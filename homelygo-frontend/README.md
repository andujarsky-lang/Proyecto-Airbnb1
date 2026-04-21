# HomelyGo Frontend

Frontend profesional para la plataforma de reservas de alojamiento HomelyGo.

## Tecnologías
- **React 18** + **Vite**
- **React Router v6** para navegación
- **Axios** para peticiones HTTP
- **Context API** para estado global de autenticación

## Instalación

### 1. Instalar Node.js
Descarga e instala Node.js desde: https://nodejs.org (versión LTS recomendada)

### 2. Instalar dependencias
```bash
cd homelygo-frontend
npm install
```

### 3. Configurar la URL del API
Si tu API corre en un puerto diferente a `7154`, edita:
- `src/services/api.js` → cambia `API_BASE_URL`
- `src/pages/PropertyDetailPage.jsx` → cambia `API_BASE`
- `src/pages/PropertyFormPage.jsx` → cambia la URL de preview
- `src/pages/HostPropertiesPage.jsx` → cambia `API_BASE`
- `vite.config.js` → cambia el `target` del proxy

### 4. Ejecutar en desarrollo
```bash
npm run dev
```
Abre http://localhost:3000

### 5. Build para producción
```bash
npm run build
```

## Estructura del proyecto
```
src/
├── components/
│   ├── Navbar.jsx          # Barra de navegación con notificaciones
│   ├── Footer.jsx          # Pie de página
│   ├── PropertyCard.jsx    # Tarjeta de propiedad reutilizable
│   └── ProtectedRoute.jsx  # Rutas protegidas por rol
├── context/
│   └── AuthContext.jsx     # Estado global de autenticación
├── pages/
│   ├── HomePage.jsx        # Página principal con hero y listado
│   ├── SearchPage.jsx      # Búsqueda con filtros
│   ├── PropertyDetailPage.jsx  # Detalle + reserva
│   ├── LoginPage.jsx       # Login profesional split-screen
│   ├── RegisterPage.jsx    # Registro con selección de rol
│   ├── ReservationsPage.jsx    # Mis reservas (Guest)
│   ├── HostPropertiesPage.jsx  # Panel del anfitrión
│   └── PropertyFormPage.jsx    # Crear/editar propiedad
├── services/
│   └── api.js              # Todos los servicios HTTP
├── App.jsx                 # Rutas principales
└── index.css               # Variables CSS y estilos globales
```

## Funcionalidades
- ✅ Login y registro con diseño split-screen profesional
- ✅ Selección de rol (Viajero/Anfitrión) en registro
- ✅ Confirmación de email (flujo Telegram)
- ✅ Página principal con hero, búsqueda y listado
- ✅ Búsqueda con filtros (ubicación, fechas, capacidad)
- ✅ Detalle de propiedad con galería y formulario de reserva
- ✅ Panel del anfitrión para gestionar propiedades
- ✅ Formulario de crear/editar propiedad con drag & drop de imagen
- ✅ Mis reservas con acciones (cancelar, completar, reseñar)
- ✅ Sistema de notificaciones en tiempo real (polling cada 30s)
- ✅ Rutas protegidas por rol (Guest/Host)
- ✅ Diseño responsive para móvil y desktop
