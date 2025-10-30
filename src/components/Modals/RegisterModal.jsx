import React, { useState } from "react";
import API from "../../services/api";

const RegisterModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      setMensaje("✅ Registro exitoso, ya puedes iniciar sesión.");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMensaje("❌ Error al registrar. Intenta de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1A1A2E] text-white rounded-2xl p-8 w-96 shadow-[0_0_25px_#6C63FF]">
        <h2 className="text-2xl font-bold mb-4 text-[#00E5FF] text-center">
          Crear cuenta
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            className="bg-[#0A0A12] border border-[#6C63FF] rounded-lg px-3 py-2 focus:outline-none focus:border-[#00E5FF]"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="bg-[#0A0A12] border border-[#6C63FF] rounded-lg px-3 py-2 focus:outline-none focus:border-[#00E5FF]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="bg-[#0A0A12] border border-[#6C63FF] rounded-lg px-3 py-2 focus:outline-none focus:border-[#00E5FF]"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-[#6C63FF] hover:bg-[#00E5FF] text-white font-semibold py-2 rounded-lg transition duration-300 shadow-[0_0_15px_#6C63FF] hover:shadow-[0_0_15px_#00E5FF]"
          >
            Registrarse
          </button>
          {mensaje && (
            <p className="text-center text-sm mt-2 text-[#00FF88]">{mensaje}</p>
          )}
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full text-[#FF4081] hover:text-[#00E5FF] transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
