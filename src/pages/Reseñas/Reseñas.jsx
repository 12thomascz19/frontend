import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCommentDots,
  FaStar,
  FaClock,
  FaGamepad,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Reseñas = () => {
  const [vista, setVista] = useState("comentar");
  const [misJuegos, setMisJuegos] = useState([]);
  const [reseñas, setReseñas] = useState([]);

  const [formData, setFormData] = useState({
    juegoId: "",
    textoReseña: "",
    puntuacion: 0,
    horasJugadas: "",
    dificultad: "",
    recomendaria: null,
  });

  const token = localStorage.getItem("token");

  // 🟣 Cargar juegos del usuario
  useEffect(() => {
    const obtenerMisJuegos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/juegos/mi-biblioteca",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.biblioteca)
          ? res.data.biblioteca
          : [];

        setMisJuegos(data);
      } catch {
        setMisJuegos([]);
      }
    };
    obtenerMisJuegos();
  }, [token]);

  // 🟣 Cargar reseñas
  useEffect(() => {
    const obtenerReseñas = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resenas");
        setReseñas(Array.isArray(res.data) ? res.data : []);
      } catch {
        setReseñas([]);
      }
    };
    obtenerReseñas();
  }, []);

  // 🟣 Enviar reseña
  const enviarReseña = async (e) => {
    e.preventDefault();

    if (
      !formData.juegoId ||
      !formData.textoReseña ||
      !formData.horasJugadas ||
      !formData.dificultad ||
      formData.recomendaria === null ||
      formData.puntuacion === 0
    ) {
      toast.error("Completa todos los campos ❗");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/resenas", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Reseña publicada! 🚀");

      setFormData({
        juegoId: "",
        textoReseña: "",
        puntuacion: 0,
        horasJugadas: "",
        dificultad: "",
        recomendaria: null,
      });
    } catch {
      toast.error("No se pudo publicar 😢");
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-28 px-6 pb-16">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#00E5FF] flex items-center gap-3 drop-shadow-[0_0_10px_#00E5FF80]">
          <FaCommentDots className="text-[#6C63FF]" />
          Reseñas de Juegos
        </h1>

        {/* Mini Nav */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setVista("comentar")}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              vista === "comentar"
                ? "bg-[#6C63FF] shadow-[0_0_15px_#6C63FF90]"
                : "bg-[#1A1A2E] hover:bg-[#26263A]"
            }`}
          >
            Comentar
          </button>

          <Link
            to="/ver-resenas"
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              vista === "ver"
                ? "bg-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF90]"
                : "bg-[#1A1A2E] hover:bg-[#26263A]"
            }`}
          >
            Ver reseñas
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* 🟣 VISTA: Comentar reseña */}
        {vista === "comentar" && (
          <motion.div
            key="comentar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0D0D17] border border-[#6C63FF50] rounded-3xl p-8 max-w-4xl mx-auto shadow-[0_0_30px_#6C63FF20]"
          >
            <h2 className="text-2xl font-bold text-[#00E5FF] mb-6">
              ✍️ Crear una reseña
            </h2>

            <form
              onSubmit={enviarReseña}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Juego */}
              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">Juego</label>
                <select
                  value={formData.juegoId}
                  onChange={(e) =>
                    setFormData({ ...formData, juegoId: e.target.value })
                  }
                  className="w-full bg-[#0B0B14] rounded-lg border border-[#6C63FF60] px-4 py-2"
                >
                  <option value="">-- Selecciona un juego --</option>
                  {misJuegos.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Texto reseña */}
              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">Tu reseña</label>
                <textarea
                  value={formData.textoReseña}
                  onChange={(e) =>
                    setFormData({ ...formData, textoReseña: e.target.value })
                  }
                  rows="4"
                  className="w-full bg-[#0B0B14] rounded-lg border border-[#6C63FF60] px-4 py-2"
                  placeholder="Escribe tu opinión del juego..."
                />
              </div>

              {/* Horas jugadas */}
              <div>
                <label className="block mb-1 text-gray-300">
                  Horas jugadas
                </label>
                <div className="flex items-center bg-[#0B0B14] border border-[#6C63FF60] rounded-lg px-3">
                  <FaClock className="text-[#6C63FF] mr-2" />
                  <input
                    type="number"
                    value={formData.horasJugadas}
                    onChange={(e) =>
                      setFormData({ ...formData, horasJugadas: e.target.value })
                    }
                    className="w-full bg-transparent py-2 outline-none"
                    placeholder="Ej: 12"
                  />
                </div>
              </div>

              {/* Dificultad */}
              <div>
                <label className="block mb-1 text-gray-300">Dificultad</label>
                <select
                  value={formData.dificultad}
                  onChange={(e) =>
                    setFormData({ ...formData, dificultad: e.target.value })
                  }
                  className="w-full bg-[#0B0B14] rounded-lg border border-[#6C63FF60] px-4 py-2"
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Normal">Normal</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              {/* Recomendaría */}
              <div>
                <label className="block mb-1 text-gray-300">
                  ¿Lo recomendarías?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, recomendaria: true })
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      formData.recomendaria === true
                        ? "bg-[#00E5FF] text-black shadow-[0_0_12px_#00E5FF70]"
                        : "bg-[#1A1A2E] hover:bg-[#26263A]"
                    }`}
                  >
                    <FaThumbsUp /> Sí
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, recomendaria: false })
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      formData.recomendaria === false
                        ? "bg-[#FF4B4B] text-black shadow-[0_0_12px_#FF4B4B70]"
                        : "bg-[#1A1A2E] hover:bg-[#26263A]"
                    }`}
                  >
                    <FaThumbsDown /> No
                  </button>
                </div>
              </div>

              {/* Puntuación */}
              <div>
                <label className="block mb-1 text-gray-300">Puntuación</label>
                <div className="flex text-3xl gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FaStar
                      key={n}
                      onClick={() =>
                        setFormData({ ...formData, puntuacion: n })
                      }
                      className={`cursor-pointer transition-all ${
                        n <= formData.puntuacion
                          ? "text-yellow-400 scale-125"
                          : "text-gray-600 hover:text-yellow-400"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* BOTÓN PUBLICAR */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="col-span-2 bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] text-black font-bold py-3 rounded-xl shadow-[0_0_20px_#00E5FF60]"
              >
                Publicar reseña
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Reseñas;
