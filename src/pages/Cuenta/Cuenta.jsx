import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaSave,
  FaEdit,
  FaUpload,
  FaEnvelope,
  // FaUserEdit,
  // FaCamera,
  FaChartLine,
  // FaSave,
  FaGamepad,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Cuenta = () => {
  const [usuario, setUsuario] = useState({});
  const [editando, setEditando] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Obtener perfil del backend
  const obtenerPerfil = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(res.data);
      setPreview(`http://localhost:5000${res.data.fotoPerfil}`);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    }
  };

  useEffect(() => {
    obtenerPerfil();
  }, []);

  // Guardar cambios
  const guardarCambios = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", usuario.nombre);
      formData.append("descripcion", usuario.descripcion);
      if (file) formData.append("fotoPerfil", file);

      await axios.put("http://localhost:5000/api/usuarios/perfil", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Perfil actualizado con éxito", {
        style: {
          background: "#1A1A2E",
          color: "#00FF88",
          border: "1px solid #00FF88",
          boxShadow: "0 0 15px #00FF8880",
        },
      });

      setEditando(false);
      obtenerPerfil();
    } catch (error) {
      toast.error("❌ Error al actualizar perfil");
    }
  };

  // Manejar previsualización
  const manejarArchivo = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-28 pb-20 px-6 flex justify-center">
      <motion.div
        className="relative bg-[#1A1A2E] w-full max-w-2xl rounded-2xl border border-[#6C63FF50] shadow-[0_0_20px_#6C63FF50] overflow-hidden p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF20] to-[#00E5FF10] blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* FOTO DE PERFIL */}
          <div className="relative group">
            {preview ? (
              <img
                src={preview}
                alt="Foto perfil"
                className="w-36 h-36 object-cover rounded-full border-4 border-[#00E5FF] shadow-[0_0_25px_#00E5FF80]"
              />
            ) : (
              <FaUserCircle className="text-[9rem] text-[#6C63FF]" />
            )}
            {editando && (
              <label
                htmlFor="fotoPerfil"
                className="absolute bottom-1 right-1 bg-[#6C63FF] hover:bg-[#7B72FF] text-white p-2 rounded-full cursor-pointer transition"
              >
                <FaUpload />
                <input
                  id="fotoPerfil"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={manejarArchivo}
                />
              </label>
            )}
          </div>

          {/* INFO DEL USUARIO */}
          {editando ? (
            <>
              <input
                type="text"
                value={usuario.nombre || ""}
                onChange={(e) =>
                  setUsuario({ ...usuario, nombre: e.target.value })
                }
                className="bg-[#0A0A12] text-white px-4 py-2 rounded-md border border-[#6C63FF80] focus:ring-2 focus:ring-[#00E5FF] text-center w-full"
              />
              <textarea
                value={usuario.descripcion || ""}
                onChange={(e) =>
                  setUsuario({ ...usuario, descripcion: e.target.value })
                }
                placeholder="Agrega una breve descripción sobre ti..."
                className="bg-[#0A0A12] text-white px-4 py-2 rounded-md border border-[#6C63FF80] focus:ring-2 focus:ring-[#00E5FF] w-full text-center h-24"
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-[#00E5FF]">
                {usuario.nombre}
              </h2>
              <div className="flex items-center gap-2 text-[#B0B3C2]">
                <FaEnvelope /> {usuario.email}
              </div>
              <p className="italic text-[#E0E0E0] mt-3">
                {usuario.descripcion || "No tienes una descripción aún."}
              </p>
            </>
          )}

          {/* BOTONES */}
          <div className="flex gap-4 mt-6">
            {editando ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={guardarCambios}
                className="bg-[#00FF88] text-black font-bold px-6 py-2 rounded-md shadow-[0_0_15px_#00FF8880]"
              >
                <FaSave className="inline mr-2" /> Guardar
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setEditando(true)}
                className="bg-[#6C63FF] text-white font-bold px-6 py-2 rounded-md hover:bg-[#7B72FF]"
              >
                <FaEdit className="inline mr-2" /> Editar perfil
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      <Footer/>
    </div>
  );
};

export default Cuenta;
