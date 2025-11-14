import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFilter, FaPlusCircle, FaGamepad, FaSearch } from "react-icons/fa";
import axios from "axios";
import JuegoCard from "../../components/Juegos/JuegoCard";
import AgregarJuegoModal from "../../components/Juegos/AgregarJuegoModal";

const ExplorarJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [genero, setGenero] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Cargar juegos desde el backend
  const obtenerJuegos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/juegos");
      setJuegos(res.data);
    } catch (error) {
      console.error("Error al obtener juegos:", error);
    }
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  // Filtrado

  const juegosFiltrados = juegos.filter((juego) => {
    const coincideTitulo = juego.titulo
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideGenero =
      genero === "todos" ||
      juego.genero?.toLowerCase() === genero.toLowerCase();
    return coincideTitulo && coincideGenero;
  });

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white px-6 pt-28 pb-16">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <FaGamepad className="text-[#6C63FF] text-4xl drop-shadow-[0_0_10px_#6C63FF]" />
          <h1 className="text-3xl font-extrabold text-[#00E5FF] tracking-wide">
            Explorar Juegos
          </h1>
        </div>

        {/* Filtros y botón */}
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-[#6C63FF]" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-[#1A1A2E] border border-[#6C63FF60] rounded-lg pl-10 pr-4 py-2 text-sm"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-[#6C63FF]" />
            <select
              className="bg-[#1A1A2E] border border-[#6C63FF60] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#00E5FF] transition-all"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="todos">Todas las categorías</option>
              <option value="PC">PC</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Nintendo">Nintendo</option>
              <option value="Móvil">Móvil</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] px-5 py-2 rounded-lg font-semibold shadow-[0_0_15px_#6C63FF80] hover:shadow-[0_0_25px_#00E5FF80] transition-all"
          >
            <FaPlusCircle />
            Agregar juego
          </motion.button>
        </div>
      </div>

      {/* Listado de juegos */}
      {juegosFiltrados.length === 0 ? (
        <p className="text-center text-[#B0B3C2] mt-10">
          No hay juegos disponibles aún. ¡Agrega el primero! 🎮
        </p>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {juegosFiltrados.map((juego) => (
            <JuegoCard key={juego._id} juego={juego} />
          ))}
        </motion.div>
      )}

      {/* Modal de agregar */}
      {showModal && (
        <AgregarJuegoModal
          onClose={() => setShowModal(false)}
          onAdd={obtenerJuegos}
        />
      )}
    </div>
  );
};

export default ExplorarJuegos;
