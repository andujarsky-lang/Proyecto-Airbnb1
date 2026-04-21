/* ============================================
   REGISTER PAGE - Página de registro
   Con selección de rol (Guest/Host)
   ============================================ */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './AuthPages.css';

// Ícono de ojo abierto (SVG limpio, estilo Google)
const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Ícono de ojo cerrado
const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Formulario, 2: Confirmar email
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    rol: 0,
  });
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Validación del correo: debe tener @ y terminar en dominio con punto
  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) return 'El nombre es requerido.';
    if (formData.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (!formData.correo.trim()) return 'El correo es requerido.';
    if (!validarCorreo(formData.correo)) return 'El correo debe tener un formato válido (ej: usuario@correo.com).';
    if (!formData.password) return 'La contraseña es requerida.';
    if (formData.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (formData.password.length > 20) return 'La contraseña no puede superar los 20 caracteres.';
    if (formData.password !== formData.confirmarPassword) return 'Las contraseñas no coinciden.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    // El backend espera: Nombre, Correo, Password, Rol
    const result = await register({
      nombre: formData.nombre,
      correo: formData.correo,
      password: formData.password,
      rol: formData.rol,
    });
    setLoading(false);

    if (result.success) {
      setStep(2);
    } else {
      // Asegurarse de que el error sea siempre un string
      const errMsg = typeof result.error === 'string'
        ? result.error
        : JSON.stringify(result.error);
      setError(errMsg || 'Error al registrar usuario.');
    }
  };

  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    if (!confirmCode.trim()) { setError('Ingresa el código de confirmación.'); return; }

    setLoading(true);
    try {
      await authService.confirmEmail(formData.correo, confirmCode.trim().toUpperCase());
      navigate('/login?confirmed=true');
    } catch (err) {
      setError(err.response?.data || 'Código inválido o expirado. Intenta de nuevo.');
    }
    setLoading(false);
  };

  // ── PASO 2: Confirmación de email ──────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="auth-page">
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
              <h1>¡Casi listo!</h1>
              <p>Solo falta confirmar tu correo para activar tu cuenta y empezar a explorar.</p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <div className="confirm-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#FF5A5F">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div className="auth-form-header">
              <h2>Confirma tu cuenta</h2>
              <p>Enviamos un código de verificación a tu Telegram. Ingrésalo aquí.</p>
            </div>

            {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

            <form onSubmit={handleConfirmEmail} className="auth-form">
              <div className="form-group">
                <label htmlFor="code">Código de verificación</label>
                <input
                  type="text"
                  id="code"
                  value={confirmCode}
                  onChange={(e) => { setConfirmCode(e.target.value); setError(''); }}
                  placeholder="Ej: A3F7B2C1"
                  className="form-input code-input"
                  maxLength={8}
                  autoFocus
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading
                  ? <span className="btn-loading"><span className="btn-spinner"></span>Verificando...</span>
                  : 'Confirmar cuenta'}
              </button>
            </form>

            <p className="auth-footer-text" style={{ textAlign: 'center', marginTop: '16px' }}>
              ¿No recibiste el código?{' '}
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500 }}>
                Volver al registro
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── PASO 1: Formulario de registro ─────────────────────────────────────────
  return (
    <div className="auth-page">
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
            <h1>Únete a HomelyGo</h1>
            <p>Crea tu cuenta y empieza a explorar los mejores alojamientos o comparte tu espacio con el mundo.</p>
          </div>
          <div className="auth-stats">
            <div className="auth-stat"><span className="stat-number">Gratis</span><span className="stat-label">Registro</span></div>
            <div className="auth-stat"><span className="stat-number">Seguro</span><span className="stat-label">Datos</span></div>
            <div className="auth-stat"><span className="stat-number">24/7</span><span className="stat-label">Soporte</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Crear cuenta</h2>
            <p>Completa tus datos para comenzar</p>
          </div>

          {/* Selector de rol */}
          <div className="role-selector">
            <button type="button" className={`role-option ${formData.rol === 0 ? 'active' : ''}`} onClick={() => setFormData({ ...formData, rol: 0 })}>
              <span className="role-icon">✈️</span>
              <span className="role-title">Soy Viajero</span>
              <span className="role-desc">Quiero reservar alojamientos</span>
            </button>
            <button type="button" className={`role-option ${formData.rol === 1 ? 'active' : ''}`} onClick={() => setFormData({ ...formData, rol: 1 })}>
              <span className="role-icon">🏠</span>
              <span className="role-title">Soy Anfitrión</span>
              <span className="role-desc">Quiero publicar mi espacio</span>
            </button>
          </div>

          {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre completo" className="form-input" />
              </div>
            </div>

            {/* Correo */}
            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} placeholder="usuario@correo.com" className="form-input" />
              </div>
            </div>

            {/* Contraseñas en fila */}
            <div className="form-row">
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
                    placeholder="Mínimo 8 caracteres"
                    className="form-input"
                  />
                  <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmarPassword">Confirmar contraseña</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmarPassword"
                    name="confirmarPassword"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="form-input"
                  />
                  <button type="button" className="input-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            {formData.password && (
              <div className="password-strength">
                <div className={`strength-bar ${formData.password.length >= 8 ? 'ok' : 'weak'}`}></div>
                <span className={formData.password.length >= 8 ? 'strength-ok' : 'strength-weak'}>
                  {formData.password.length < 8
                    ? `Faltan ${8 - formData.password.length} caracteres más`
                    : '✓ Longitud correcta'}
                </span>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading
                ? <span className="btn-loading"><span className="btn-spinner"></span>Creando cuenta...</span>
                : `Crear cuenta como ${formData.rol === 0 ? 'Viajero' : 'Anfitrión'}`}
            </button>
          </form>

          <div className="auth-divider"><span>¿Ya tienes cuenta?</span></div>
          <Link to="/login" className="auth-secondary-btn">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
