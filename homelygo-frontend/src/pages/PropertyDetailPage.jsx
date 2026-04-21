/* ============================================
   PROPERTY DETAIL PAGE - Detalle de propiedad
   Con galería, info, reseñas y formulario de reserva
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propiedadService, reservaService, reseñaService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PropertyDetailPage.css';

const API_BASE = 'https://localhost:7154';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isGuest, user } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ fechaInicio: '', fechaFin: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const [propData, reviewsData] = await Promise.all([
        propiedadService.getById(id),
        reseñaService.getByProperty(id).catch(() => []),
      ]);
      setProperty(propData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error al cargar propiedad:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingForm.fechaInicio || !bookingForm.fechaFin) return 0;
    const start = new Date(bookingForm.fechaInicio);
    const end = new Date(bookingForm.fechaFin);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * (property?.precioPorNoche || 0);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(price);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isGuest()) {
      setBookingError('Solo los viajeros pueden hacer reservas.');
      return;
    }
    if (calculateNights() <= 0) {
      setBookingError('Las fechas seleccionadas no son válidas.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    try {
      await reservaService.create({
        propiedadId: parseInt(id),
        fechaInicio: bookingForm.fechaInicio,
        fechaFin: bookingForm.fechaFin,
      });
      setBookingSuccess(true);
    } catch (error) {
      setBookingError(error.response?.data || 'No se pudo crear la reserva. Verifica las fechas.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#FFB400' : '#DDD', fontSize: '1rem' }}>★</span>
    ));
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Cargando propiedad...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="detail-not-found">
        <h2>Propiedad no encontrada</h2>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const imageUrl = property.imagenPrincipalUrl ? `${API_BASE}${property.imagenPrincipalUrl}` : null;
  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="detail-page">
      <div className="container">
        {/* Encabezado */}
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Volver
          </button>
          <h1 className="detail-title">{property.nombre}</h1>
          <div className="detail-meta">
            {property.promedioEstrellas > 0 && (
              <span className="detail-rating">
                ★ {(property.promedioEstrellas || 0).toFixed(1)} · {reviews.length} reseñas
              </span>
            )}
            <span className="detail-location">
              📍 {property.ubicacion || 'Ubicación no especificada'}
            </span>
          </div>
        </div>

        {/* Imagen principal */}
        <div className="detail-gallery">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={property.nombre}
              className="detail-main-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="detail-image-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <p>Sin imagen disponible</p>
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="detail-content">
          {/* Info izquierda */}
          <div className="detail-info">
            {/* Descripción */}
            <div className="detail-section">
              <div className="detail-host-info">
                <div>
                  <h2>Alojamiento completo</h2>
                  <p className="detail-capacity">
                    Hasta {property.capacidad || 'N/A'} huéspedes
                    {property.tipo && ` · ${property.tipo}`}
                  </p>
                </div>
                <div className="host-avatar">
                  🏠
                </div>
              </div>
            </div>

            <div className="detail-divider"></div>

            {/* Características */}
            <div className="detail-section">
              <div className="detail-features">
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <div>
                    <strong>Limpieza impecable</strong>
                    <p>Propiedad limpiada y desinfectada</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔑</span>
                  <div>
                    <strong>Check-in flexible</strong>
                    <p>Proceso de entrada sencillo</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📍</span>
                  <div>
                    <strong>Excelente ubicación</strong>
                    <p>{property.ubicacion}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-divider"></div>

            {/* Descripción */}
            {property.descripcion && (
              <div className="detail-section">
                <h3>Sobre este alojamiento</h3>
                <p className="detail-description">{property.descripcion}</p>
              </div>
            )}

            <div className="detail-divider"></div>

            {/* Reseñas */}
            <div className="detail-section">
              <div className="reviews-header">
                <h3>
                  {property.promedioEstrellas > 0 && (
                    <span>★ {(property.promedioEstrellas || 0).toFixed(1)} · </span>
                  )}
                  {reviews.length} reseñas
                </h3>
              </div>

              {reviews.length === 0 ? (
                <p className="no-reviews">Aún no hay reseñas para esta propiedad.</p>
              ) : (
                <div className="reviews-grid">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-avatar">
                          {review.nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="reviewer-name">{review.nombreUsuario || 'Usuario'}</p>
                          <div className="review-stars">
                            {renderStars(review.calificacion)}
                          </div>
                        </div>
                      </div>
                      <p className="review-comment">{review.comentario}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel de reserva */}
          <div className="detail-booking">
            <div className="booking-card">
              <div className="booking-price">
                <span className="booking-price-amount">{formatPrice(property.precioPorNoche)}</span>
                <span className="booking-price-period"> / noche</span>
              </div>

              {property.promedioEstrellas > 0 && (
                <div className="booking-rating">
                  ★ {(property.promedioEstrellas || 0).toFixed(1)} · {reviews.length} reseñas
                </div>
              )}

              {bookingSuccess ? (
                <div className="booking-success">
                  <div className="success-icon">✅</div>
                  <h3>¡Reserva creada!</h3>
                  <p>Tu solicitud está pendiente de confirmación por el anfitrión.</p>
                  <button
                    className="booking-btn"
                    onClick={() => navigate('/reservations')}
                  >
                    Ver mis reservas
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="booking-form">
                  <div className="booking-dates">
                    <div className="booking-date-field">
                      <label>LLEGADA</label>
                      <input
                        type="date"
                        value={bookingForm.fechaInicio}
                        onChange={(e) => setBookingForm({ ...bookingForm, fechaInicio: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="booking-date-divider"></div>
                    <div className="booking-date-field">
                      <label>SALIDA</label>
                      <input
                        type="date"
                        value={bookingForm.fechaFin}
                        onChange={(e) => setBookingForm({ ...bookingForm, fechaFin: e.target.value })}
                        min={bookingForm.fechaInicio || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <div className="booking-error">{bookingError}</div>
                  )}

                  {nights > 0 && (
                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>{formatPrice(property.precioPorNoche)} × {nights} noches</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      <div className="summary-divider"></div>
                      <div className="summary-row total">
                        <strong>Total</strong>
                        <strong>{formatPrice(total)}</strong>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="booking-btn"
                    disabled={bookingLoading || !isAuthenticated}
                  >
                    {!isAuthenticated
                      ? 'Inicia sesión para reservar'
                      : bookingLoading
                      ? 'Procesando...'
                      : 'Reservar ahora'}
                  </button>

                  {!isAuthenticated && (
                    <p className="booking-login-hint">
                      <a href="/login">Inicia sesión</a> o <a href="/register">regístrate</a> para hacer una reserva
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
