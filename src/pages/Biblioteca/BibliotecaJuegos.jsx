import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import JuegoCard from "../../components/Juegos/JuegoCard";
import Footer from "../../components/Footer/Footer";

const BibliotecaJuegos = () => {
  // Estados principales
  const [juegos, setJuegos] = useState([]); // Lista de juegos del usuario
  const [busqueda, setBusqueda] = useState(""); // Texto de búsqueda
  const [genero, setGenero] = useState("todos"); // Filtro por género
  const [loading, setLoading] = useState(false); // Estado de carga de acciones
  const navigate = useNavigate(); // Para navegación programática
  const token = localStorage.getItem("token"); // Token de autenticación

  // ----------------------------------
  // Función: Obtener biblioteca del usuario
  // ----------------------------------
  const obtenerBiblioteca = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/juegos/mi-biblioteca",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      // Validación flexible según estructura del backend
      if (Array.isArray(data)) setJuegos(data);
      else if (Array.isArray(data?.biblioteca)) setJuegos(data.biblioteca);
      else if (Array.isArray(data?.juegos)) setJuegos(data.juegos);
      else {
        setJuegos([]);
        toast.error("Formato inesperado al cargar tu biblioteca");
      }
    } catch (error) {
      console.error(error);
      setJuegos([]);
      if (error.response?.status === 401) {
        toast.error("Sesión expirada. Inicia sesión de nuevo.");
        localStorage.removeItem("token");
        navigate("/login");
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
  // Función: Cambiar estado de completado de un juego
  // ----------------------------------
  const toggleCompletado = async (juegoId, completadoActual) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/juegos/${juegoId}`,
        { completado: !completadoActual },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualiza el estado local
      setJuegos((prev) =>
        prev.map((j) =>
          j._id === juegoId ? { ...j, completado: response.data.completado } : j
        )
      );

      toast.success(
        response.data.completado
          ? "Juego marcado como completado"
          : "Juego marcado como pendiente"
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Función: Eliminar un juego de la biblioteca
  // ----------------------------------
  const eliminarJuego = async (juegoId) => {
    if (!window.confirm("¿Eliminar juego de tu biblioteca?")) return;

    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/juegos/mi-biblioteca/${juegoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJuegos((prev) => prev.filter((j) => j._id !== juegoId));
      toast.success("Juego eliminado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Función: Calificar un juego
  // ----------------------------------
  const calificarJuego = async (juegoId, nuevaCalificacion) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/juegos/${juegoId}`,
        { calificacion: nuevaCalificacion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJuegos((prev) =>
        prev.map((j) =>
          j._id === juegoId
            ? { ...j, calificacion: response.data.calificacion }
            : j
        )
      );

      toast.success("Calificación actualizada");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo calificar");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Estadísticas de la biblioteca
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
  // Filtrado de juegos por búsqueda y género
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

  // Función que se pasa a JuegoCard para actualizar la lista
  const actualizarJuegos = (nuevaBiblioteca) => {
    setJuegos(nuevaBiblioteca);
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white px-4 sm:px-6 lg:px-12 pt-28 pb-16">
      {/* ENCABEZADO */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-cyan-400">
          Mi Biblioteca
        </h1>

        {/* Estadísticas */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-800 border border-cyan-500 rounded-lg px-4 py-2 text-center min-w-[90px]">
            <p className="text-2xl font-bold text-cyan-400">
              {estadisticas.total}
            </p>
            <p className="text-xs text-gray-400">Total Juegos</p>
          </div>
          <div className="bg-gray-800 border border-green-500 rounded-lg px-4 py-2 text-center min-w-[90px]">
            <p className="text-2xl font-bold text-green-400">
              {estadisticas.completados}
            </p>
            <p className="text-xs text-gray-400">Completados</p>
          </div>
          <div className="bg-gray-800 border border-yellow-500 rounded-lg px-4 py-2 text-center min-w-[90px]">
            <p className="text-2xl font-bold text-yellow-400">
              {estadisticas.porcentajeCompletados}%
            </p>
            <p className="text-xs text-gray-400">Progreso</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-gray-800 border border-cyan-500 rounded-lg px-4 py-2 text-sm w-full sm:w-auto"
          />
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="bg-gray-800 border border-cyan-500 rounded-lg px-4 py-2 text-sm w-full sm:w-auto"
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

      {/* ACCIONES */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <p className="text-gray-400 text-sm">
          Mostrando {juegosFiltrados.length} de {estadisticas.total} juegos
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setBusqueda("");
              setGenero("todos");
            }}
            className="bg-gray-800 border border-cyan-500 px-4 py-2 rounded-lg text-sm"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={obtenerBiblioteca}
            className="bg-gray-800 border border-cyan-500 px-4 py-2 rounded-lg text-sm"
          >
            Recargar
          </button>
        </div>
      </div>

      {/* GRID DE JUEGOS */}
      {juegosFiltrados.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-400 mb-4">
            No tienes juegos en tu biblioteca.
          </p>
          <button
            onClick={() => navigate("/explorar-juegos")}
            className="bg-cyan-500 px-6 py-3 rounded-lg font-semibold text-black"
          >
            Explorar Juegos
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {juegosFiltrados.map((juego) => (
            <JuegoCard
              key={juego._id}
              juego={juego}
              enBibliotecaProp={true}
              toggleCompletado={toggleCompletado}
              eliminarJuego={eliminarJuego}
              calificarJuego={calificarJuego}
              actualizarJuegos={actualizarJuegos}
            />
          ))}
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 pt-12 pb-10 text-sm border-t border-gray-700 w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default BibliotecaJuegos;
