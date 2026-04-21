/* ============================================
   API SERVICE - Configuración de Axios
   Maneja todas las peticiones HTTP al backend
   ============================================ */

import axios from 'axios';

// URL base del API (ajusta según tu configuración)
const API_BASE_URL = 'https://localhost:7154/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================

export const authService = {
  // Registro de usuario
  register: async (userData) => {
    // Aseguramos que los campos coincidan exactamente con el DTO del backend
    const payload = {
      Nombre: userData.nombre,
      Correo: userData.correo,
      Password: userData.password,
      Rol: userData.rol,
    };
    const response = await api.post('/Usuario/registrar', payload);
    return response.data;
  },

  // Login - el backend devuelve { mensaje, token }
  login: async (credentials) => {
    const response = await api.post('/Usuario/login', {
      Correo: credentials.correo,
      Password: credentials.password,
    });
    return {
      exito: true,
      token: response.data.token,
    };
  },

  // Confirmar email - endpoint real es /confirmar-correo con query params
  confirmEmail: async (correo, codigo) => {
    const response = await api.post(`/Usuario/confirmar-correo?correo=${encodeURIComponent(correo)}&token=${encodeURIComponent(codigo)}`);
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/Usuario/perfil');
    return response.data;
  },
};

// ============================================
// SERVICIOS DE PROPIEDADES
// ============================================

export const propiedadService = {
  // Listar todas las propiedades
  getAll: async () => {
    const response = await api.get('/Propiedad/listar');
    return response.data;
  },

  // Obtener propiedad por ID
  getById: async (id) => {
    const response = await api.get(`/Propiedad/${id}`);
    return response.data;
  },

  // Buscar propiedades con filtros
  search: async (filters) => {
    const response = await api.post('/Propiedad/buscar', filters);
    return response.data;
  },

  // Crear propiedad (Host)
  create: async (formData) => {
    const response = await api.post('/Propiedad/crear', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Editar propiedad (Host)
  update: async (id, formData) => {
    const response = await api.put(`/Propiedad/editar/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Eliminar propiedad (Host)
  delete: async (id) => {
    const response = await api.delete(`/Propiedad/eliminar/${id}`);
    return response.data;
  },

  // Obtener propiedades del host
  getMyProperties: async () => {
    const response = await api.get('/Propiedad/mis-propiedades');
    return response.data;
  },
};

// ============================================
// SERVICIOS DE RESERVAS
// ============================================

export const reservaService = {
  // Crear reserva (Guest)
  create: async (reservaData) => {
    const response = await api.post('/Reserva/crear', reservaData);
    return response.data;
  },

  // Obtener mis reservas (Guest)
  getMyReservations: async () => {
    const response = await api.get('/Reserva/mis-reservas');
    return response.data;
  },

  // Cancelar reserva (Guest)
  cancel: async (id) => {
    const response = await api.put(`/Reserva/cancelar/${id}`);
    return response.data;
  },

  // Completar reserva (Guest)
  complete: async (id) => {
    const response = await api.put(`/Reserva/completar/${id}`);
    return response.data;
  },

  // Aceptar reserva (Host)
  accept: async (id) => {
    const response = await api.put(`/Reserva/aceptar/${id}`);
    return response.data;
  },
};

// ============================================
// SERVICIOS DE RESEÑAS
// ============================================

export const reseñaService = {
  // Crear reseña
  create: async (reseñaData) => {
    const response = await api.post('/Reseña/crear', reseñaData);
    return response.data;
  },

  // Obtener reseñas de una propiedad
  getByProperty: async (propiedadId) => {
    const response = await api.get(`/Reseña/propiedad/${propiedadId}`);
    return response.data;
  },
};

// ============================================
// SERVICIOS DE NOTIFICACIONES
// ============================================

export const notificacionService = {
  // Obtener todas mis notificaciones
  getAll: async () => {
    const response = await api.get('/Notificacion/mis-notificaciones');
    return response.data;
  },

  // Obtener notificaciones no leídas
  getUnread: async () => {
    const response = await api.get('/Notificacion/no-leidas');
    return response.data;
  },

  // Marcar como leída
  markAsRead: async (id) => {
    const response = await api.put(`/Notificacion/marcar-leida/${id}`);
    return response.data;
  },

  // Marcar todas como leídas
  markAllAsRead: async () => {
    const response = await api.put('/Notificacion/marcar-todas-leidas');
    return response.data;
  },
};

export default api;
