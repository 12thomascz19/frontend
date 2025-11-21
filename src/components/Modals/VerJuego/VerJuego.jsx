import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const VerJuego = ({ gameId, onClose }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Cuando abra el modal → hacer fetch del juego
  useEffect(() => {
    if (!gameId) return; // evita undefined

    const fetchGame = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/juegos/${gameId._id}`
        );
        setGame(res.data);
      } catch (error) {
        console.error("Error al obtener juegos:", error);
      }
    };

    fetchGame();
  }, [gameId]);

  if (!gameId) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="bg-[#1C1C2D] text-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <h2 className="text-2xl font-bold">
              {loading ? "Cargando..." : game?.titulo}
            </h2>

            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-2xl"
            >
              ✖
            </button>
          </div>

          {/* LOADER */}
          {loading && (
            <div className="p-10 text-center text-gray-300">
              Cargando información del juego...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="p-10 text-center text-red-400">{error}</div>
          )}

          {/* CONTENIDO */}
          {!loading && game && (
            <div className="flex flex-col lg:flex-row gap-6 p-6">
              {/* IMAGEN (izquierda) */}
              <div className="lg:w-1/2 w-full flex justify-center">
                <img
                  src={game.imagenPortada}
                  alt={game.titulo}
                  className="rounded-xl w-full h-[380px] object-cover shadow-lg border border-white/10"
                />
              </div>

              {/* INFO (derecha) */}
              <div className="lg:w-1/2 w-full space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {game.descripcion || "Sin descripción disponible."}
                </p>

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
