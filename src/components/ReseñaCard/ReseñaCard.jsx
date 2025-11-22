import React, { useState } from "react";
// Importa React y useState para manejar estados internos

import axios from "axios";
// Axios para hacer peticiones HTTP al backend

import {
  FaEllipsisV,
  FaClock,
  FaGamepad,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
// Importa íconos de Font Awesome usados en la tarjeta

import { motion, AnimatePresence } from "framer-motion";
// Framer Motion para animaciones suaves

import toast from "react-hot-toast";
// Para mostrar notificaciones emergentes (éxito o error)

// Imagen por defecto si no hay portada
const coverPlaceholder =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

// Componente de tarjeta de reseña
const ResenaCard = ({ resena, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para abrir/cerrar el menú de opciones (editar/eliminar)

  // Obtener usuario y token del localStorage
  const user = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  // Determinar nombre del autor de la reseña
  const autorNombre =
    resena?.usuario?.nombre ||
    resena?.autor?.nombre ||
    resena?.usuarioNombre ||
    "Anónimo";

  // Determinar ID del autor
  const autorId =
    resena?.usuario?._id || resena?.autor?._id || resena?.usuarioId;

  // Validar si el usuario actual es propietario de la reseña
  const esPropietario = user?.id === autorId || user?._id === autorId;

  // ----------------------------------
  // 🔥 FUNCION ELIMINAR RESEÑA
  // ----------------------------------
  const eliminarResena = async () => {
    if (!esPropietario) {
      toast.error("❌ No puedes eliminar reseñas de otros usuarios.");
      setMenuOpen(false);
      return;
    }

    try {
      // Petición DELETE al backend con token en headers
      const respuesta = await axios.delete(
        `http://localhost:5000/api/resenas/${resena._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Notificación de éxito y cierre del menú
      toast.success("✔ Reseña eliminada correctamente");
      setMenuOpen(false);

      // Llama a la función onDelete pasada como prop para actualizar la lista
      onDelete(resena._id);
    } catch (error) {
      toast.error("Error al eliminar reseña");
      console.error(error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }} // Animación inicial al cargar la tarjeta
      animate={{ opacity: 1, y: 0 }} // Animación final
      className="relative bg-[#0D0D14] rounded-2xl border border-[#2A2A3E] overflow-hidden"
    >
      {/* BOTÓN 3 PUNTOS: Abrir menú opciones */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-3 right-3 p-2 rounded-full bg-[#1C1B29] border border-[#2A2A3E] hover:bg-[#2A2A3E] transition z-20"
      >
        <FaEllipsisV className="text-gray-300" />
      </button>

      {/* MENÚ OPCIONES (Editar / Eliminar) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-12 right-3 z-30 bg-[#14141F] border border-[#2A2A3E] rounded-lg shadow-xl w-36 overflow-hidden"
          >
            {/* Botón Eliminar */}
            <button
              onClick={eliminarResena}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#1F1F2E]"
            >
              Eliminar
            </button>

            {/* Botón Editar */}
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(resena);
              }}
              className="w-full px-4 py-2 text-left text-sm text-blue-300 hover:bg-[#1F1F2E]"
            >
              Editar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGEN DE PORTADA */}
      <div className="h-40 bg-gradient-to-r from-[#17172A] to-[#0B1020] flex items-center justify-center">
        <img
          src={
            resena.imagenPortada ||
            resena.juego?.imagenPortada ||
            coverPlaceholder
          }
          className="h-28 rounded-xl object-cover border border-[#00E5FF20]"
        />
      </div>

      {/* INFORMACIÓN DE LA RESEÑA */}
      <div className="p-4 flex flex-col gap-3">
        {/* Título del juego */}
        <h3 className="text-lg font-bold text-[#00E5FF]">
          {resena.juego?.titulo}
        </h3>

        {/* Autor y fecha */}
        <p className="text-xs text-[#B0B3C2]">
          <strong className="text-white">{autorNombre}</strong> •{" "}
          {new Date(resena.fechaCreacion).toLocaleDateString()}
        </p>

        {/* Comentario */}
        <p className="text-sm text-[#E0E0F0]">{resena.comentario}</p>

        {/* Etiquetas adicionales: horas jugadas, dificultad, recomendación */}
        <div className="flex gap-2 flex-wrap">
          {/* Horas jugadas */}
          <span className="flex items-center gap-1 bg-[#11121A] px-3 py-1 rounded-full text-xs">
            <FaClock className="text-[#6C63FF]" /> {resena.horasJugadas} h
          </span>

          {/* Dificultad */}
          <span className="flex items-center gap-1 bg-[#11121A] px-3 py-1 rounded-full text-xs">
            <FaGamepad className="text-[#00E5FF]" /> {resena.dificultad}
          </span>

          {/* Recomendación */}
          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
              resena.recomendaria
                ? "bg-[#00E5FF] text-black"
                : "bg-[#1A1A2E] text-[#B0B3C2] border border-[#FF1744]/20"
            }`}
          >
            {resena.recomendaria ? <FaThumbsUp /> : <FaThumbsDown />}
            {resena.recomendaria ? "Recomendada" : "No recomendada"}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ResenaCard;
