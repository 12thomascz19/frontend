import React, { useState } from "react";
// Importo framer-motion para animaciones suaves
import { motion } from "framer-motion";
// Importo toast para mostrar notificaciones bonitas
import toast from "react-hot-toast";
// Importo axios para hacer peticiones HTTP
import axios from "axios";
// Importo íconos para botones
import { FaTimes, FaSave } from "react-icons/fa";

// Componente para el modal de agregar un nuevo juego
function AgregarJuegoModal({ onClose, onAdd }){
  // Estado local para guardar la información del juego
  const [juego, setJuego] = useState({
    titulo: "",
    genero: "",
    plataforma: "",
    añoLanzamiento: "",
    desarrollador: "",
    imagenPortada: "",
    descripcion: "",
    completado: false,
  });

  // Función que actualiza el estado cuando el usuario escribe en un input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJuego({
      ...juego,
      [name]: type === "checkbox" ? checked : value, // Si es checkbox usamos checked
    });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evito que la página se recargue
    try {
      // Hago una petición POST al backend para agregar el juego
      await axios.post("http://localhost:5000/api/juegos", juego);

      // Mostrar notificación de éxito
      toast.success("Juego agregado exitosamente 🎮", {
        style: {
          background: "#00FF88",
          color: "#000",
          boxShadow: "0 0 25px #00FF88",
          fontWeight: "700",
        },
      });

      // Llamo a la función onAdd para actualizar la lista de juegos
      onAdd();
      // Cierro el modal
      onClose();
    } catch (error) {
      console.error("Error al agregar el juego:", error);
      toast.error("No se pudo agregar el juego"); // Mostrar error si falla
    }
  };

  return (
    // Fondo negro semi-transparente para el modal
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      {/* Contenedor del modal con animación de escalado */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-[#0A0A12] text-white p-6 rounded-2xl border border-[#00FF88] shadow-[0_0_25px_#00FF88] w-[90%] max-w-lg"
      >
        {/* Header del modal con título y botón de cerrar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#00FF88] drop-shadow-[0_0_12px_#00FF88]">
            Agregar nuevo videojuego
          </h2>
          <button
            onClick={onClose} // Cierra el modal al hacer click
            className="text-[#FF4C7D] hover:text-[#FF1744]"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Formulario para agregar juego */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <input
            type="text"
            name="titulo"
            value={juego.titulo}
            onChange={handleChange}
            placeholder="Título"
            required
            className="w-full bg-[#161625] border border-[#00FF8840] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00FF88] outline-none"
          />

          {/* Género y Plataforma */}
          <div className="grid grid-cols-2 gap-3">
            {/* Género */}
            <div>
              <label className="block text-sm mb-2 text-[#B0B3C2]">
                Género
              </label>
              <select
                name="genero"
                value={juego.genero}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#1A1A2E] border border-[#6C63FF50]
               focus:outline-none focus:border-[#00E5FF] text-[#E0E0F0]
               transition-all cursor-pointer hover:bg-[#1E1E3A]"
                required
              >
                <option value="">Selecciona un género</option>
                <option value="Acción">Acción</option>
                <option value="Aventura">Aventura</option>
                <option value="RPG">RPG</option>
                <option value="Estrategia">Estrategia</option>
                <option value="Simulación">Simulación</option>
                <option value="Deportes">Deportes</option>
                <option value="Carreras">Carreras</option>
                <option value="Shooter">Shooter</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Terror">Terror</option>
                <option value="Plataformas">Plataformas</option>
              </select>
            </div>

            {/* Plataforma */}
            <div>
              <label className="block text-sm mb-2 text-[#B0B3C2]">
                Plataforma
              </label>
              <select
                name="plataforma"
                value={juego.plataforma}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#1A1A2E] border border-[#6C63FF50] 
               focus:outline-none focus:border-[#00E5FF] text-[#E0E0F0] 
               transition-all cursor-pointer hover:bg-[#1E1E3A]"
                required
              >
                <option value="">Selecciona una plataforma</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Móvil">Móvil</option>
              </select>
            </div>
          </div>

          {/* Año de lanzamiento y desarrollador */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="añoLanzamiento"
              value={juego.añoLanzamiento}
              onChange={handleChange}
              placeholder="Año de lanzamiento"
              required
              className="bg-[#161625] border border-[#00FF8840] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00FF88]"
            />
            <input
              type="text"
              name="desarrollador"
              value={juego.desarrollador}
              onChange={handleChange}
              placeholder="Desarrollador"
              required
              className="bg-[#161625] border border-[#00FF8840] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00FF88]"
            />
          </div>

          {/* Imagen de portada */}
          <input
            type="text"
            name="imagenPortada"
            value={juego.imagenPortada}
            onChange={handleChange}
            placeholder="URL de la portada"
            required
            className="w-full bg-[#161625] border border-[#00FF8840] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00FF88]"
          />

          {/* Descripción */}
          <textarea
            name="descripcion"
            value={juego.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            rows="3"
            required
            className="w-full bg-[#161625] border border-[#00FF8840] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00FF88] resize-none"
          ></textarea>

          {/* Checkbox completado */}
          <label className="flex items-center gap-2 text-sm text-[#C9C9D9]">
            <input
              type="checkbox"
              name="completado"
              checked={juego.completado}
              onChange={handleChange}
              className="accent-[#00FF88]"
            />
            ¿Juego completado?
          </label>

          {/* Botón guardar con animación hover */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full bg-[#00FF88] text-black font-bold py-2 rounded-lg shadow-[0_0_20px_#00FF88] hover:shadow-[0_0_35px_#00FF88] transition"
          >
            <FaSave className="inline mr-2" />
            Guardar Juego
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Exporto el componente para usarlo en otros archivos
export default AgregarJuegoModal;
