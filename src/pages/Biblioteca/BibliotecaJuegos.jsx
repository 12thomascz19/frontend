import React, { useState, useEffect } from "react";
// React y hooks para manejar estado y efectos

import { motion } from "framer-motion";
// Animaciones suaves para la interfaz

import axios from "axios";
// Para hacer peticiones HTTP al backend

import { FaSearch, FaFilter, FaGamepad, FaPlus } from "react-icons/fa";
// Íconos usados en la interfaz

import { useNavigate } from "react-router-dom";
// Para navegar programáticamente entre páginas

import toast from "react-hot-toast";
// Notificaciones emergentes de éxito, error o info

import CardBiblioteca from "../../components/Biblioteca/CardBiblioteca";
// Componente de tarjeta de la biblioteca (si lo usas)

import JuegoCard from "../../components/Juegos/JuegoCard";
// Componente de tarjeta de juego

import Footer from "../../components/Footer/Footer";
// Footer de la página

// Componente principal de la Biblioteca de Juegos
const BibliotecaJuegos = () => {
  // Estados principales
  const [juegos, setJuegos] = useState([]); // Lista de juegos del usuario
  const [busqueda, setBusqueda] = useState(""); // Texto de búsqueda
  const [genero, setGenero] = useState("todos"); // Filtro de género
  const [loading, setLoading] = useState(false); // Estado de carga

  const navigate = useNavigate(); // Hook para navegación programática
  const token = localStorage.getItem("token"); // Token de sesión

  // ----------------------------------
  // 🔥 OBTENER BIBLIOTECA DEL USUARIO
  // ----------------------------------
  const obtenerBiblioteca = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/juegos/mi-biblioteca",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      // Manejo flexible según el formato que envíe el backend
      if (Array.isArray(data)) {
        setJuegos(data);
      } else if (Array.isArray(data?.biblioteca)) {
        setJuegos(data.biblioteca);
      } else if (Array.isArray(data?.juegos)) {
        setJuegos(data.juegos);
      } else {
        setJuegos([]);
        toast.error("Formato inesperado al cargar tu biblioteca");
      }
    } catch (error) {
      console.error("Error:", error);
      setJuegos([]);

      if (error.response?.status === 401) {
        // Sesión expirada
        toast.error("Sesión expirada. Inicia sesión de nuevo.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else if (error.response?.status === 404) {
        toast.info("Tu biblioteca está vacía");
      } else {
        toast.error("Error al cargar tu biblioteca");
      }
    }
  };

  // Cargar biblioteca al montar el componente
  useEffect(() => {
    obtenerBiblioteca();
  }, []);

  // ----------------------------------
  // 🔥 TOGGLE COMPLETADO
  // Cambia estado de completado de un juego
  // ----------------------------------
  const toggleCompletado = async (juegoId, completadoActual) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/juegos/${juegoId}`,
        { completado: !completadoActual },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualiza el juego en la lista local
      setJuegos((prev) =>
        prev.map((juego) =>
          juego._id === juegoId
            ? { ...juego, completado: response.data.completado }
            : juego
        )
      );

      toast.success(
        response.data.completado
          ? "Juego marcado como completado"
          : "Juego marcado como pendiente"
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // 🔥 ELIMINAR JUEGO
  // ----------------------------------
  const eliminarJuego = async (juegoId) => {
    if (!window.confirm("¿Eliminar juego de tu biblioteca?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/juegos/${juegoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Quita el juego eliminado del estado
      setJuegos((prev) => prev.filter((j) => j._id !== juegoId));

      toast.success("Juego eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo eliminar");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // 🔥 CALIFICAR JUEGO
  // ----------------------------------
  const calificarJuego = async (juegoId, nuevaCalificacion) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/juegos/${juegoId}`,
        { calificacion: nuevaCalificacion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualiza la calificación en la lista local
      setJuegos((prev) =>
        prev.map((j) =>
          j._id === juegoId
            ? { ...j, calificacion: response.data.calificacion }
            : j
        )
      );

      toast.success("Calificación actualizada");
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo calificar");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // 🔥 ESTADÍSTICAS
  // ----------------------------------
  const estadisticas = {
    total: juegos.length,
    completados: juegos.filter((j) => j.completado).length,
    porcentajeCompletados:
      juegos.length > 0
        ? Math.round(
            (juegos.filter((j) => j.completado).length / juegos.length) * 100
          )
        : 0,
  };

  // ----------------------------------
  // 🔥 FILTRADO
  // ----------------------------------
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
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        {/* Título */}
        <div className="flex items-center gap-3">
          <FaGamepad className="text-[#6C63FF] text-4xl drop-shadow-[0_0_10px_#6C63FF]" />
          <h1 className="text-3xl font-extrabold text-[#00E5FF] tracking-wide">
            Mi Biblioteca
          </h1>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="flex gap-4 mt-6 md:mt-0">
          <div className="bg-[#1A1A2E] border border-[#6C63FF40] rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-[#00E5FF]">
              {estadisticas.total}
            </p>
            <p className="text-xs text-[#B0B3C2]">Total Juegos</p>
          </div>
          <div className="bg-[#1A1A2E] border border-[#6C63FF40] rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-[#00FF88]">
              {estadisticas.completados}
            </p>
            <p className="text-xs text-[#B0B3C2]">Completados</p>
          </div>
          <div className="bg-[#1A1A2E] border border-[#6C63FF40] rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-[#FFD700]">
              {estadisticas.porcentajeCompletados}%
            </p>
            <p className="text-xs text-[#B0B3C2]">Progreso</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6 md:mt-0">
          {/* Buscar por título */}
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

          {/* Filtrar por género */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-[#6C63FF]" />
            <select
              className="bg-[#1A1A2E] border border-[#6C63FF60] rounded-lg pl-10 pr-4 py-2 text-sm"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="todos">Todos los géneros</option>
              <option value="Acción">Acción</option>
              <option value="Aventura">Aventura</option>
              <option value="RPG">RPG</option>
              <option value="Estrategia">Estrategia</option>
              <option value="Deportes">Deportes</option>
              <option value="Simulación">Simulación</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Terror">Terror</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#B0B3C2]">
          Mostrando {juegosFiltrados.length} de {estadisticas.total} juegos
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setBusqueda("");
              setGenero("todos");
            }}
            className="bg-[#1A1A2E] border border-[#6C63FF40] px-4 py-2 rounded-lg text-sm"
          >
            Limpiar Filtros
          </button>
        </div>

        <button
          onClick={obtenerBiblioteca}
          className="bg-[#1A1A2E] border border-[#6C63FF40] px-4 py-2 rounded-lg text-sm"
        >
          Recargar
        </button>
      </div>

      {/* GRID DE JUEGOS */}
      {juegosFiltrados.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-[#B0B3C2] mb-4">
            No tienes juegos en tu biblioteca. 🎮
          </p>

          <button
            onClick={() => navigate("/explorar-juegos")}
            className="bg-[#6C63FF] px-6 py-3 rounded-lg font-semibold"
          >
            Explorar Juegos
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Renderizado de cada juego */}
          {juegosFiltrados.map((juego) => (
            <JuegoCard
              key={juego._id}
              juego={juego}
              enBibliotecaProp={true}
              toggleCompletado={toggleCompletado}
              eliminarJuego={eliminarJuego}
              calificarJuego={calificarJuego}
            />
          ))}
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 pt-12 pb-10 text-sm border-t w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default BibliotecaJuegos;
