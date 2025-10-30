import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaChartBar, FaGamepad } from "react-icons/fa";
import LoginModal from "../Modals/LoginModal";
import RegisterModal from "../Modals/RegisterModal";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef();

  // ✅ Detectar sesión activa al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
  };

  const links = [
    { to: "/biblioteca", label: "Biblioteca", icon: <FaGamepad /> },
    { to: "/estadisticas", label: "Estadísticas", icon: <FaChartBar /> },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-[#1A1A2E] border-b-2 border-[#6C63FF] shadow-[0_0_20px_rgba(108,99,255,0.3)] sticky top-0 z-50">
        {/* 🎮 LOGO */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-[#00E5FF] font-bold text-xl uppercase tracking-wide flex items-center gap-2"
        >
          🎮 <span className="text-[#6C63FF]">GameTracker</span>
        </div>

        {/* 🔗 ENLACES */}
        <ul className="flex items-center gap-6 text-[#B0B3C2] font-medium">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center gap-1 transition duration-300 hover:text-[#00E5FF] ${
                  location.pathname === link.to
                    ? "text-[#6C63FF] drop-shadow-[0_0_8px_#6C63FF]"
                    : ""
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}

          {/* 🔐 Si no hay sesión → mostrar botones */}
          {!usuario ? (
            <>
              <li>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg shadow-[0_0_10px_#6C63FF] hover:bg-[#00E5FF] hover:shadow-[0_0_15px_#00E5FF] transition duration-300"
                >
                  Iniciar sesión
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-[#FF4081] text-white px-4 py-2 rounded-lg shadow-[0_0_10px_#FF4081] hover:bg-[#00FF88] hover:shadow-[0_0_15px_#00FF88] transition duration-300"
                >
                  Registrarse
                </button>
              </li>
            </>
          ) : (
            // 👤 Usuario autenticado
            <li className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-2 text-white bg-[#6C63FF]/30 hover:bg-[#6C63FF]/50 px-4 py-2 rounded-full transition duration-300 border border-[#6C63FF]"
              >
                <FaUserCircle className="text-2xl text-[#00E5FF]" />
                <span className="font-medium">{usuario.nombre}</span>
              </button>

              {/* ⚙️ MENÚ DESPLEGABLE */}
              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A2E] border border-[#6C63FF] rounded-lg shadow-[0_0_15px_rgba(108,99,255,0.4)] p-2">
                  <button
                    onClick={() => {
                      navigate("/cuenta");
                      setMenuAbierto(false);
                    }}
                    className="flex items-center gap-2 w-full text-left text-[#B0B3C2] hover:text-[#00E5FF] hover:bg-[#6C63FF]/10 px-3 py-2 rounded-md transition"
                  >
                    <FaUserCircle /> Mi cuenta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left text-[#FF4081] hover:text-[#FF1744] hover:bg-[#FF4081]/10 px-3 py-2 rounded-md transition"
                  >
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>

      {/* Modales */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </>
  );
};

export default Navbar;
