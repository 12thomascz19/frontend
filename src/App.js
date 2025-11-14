import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import BibliotecaJuegos from "./pages/Biblioteca/BibliotecaJuegos";
import Estadisticas from "./pages/Estadisticas/Estadisticas";
import Home from "./pages/Home";
import Cuenta from "./pages/Cuenta/Cuenta";
import ExplorarJuegos from "./pages/ExplorarJuegos/ExplorarJuegos";

// ✅ Importa los modales
import LoginModal from "./components/Modals/LoginModal";
import RegisterModal from "./components/Modals/RegisterModal";

// ✅ Importa react-hot-toast si usas toasts globales
import { Toaster } from "react-hot-toast";
import Reseñas from "./pages/Reseñas/Reseñas";
import VerResenas from "./pages/VerReseñas/VerResenas";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );

  // ✅ Cuando el usuario inicia sesión correctamente
  const handleLoginSuccess = (userData) => {
    setUsuario(userData);
    setShowLogin(false);
  };

  // ✅ Cuando el usuario cierra sesión
  const handleLogout = () => {
    setUsuario(null);
  };

  return (
    <>
      <Router>
        {/* ✅ Navbar recibe funciones y estado */}
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />

        {/* ✅ Rutas principales */}
        <Routes>
          <Route path="/" element={<Home usuario={usuario} />} />
          <Route path="/Explorar-juegos" element={<ExplorarJuegos />} />
          <Route path="/biblioteca" element={<BibliotecaJuegos />} />
          <Route path="/resenas" element={<Reseñas />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/ver-resenas" element={<VerResenas />} />
        </Routes>

        {/* ✅ Modales controlados por estado */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {showRegister && (
          <RegisterModal onClose={() => setShowRegister(false)} />
        )}
      </Router>

      {/* ✅ Toast global con estilo neón verde */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#00FF88",
              color: "#0A0A12",
              fontWeight: "700",
              border: "1px solid #00FF88",
              boxShadow: "0 0 25px #00FF88, 0 0 50px #00FF88",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            },
          },
          error: {
            style: {
              background: "#FF1744",
              color: "#FFFFFF",
              fontWeight: "700",
              border: "1px solid #FF1744",
              boxShadow: "0 0 25px #FF1744, 0 0 50px #FF1744",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            },
          },
        }}
      />
    </>
  );
}

export default App;
