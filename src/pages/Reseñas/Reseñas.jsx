import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCommentDots, FaEye, FaStar } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Reseñas = () => {
  const [vista, setVista] = useState("comentar"); // comentar | ver
  const [misJuegos, setMisJuegos] = useState([]); //  Siempre inicializamos como array
  const [reseñas, setReseñas] = useState([]);
  const [formData, setFormData] = useState({
    juegoId: "",
    comentario: "",
    puntuacion: 0,
  });

  const token = localStorage.getItem("token");

  // 🔹 Cargar juegos del usuario
  useEffect(() => {
    const obtenerMisJuegos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/juegos/mi-biblioteca",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Si el backend devuelve un objeto o null, aseguramos que sea array
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.biblioteca)
          ? res.data.biblioteca
          : [];

        setMisJuegos(data);
      } catch (error) {
        console.error("Error al obtener mis juegos:", error);
        setMisJuegos([]); // Evitar que quede undefined
      }
    };
    obtenerMisJuegos();
  }, [token]);

  // 🔹 Cargar reseñas públicas
  useEffect(() => {
    const obtenerReseñas = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resenas");
        const data = Array.isArray(res.data) ? res.data : [];
        setReseñas(data);
      } catch (error) {
        console.error("Error al obtener reseñas:", error);
        setReseñas([]);
      }
    };
    obtenerReseñas();
  }, []);

  // 🔹 Enviar reseña
  const enviarReseña = async (e) => {
    e.preventDefault();
    if (
      !formData.juegoId ||
      !formData.comentario ||
      formData.puntuacion === 0
    ) {
      toast.error("Por favor completa todos los campos ✏️");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/resenas", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Reseña publicada exitosamente! 🚀");
      setFormData({ juegoId: "", comentario: "", puntuacion: 0 });
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      toast.error("No se pudo publicar la reseña 😢");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-28 px-6 pb-16">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#00E5FF] flex items-center gap-3">
          <FaCommentDots className="text-[#6C63FF]" />
          Reseñas de mis juegos
        </h1>

        {/* Mini Nav */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setVista("comentar")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              vista === "comentar"
                ? "bg-[#6C63FF] text-white shadow-[0_0_12px_#6C63FF80]"
                : "bg-[#1E1E2E] text-gray-300 hover:bg-[#2C2C3A]"
            }`}
          >
            Comentar reseñas
          </button>
          <Link
            to="/ver-resenas"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              vista === "ver"
                ? "bg-[#00E5FF] text-black shadow-[0_0_12px_#00E5FF80]"
                : "bg-[#1E1E2E] text-gray-300 hover:bg-[#2C2C3A]"
            }`}
          >
            Ver reseñas
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* 🔹 Vista: Comentar reseña */}
        {vista === "comentar" && (
          <motion.div
            key="comentar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-[#1A1A2E] border border-[#6C63FF50] rounded-2xl p-6 shadow-lg max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-bold text-[#00E5FF] mb-4">
              🕹️ Escribe tu reseña
            </h2>

            <form onSubmit={enviarReseña} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Selecciona un juego
                </label>
                <select
                  value={formData.juegoId}
                  onChange={(e) =>
                    setFormData({ ...formData, juegoId: e.target.value })
                  }
                  className="w-full bg-[#0F0F1A] border border-[#6C63FF60] text-white px-4 py-2 rounded-lg"
                >
                  <option value="">-- Selecciona --</option>
                  {Array.isArray(misJuegos) &&
                    misJuegos.map((juego) => (
                      <option key={juego._id} value={juego._id}>
                        {juego.titulo}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Tu reseña
                </label>
                <textarea
                  value={formData.comentario}
                  onChange={(e) =>
                    setFormData({ ...formData, comentario: e.target.value })
                  }
                  rows="4"
                  className="w-full bg-[#0F0F1A] border border-[#6C63FF60] text-white px-4 py-2 rounded-lg"
                  placeholder="Escribe lo que piensas del juego..."
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Puntuación
                </label>
                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FaStar
                      key={num}
                      onClick={() =>
                        setFormData({ ...formData, puntuacion: num })
                      }
                      className={`cursor-pointer transition-all ${
                        num <= formData.puntuacion
                          ? "text-yellow-400 scale-110"
                          : "text-gray-600 hover:text-yellow-400"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] py-3 rounded-lg font-bold text-black hover:shadow-[0_0_20px_#00E5FF80] transition-all"
              >
                Publicar reseña
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* 🔹 Vista: Ver reseñas */}
      </AnimatePresence>
      <Footer/>
    </div>
  );
};

export default Reseñas;
