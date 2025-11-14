import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGamepad,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaBookOpen,
  FaChevronDown,
  FaPlayCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Navbar = ({
  onLoginClick,
  onRegisterClick,
  onLoginSuccess, 
  onLogout, 
}) => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // ✅ Mostrar notificación de cierre
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

    // ✅ Ejecutar callback del padre (si existe)
    if (onLogout) onLogout();

    // ✅ Redirige sin recargar la página
    navigate("/");
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0A0A12]/95 backdrop-blur-md border-b border-[#6C63FF40] shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
        >
          <FaGamepad className="text-[#6C63FF] text-3xl drop-shadow-[0_0_12px_#6C63FF]" />
          <span className="text-[#00E5FF] text-2xl font-extrabold tracking-wide">
            GAMETRACKER
          </span>
        </motion.div>

        {/* LINKS DE NAVEGACIÓN */}
        <nav className="flex items-center gap-8 text-[#C9C9D9] font-medium">
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
            <FaBookOpen />
            Mi Biblioteca
          </Link>
          <Link
            to="/resenas"
            className="flex items-center gap-2 hover:text-[#00E5FF] transition-all"
          >
            <FaBookOpen />
            Mis Reseñas
          </Link>

          <Link
            to="/estadisticas"
            className="flex items-center gap-2 hover:text-[#6C63FF] transition-all"
          >
            <FaChartBar />
            Mis Estadísticas
          </Link>

          {/* Usuario logueado */}
          {usuario ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setMenuOpen(!menuOpen)}
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

              {/* Dropdown del usuario */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-3 w-52 bg-[#161625] border border-[#6C63FF40] rounded-xl shadow-lg p-3 text-sm"
                  >
                    {/* PERFIL */}
                    <Link
                      to="/cuenta"
                      className="group flex items-center gap-3 text-[#E0E0F0] px-3 py-2 rounded-md transition-all duration-300 relative overflow-hidden"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#00E5FF20] to-[#6C63FF20] blur-md transition-all duration-500"></div>
                      <FaUserCircle className="relative text-[#00E5FF] group-hover:drop-shadow-[0_0_8px_#00E5FF]" />
                      <span className="relative group-hover:text-[#00E5FF]">
                        Mi cuenta
                      </span>
                    </Link>

                    {/* CERRAR SESIÓN */}
                    <button
                      onClick={handleLogout}
                      className="group flex items-center gap-3 text-[#FF4C7D] px-3 py-2 rounded-md w-full text-left relative overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#FF174420] to-[#FF408120] blur-md transition-all duration-500"></div>
                      <FaSignOutAlt className="relative group-hover:drop-shadow-[0_0_8px_#FF1744]" />
                      <span className="relative group-hover:text-[#FF1744]">
                        Cerrar sesión
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
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

      {/* Línea inferior animada */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#6C63FF] via-[#00E5FF] to-[#FF4081]"
        animate={{ backgroundPosition: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundSize: "200% 100%",
        }}
      ></motion.div>
    </header>
  );
};

export default Navbar;
