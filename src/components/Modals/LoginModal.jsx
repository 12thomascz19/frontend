import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Guardar token y usuario
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      toast.success(`🎮 ¡Bienvenido de nuevo, ${res.data.usuario.nombre}!`);

      // Actualiza estado global
      if (onLoginSuccess) onLoginSuccess(res.data.usuario);

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1500);
    } catch (err) {
      toast.error("❌ Credenciales incorrectas. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[#1A1A2E] border border-[#6C63FF70] rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-white"
        >
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-[#FF4081] transition"
          >
            <FaTimes size={20} />
          </button>

          <div className="text-center mb-6">
            <FaSignInAlt className="text-4xl mx-auto text-[#00E5FF] mb-2" />
            <h2 className="text-2xl font-bold text-[#00E5FF]">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-[#B0B3C2] mt-1">
              Accede a tu cuenta y comienza a jugar 🎮
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-10">
              <FaSpinner className="animate-spin text-[#00FF88] text-4xl mb-2" />
              <p className="text-[#00FF88] font-semibold">
                Iniciando sesión...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-[#6C63FF]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A12] border border-[#6C63FF70] rounded-lg text-white focus:ring-2 focus:ring-[#6C63FF] outline-none transition"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-[#6C63FF]" />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A12] border border-[#6C63FF70] rounded-lg text-white focus:ring-2 focus:ring-[#6C63FF] outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6C63FF] to-[#00E5FF] py-2 rounded-lg font-bold text-black shadow-lg hover:shadow-[#6C63FF]/50 transition-transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
