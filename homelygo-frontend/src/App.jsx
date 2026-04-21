/* ============================================
   APP.JSX - Configuración principal de rutas
   React Router v6 con rutas protegidas
   ============================================ */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, HostRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas públicas
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

// Páginas de autenticación
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Páginas protegidas (cualquier usuario autenticado)
import ReservationsPage from './pages/ReservationsPage';

// Páginas del Host
import HostPropertiesPage from './pages/HostPropertiesPage';
import PropertyFormPage from './pages/PropertyFormPage';

// Estilos globales
import './index.css';

// Layout principal con Navbar y Footer
const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      {children}
    </main>
    <Footer />
  </div>
);

// Layout sin Navbar/Footer (para auth pages)
const AuthLayout = ({ children }) => (
  <div>
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ===== RUTAS PÚBLICAS ===== */}
          <Route path="/" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />

          <Route path="/search" element={
            <MainLayout>
              <SearchPage />
            </MainLayout>
          } />

          <Route path="/property/:id" element={
            <MainLayout>
              <PropertyDetailPage />
            </MainLayout>
          } />

          {/* ===== RUTAS DE AUTENTICACIÓN (solo si NO está logueado) ===== */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicOnlyRoute>
          } />

          <Route path="/register" element={
            <PublicOnlyRoute>
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            </PublicOnlyRoute>
          } />

          {/* ===== RUTAS PROTEGIDAS (requieren login) ===== */}
          <Route path="/reservations" element={
            <ProtectedRoute>
              <MainLayout>
                <ReservationsPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* ===== RUTAS DEL HOST (requieren ser Host) ===== */}
          <Route path="/host/properties" element={
            <HostRoute>
              <MainLayout>
                <HostPropertiesPage />
              </MainLayout>
            </HostRoute>
          } />

          <Route path="/host/properties/new" element={
            <HostRoute>
              <MainLayout>
                <PropertyFormPage />
              </MainLayout>
            </HostRoute>
          } />

          <Route path="/host/properties/edit/:id" element={
            <HostRoute>
              <MainLayout>
                <PropertyFormPage />
              </MainLayout>
            </HostRoute>
          } />

          {/* ===== 404 ===== */}
          <Route path="*" element={
            <MainLayout>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: '16px',
                textAlign: 'center',
                padding: '24px'
              }}>
                <div style={{ fontSize: '5rem' }}>🏠</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Página no encontrada</h1>
                <p style={{ color: 'var(--text-secondary)' }}>La página que buscas no existe.</p>
                <a href="/" style={{
                  padding: '12px 24px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600
                }}>
                  Volver al inicio
                </a>
              </div>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
