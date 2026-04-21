/* ============================================
   AUTH CONTEXT - Manejo de Autenticación
   Decodifica el JWT para obtener datos del usuario
   ============================================ */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

// Decodifica un JWT sin librería externa (solo el payload)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Construye el objeto usuario desde el payload del JWT
const buildUserFromToken = (token) => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  // Los claims del JWT de .NET usan estos nombres
  return {
    id: parseInt(
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload['nameid'] ||
      payload['sub'] || '0'
    ),
    nombre:
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      payload['name'] ||
      payload['unique_name'] || 'Usuario',
    correo:
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      payload['email'] || '',
    rol: parseInt(
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload['role'] ||
      payload['rol'] || '0'
    ),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const userData = buildUserFromToken(storedToken);
      if (userData) {
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (correo, contraseña) => {
    try {
      const response = await authService.login({ correo, contraseña });

      if (response.exito && response.token) {
        const userData = buildUserFromToken(response.token);
        if (!userData) {
          return { success: false, error: 'Token inválido recibido del servidor.' };
        }

        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, error: 'Credenciales incorrectas.' };
      }
    } catch (error) {
      const data = error.response?.data;
      let msg = 'Error de conexión con el servidor.';
      if (typeof data === 'string') msg = data;
      else if (data?.mensaje) msg = data.mensaje;
      else if (data?.title) msg = data.title;
      return { success: false, error: msg };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      // El backend puede devolver un objeto con { mensaje } o un string o un objeto de validación
      let msg = 'Error al registrar usuario.';
      const data = error.response?.data;
      if (typeof data === 'string') {
        msg = data;
      } else if (data?.mensaje) {
        msg = data.mensaje;
      } else if (data?.errors) {
        // Errores de validación de .NET (objeto con arrays)
        const firstError = Object.values(data.errors).flat()[0];
        msg = firstError || msg;
      } else if (data?.title) {
        msg = data.title;
      }
      return { success: false, error: msg };
    }
  };

  // Confirm Email
  const confirmEmail = async (correo, codigo) => {
    try {
      await authService.confirmEmail(correo, codigo);
      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data ||
        'Código inválido o expirado.';
      return { success: false, error: msg };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const isHost = () => user?.rol === 1;
  const isGuest = () => user?.rol === 0;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      login, register, confirmEmail, logout,
      isHost, isGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export default AuthContext;
