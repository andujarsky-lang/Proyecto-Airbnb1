/* ============================================
   PROPERTY FORM PAGE - Crear/Editar propiedad
   Formulario completo con upload de imagen
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propiedadService } from '../services/api';
import './PropertyFormPage.css';

const PropertyFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, es edición
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    precioPorNoche: '',
    capacidad: '',
    tipo: 'Casa',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const propertyTypes = ['Casa', 'Apartamento', 'Villa', 'Cabaña', 'Habitación', 'Loft', 'Finca'];

  // Si es edición, cargar datos existentes
  useEffect(() => {
    if (isEditing) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      const data = await propiedadService.getById(id);
      setFormData({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        ubicacion: data.ubicacion || '',
        precioPorNoche: data.precioPorNoche || '',
        capacidad: data.capacidad || '',
        tipo: data.tipo || 'Casa',
      });
      if (data.imagenPrincipalUrl) {
        setImagePreview(`https://localhost:7154${data.imagenPrincipalUrl}`);
      }
    } catch (error) {
      setError('No se pudo cargar la propiedad.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo y tamaño
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no puede superar los 10MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleImageChange(fakeEvent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) { setError('El nombre es requerido.'); return; }
    if (!formData.ubicacion.trim()) { setError('La ubicación es requerida.'); return; }
    if (!formData.precioPorNoche || formData.precioPorNoche <= 0) { setError('El precio debe ser mayor a 0.'); return; }
    if (!formData.capacidad || formData.capacidad <= 0) { setError('La capacidad debe ser mayor a 0.'); return; }

    setLoading(true);
    setError('');

    try {
      // Construir FormData para enviar imagen + datos
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('descripcion', formData.descripcion);
      data.append('ubicacion', formData.ubicacion);
      data.append('precioPorNoche', formData.precioPorNoche);
      data.append('capacidad', formData.capacidad);
      data.append('tipo', formData.tipo);
      if (imageFile) {
        data.append('imagen', imageFile);
      }

      if (isEditing) {
        await propiedadService.update(id, data);
      } else {
        await propiedadService.create(data);
      }

      setSuccess(true);
      setTimeout(() => navigate('/host/properties'), 1500);
    } catch (error) {
      setError(error.response?.data || 'Error al guardar la propiedad.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Cargando propiedad...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="form-success">
        <div className="success-animation">✅</div>
        <h2>{isEditing ? 'Propiedad actualizada' : 'Propiedad publicada'}</h2>
        <p>Redirigiendo a tus propiedades...</p>
      </div>
    );
  }

  return (
    <div className="property-form-page">
      <div className="container">
        <div className="form-page-header">
          <button className="back-btn" onClick={() => navigate('/host/properties')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Volver
          </button>
          <h1>{isEditing ? 'Editar propiedad' : 'Publicar nueva propiedad'}</h1>
          <p>{isEditing ? 'Actualiza la información de tu alojamiento' : 'Comparte tu espacio con viajeros de todo el mundo'}</p>
        </div>

        <div className="property-form-layout">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="property-form">
            {error && (
              <div className="form-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            {/* Sección: Información básica */}
            <div className="form-section">
              <h3 className="form-section-title">
                <span className="section-number">1</span>
                Información básica
              </h3>

              <div className="form-field">
                <label htmlFor="nombre">Nombre de la propiedad *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Villa Amapola con vista al mar"
                  className="field-input"
                  maxLength={100}
                />
                <span className="field-hint">{formData.nombre.length}/100 caracteres</span>
              </div>

              <div className="form-field">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe tu propiedad: qué la hace especial, qué incluye, reglas de la casa..."
                  className="field-textarea"
                  rows={5}
                  maxLength={1000}
                />
                <span className="field-hint">{formData.descripcion.length}/1000 caracteres</span>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="tipo">Tipo de propiedad *</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="field-select"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="ubicacion">Ubicación *</label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    placeholder="Ej: Punta Cana, La Altagracia"
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Precio y capacidad */}
            <div className="form-section">
              <h3 className="form-section-title">
                <span className="section-number">2</span>
                Precio y capacidad
              </h3>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="precioPorNoche">Precio por noche (DOP) *</label>
                  <div className="price-input-wrapper">
                    <span className="price-prefix">RD$</span>
                    <input
                      type="number"
                      id="precioPorNoche"
                      name="precioPorNoche"
                      value={formData.precioPorNoche}
                      onChange={handleChange}
                      placeholder="0"
                      className="field-input price-input"
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="capacidad">Capacidad máxima *</label>
                  <div className="capacity-input-wrapper">
                    <input
                      type="number"
                      id="capacidad"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={handleChange}
                      placeholder="0"
                      className="field-input"
                      min="1"
                      max="50"
                    />
                    <span className="capacity-suffix">huéspedes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Imagen */}
            <div className="form-section">
              <h3 className="form-section-title">
                <span className="section-number">3</span>
                Foto principal
              </h3>

              <div
                className={`image-dropzone ${imagePreview ? 'has-image' : ''}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('imageInput').click()}
              >
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <div className="image-overlay">
                      <span>Cambiar imagen</span>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <div className="dropzone-icon">📸</div>
                    <p className="dropzone-title">Arrastra una imagen aquí</p>
                    <p className="dropzone-subtitle">o haz clic para seleccionar</p>
                    <span className="dropzone-hint">JPG, PNG, WEBP · Máx. 10MB</span>
                  </div>
                )}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate('/host/properties')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="btn-spinner"></span>
                    {isEditing ? 'Guardando...' : 'Publicando...'}
                  </span>
                ) : (
                  isEditing ? 'Guardar cambios' : 'Publicar propiedad'
                )}
              </button>
            </div>
          </form>

          {/* Preview lateral */}
          <div className="form-preview">
            <h3>Vista previa</h3>
            <div className="preview-card">
              <div className="preview-image">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <div className="preview-placeholder">🏠</div>
                )}
              </div>
              <div className="preview-info">
                <h4>{formData.nombre || 'Nombre de la propiedad'}</h4>
                <p className="preview-location">📍 {formData.ubicacion || 'Ubicación'}</p>
                <p className="preview-capacity">👥 Hasta {formData.capacidad || '?'} huéspedes</p>
                <p className="preview-price">
                  <strong>
                    {formData.precioPorNoche
                      ? `RD$ ${Number(formData.precioPorNoche).toLocaleString()}`
                      : 'RD$ 0'}
                  </strong>
                  {' '}/ noche
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormPage;
