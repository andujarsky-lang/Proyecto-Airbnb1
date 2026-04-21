/* ============================================
   HERO CAROUSEL - Carrusel principal del home
   Imágenes de alta calidad de alojamientos reales
   Auto-avanza cada 5 segundos, con controles
   ============================================ */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroCarousel.css';

// Imágenes de Unsplash — alojamientos reales de alta calidad
// Cada slide tiene imagen, título, subtítulo y CTA
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=85&fit=crop',
    tag: 'Villa de lujo',
    title: 'Vive experiencias únicas',
    subtitle: 'Villas privadas con piscina, vistas al mar y todo lo que necesitas para descansar.',
    cta: 'Explorar villas',
    search: 'Villa',
  },
  {
    img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=85&fit=crop',
    tag: 'Frente al mar',
    title: 'Tu paraíso te espera',
    subtitle: 'Casas de playa con acceso directo al mar. Despierta con el sonido de las olas.',
    cta: 'Ver casas de playa',
    search: 'Playa',
  },
  {
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85&fit=crop',
    tag: 'Apartamento moderno',
    title: 'Comodidad en la ciudad',
    subtitle: 'Apartamentos modernos en el corazón de la ciudad. Todo a tu alcance.',
    cta: 'Ver apartamentos',
    search: 'Apartamento',
  },
  {
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=85&fit=crop',
    tag: 'Resort & Spa',
    title: 'Relájate como nunca',
    subtitle: 'Resorts con spa, piscina infinita y servicio de primera. Mereces lo mejor.',
    cta: 'Ver resorts',
    search: 'Resort',
  },
  {
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=85&fit=crop',
    tag: 'Casa familiar',
    title: 'Espacio para toda la familia',
    subtitle: 'Casas amplias con jardín, cocina equipada y todo lo que tu familia necesita.',
    cta: 'Ver casas',
    search: 'Casa',
  },
];

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchForm, setSearchForm] = useState({
    ubicacion: '',
    fechaInicio: '',
    fechaFin: '',
    capacidad: '',
  });

  // Avanzar al siguiente slide
  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goTo = (index) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-avance cada 5 segundos
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.ubicacion) params.set('ubicacion', searchForm.ubicacion);
    if (searchForm.fechaInicio) params.set('fechaInicio', searchForm.fechaInicio);
    if (searchForm.fechaFin) params.set('fechaFin', searchForm.fechaFin);
    if (searchForm.capacidad) params.set('capacidad', searchForm.capacidad);
    navigate(`/search?${params.toString()}`);
  };

  const slide = SLIDES[current];

  return (
    <div className="carousel">
      {/* Slides de fondo */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`carousel-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.img})` }}
        />
      ))}

      {/* Overlay degradado */}
      <div className="carousel-overlay" />

      {/* Contenido del slide */}
      <div className={`carousel-content ${isTransitioning ? 'fading' : ''}`}>
        <span className="carousel-tag">{slide.tag}</span>
        <h1 className="carousel-title">{slide.title}</h1>
        <p className="carousel-subtitle">{slide.subtitle}</p>
      </div>

      {/* Buscador flotante */}
      <div className="carousel-search-wrapper">
        <form className="carousel-search" onSubmit={handleSearch}>
          <div className="cs-field">
            <label>¿A dónde vas?</label>
            <input
              type="text"
              placeholder="Destino o ciudad"
              value={searchForm.ubicacion}
              onChange={(e) => setSearchForm({ ...searchForm, ubicacion: e.target.value })}
            />
          </div>
          <div className="cs-divider" />
          <div className="cs-field">
            <label>Llegada</label>
            <input
              type="date"
              value={searchForm.fechaInicio}
              onChange={(e) => setSearchForm({ ...searchForm, fechaInicio: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="cs-divider" />
          <div className="cs-field">
            <label>Salida</label>
            <input
              type="date"
              value={searchForm.fechaFin}
              onChange={(e) => setSearchForm({ ...searchForm, fechaFin: e.target.value })}
              min={searchForm.fechaInicio || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="cs-divider" />
          <div className="cs-field">
            <label>Huéspedes</label>
            <input
              type="number"
              placeholder="¿Cuántos?"
              min="1"
              value={searchForm.capacidad}
              onChange={(e) => setSearchForm({ ...searchForm, capacidad: e.target.value })}
            />
          </div>
          <button type="submit" className="cs-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            Buscar
          </button>
        </form>
      </div>

      {/* Controles de navegación */}
      <button className="carousel-btn prev" onClick={goPrev} aria-label="Anterior">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <button className="carousel-btn next" onClick={goNext} aria-label="Siguiente">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>

      {/* Indicadores (dots) */}
      <div className="carousel-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
