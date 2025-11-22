import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Componente modal para ver detalles de un juego específico
const VerJuego = ({ gameId, onClose }) => {
  // Estado del juego, loader y posibles errores
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Efecto que se ejecuta al abrir el modal para traer los datos del juego
  useEffect(() => {
    if (!gameId) return; // Evita errores si gameId es undefined

    const fetchGame = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/juegos/${gameId._id}`
        );
        setGame(res.data);   // Guarda los datos del juego en el estado
        setLoading(false);   // Termina el loader
      } catch (error) {
        console.error("Error al obtener juegos:", error);
        setError("No se pudo cargar la información del juego.");
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // Si no hay gameId, no renderiza nada
  if (!gameId) return null;

  return (
    <AnimatePresence>
      {/* Fondo del modal oscuro + animación */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Contenedor del modal con animación de escala */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="bg-[#1C1C2D] text-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden"
        >
          {/* ------------------ HEADER ------------------ */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <h2 className="text-2xl font-bold">
              {loading ? "Cargando..." : game?.titulo}
            </h2>

            {/* Botón para cerrar modal */}
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-2xl"
            >
              ✖
            </button>
          </div>

          {/* ------------------ LOADER ------------------ */}
          {loading && (
            <div className="p-10 text-center text-gray-300">
              Cargando información del juego...
            </div>
          )}

          {/* ------------------ ERROR ------------------ */}
          {error && (
            <div className="p-10 text-center text-red-400">{error}</div>
          )}

          {/* ------------------ CONTENIDO DEL JUEGO ------------------ */}
          {!loading && game && (
            <div className="flex flex-col lg:flex-row gap-6 p-6">
              {/* IMAGEN DEL JUEGO */}
              <div className="lg:w-1/2 w-full flex justify-center">
                <img
                  src={game.imagenPortada}
                  alt={game.titulo}
                  className="rounded-xl w-full h-[380px] object-cover shadow-lg border border-white/10"
                />
              </div>

              {/* INFORMACIÓN DETALLADA */}
              <div className="lg:w-1/2 w-full space-y-4">
                {/* Descripción */}
                <p className="text-gray-300 leading-relaxed">
                  {game.descripcion || "Sin descripción disponible."}
                </p>

                {/* Detalles extra */}
                <div className="space-y-1 text-gray-400">
                  <p>
                    <span className="font-semibold text-white">
                      Plataforma:
                    </span>{" "}
                    {game.plataforma}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Género:</span>{" "}
                    {game.genero}
                  </p>
                  <p>
                    <span className="font-semibold text-white">
                      Desarrollador:
                    </span>{" "}
                    {game.desarrollador}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Año:</span>{" "}
                    {game.anioLanzamiento}
                  </p>
                </div>

                {/* Botón acción (puede dirigir al juego o a otra página) */}
                <div className="pt-4">
                  <button className="w-full bg-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-lg">
                    Ir al juego
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerJuego;
