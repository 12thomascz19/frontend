import React, { useState } from "react";
// Importa React y el hook useState para manejar estado local dentro del componente

import { motion, AnimatePresence } from "framer-motion";
// Importa Framer Motion para animaciones suaves de aparición/desaparición

import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaSpinner,
} from "react-icons/fa";
// Importa íconos de Font Awesome: X, sobre, candado, icono de login y spinner de carga

import axios from "axios";
// Importa Axios para hacer peticiones HTTP al backend

import toast from "react-hot-toast";
// Importa toast para mostrar notificaciones emergentes de éxito o error

// Componente modal de login
const LoginModal = ({ onClose, onLoginSuccess }) => {
  // onClose → función para cerrar el modal
  // onLoginSuccess → función que se ejecuta si el login es exitoso

  const [formData, setFormData] = useState({ email: "", password: "" });
  // Estado para almacenar email y contraseña ingresados por el usuario

  const [loading, setLoading] = useState(false);
  // Estado para controlar la animación de carga mientras se realiza el login

  // Función para actualizar el estado cuando el usuario escribe en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    setLoading(true); // Activa la animación de carga

    try {
      // Petición POST al backend para autenticar usuario
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      // Notificación de éxito con nombre del usuario
      toast.success(`🎮 ¡Bienvenido de nuevo, ${res.data.usuario.nombre}!`);

      // Ejecuta la función onLoginSuccess si está definida
      if (onLoginSuccess) onLoginSuccess(res.data.usuario);

      // Después de 1.5 segundos, desactiva loader y cierra el modal
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1500);
    } catch (err) {
      // Si ocurre un error, muestra notificación de error
      toast.error("❌ Credenciales incorrectas. Intenta nuevamente.");
      setLoading(false); // Desactiva loader
    }
  };

  return (
    <AnimatePresence>
      {/* Contenedor principal del modal con fondo oscuro y animación de fade */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }} // Animación inicial: invisible
        animate={{ opacity: 1 }} // Animación al aparecer: visible
        exit={{ opacity: 0 }} // Animación al cerrar: fade out
      >
        {/* Contenedor interno del modal con animación de escala */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} // Inicia más pequeño y transparente
          animate={{ scale: 1, opacity: 1 }} // Escala a tamaño normal y opacidad completa
          exit={{ scale: 0.9, opacity: 0 }} // Al cerrar, vuelve a achicarse y desaparecer
          transition={{ duration: 0.3 }} // Duración de la animación
          className="relative bg-[#1A1A2E] border border-[#6C63FF70] rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-white"
        >
          {/* Botón para cerrar modal */}
          <button
            onClick={onClose} // Ejecuta función onClose al hacer click
            className="absolute top-3 right-3 text-gray-400 hover:text-[#FF4081] transition"
          >
            <FaTimes size={20} /> {/* Ícono de X */}
          </button>

          {/* Encabezado del modal */}
          <div className="text-center mb-6">
            <FaSignInAlt className="text-4xl mx-auto text-[#00E5FF] mb-2" />{" "}
            {/* Ícono grande */}
            <h2 className="text-2xl font-bold text-[#00E5FF]">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-[#B0B3C2] mt-1">
              Accede a tu cuenta y comienza a jugar 🎮
            </p>
          </div>

          {/* Si está cargando, muestra loader */}
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <FaSpinner className="animate-spin text-[#00FF88] text-4xl mb-2" />
              <p className="text-[#00FF88] font-semibold">
                Iniciando sesión...
              </p>
            </div>
          ) : (
            // Formulario de login
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input de email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-[#6C63FF]" />{" "}
                {/* Ícono de sobre */}
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange} // Actualiza el estado
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A12] border border-[#6C63FF70] rounded-lg text-white focus:ring-2 focus:ring-[#6C63FF] outline-none transition"
                />
              </div>

              {/* Input de contraseña */}
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-[#6C63FF]" />{" "}
                {/* Ícono de candado */}
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange} // Actualiza el estado
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A12] border border-[#6C63FF70] rounded-lg text-white focus:ring-2 focus:ring-[#6C63FF] outline-none transition"
                />
              </div>

              {/* Botón de enviar formulario */}
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
