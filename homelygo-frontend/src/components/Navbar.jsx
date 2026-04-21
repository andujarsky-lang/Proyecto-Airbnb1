/* ============================================
   NAVBAR - Barra de navegación profesional
   Diseño inspirado en Airbnb
   ============================================ */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificacionService } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isHost } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones no leídas
  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadNotifications();
      // Actualizar cada 30 segundos
      const interval = setInterval(loadUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadNotifications = async () => {
    try {
      const data = await notificacionService.getUnread();
      setNotifications(data);
      setUnreadCount(data.length);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await notificacionService.markAsRead(notificationId);
      loadUnreadNotifications();
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificacionService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
      setShowNotifications(false);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L4 10v12c0 6.627 5.373 12 12 12s12-5.373 12-12V10L16 2z" fill="#FF5A5F"/>
            <path d="M16 8l-6 4v6c0 3.314 2.686 6 6 6s6-2.686 6-6v-6l-6-4z" fill="white"/>
          </svg>
          <span className="navbar-brand">HomelyGo</span>
        </Link>

        {/* Búsqueda (solo en home) */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="¿A dónde quieres ir?" 
            className="navbar-search-input"
            onFocus={() => navigate('/search')}
          />
          <button className="navbar-search-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>

        {/* Menú derecho */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              {/* Botón "Pon tu espacio" para Hosts */}
              {isHost() && (
                <Link to="/host/properties/new" className="navbar-host-btn">
                  Pon tu espacio en HomelyGo
                </Link>
              )}

              {/* Notificaciones */}
              <div className="navbar-notifications">
                <button 
                  className="navbar-icon-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="navbar-badge">{unreadCount}</span>
                  )}
                </button>

                {/* Dropdown de notificaciones */}
                {showNotifications && (
                  <div className="navbar-dropdown notifications-dropdown">
                    <div className="dropdown-header">
                      <h3>Notificaciones</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="mark-all-btn">
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                    <div className="notifications-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">
                          <p>No tienes notificaciones nuevas</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className="notification-item"
                            onClick={() => handleNotificationClick(notif.id)}
                          >
                            <p>{notif.mensaje}</p>
                            <span className="notification-time">
                              {new Date(notif.fechaCreacion).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Menú de usuario */}
              <div className="navbar-user-menu">
                <button 
                  className="navbar-user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v1A1.5 1.5 0 0 1 14.5 6h-13A1.5 1.5 0 0 1 0 4.5v-1zm0 6A1.5 1.5 0 0 1 1.5 8h13A1.5 1.5 0 0 1 16 9.5v1a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 10.5v-1z"/>
                  </svg>
                  <div className="navbar-avatar">
                    {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Dropdown de usuario */}
                {showUserMenu && (
                  <div className="navbar-dropdown user-dropdown">
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">
                        {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="dropdown-user-name">{user?.nombre}</p>
                        <p className="dropdown-user-email">{user?.correo}</p>
                        <span className="dropdown-user-role">
                          {isHost() ? '🏠 Anfitrión' : '✈️ Viajero'}
                        </span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/reservations" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Mis reservas
                    </Link>
                    {isHost() && (
                      <Link to="/host/properties" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                        Mis propiedades
                      </Link>
                    )}
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Perfil
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Iniciar sesión</Link>
              <Link to="/register" className="navbar-btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
