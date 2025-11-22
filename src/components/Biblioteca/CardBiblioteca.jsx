import React, { useState } from "react";
// Importo el icono de 3 puntos verticales para el menú
import { FiMoreVertical } from "react-icons/fi";
// Importo el CSS adicional para el card (perspectiva, flip, etc.)
import './CardBiblioteca.css'

// Componente que recibe un "juego" como prop
function CardBiblioteca({ juego }) {
  // Estado para controlar si la carta está volteada (flip)
  const [flip, setFlip] = useState(false);

  // Si no hay información del juego, mostramos un mensaje de error
  if (!juego) {
    return (
      <div className="w-80 h-[420px] bg-gray-800 text-white flex items-center justify-center rounded-xl shadow-xl">
        <p>Error: juego no disponible</p>
      </div>
    );
  }

  // Extraemos los valores del juego con valores por defecto por si falta algo
  const {
    titulo = "Sin título",
    descripcion = "Sin descripción",
    imagenPortada = "https://via.placeholder.com/400x400?text=Sin+Imagen",
    valoracion = 0,
    completado = false,
    desarrollador = "Desconocido",
    anioLanzamiento = "N/A",
    plataforma = "N/A",
    genero = "N/A",
    fechaCreacion = "N/A",
  } = juego;

  // Función para mostrar las estrellas según la puntuación
  const renderStars = (num) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < num ? "text-yellow-400" : "text-gray-500"}>
        ★
      </span>
    ));
  };

  return (
    // Contenedor con perspectiva para efecto 3D y cursor pointer
    <div className="w-80 h-[420px] perspective cursor-pointer">
      <div
        className={`relative w-full h-full duration-700 transform-style-preserve-3d ${
          flip ? "rotate-y-180" : ""
        }`}
      >
        {/* -------- CARA DELANTERA -------- */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg">
          {/* Imagen del juego */}
          <img
            src={imagenPortada}
            alt={titulo}
            onError={(e) => {
              // Si falla la imagen, mostramos un placeholder
              e.target.src =
                "https://via.placeholder.com/400x400?text=Imagen+No+Disponible";
            }}
            className="w-full h-full object-cover"
          />

          {/* Badge de completado */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-md">
            {completado ? "Completado ✓" : "Sin completar"}
          </div>

          {/* Menú de 3 puntos */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-80">
            <FiMoreVertical size={18} />
          </div>

          {/* Degradado para que el texto destaque sobre la imagen */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          {/* Título y botón para voltear */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold">{titulo}</h2>

            <button
              onClick={() => setFlip(true)} // Volteamos la carta al hacer click
              className="bg-white bg-opacity-90 text-black px-3 py-1 text-sm rounded-md font-semibold hover:bg-opacity-100 duration-200"
            >
              Ver detalles
            </button>
          </div>

          {/* Descripción resumida */}
          <div className="absolute bottom-16 left-3 right-3 text-gray-200 text-sm line-clamp-3">
            {descripcion}
          </div>
        </div>

        {/* -------- CARA TRASERA -------- */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-900 text-white rounded-xl p-5 overflow-y-auto">
          {/* Título grande */}
          <h2 className="text-xl font-bold mb-2">{titulo}</h2>

          {/* Descripción completa */}
          <p className="text-gray-300 text-sm mb-4">{descripcion}</p>

          {/* Valoración con estrellas */}
          <div className="mb-3">
            <p className="font-semibold">Puntuación:</p>
            <div className="text-yellow-400 text-lg">{renderStars(valoracion)}</div>
          </div>

          {/* Información adicional del juego */}
          <div className="text-sm space-y-1">
            <p><span className="font-semibold">Desarrollador:</span> {desarrollador}</p>
            <p><span className="font-semibold">Año:</span> {anioLanzamiento}</p>
            <p><span className="font-semibold">Plataforma:</span> {plataforma}</p>
            <p><span className="font-semibold">Género:</span> {genero}</p>
            <p><span className="font-semibold">Fecha de creación:</span> {fechaCreacion}</p>
          </div>

          {/* Botón para volver a la cara delantera */}
          <button
            onClick={() => setFlip(false)}
            className="mt-5 w-full bg-white text-black py-2 rounded-md hover:bg-gray-200 duration-200 font-semibold"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporto el componente para usarlo en otros archivos
export default CardBiblioteca;
