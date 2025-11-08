import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { FaChartBar, FaGamepad, FaTrophy, FaStar } from "react-icons/fa";

const COLORS = ["#6C63FF", "#00E5FF", "#FF4081", "#00FF88", "#FF1744"];

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/estadisticas/mis-estadisticas",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEstadisticas(res.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    fetchStats();
  }, []);

  if (!estadisticas) {
    return (
      <div className="min-h-screen bg-[#0A0A12] text-white flex justify-center items-center">
        <div className="text-center text-[#B0B3C2] animate-pulse">
          No hay estadisticas que mostrar{" "}
        </div>
      </div>
    );
  }

  const plataformasData = Object.entries(estadisticas.porPlataforma).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const generosData = Object.entries(estadisticas.porGenero).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-28 px-8 pb-20">
      {/* ENCABEZADO */}
      <motion.div
        className="flex items-center gap-4 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaChartBar className="text-[#6C63FF] text-4xl drop-shadow-[0_0_12px_#6C63FF]" />
        <h1 className="text-3xl font-extrabold text-[#00E5FF]">
          Mis Estadísticas
        </h1>
      </motion.div>

      {/* MÉTRICAS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div
          className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg border border-[#6C63FF30]"
          whileHover={{ scale: 1.05 }}
        >
          <FaGamepad className="text-[#6C63FF] text-3xl mb-2" />
          <h3 className="text-lg text-[#B0B3C2]">Total de juegos</h3>
          <p className="text-3xl font-bold text-[#00E5FF]">
            {estadisticas.totalJuegos}
          </p>
        </motion.div>

        <motion.div
          className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg border border-[#6C63FF30]"
          whileHover={{ scale: 1.05 }}
        >
          <FaTrophy className="text-[#00FF88] text-3xl mb-2" />
          <h3 className="text-lg text-[#B0B3C2]">Completados</h3>
          <p className="text-3xl font-bold text-[#00FF88]">
            {estadisticas.porcentajeCompletados}%
          </p>
        </motion.div>

        <motion.div
          className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg border border-[#6C63FF30]"
          whileHover={{ scale: 1.05 }}
        >
          <FaStar className="text-[#FF4081] text-3xl mb-2" />
          <h3 className="text-lg text-[#B0B3C2]">Promedio Puntuación</h3>
          <p className="text-3xl font-bold text-[#FF4081]">
            {estadisticas.promedioPuntuacion.toFixed(1)}
          </p>
        </motion.div>

        <motion.div
          className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg border border-[#6C63FF30]"
          whileHover={{ scale: 1.05 }}
        >
          <FaChartBar className="text-[#00E5FF] text-3xl mb-2" />
          <h3 className="text-lg text-[#B0B3C2]">Juegos Activos</h3>
          <p className="text-3xl font-bold text-[#00E5FF]">
            {estadisticas.totalJuegos - estadisticas.completados}
          </p>
        </motion.div>
      </div>

      {/* GRAFICAS */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gráfico por plataforma */}
        <div className="bg-[#1A1A2E] p-6 rounded-2xl shadow-lg border border-[#6C63FF30]">
          <h2 className="text-xl mb-4 text-[#00E5FF] font-semibold">
            Distribución por Plataforma
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={plataformasData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {plataformasData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico por género */}
        <div className="bg-[#1A1A2E] p-6 rounded-2xl shadow-lg border border-[#6C63FF30]">
          <h2 className="text-xl mb-4 text-[#00E5FF] font-semibold">
            Distribución por Género
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
              <XAxis dataKey="name" stroke="#B0B3C2" />
              <YAxis stroke="#B0B3C2" />
              <Tooltip />
              <Bar dataKey="value" fill="#6C63FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
