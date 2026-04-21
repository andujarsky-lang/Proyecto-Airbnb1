/* ============================================
   HOME PAGE - Página principal
   Carrusel hero + destinos + listado de propiedades
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propiedadService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import HeroCarousel from '../components/HeroCarousel';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propiedadService.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Destinos populares con imágenes reales de alta calidad
  const destinations = [
    {
      name: 'Punta Cana',
      img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80&fit=crop',
    },
    {
      name: 'Santo Domingo',
      img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80&fit=crop',
    },
    {
      name: 'Samaná',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&fit=crop',
    },
    {
      name: 'Puerto Plata',
      img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80&fit=crop',
    },
  ];

  return (
    <div className="home-page">

      {/* ── CARRUSEL HERO ─────────────────────────────── */}
      <HeroCarousel />

      {/* ── DESTINOS POPULARES ────────────────────────── */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Destinos populares</h2>
            <p>Los lugares más buscados por nuestros viajeros</p>
          </div>
          <div className="destinations-grid">
            {destinations.map((dest, i) => (
              <button
                key={i}
                className="destination-card"
                onClick={() => navigate(`/search?ubicacion=${dest.name}`)}
              >
                <img src={dest.img} alt={dest.name} loading="lazy" />
                <div className="destination-overlay">
                  <span>{dest.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPIEDADES DISPONIBLES ───────────────────── */}
      <section className="properties-section">
        <div className="container">
          <div className="section-header">
            <h2>Alojamientos disponibles</h2>
            <p>{properties.length} propiedades encontradas</p>
          </div>

          {loading ? (
            <div className="properties-loading">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="property-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text medium"></div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-light)' }}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <h3>No hay propiedades disponibles</h3>
              <p>Sé el primero en publicar tu alojamiento</p>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ¿POR QUÉ HOMELYGO? ────────────────────────── */}
      <section className="why-section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegir HomelyGo?</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🔒</div>
              <h3>Reservas seguras</h3>
              <p>Tus pagos y datos están protegidos con la más alta seguridad.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">⭐</div>
              <h3>Propiedades verificadas</h3>
              <p>Cada alojamiento es revisado y calificado por huéspedes reales.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">💬</div>
              <h3>Soporte 24/7</h3>
              <p>Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">💰</div>
              <h3>Mejores precios</h3>
              <p>Encuentra las mejores tarifas sin comisiones ocultas.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
