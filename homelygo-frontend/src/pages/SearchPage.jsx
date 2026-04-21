/* ============================================
   SEARCH PAGE - Página de búsqueda con filtros
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propiedadService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ubicacion: searchParams.get('ubicacion') || '',
    fechaInicio: searchParams.get('fechaInicio') || '',
    fechaFin: searchParams.get('fechaFin') || '',
    capacidad: searchParams.get('capacidad') || '',
    precioMin: '',
    precioMax: '',
  });

  useEffect(() => {
    searchProperties();
  }, []);

  const searchProperties = async () => {
    setLoading(true);
    try {
      // Si hay filtros activos, usar búsqueda; si no, listar todo
      const hasFilters = filters.ubicacion || filters.fechaInicio || filters.capacidad;
      let data;
      if (hasFilters) {
        data = await propiedadService.search({
          ubicacion: filters.ubicacion || null,
          fechaInicio: filters.fechaInicio || null,
          fechaFin: filters.fechaFin || null,
          capacidad: filters.capacidad ? parseInt(filters.capacidad) : null,
        });
      } else {
        data = await propiedadService.getAll();
      }
      setProperties(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      // Fallback: cargar todas
      try {
        const data = await propiedadService.getAll();
        setProperties(data);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProperties();
  };

  const clearFilters = () => {
    setFilters({ ubicacion: '', fechaInicio: '', fechaFin: '', capacidad: '', precioMin: '', precioMax: '' });
    setSearchParams({});
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-layout">
          {/* Sidebar de filtros */}
          <aside className="search-filters">
            <div className="filters-header">
              <h3>Filtros</h3>
              <button className="clear-filters" onClick={clearFilters}>Limpiar</button>
            </div>

            <form onSubmit={handleSearch} className="filters-form">
              <div className="filter-group">
                <label>Destino</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={filters.ubicacion}
                  onChange={handleFilterChange}
                  placeholder="Ciudad o lugar"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Check-in</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={handleFilterChange}
                  className="filter-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="filter-group">
                <label>Check-out</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={filters.fechaFin}
                  onChange={handleFilterChange}
                  className="filter-input"
                  min={filters.fechaInicio || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="filter-group">
                <label>Huéspedes</label>
                <input
                  type="number"
                  name="capacidad"
                  value={filters.capacidad}
                  onChange={handleFilterChange}
                  placeholder="Número de personas"
                  className="filter-input"
                  min="1"
                />
              </div>

              <button type="submit" className="filter-search-btn">
                Buscar
              </button>
            </form>
          </aside>

          {/* Resultados */}
          <main className="search-results">
            <div className="results-header">
              <h2>
                {loading ? 'Buscando...' : `${properties.length} alojamiento${properties.length !== 1 ? 's' : ''} encontrado${properties.length !== 1 ? 's' : ''}`}
              </h2>
              {filters.ubicacion && <p>en "{filters.ubicacion}"</p>}
            </div>

            {loading ? (
              <div className="results-loading">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="property-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No encontramos resultados</h3>
                <p>Intenta con otros filtros o fechas diferentes</p>
                <button className="btn-outline" onClick={clearFilters}>
                  Ver todos los alojamientos
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
