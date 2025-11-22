import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGamepad,
  FaUserAstronaut,
  FaSignInAlt,
  FaRocket,
  FaMedal,
  FaChartBar,
  FaLayerGroup,
  FaPlayCircle,
} from "react-icons/fa";
import LoginModal from "../components/Modals/LoginModal";
import RegisterModal from "../components/Modals/RegisterModal";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [gradientPos, setGradientPos] = useState(0);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPos((prev) => (prev + 1) % 360);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start text-white px-4 sm:px-6 pt-32 pb-20 overflow-hidden"
      style={{
        background: `linear-gradient(${gradientPos}deg, #0A0A12, #1A1A2E, #0A0A12)`,
        transition: "background 0.5s ease",
      }}
    >
      {/* Glow dinámico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6C63FF40_0%,transparent_60%)] blur-3xl animate-pulse opacity-40"></div>

      {/* LOGO + TEXTO */}
      <motion.div
        className="z-10 flex flex-col items-center text-center mb-16 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <FaGamepad className="text-[#6C63FF] text-7xl sm:text-8xl drop-shadow-[0_0_25px_#6C63FF]" />
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#00E5FF] mt-4 tracking-wide drop-shadow-[0_0_12px_#00E5FF]">
          GameTracker
        </h1>

        <p className="text-[#B0B3C2] mt-4 text-base sm:text-lg max-w-2xl leading-relaxed px-2">
          Tu portal gamer definitivo ⚡Explora tus jugos favoritos, 
          administra tu biblioteca, revisa tus estadísticas y
         reseña tus juegos favoritos. ¡Todo en un solo lugar!
        </p>
      </motion.div>

      {/* BOTONES */}
      <motion.div
        className="z-10 flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 w-full px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {!token ? (
          <>
            <motion.button
              onClick={() => setShowLogin(true)}
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px #6C63FF" }}
              className="flex items-center justify-center gap-2 bg-[#6C63FF] hover:bg-[#7B72FF] transition-all w-full sm:w-auto px-8 py-3 rounded-lg font-semibold shadow-lg shadow-[#6C63FF]/50"
            >
              <FaSignInAlt /> Iniciar sesión
            </motion.button>

            <motion.button
              onClick={() => setShowRegister(true)}
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px #00E5FF" }}
              className="flex items-center justify-center gap-2 bg-[#00E5FF] hover:bg-[#33EEFF] text-black transition-all w-full sm:w-auto px-8 py-3 rounded-lg font-semibold shadow-lg shadow-[#00E5FF]/40"
            >
              <FaUserAstronaut /> Crear cuenta
            </motion.button>
          </>
        ) : (
          <div className="text-center w-full">
            <p className="bg-blue-500/20 p-3 rounded text-[#ffffff] mb-4 text-lg font-semibold w-full sm:w-auto mx-auto">
              ¡Hola, {usuario?.nombre}!
            </p>
            <Link
              to="/Explorar-juegos"
              className="flex items-center justify-center gap-2 bg-[#6C63FF] hover:bg-[#7B72FF] px-8 py-3 rounded-lg font-semibold shadow-lg shadow-[#6C63FF]/50 w-full sm:w-auto mx-auto"
            >
              <FaRocket /> Ir a mis juegos
            </Link>
          </div>
        )}
      </motion.div>

      {/* CARACTERÍSTICAS */}
      <motion.div
        className="z-10 mt-10 max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
      >
        <FeatureCard
          icon={<FaChartBar className="text-[#00E5FF] text-4xl" />}
          title="Analiza tus estadísticas"
          desc="Descubre cuánto juegas, tus géneros favoritos y tus logros globales."
        />
        <FeatureCard
          icon={<FaMedal className="text-[#FF4081] text-4xl" />}
          title="Publica tus reseñas"
          desc="Publica reseñas y califica tus propios juegos."
        />
        <FeatureCard
          icon={<FaLayerGroup className="text-[#6C63FF] text-4xl" />}
          title="Organiza tu colección"
          desc="Guarda, clasifica y comparte tus juegos en tu biblioteca."
        />
      </motion.div>

      {/* BOTÓN FINAL */}
      <motion.div
        className="z-10 mt-20 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/estadisticas")}
          className="flex items-center justify-center gap-2 bg-[#00E5FF] text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#33EEFF] transition-all mx-auto"
        >
          <FaPlayCircle /> Explorar estadísticas
        </motion.button>
      </motion.div>

      <Footer />

      {/* MODALES */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

// CARD DE CARACTERÍSTICA
const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      boxShadow: "0 0 25px rgba(108,99,255,0.5)",
      y: -5,
    }}
    className="bg-[#1A1A2E] rounded-2xl p-6 shadow-md transition-all duration-300 border border-[#2B2B40]"
  >
    <div className="flex flex-col items-center justify-center gap-3">
      {icon}
      <h3 className="text-xl font-bold text-[#FFFFFF] text-center">{title}</h3>
      <p className="text-[#B0B3C2] text-sm text-center">{desc}</p>
    </div>
  </motion.div>
);

export default Home;
