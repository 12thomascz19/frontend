# 🎮 GameTracker — Frontend

Bienvenido al **Frontend de GameTracker**, una aplicación web moderna donde los usuarios pueden **registrarse, iniciar sesión y gestionar sus propios videojuegos**.  
Desarrollada con **React**, **TailwindCSS**, y conectada al backend de **Node.js + MongoDB**.

---

## 🚀 Tecnologías utilizadas

    | Tecnología | Descripción |
    |-------------|-------------|
    | ⚛️ **React.js** | Framework principal para el frontend |
    | 🎨 **TailwindCSS** | Sistema de estilos rápido, moderno y responsive |
    | 🌐 **Axios** | Cliente HTTP para conectar con el backend |
    | 🔄 **React Router DOM** | Manejo de rutas y navegación SPA |
    | 🧠 **LocalStorage** | Persistencia de sesión del usuario |
    | 🧩 **React Icons** | Iconos profesionales y personalizables |

---

## 🧱 Estructura del proyecto

    frontend/
    │
    ├── src/
    │ ├── api.js # Configuración de conexión al backend
    │ ├── App.js # Rutas principales y navegación
    │ │
    │ ├── components/
    │ │ ├── Navbar/ # Barra de navegación dinámica
    │ │ │ └── Navbar.jsx
    │ │ │
    │ │ ├── Modals/ # Modales de autenticación
    │ │ │ ├── LoginModal.jsx
    │ │ │ └── RegisterModal.jsx
    │ │ │
    │ │ └── Juegos/ # Componentes de juegos del usuario
    │ │ └── MisJuegos.jsx
    │ │
    │ ├── pages/
    │ │ ├── BibliotecaJuegos.jsx
    │ │ ├── Estadisticas.jsx
    │ │ └── Cuenta.jsx # Página privada del usuario logueado
    │ │
    │ └── index.js # Punto de entrada React
    │
    ── package.json
    
---

## 🎨 Paleta de colores — “GameTracker”

    | Rol | Color | HEX | Descripción |
    |------|-------|-----|-------------|
    | 🎯 Primario | Azul violeta gamer | `#6C63FF` | Botones, enlaces y bordes |
    | ⚡ Secundario | Cian eléctrico | `#00E5FF` | Efectos y resaltes brillantes |
    | 🕹️ Acento | Rosa neón | `#FF4081` | Alertas y logros |
    | 🌑 Fondo | Azul oscuro | `#0A0A12` | Fondo general |
    | 🧩 Paneles | Azul profundo | `#1A1A2E` | Tarjetas y secciones |
    | ✨ Texto principal | Blanco | `#FFFFFF` | Títulos y texto visible |
    | 💬 Texto secundario | Gris azulado | `#B0B3C2` | Etiquetas y subtítulos |
    | 🔥 Éxito | Verde neón | `#00FF88` | Indicadores positivos |
  | 💀 Error | Rojo neón | `#FF1744` | Mensajes de error |

---

## ⚙️ Instalación y ejecución
    npn install
    npm run dev

### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/12thomascz19/frontend.git
cd frontend
└── tailwind.config.js

