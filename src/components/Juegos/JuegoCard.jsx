import React, { useState, useRef, useEffect } from "react";
// Importo framer-motion para animaciones suaves
import { motion, AnimatePresence } from "framer-motion";
// Importo íconos de react-icons
import {
  FaEllipsisV, FaPlusCircle, FaStar, FaCheckCircle, FaTimesCircle,
  FaUserAlt, FaCalendarAlt, FaGamepad, FaTags, FaUndoAlt, FaMinusCircle,
} from "react-icons/fa";
// Importo toast para notificaciones
import toast from "react-hot-toast";
// Importo axios para hacer peticiones HTTP
import axios from "axios";
// Importo estilos CSS personalizados
import "./AgregarJuegoModal.css";

// Componente principal de la tarjeta de un juego
function JuegoCard({ juego, enBibliotecaProp }){
  // Estado para controlar si el menú de opciones está abierto
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para controlar si la tarjeta está volteada (flip)
  const [flipped, setFlipped] = useState(false);
  // Estado que indica si el juego está en la biblioteca del usuario
  const [enBiblioteca, setEnBiblioteca] = useState(enBibliotecaProp || false);

  // Referencia al contenedor del menú desplegable
  const dropdownRef = useRef(null);

  // Obtenemos token y usuario desde el localStorage
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  /* ------------------ FUNCIÓN PARA VERIFICAR SI EL JUEGO ESTÁ EN LA BIBLIOTECA ------------------ */
  const verificarBiblioteca = async () => {
    try {
      if (!usuario || !token) return;

      // Petición GET para obtener los juegos de la biblioteca del usuario
      const res = await axios.get(
        `http://localhost:5000/api/biblioteca/${usuario._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Revisamos si el juego ya está en la biblioteca
      const existe = res.data.juegos.some((j) => j._id === juego._id);
      setEnBiblioteca(existe);
    } catch (err) {
      console.error("Error verificando biblioteca:", err);
    }
  };

  // Ejecuta la verificación al montar el componente o si cambia la prop
  useEffect(() => {
    if (enBibliotecaProp) {
      setEnBiblioteca(true); // Si ya sabemos que está en la biblioteca
      return;
    }
    verificarBiblioteca(); // Sino revisamos la API
  }, [enBibliotecaProp]);

  /* ------------------ FUNCIONES PARA AGREGAR Y QUITAR JUEGO ------------------ */
  const agregarABiblioteca = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/juegos/agregar-a-biblioteca/${juego._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Juego agregado a tu biblioteca ");
      setEnBiblioteca(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo agregar el juego ");
    } finally {
      setMenuOpen(false); // Siempre cerramos el menú
    }
  };

  const quitarDeBiblioteca = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/juegos/quitar-de-biblioteca/${juego._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Juego eliminado de tu biblioteca ");
      setEnBiblioteca(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo quitar el juego ");
    } finally {
      setMenuOpen(false); // Cerramos el menú
    }
  };

  /* ------------------ CERRAR MENÚ AL HACER CLICK FUERA ------------------ */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false); // Cierra menú si clic fuera
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------ FUNCIÓN PARA RENDERIZAR ESTRELLAS ------------------ */
  const renderStars = () => {
    const totalStars = 5;
    return [...Array(totalStars)].map((_, i) => (
      <FaStar
        key={i}
        className={`${i < (juego.puntuacion || 0) ? "text-yellow-400" : "text-gray-600"} text-lg drop-shadow-[0_0_4px_#00000060]`}
      />
    ));
  };

  return (
    <div className="relative w-full h-[380px] perspective">
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        
        {/* ------------------ PARTE FRONTAL ------------------ */}
        <div className="card-front border border-[#6C63FF40] shadow-[0_0_20px_#00E5FF40]">
          <img
            src={juego.imagenPortada || "https://via.placeholder.com/400x400?text=Sin+Portada"}
            alt={juego.titulo}
            className="w-full h-full object-cover"
          />

          {/* Degradado inferior */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#000000d0] to-transparent"></div>

          {/* Contenedor del menú y estado */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center" ref={dropdownRef}>
            {/* Estado de completado */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
              juego.completado ? "bg-[#00FF8830] text-[#00FF88]" : "bg-[#FF174430] text-[#FF4081]"
            }`}>
              {juego.completado ? (<><FaCheckCircle /> Completado</>) : (<><FaTimesCircle /> Pendiente</>)}
            </div>

            {/* Botón menú de 3 puntos */}
            <div
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="p-2 bg-[#0A0A12]/60 rounded-full hover:bg-[#6C63FF]/70 transition-all cursor-pointer"
            >
              <FaEllipsisV />
            </div>

            {/* Menú desplegable */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 w-48 bg-[#1E1E2E] border border-[#6C63FF60] rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {!enBiblioteca ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); agregarABiblioteca(); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-[#E0E0F0] hover:bg-[#6C63FF]/30 transition-all"
                    >
                      <FaPlusCircle className="text-[#00FF88]" /> Agregar a mi biblioteca
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); quitarDeBiblioteca(); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-[#E0E0F0] hover:bg-[#FF174430] transition-all"
                    >
                      <FaMinusCircle className="text-red-400" /> Quitar de mi biblioteca
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Texto inferior y botón ver detalles */}
          <div className="absolute bottom-4 left-0 w-full px-5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-[#00E5FF] drop-shadow-[0_0_8px_#000]">{juego.titulo}</h3>
              <p className="text-sm text-gray-300 max-w-[250px]">{juego.descripcion}</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
              className="bg-[#00E5FF]/90 text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#00FF88] transition-all shadow-md"
            >
              Ver detalles
            </button>
          </div>
        </div>

        {/* ------------------ PARTE TRASERA ------------------ */}
        <div className="card-back relative overflow-hidden border border-[#6C63FF60] rounded-xl shadow-[0_0_25px_#6C63FF80]">
          <img
            src={juego.imagenPortada || "https://via.placeholder.com/400x400?text=Sin+Portada"}
            alt="Fondo desenfocado"
            className="absolute inset-0 w-full h-full object-cover blur-md brightness-[0.4]"
          />

          <div className="relative z-10 h-full flex flex-col justify-between p-5 text-white">
            {/* Información del juego */}
            <div>
              <h3 className="text-2xl font-extrabold text-[#00E5FF] mb-4 drop-shadow-[0_0_10px_#00E5FF60]">{juego.titulo}</h3>
              <div className="flex gap-1 mb-3">{renderStars()}</div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaUserAlt className="text-[#00E5FF]" /> <span><strong>Desarrollador:</strong> {juego.desarrollador}</span>
                </div>
                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaCalendarAlt className="text-[#00E5FF]" /> <span><strong>Año de lanzamiento:</strong> {juego.añoLanzamiento}</span>
                </div>
                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaGamepad className="text-[#00E5FF]" /> <span><strong>Plataforma:</strong> {juego.plataforma}</span>
                </div>
                <div className="flex items-center gap-3 bg-[#1A1A2E]/80 p-2 rounded-md border border-[#6C63FF30]">
                  <FaTags className="text-[#00E5FF]" /> <span><strong>Género:</strong> {juego.genero}</span>
                </div>

                <div className="text-[#B0B3C2] text-xs mt-2 text-right">
                  <span><strong>Creado:</strong> {new Date(juego.fechaCreacion).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Botón volver */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] text-black font-bold px-6 py-2 rounded-lg shadow-[0_0_12px_#00E5FF80] hover:shadow-[0_0_20px_#6C63FF80] transition-all"
            >
              <FaUndoAlt /> Volver
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Exportamos el componente para usarlo en otras partes
export default JuegoCard;
