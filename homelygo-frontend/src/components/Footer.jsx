/* ============================================
   FOOTER - Pie de página profesional
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Marca */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 10v12c0 6.627 5.373 12 12 12s12-5.373 12-12V10L16 2z" fill="#FF5A5F"/>
                <path d="M16 8l-6 4v6c0 3.314 2.686 6 6 6s6-2.686 6-6v-6l-6-4z" fill="white"/>
              </svg>
              <span>HomelyGo</span>
            </Link>
            <p>Tu plataforma de confianza para encontrar el alojamiento perfecto en cualquier destino.</p>
          </div>

          {/* Explorar */}
          <div className="footer-col">
            <h4>Explorar</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/search">Buscar alojamientos</Link></li>
            </ul>
          </div>

          {/* Anfitriones */}
          <div className="footer-col">
            <h4>Anfitriones</h4>
            <ul>
              <li><Link to="/host/properties">Mis propiedades</Link></li>
              <li><Link to="/host/properties/new">Publicar propiedad</Link></li>
            </ul>
          </div>

          {/* Cuenta */}
          <div className="footer-col">
            <h4>Mi cuenta</h4>
            <ul>
              <li><Link to="/reservations">Mis reservas</Link></li>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/register">Registrarse</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HomelyGo. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ para Programación II</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
