import React, { useState, useEffect, useRef } from "react";
// Importa React, hooks de estado, efecto y referencias

import { Link, useNavigate } from "react-router-dom";
// Link para navegación interna y useNavigate para redirecciones programáticas

import {
  FaGamepad,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaBookOpen,
  FaChevronDown,
  FaPlayCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
// Importa íconos de Font Awesome usados en el navbar

import { motion, AnimatePresence } from "framer-motion";
// Framer Motion para animaciones suaves de apertura y cierre de elementos

import toast from "react-hot-toast";
// Para mostrar notificaciones emergentes (ej. cierre de sesión)

// Componente Navbar principal
const Navbar = ({ onLoginClick, onRegisterClick, onLogout }) => {
  const navigate = useNavigate();
  // Hook para redirigir a rutas programáticamente

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  // Obtiene usuario del localStorage (si está logueado)

  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para controlar dropdown del usuario en desktop

  const [mobileMenu, setMobileMenu] = useState(false);
  // Estado para mostrar menú móvil

  const dropdownRef = useRef(null);
  // Referencia al dropdown para detectar clicks fuera del menú

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina token
    localStorage.removeItem("usuario"); // Elimina usuario

    // Muestra notificación de éxito al cerrar sesión
    toast.success("Sesión cerrada correctamente 👋", {
      style: {
        background: "#1A1A2E",
        color: "#00FF88",
        border: "1px solid #6C63FF",
        boxShadow: "0 0 12px #6C63FF80",
        fontWeight: "600",
      },
      icon: "🎮",
    });

    if (onLogout) onLogout(); // Llama función pasada como prop

    navigate("/"); // Redirige a la página principal
  };

  // Hook para cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false); // Cierra dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Contenedor principal del header/navbar
    <header className="fixed top-0 left-0 w-full bg-[#0A0A12]/95 backdrop-blur-md border-b border-[#6C63FF40] shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigate("/")} // Redirige al home
          whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
        >
          <FaGamepad className="text-[#6C63FF] text-3xl drop-shadow-[0_0_12px_#6C63FF]" />
          <span className="text-[#00E5FF] text-2xl font-extrabold tracking-wide">
            GAMETRACKER
          </span>
        </motion.div>

        {/* BOTÓN MENÚ HAMBURGUESA (MÓVIL) */}
        <button
          className="lg:hidden text-[#00E5FF] text-3xl"
          onClick={() => setMobileMenu(true)}
        >
          <FaBars />
        </button>

        {/* MENÚ DESKTOP */}
        <nav className="hidden lg:flex items-center gap-8 text-[#C9C9D9] font-medium">
          {/* Links principales */}
          <Link
            to="/Explorar-juegos"
            className="flex items-center gap-2 hover:text-[#00FF88] transition-all"
          >
            <FaPlayCircle /> Explorar Juegos
          </Link>

          <Link
            to="/biblioteca"
            className="flex items-center gap-2 hover:text-[#00E5FF] transition-all"
          >
            <FaBookOpen /> Mi Biblioteca
          </Link>

          <Link
            to="/resenas"
            className="flex items-center gap-2 hover:text-[#00E5FF] transition-all"
          >
            <FaBookOpen /> Mis Reseñas
          </Link>

          <Link
            to="/estadisticas"
            className="flex items-center gap-2 hover:text-[#6C63FF] transition-all"
          >
            <FaChartBar /> Mis Estadísticas
          </Link>

          {/* DROPDOWN USUARIO */}
          {usuario ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }} // Pequeña animación al hover
                onClick={() => setMenuOpen(!menuOpen)} // Alterna el dropdown
                className="flex items-center gap-2 bg-[#6C63FF]/20 px-5 py-2 rounded-full text-[#00E5FF] font-semibold shadow-inner border border-[#6C63FF]/50 hover:bg-[#6C63FF]/30 transition-all"
              >
                <FaUserCircle className="text-xl" />
                {usuario.nombre}
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {/* Dropdown animado */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-3 w-52 bg-[#161625] border border-[#6C63FF40] rounded-xl shadow-lg p-3 text-sm"
                  >
                    <Link
                      to="/cuenta"
                      className="group flex items-center gap-3 text-[#E0E0F0] px-3 py-2 rounded-md transition-all"
                      onClick={() => setMenuOpen(false)} // Cierra dropdown al click
                    >
                      <FaUserCircle className="text-[#00E5FF]" />
                      <span>Mi cuenta</span>
                    </Link>

                    <button
                      onClick={handleLogout} // Cierra sesión
                      className="group flex items-center gap-3 text-[#FF4C7D] px-3 py-2 rounded-md w-full text-left transition-all"
                    >
                      <FaSignOutAlt />
                      <span>Cerrar sesión</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Si no hay usuario logueado → botones login y register
            <div className="flex gap-4">
              <button
                onClick={onLoginClick}
                className="bg-[#6C63FF] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#7B72FF] transition-all shadow-md"
              >
                Iniciar sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="bg-[#00E5FF] px-4 py-2 rounded-md text-black font-semibold hover:bg-[#33EEFF] transition-all shadow-md"
              >
                Registrarse
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-72 h-full 
                       bg-[#0A0A12] bg-opacity-95 backdrop-blur-xl
                       border-l border-[#6C63FF40] 
                       shadow-xl z-[999] p-6 flex flex-col gap-6"
          >
            {/* CABECERA DEL MENÚ: Nombre del usuario */}
            <div className="flex justify-between items-center">
              <span
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/cuenta");
                }}
                className="text-[#00E5FF] text-lg font-semibold underline underline-offset-4 cursor-pointer hover:text-[#33EEFF] transition"
              >
                {usuario?.nombre || "Mi Cuenta"}
              </span>

              <button
                className="text-[#FF4C7D] text-3xl"
                onClick={() => setMobileMenu(false)} // Cierra menú
              >
                <FaTimes />
              </button>
            </div>

            {/* LINKS MÓVIL */}
            <Link
              to="/Explorar-juegos"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 text-[#C9C9D9] hover:text-[#00FF88] transition-all"
            >
              <FaPlayCircle /> Explorar Juegos
            </Link>

            <Link
              to="/biblioteca"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 text-[#C9C9D9] hover:text-[#00E5FF] transition-all"
            >
              <FaBookOpen /> Mi Biblioteca
            </Link>

            <Link
              to="/resenas"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 text-[#C9C9D9] hover:text-[#00E5FF] transition-all"
            >
              <FaBookOpen /> Mis Reseñas
            </Link>

            <Link
              to="/estadisticas"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 text-[#C9C9D9] hover:text-[#6C63FF] transition-all"
            >
              <FaChartBar /> Mis Estadísticas
            </Link>

            {/* LOGIN / LOGOUT MÓVIL */}
            {!usuario ? (
              <div className="flex flex-col gap-3 mt-5">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      onLoginClick();
                    }}
                    className="w-full bg-[#6C63FF] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#7B72FF] transition-all"
                  >
                    Iniciar sesión
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      onRegisterClick();
                    }}
                    className="w-full bg-[#00E5FF] px-4 py-2 rounded-md text-black font-semibold hover:bg-[#33EEFF] transition-all"
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleLogout(); // Cierra sesión en móvil
                }}
                className="flex items-center gap-3 text-[#FF4C7D] font-semibold px-4 py-2 hover:text-[#FF1744] transition-all"
              >
                <FaSignOutAlt /> Cerrar sesión
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LÍNEA ANIMADA DEL NAVBAR */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#6C63FF] via-[#00E5FF] to-[#FF4081]"
        animate={{ backgroundPosition: ["0%", "100%"] }} // Animación de gradiente en loop
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 100%" }}
      ></motion.div>
    </header>
  );
};

export default Navbar;
