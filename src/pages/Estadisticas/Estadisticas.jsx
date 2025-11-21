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
import Footer from "../../components/Footer/Footer";

const COLORS = ["#6C63FF", "#00E5FF", "#FF4081", "#00FF88", "#FF1744"];

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/juegos/mi-biblioteca",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        const juegos = Array.isArray(data)
          ? data
          : Array.isArray(data?.biblioteca)
          ? data.biblioteca
          : Array.isArray(data?.juegos)
          ? data.juegos
          : [];

        const totalJuegos = juegos.length;
        const completados = juegos.filter((j) => j.completado).length;
        const porcentajeCompletados =
          totalJuegos > 0 ? Math.round((completados / totalJuegos) * 100) : 0;

        const calificaciones = juegos
          .map((j) => Number(j.calificacion))
          .filter((n) => !isNaN(n));

        const promedioPuntuacion =
          calificaciones.length > 0
            ? calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length
            : 0;

        const porPlataforma = juegos.reduce((acc, j) => {
          const key = j.plataforma || "Desconocida";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const porGenero = juegos.reduce((acc, j) => {
          const key = j.genero || "Desconocido";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        setEstadisticas({
          totalJuegos,
          completados,
          porcentajeCompletados,
          promedioPuntuacion,
          porPlataforma,
          porGenero,
        });
      } catch (error) {
        setEstadisticas({
          totalJuegos: 0,
          completados: 0,
          porcentajeCompletados: 0,
          promedioPuntuacion: 0,
          porPlataforma: {},
          porGenero: {},
        });
      }
    };

    fetchStats();
  }, []);

  if (!estadisticas) {
    return (
      <div className="min-h-screen bg-[#0A0A12] text-white flex justify-center items-center px-4">
        <div className="text-center text-[#B0B3C2] animate-pulse">
          No hay estadísticas que mostrar
        </div>
      </div>
    );
  }

  const plataformasData = Object.entries(estadisticas.porPlataforma).map(
    ([name, value]) => ({ name, value })
  );

  const generosData = Object.entries(estadisticas.porGenero).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-28 px-4 sm:px-8 pb-20">
      {/* ENCABEZADO */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaChartBar className="text-[#6C63FF] text-4xl drop-shadow-[0_0_12px_#6C63FF]" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00E5FF] mt-2 sm:mt-0">
          Mis Estadísticas
        </h1>
      </motion.div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<FaGamepad className="text-[#6C63FF] text-3xl mb-2" />}
          label="Total de juegos"
          value={estadisticas.totalJuegos}
          color="#00E5FF"
        />

        <StatCard
          icon={<FaTrophy className="text-[#00FF88] text-3xl mb-2" />}
          label="Completados"
          value={`${estadisticas.porcentajeCompletados}%`}
          color="#00FF88"
        />

        <StatCard
          icon={<FaStar className="text-[#FF4081] text-3xl mb-2" />}
          label="Promedio Puntuación"
          value={estadisticas.promedioPuntuacion.toFixed(1)}
          color="#FF4081"
        />

        <StatCard
          icon={<FaChartBar className="text-[#00E5FF] text-3xl mb-2" />}
          label="Juegos activos"
          value={estadisticas.totalJuegos - estadisticas.completados}
          color="#00E5FF"
        />
      </div>

      {/* GRAFICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Plataforma */}
        <ChartCard title="Distribución por Plataforma">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={plataformasData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {plataformasData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Género */}
        <ChartCard title="Distribución por Género">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={generosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
              <XAxis dataKey="name" stroke="#B0B3C2" />
              <YAxis stroke="#B0B3C2" />
              <Tooltip />
              <Bar dataKey="value" fill="#6C63FF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Footer />
    </div>
  );
};

// COMPONENTE DE MÉTRICA
const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg border border-[#6C63FF30]"
    whileHover={{ scale: 1.05 }}
  >
    {icon}
    <h3 className="text-lg text-[#B0B3C2]">{label}</h3>
    <p className="text-3xl font-bold" style={{ color }}>
      {value}
    </p>
  </motion.div>
);

// COMPONENTE DE GRÁFICAS
const ChartCard = ({ children, title }) => (
  <div className="bg-[#1A1A2E] p-6 rounded-2xl shadow-lg border border-[#6C63FF30]">
    <h2 className="text-xl mb-4 text-[#00E5FF] font-semibold">{title}</h2>
    {children}
  </div>
);

export default Estadisticas;
