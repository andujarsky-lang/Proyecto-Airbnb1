/* ============================================
   PROPERTY CARD - Tarjeta de propiedad
   Componente reutilizable para mostrar propiedades
   ============================================ */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const API_BASE = 'https://localhost:7154';

const PropertyCard = ({ property }) => {
  const [imgError, setImgError] = useState(false);

  // La URL puede venir como "/uploads/archivo.jpg" → la completamos con el base
  const imageUrl = property.imagenPrincipalUrl
    ? property.imagenPrincipalUrl.startsWith('http')
      ? property.imagenPrincipalUrl
      : `${API_BASE}${property.imagenPrincipalUrl}`
    : null;

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? 'star filled' : 'star'}>★</span>
      );
    }
    return stars;
  };

  return (
    <Link to={`/property/${property.id}`} className="property-card">
      {/* Imagen */}
      <div className="property-card-image">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={property.nombre}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="property-card-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        )}
        {/* Badge de tipo */}
        {property.tipo && (
          <span className="property-card-badge">{property.tipo}</span>
        )}
      </div>

      {/* Información */}
      <div className="property-card-info">
        <div className="property-card-header">
          <h3 className="property-card-title">{property.nombre}</h3>
          {property.promedioEstrellas > 0 && (
            <div className="property-card-rating">
              <span className="star-icon">★</span>
              <span>{(property.promedioEstrellas || 0).toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="property-card-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {property.ubicacion || 'Ubicación no especificada'}
        </p>

        {property.capacidad && (
          <p className="property-card-capacity">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Hasta {property.capacidad} huéspedes
          </p>
        )}

        <div className="property-card-price">
          <span className="price-amount">{formatPrice(property.precioPorNoche)}</span>
          <span className="price-period"> / noche</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
