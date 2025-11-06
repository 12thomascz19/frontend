import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEllipsisV,
  FaPlusCircle,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaUserAlt,
  FaCalendarAlt,
  FaGamepad,
  FaTags,
  FaUndoAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import './AgregarJuegoModal.css';

const JuegoCard = ({ juego }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const dropdownRef = useRef(null);

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

  const agregarABiblioteca = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Debes iniciar sesión para agregar juegos 🎮");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/juegos",
        { ...juego },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Juego agregado a tu biblioteca ✅", {
        style: {
          background: "#0A0A12",
          color: "#00FF88",
          border: "1px solid #00FF88",
          boxShadow: "0 0 15px #00FF8880",
          fontWeight: "600",
        },
        icon: "🎮",
      });
    } catch (error) {
      console.error("Error al agregar juego:", error);
      toast.error("No se pudo agregar el juego 😢");
    } finally {
      setMenuOpen(false);
    }
  };

  const renderStars = (puntuacion) => {
    const totalStars = 5;
    return [...Array(totalStars)].map((_, i) => (
      <FaStar
        key={i}
        className={`${
          i < puntuacion ? "text-yellow-400" : "text-gray-600"
        } text-lg drop-shadow-[0_0_4px_#00000060]`}
      />
    ));
  };

  return (
    <div className="relative w-full h-[380px] perspective">
      {/* Contenedor interno 3D */}
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        {/* 🎴 Parte frontal */}
        <div className="card-front border border-[#6C63FF40] shadow-[0_0_20px_#00E5FF40]">
          <img
            src={
              juego.imagenPortada ||
              "https://via.placeholder.com/400x400?text=Sin+Portada"
            }
            alt={juego.titulo}
            className="w-full h-full object-cover"
          />

          {/* Sombra inferior */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#000000d0] to-transparent"></div>

          {/* Estado y menú */}
          <div
            className="absolute top-3 left-3 right-3 flex justify-between items-center"
            ref={dropdownRef}
          >
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                juego.completado
                  ? "bg-[#00FF8830] text-[#00FF88]"
                  : "bg-[#FF174430] text-[#FF4081]"
              }`}
            >
              {juego.completado ? (
                <>
                  <FaCheckCircle /> Completado
                </>
              ) : (
                <>
                  <FaTimesCircle /> Pendiente
                </>
              )}
            </div>

            {/* Menú de 3 puntos */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-2 bg-[#0A0A12]/60 rounded-full hover:bg-[#6C63FF]/70 transition-all cursor-pointer"
            >
              <FaEllipsisV />
            </div>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 w-48 bg-[#1E1E2E] border border-[#6C63FF60] rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      agregarABiblioteca();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-[#E0E0F0] hover:bg-[#6C63FF]/30 transition-all"
                  >
                    <FaPlusCircle className="text-[#00FF88]" />
                    Agregar a mi biblioteca
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Texto inferior */}
          <div className="absolute bottom-4 left-0 w-full px-5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-[#00E5FF] drop-shadow-[0_0_8px_#000]">
                {juego.titulo}
              </h3>
              <p className="text-sm text-gray-300 max-w-[250px]">
                {juego.descripcion?.slice(0, 60)}...
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(true);
              }}
              className="bg-[#00E5FF]/90 text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#00FF88] transition-all shadow-md"
            >
              Ver detalles
            </button>
          </div>
        </div>

        {/* 🎴 Parte trasera */}
        <div className="card-back relative overflow-hidden border border-[#6C63FF60] rounded-xl shadow-[0_0_25px_#6C63FF80]">
          {/* Fondo desenfocado */}
          <img
            src={
              juego.imagenPortada ||
              "https://via.placeholder.com/400x400?text=Sin+Portada"
            }
            alt="Fondo desenfocado"
            className="absolute inset-0 w-full h-full object-cover blur-md brightness-[0.4]"
          />

          <div className="relative z-10 h-full flex flex-col justify-between p-5 text-white">
            <div>
              <h3 className="text-2xl font-extrabold text-[#00E5FF] mb-4 drop-shadow-[0_0_10px_#00E5FF60]">
                {juego.titulo}
              </h3>

              {/* Puntuación */}
              <div className="flex gap-1 mb-3">{renderStars(juego.valoracion)}</div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaUserAlt className="text-[#00E5FF]" />
                  <span>
                    <strong>Desarrollador:</strong> {juego.desarrollador}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaCalendarAlt className="text-[#00E5FF]" />
                  <span>
                    <strong>Año de lanzamiento:</strong> {juego.anioLanzamiento}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaGamepad className="text-[#00E5FF]" />
                  <span>
                    <strong>Plataforma:</strong> {juego.plataforma}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaTags className="text-[#00E5FF]" />
                  <span>
                    <strong>Género:</strong> {juego.genero}
                  </span>
                </div>

                <div className="text-[#B0B3C2] text-xs mt-2 text-right">
                  <span>
                    <strong>Creado:</strong>{" "}
                    {new Date(juego.fechaCreacion).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] text-black font-bold px-6 py-2 rounded-lg shadow-[0_0_12px_#00E5FF80] hover:shadow-[0_0_20px_#6C63FF80] transition-all"
            >
              <FaUndoAlt /> Volver
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuegoCard;
