// src/pages/Resenas/VerResenas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaStar,
  FaClock,
  FaGamepad,
  FaThumbsUp,
  FaThumbsDown,
  FaEllipsisV,
} from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import VerJuego from "../../components/Modals/VerJuego/VerJuego";

const coverPlaceholder = "/mnt/data/461eccd0-222d-4ac0-9950-adf5fbc639bb.png";

const VerResenas = () => {
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opcionesAbiertas, setOpcionesAbiertas] = useState(null); // ID de reseña que tiene menú abierto

  const [q, setQ] = useState(""); // búsqueda por texto o título
  const [filtroDificultad, setFiltroDificultad] = useState("todos");
  const [filtroRecomendadas, setFiltroRecomendadas] = useState("todas"); // todas | si | no
  const [selectedGame, setSelectedGame] = useState(null);
  const [openGameId, setOpenGameId] = useState(null);

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/resenas");
        // se espera un array de reseñas con la estructura del esquema
        setReseñas(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error cargando reseñas:", err);
        setReseñas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResenas();
  }, []);

  // filtrado y búsqueda
  const filtradas = reseñas
    .filter((r) => {
      if (!r) return false;
      // filtro por dificultad
      if (
        filtroDificultad !== "todos" &&
        (r.dificultad || "").toLowerCase() !== filtroDificultad.toLowerCase()
      ) {
        return false;
      }
      // filtro por recomendacion
      if (filtroRecomendadas === "si" && r.recomendaria !== true) return false;
      if (filtroRecomendadas === "no" && r.recomendaria !== false) return false;
      // búsqueda por texto de reseña o título del juego (si viene como objeto o cadena)
      const texto = (
        (r.textoReseña || "") +
        " " +
        (r.juegoTitulo || r.juego?.titulo || "")
      ).toLowerCase();
      if (q && !texto.includes(q.toLowerCase())) return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.fechaCreacion || b.createdAt || 0) -
        new Date(a.fechaCreacion || a.createdAt || 0)
    );

  const onOpciones = (reseña) => {
    setOpcionesAbiertas((prev) => (prev === reseña._id ? null : reseña._id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-12">
      {/* Encabezado y filtros */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00E5FF] tracking-wide drop-shadow-[0_0_12px_#00E5FF]">
              Reseñas públicas
            </h1>
            <p className="text-[#B0B3C2] mt-2">
              Lee lo que otros usuarios opinan o explora reseñas por juego,
              puntuación o dificultad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por juego o contenido..."
              className="bg-[#1A1A2E] border border-[#6C63FF40] rounded-lg px-4 py-2 text-sm w-full sm:w-64"
            />

            <select
              value={filtroDificultad}
              onChange={(e) => setFiltroDificultad(e.target.value)}
              className="bg-[#1A1A2E] border border-[#6C63FF40] rounded-lg px-3 py-2 text-sm"
            >
              <option value="todos">Todas las dificultades</option>
              <option value="Fácil">Fácil</option>
              <option value="Normal">Normal</option>
              <option value="Difícil">Difícil</option>
            </select>

            <select
              value={filtroRecomendadas}
              onChange={(e) => setFiltroRecomendadas(e.target.value)}
              className="bg-[#1A1A2E] border border-[#6C63FF40] rounded-lg px-3 py-2 text-sm"
            >
              <option value="todas">Todas</option>
              <option value="si">Recomendadas</option>
              <option value="no">No recomendadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="flex gap-10 max-w-7xl mx-auto">
        {filtradas.map((r) => {
          const user = JSON.parse(localStorage.getItem("user"));

          // Obtener ID y nombre del autor de la reseña
          const autorId =
            r.autor?._id || r.usuario?._id || r.usuarioId || r.userId || null;

          const autorNombre =
            r.autor?.nombre ||
            r.usuario?.nombre ||
            r.usuarioNombre ||
            r.userName ||
            "Anónimo";

          const soyYo = user?.id === autorId;

          return (
            <motion.article
              key={r._id || Math.random()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                translateY: -6,
                boxShadow: "0 8px 30px rgba(108,99,255,0.12)",
              }}
              transition={{ duration: 0.25 }}
              className="relative bg-[#0D0D14] rounded-2xl border border-[#2A2A3E] overflow-hidden"
            >
              {/* botón 3 puntos — solo si soy yo */}
              {soyYo && (
                <div className="absolute top-3 right-3 text-gray-300 hover:text-white cursor-pointer z-10">
                  <FaEllipsisV onClick={() => onOpciones(r)} />
                </div>
              )}
              {soyYo && opcionesAbiertas === r._id && (
                <div className="absolute top-10 right-3 bg-[#14141F] border border-[#2A2A3E] rounded-lg shadow-lg w-32 z-20">
                  <button
                    onClick={() => alert("Editar reseña")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#1F1F2E]"
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => alert("Eliminar reseña")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#1F1F2E] text-red-400"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              )}

              {/* imagen */}
              <div className="h-36 w-full bg-gradient-to-r from-[#17172A] to-[#0B1020] flex items-center justify-center">
                <img
                  src={
                    r.imagenPortada ||
                    r.juego?.imagenPortada ||
                    r.coverUrl ||
                    coverPlaceholder
                  }
                  alt={r.juego?.titulo || r.juegoTitulo || "Juego"}
                  className="h-28 object-cover rounded-lg shadow-[0_0_15px_#00E5FF40] border border-[#00E5FF20]"
                />
              </div>

              {/* contenido */}
              <div className="p-4 flex flex-col gap-3">
                {/* título + autor + fecha */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#00E5FF]">
                      {r.juego?.titulo || r.juegoTitulo || "Título desconocido"}
                    </h3>

                    <p className="text-xs text-[#B0B3C2]">
                      {/* Nombre autor */}
                      <strong className="text-white">
                        {autorNombre}{" "}
                        
                       
                      </strong>{" "}
                      •{" "}
                      {new Date(
                        r.fechaCreacion || r.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* puntuación */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const filled = i < (r.puntuacion || 0);
                      return (
                        <FaStar
                          key={i}
                          className={`text-sm ${
                            filled ? "text-yellow-400" : "text-gray-600"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* comentario */}
                <p className="text-sm text-[#E0E0F0] leading-relaxed line-clamp-5">
                  {r.textoReseña}
                </p>

                {/* tags */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="flex items-center gap-2 bg-[#11121A] text-[#B0B3C2] px-3 py-1 rounded-full text-xs border border-[#6C63FF20]">
                    <FaClock className="text-[#6C63FF]" />
                    {r.horasJugadas ?? "—"} h
                  </span>

                  <span className="flex items-center gap-2 bg-[#11121A] text-[#B0B3C2] px-3 py-1 rounded-full text-xs border border-[#6C63FF20]">
                    <FaGamepad className="text-[#00E5FF]" />
                    {r.dificultad || "Desconocida"}
                  </span>

                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      r.recomendaria
                        ? "bg-[#00E5FF] text-black"
                        : "bg-[#1A1A2E] text-[#B0B3C2] border border-[#FF1744]/20"
                    }`}
                  >
                    {r.recomendaria ? <FaThumbsUp /> : <FaThumbsDown />}
                    {r.recomendaria ? "La recomiendo" : "No la recomiendo"}
                  </span>
                </div>

                {/* acciones */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#99A0B5]">
                    {r.fechaActualizacion
                      ? `Actualizado ${new Date(
                          r.fechaActualizacion
                        ).toLocaleDateString()}`
                      : ""}
                  </span>

                  <button
                    onClick={() => {
                      const juegoId = r.juego?._id || r.juegoId;
                      if (juegoId) window.location.href = `/juego/${juegoId}`;
                    }}
                    className="text-sm text-[#00E5FF] font-semibold hover:underline"
                  >
                    Ver juego
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Modal estilo Amazon */}
      <VerJuego gameId={openGameId} onClose={() => setOpenGameId(null)} />

      <Footer />
    </div>
  );
};

export default VerResenas;
