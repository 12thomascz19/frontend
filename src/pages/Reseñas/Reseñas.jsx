import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCommentDots,
  FaStar,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Reseñas = () => {
  const [vista, setVista] = useState("comentar");
  const [misJuegos, setMisJuegos] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  //  Desde editar
  const resenaEditar = location.state || null;
  const esEdicion = !!resenaEditar;

  const token = localStorage.getItem("token");

  // 🟣 Formulario unificado
  const [formData, setFormData] = useState({
    juegoId: resenaEditar?.juego?._id || "",
    textoReseña: resenaEditar?.comentario || "",
    puntuacion: resenaEditar?.puntuacion || 0,
    horasJugadas: resenaEditar?.horasJugadas || "",
    dificultad: resenaEditar?.dificultad || "",
    recomendaria: resenaEditar?.recomendaria ?? null,
  });

  //  Notificación cuando entra en modo edición
  useEffect(() => {
    if (esEdicion) {
      toast(" Editando reseña...");
    }
  }, [esEdicion]);

  // 🟣 Cargar mis juegos
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

  // 🟣 Guardar / Editar reseña
  const handleSubmit = async (e) => {
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
      let response;

      if (esEdicion) {
        response = await axios.put(
          `http://localhost:5000/api/resenas/${resenaEditar._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("✔ Reseña actualizada correctamente");
      } else {
        response = await axios.post(
          "http://localhost:5000/api/resenas",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("✔ Reseña publicada correctamente");
      }

      // 🟣 Enviar la reseña actualizada a la vista de VerReseñas
      navigate("/ver-resenas", {
        state: { reseñaActualizada: response.data },
      });
    } catch (error) {
      toast.error("Error al guardar los datos");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-28 px-4 md:px-6 pb-16">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#00E5FF] flex items-center gap-3 drop-shadow-[0_0_10px_#00E5FF80]">
          <FaCommentDots className="text-[#6C63FF]" />
          {esEdicion ? "Editar Reseña" : "Reseñas de Juegos"}
        </h1>

        <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={() => setVista("comentar")}
            className={`px-4 md:px-5 py-2 rounded-xl font-semibold transition-all ${
              vista === "comentar"
                ? "bg-[#6C63FF] shadow-[0_0_15px_#6C63FF90]"
                : "bg-[#1A1A2E] hover:bg-[#26263A]"
            }`}
          >
            Comentar
          </button>

          <Link
            to="/ver-resenas"
            className="px-4 md:px-5 py-2 rounded-xl font-semibold bg-[#1A1A2E] hover:bg-[#26263A] transition-all"
          >
            Ver reseñas
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {vista === "comentar" && (
          <motion.div
            key="comentar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0D0D17] border border-[#6C63FF50] rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-[0_0_30px_#6C63FF20] w-full"
          >
            <h2 className="text-xl md:text-2xl font-bold text-[#00E5FF] mb-6">
              {esEdicion ? "✏️ Editar reseña" : "✍️ Crear una reseña"}
            </h2>

            <form
              onSubmit={handleSubmit}
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
                  disabled={esEdicion}
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

              {/* Texto */}
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
                      setFormData({
                        ...formData,
                        horasJugadas: e.target.value,
                      })
                    }
                    className="w-full bg-transparent py-2 outline-none"
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
                        ? "bg-[#00E5FF] text-black"
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
                        ? "bg-[#FF4B4B] text-black"
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

              {/* Botón */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="col-span-2 bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] text-black font-bold py-3 rounded-xl shadow-[0_0_20px_#00E5FF60]"
              >
                {esEdicion ? "Guardar Cambios" : "Publicar Reseña"}
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
