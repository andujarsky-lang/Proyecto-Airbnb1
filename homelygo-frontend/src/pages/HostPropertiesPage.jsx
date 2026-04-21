/* ============================================
   HOST PROPERTIES PAGE - Panel del anfitrión
   Gestión de propiedades y reservas recibidas
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { propiedadService, reservaService } from '../services/api';
import './HostPropertiesPage.css';

const API_BASE = 'https://localhost:7154';

const HostPropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propiedadService.getMyProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return;
    setDeleteLoading(id);
    try {
      await propiedadService.delete(id);
      await loadProperties();
    } catch (error) {
      alert('No se pudo eliminar la propiedad.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Cargando tus propiedades...</p>
      </div>
    );
  }

  return (
    <div className="host-page">
      <div className="container">
        {/* Header */}
        <div className="host-header">
          <div>
            <h1>Mis propiedades</h1>
            <p>{properties.length} propiedad{properties.length !== 1 ? 'es' : ''} publicada{properties.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/host/properties/new" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Nueva propiedad
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="empty-host">
            <div className="empty-icon">🏠</div>
            <h2>Aún no tienes propiedades</h2>
            <p>Publica tu primer alojamiento y empieza a recibir huéspedes</p>
            <Link to="/host/properties/new" className="btn-primary">
              Publicar propiedad
            </Link>
          </div>
        ) : (
          <div className="host-properties-grid">
            {properties.map((property) => {
              const imageUrl = property.imagenPrincipalUrl
                ? `${API_BASE}${property.imagenPrincipalUrl}`
                : null;

              return (
                <div key={property.id} className="host-property-card">
                  {/* Imagen */}
                  <div className="host-property-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={property.nombre} onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <div className="host-property-placeholder">🏠</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="host-property-info">
                    <div className="host-property-header">
                      <h3>{property.nombre}</h3>
                      {property.promedioEstrellas > 0 && (
                        <span className="host-property-rating">
                          ★ {(property.promedioEstrellas || 0).toFixed(1)}
                        </span>
                      )}
                    </div>

                    <p className="host-property-location">
                      📍 {property.ubicacion || 'Sin ubicación'}
                    </p>

                    <div className="host-property-details">
                      <span>👥 {property.capacidad || 'N/A'} huéspedes</span>
                      <span>💰 {formatPrice(property.precioPorNoche)}/noche</span>
                    </div>

                    {/* Acciones */}
                    <div className="host-property-actions">
                      <button
                        className="btn-outline"
                        onClick={() => navigate(`/property/${property.id}`)}
                      >
                        Ver
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => navigate(`/host/properties/edit/${property.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(property.id)}
                        disabled={deleteLoading === property.id}
                      >
                        {deleteLoading === property.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostPropertiesPage;
