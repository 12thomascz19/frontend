import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const LoginModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario)); // 👈 Guardamos datos del usuario

      setMensaje("✅ Inicio de sesión exitoso.");
      setTimeout(() => {
        onClose();
        navigate("/cuenta"); // Redirigir al perfil
      }, 1000);
    } catch (err) {
      console.error("Error login:", err.response?.data || err.message);
      setMensaje("❌ Credenciales incorrectas.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1A1A2E] text-white rounded-2xl p-8 w-96 shadow-[0_0_25px_#00E5FF]">
        <h2 className="text-2xl font-bold mb-4 text-[#00E5FF] text-center">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="bg-[#0A0A12] border border-[#00E5FF] rounded-lg px-3 py-2 focus:outline-none focus:border-[#6C63FF]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="bg-[#0A0A12] border border-[#00E5FF] rounded-lg px-3 py-2 focus:outline-none focus:border-[#6C63FF]"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-[#00E5FF] hover:bg-[#6C63FF] text-white font-semibold py-2 rounded-lg transition duration-300 shadow-[0_0_15px_#00E5FF] hover:shadow-[0_0_15px_#6C63FF]"
          >
            Entrar
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

export default LoginModal;
