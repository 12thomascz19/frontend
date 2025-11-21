import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../../components/Footer/Footer";

const VerResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [menuActivo, setMenuActivo] = useState(null);
  const dropdownRef = useRef(null);
  const [vista, setVista] = useState("comentar"); // comentar | ver

  useEffect(() => {
    obtenerResenas();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) setUsuarioActual(usuario);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuActivo(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const obtenerResenas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resenas");
      setResenas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      toast.error("No se pudieron cargar las reseñas 😢");
    }
  };

  const eliminarResena = async (resenaId) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("¿Seguro que deseas eliminar esta reseña?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/resenas/${resenaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Reseña eliminada correctamente");
      obtenerResenas();
    } catch (error) {
      console.log("ERROR AL ELIMINAR:", error);

      const msg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Error desconocido";

      toast.error("Error al eliminar reseña: " + msg);
    }
  };

  const editarResena = (resena) => {
    toast("Función de edición próximamente ✏️", {
      style: {
        background: "#1A1A2E",
        color: "#fff",
        border: "1px solid #6C63FF",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-24 pb-16 px-6">
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#00E5FF] tracking-wide">
            Reseñas de mis juegos
          </h1>
        </div>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Link
          to="/resenas"
          onClick={() => setVista("comentar")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            vista === "comentar"
              ? "bg-[#6C63FF] text-white shadow-[0_0_12px_#6C63FF80]"
              : "bg-[#1E1E2E] text-gray-300 hover:bg-[#2C2C3A]"
          }`}
        >
          Comentar reseñas
        </Link>
        <Link
          to="/ver-resenas"
          onClick={() => setVista("comentar")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            vista === "ver"
              ? "bg-[#00E5FF] text-black shadow-[0_0_12px_#00E5FF80]"
              : "bg-[#1E1E2E] text-gray-300 hover:bg-[#2C2C3A]"
          }`}
        >
          Ver reseñas
        </Link>
      </div>

      {resenas.length === 0 ? (
        <p className="text-center text-[#B0B3C2] mt-20">
          No hay reseñas aún. ¡Sé el primero en dejar una opinión! 🎮
        </p>
      ) : (
        <div className="flex sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resenas.map((resena) => (
            <motion.div
              key={resena._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#121224] rounded-2xl border border-[#6C63FF40] shadow-[0_0_15px_#00E5FF40] overflow-hidden"
            >
              {/* Imagen del juego */}
              <img
                src={
                  resena.juego?.imagenPortada ||
                  "https://via.placeholder.com/400x400?text=Juego"
                }
                alt={resena.juego?.titulo || "Juego"}
                className="w-full h-40 object-cover"
              />

              {/* Contenido */}
              <div className="p-5 relative">
                {/* Header usuario */}
                <div
                  className="flex items-center justify-between"
                  ref={dropdownRef}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        resena.usuario?.fotoPerfil ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Usuario"
                      className="w-10 h-10 rounded-full border-2 border-[#6C63FF]"
                    />
                    <div>
                      <h3 className="font-semibold text-[#00E5FF]">
                        {resena.usuario?.nombre || "Usuario desconocido"}
                        {usuarioActual &&
                          usuarioActual.id === resena.usuario?._id && (
                            <span className="ml-2 text-xs bg-[#00FF88]/20 text-[#00FF88] px-2 py-1 rounded-full">
                              Mi reseña
                            </span>
                          )}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FaClock />{" "}
                        {new Date(resena.fechaCreacion).toLocaleString(
                          "es-CO",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Menú de opciones (solo si es del usuario actual) */}
                  {usuarioActual &&
                    usuarioActual.id === resena.usuario?._id && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setMenuActivo(
                              menuActivo === resena._id ? null : resena._id
                            )
                          }
                          className="p-2 rounded-full hover:bg-[#6C63FF]/30 transition-all"
                        >
                          <FaEllipsisV />
                        </button>

                        <AnimatePresence>
                          {menuActivo === resena._id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 top-10 w-40 bg-[#1E1E2E] border border-[#6C63FF60] rounded-xl shadow-xl overflow-hidden z-50"
                            >
                              <button
                                onClick={() => editarResena(resena)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#6C63FF]/30 text-left"
                              >
                                <FaEdit /> Editar
                              </button>
                              <button
                                onClick={() => eliminarResena(resena._id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:text-red-500"
                              >
                                <FaTrash /> Eliminar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                </div>

                {/* Título del juego reseñado */}
                <h2 className="text-lg font-bold text-[#00FF88] mt-4">
                  🎮 {resena.juego?.titulo || "Juego sin título"}
                </h2>

                {/* Contenido reseña */}
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  {resena.contenido || "Sin texto de reseña."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default VerResenas;
