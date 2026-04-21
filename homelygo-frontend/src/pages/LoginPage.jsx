/* ============================================
   LOGIN PAGE - Página de inicio de sesión
   Diseño profesional con split-screen
   ============================================ */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

// Íconos SVG estilo Google/Material
const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const confirmed = searchParams.get('confirmed');

  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correo || !formData.password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      setError('El correo debe tener un formato válido (ej: usuario@correo.com).');
      return;
    }

    setLoading(true);
    // El backend espera: Correo, Password
    const result = await login(formData.correo, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      const errMsg = typeof result.error === 'string'
        ? result.error
        : 'Credenciales incorrectas.';
      setError(errMsg);
    }
  };

  return (
    <div className="auth-page">
      {/* Panel izquierdo - Branding */}
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 10v12c0 6.627 5.373 12 12 12s12-5.373 12-12V10L16 2z" fill="white"/>
              <path d="M16 8l-6 4v6c0 3.314 2.686 6 6 6s6-2.686 6-6v-6l-6-4z" fill="#FF5A5F"/>
            </svg>
            <span>HomelyGo</span>
          </Link>

          <div className="auth-left-text">
            <h1>Tu hogar lejos de casa</h1>
            <p>Descubre miles de alojamientos únicos en todo el mundo. Desde acogedoras cabañas hasta lujosas villas.</p>
          </div>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Propiedades</span>
            </div>
            <div className="auth-stat">
              <span className="stat-number">1,200+</span>
              <span className="stat-label">Huéspedes</span>
            </div>
            <div className="auth-stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Calificación</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Bienvenido de vuelta</h2>
            <p>Inicia sesión para continuar tu aventura</p>
          </div>

          {/* Mensaje de cuenta confirmada */}
          {confirmed && (
            <div className="auth-success">
              ✅ ¡Cuenta confirmada! Ya puedes iniciar sesión.
            </div>
          )}

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="usuario@correo.com"
                  className="form-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  className="form-input"
                  autoComplete="current-password"
                />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="btn-spinner"></span>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>¿No tienes cuenta?</span>
          </div>

          <Link to="/register" className="auth-secondary-btn">
            Crear cuenta gratis
          </Link>

          <p className="auth-footer-text">
            Al continuar, aceptas nuestros{' '}
            <a href="#">Términos de servicio</a> y{' '}
            <a href="#">Política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
