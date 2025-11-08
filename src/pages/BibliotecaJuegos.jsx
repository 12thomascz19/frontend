import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEllipsisV,
  FaStar,
  FaTrashAlt,
  FaPlusCircle,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const JuegoCard = ({ juego, esBiblioteca = false, onEliminar }) => {
  const [flipped, setFlipped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAgregarBiblioteca = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/juegos",
        { ...juego },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🎮 Agregado a tu biblioteca", {
        style: {
          background: "#1A1A2E",
          color: "#00FF88",
          border: "1px solid #00FF88",
          boxShadow: "0 0 12px #00FF88",
          fontWeight: "600",
        },
      });
    } catch (error) {
      toast.error("Error al agregar el juego");
      console.error(error);
    }
  };

  const handleEliminar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/juegos/${juego._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Juego eliminado", {
        style: {
          background: "#1A1A2E",
          color: "#FF4081",
          border: "1px solid #FF1744",
          boxShadow: "0 0 12px #FF1744",
        },
      });
      if (onEliminar) onEliminar();
    } catch (error) {
      console.error(error);
    }
  };

  const puntuacion = Number(juego?.puntuacion) || 0;

  const estrellas = Array.from({ length: 5 }, (_, i) => (
    <FaStar
      key={i}
      className={i < puntuacion ? "text-[#FF4081]" : "text-gray-600"}
    />
  ));

  const imagenJuego =
    juego?.imagenPortada || juego?.imagen || "/placeholder.jpg";
  // const puntua
  // cion = Number(juego?.puntuacion) || 0;
  const completado = juego?.completado ?? false; // ← valor por defecto

  return (
    <motion.div
      className="relative w-full h-80 perspective cursor-pointer"
      onClick={() => setMenuOpen(false)}
    >
      <motion.div
        className={`relative w-full h-full transition-transform duration-700 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Cara frontal */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-lg [backface-visibility:hidden]"
          style={{
            backgroundImage: `url(${imagenJuego})`,
          }}
        >
          {/* Overlay oscuro para resaltar título */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000d9] via-transparent to-transparent"></div>

          {/* Etiqueta completado + menú */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {completado ? (
              <span className="flex items-center gap-1 bg-[#00FF88]/30 text-[#00FF88] px-2 py-1 rounded-md text-xs font-bold">
                <FaCheckCircle /> Completado
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-[#FF4081]/20 text-[#FF4081] px-2 py-1 rounded-md text-xs font-bold">
                En progreso
              </span>
            )}
          </div>

          {/* Menú tres puntos */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-2 rounded-full bg-[#0A0A12]/50 hover:bg-[#1A1A2E] transition"
              >
                <FaEllipsisV />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-[#161625] border border-[#6C63FF40] rounded-md shadow-lg z-50"
                  >
                    {!esBiblioteca ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgregarBiblioteca();
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#6C63FF20] transition-all text-[#00E5FF]"
                      >
                        <FaPlusCircle /> Agregar a biblioteca
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminar();
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#FF174420] transition-all text-[#FF4081]"
                      >
                        <FaTrashAlt /> Eliminar
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Título y descripción */}
          <div className="absolute bottom-0 left-0 w-full p-4">
            <h3 className="text-xl font-bold text-white drop-shadow-md flex justify-between items-center">
              {juego.titulo}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(true);
                }}
                className="text-sm bg-[#6C63FF] px-3 py-1 rounded-md hover:bg-[#7B72FF] transition"
              >
                Ver detalles
              </button>
            </h3>
            <p className="text-sm text-[#B0B3C2] mt-1 line-clamp-2">
              {juego.descripcion}
            </p>
          </div>
        </div>

        {/* Cara trasera */}
        <div className="absolute inset-0 bg-[#1A1A2E] rounded-xl shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between p-4">
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-20"
            style={{ backgroundImage: `url(${juego.imagen})` }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#00E5FF] mb-2">
              {juego.titulo}
            </h3>
            <div className="text-sm space-y-1 text-[#E0E0E0]">
              <p>
                🎮 <span className="text-[#00E5FF]">Desarrollador:</span>{" "}
                {juego.desarrollador}
              </p>
              <p>
                📅 <span className="text-[#00E5FF]">Lanzamiento:</span>{" "}
                {juego.anio}
              </p>
              <p>
                🕹️ <span className="text-[#00E5FF]">Plataforma:</span>{" "}
                {juego.plataforma}
              </p>
              <p>
                🏷️ <span className="text-[#00E5FF]">Género:</span>{" "}
                {juego.genero}
              </p>
              <p>
                ⭐ <span className="text-[#00E5FF]">Puntuación:</span>{" "}
                {estrellas}
              </p>
            </div>
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(false);
            }}
            className="relative z-10 mt-3 bg-[#6C63FF] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#7B72FF] transition"
          >
            Volver
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JuegoCard;
