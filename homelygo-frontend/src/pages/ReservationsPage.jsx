/* ============================================
   RESERVATIONS PAGE - Mis reservas (Guest)
   Lista de reservas con acciones
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservaService, reseñaService } from '../services/api';
import './ReservationsPage.css';

const STATUS_CONFIG = {
  Pendiente:  { label: 'Pendiente',  color: '#FFB400', bg: '#FFF8E1', icon: '⏳' },
  Confirmada: { label: 'Confirmada', color: '#00A699', bg: '#E0F7F5', icon: '✅' },
  Cancelada:  { label: 'Cancelada',  color: '#FF5A5F', bg: '#FFF0F0', icon: '❌' },
  Completada: { label: 'Completada', color: '#484848', bg: '#F5F5F5', icon: '🏁' },
};

const ReservationsPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ calificacion: 5, comentario: '' });
  const [reviewSuccess, setReviewSuccess] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservaService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;
    setActionLoading(id);
    try {
      await reservaService.cancel(id);
      await loadReservations();
    } catch (error) {
      alert('No se pudo cancelar la reserva. Recuerda que debes cancelar con al menos 24 horas de anticipación.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      await reservaService.complete(id);
      await loadReservations();
    } catch (error) {
      alert('No se pudo completar la reserva.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!showReviewModal) return;
    try {
      await reseñaService.create({
        propiedadId: showReviewModal.propiedadId,
        calificacion: reviewForm.calificacion,
        comentario: reviewForm.comentario,
      });
      setReviewSuccess(showReviewModal.id);
      setShowReviewModal(null);
      setReviewForm({ calificacion: 5, comentario: '' });
    } catch (error) {
      alert('No se pudo enviar la reseña.');
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Cargando tus reservas...</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>Mis reservas</h1>
          <p>{reservations.length} reserva{reservations.length !== 1 ? 's' : ''} en total</p>
        </div>

        {reservations.length === 0 ? (
          <div className="empty-reservations">
            <div className="empty-icon">🏠</div>
            <h2>No tienes reservas aún</h2>
            <p>Explora nuestros alojamientos y haz tu primera reserva</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Explorar alojamientos
            </button>
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map((reservation) => {
              const status = STATUS_CONFIG[reservation.estado] || STATUS_CONFIG.Pendiente;
              const canCancel = reservation.estado === 'Pendiente' || reservation.estado === 'Confirmada';
              const canComplete = reservation.estado === 'Confirmada';
              const canReview = reservation.estado === 'Completada' && reviewSuccess !== reservation.id;

              return (
                <div key={reservation.id} className="reservation-card">
                  {/* Estado */}
                  <div
                    className="reservation-status"
                    style={{ background: status.bg, color: status.color }}
                  >
                    <span>{status.icon}</span>
                    <span>{status.label}</span>
                  </div>

                  <div className="reservation-body">
                    {/* Info principal */}
                    <div className="reservation-info">
                      <div className="reservation-property">
                        <h3>Propiedad #{reservation.propiedadId}</h3>
                        <p className="reservation-id">Reserva #{reservation.id}</p>
                      </div>

                      <div className="reservation-dates">
                        <div className="date-item">
                          <span className="date-label">Check-in</span>
                          <span className="date-value">{formatDate(reservation.fechaInicio)}</span>
                        </div>
                        <div className="date-arrow">→</div>
                        <div className="date-item">
                          <span className="date-label">Check-out</span>
                          <span className="date-value">{formatDate(reservation.fechaFin)}</span>
                        </div>
                      </div>

                      <div className="reservation-price">
                        <span className="price-label">Total pagado</span>
                        <span className="price-value">{formatPrice(reservation.precioTotal)}</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="reservation-actions">
                      <button
                        className="btn-outline"
                        onClick={() => navigate(`/property/${reservation.propiedadId}`)}
                      >
                        Ver propiedad
                      </button>

                      {canCancel && (
                        <button
                          className="btn-danger"
                          onClick={() => handleCancel(reservation.id)}
                          disabled={actionLoading === reservation.id}
                        >
                          {actionLoading === reservation.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      )}

                      {canComplete && (
                        <button
                          className="btn-success"
                          onClick={() => handleComplete(reservation.id)}
                          disabled={actionLoading === reservation.id}
                        >
                          Completar
                        </button>
                      )}

                      {canReview && (
                        <button
                          className="btn-primary"
                          onClick={() => setShowReviewModal(reservation)}
                        >
                          ⭐ Dejar reseña
                        </button>
                      )}

                      {reviewSuccess === reservation.id && (
                        <span className="review-sent">✅ Reseña enviada</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de reseña */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dejar una reseña</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(null)}>✕</button>
            </div>

            <form onSubmit={handleReview} className="review-form">
              <div className="form-group">
                <label>Calificación</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= reviewForm.calificacion ? 'active' : ''}`}
                      onClick={() => setReviewForm({ ...reviewForm, calificacion: star })}
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-label">{reviewForm.calificacion}/5</span>
                </div>
              </div>

              <div className="form-group">
                <label>Comentario</label>
                <textarea
                  value={reviewForm.comentario}
                  onChange={(e) => setReviewForm({ ...reviewForm, comentario: e.target.value })}
                  placeholder="Comparte tu experiencia en este alojamiento..."
                  rows={4}
                  className="form-textarea"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowReviewModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Publicar reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
