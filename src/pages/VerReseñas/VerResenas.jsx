// src/pages/VerReseñas/VerResenas.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import ResenaCard from "../../components/ReseñaCard/ReseñaCard";
import ConfirmDeleteModal from "../../components/Modals/ModalConfirmacion/ModalConfirmacion";

import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const VerResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Si venimos desde edición, actualizar la card directamente
  useEffect(() => {
    const reseñaActualizada = location.state?.reseñaActualizada;

    if (reseñaActualizada) {
      setResenas((prev) =>
        prev.map((r) => (r._id === reseñaActualizada._id ? reseñaActualizada : r))
      );

      toast.success("✔ Reseña actualizada");
    }
  }, [location.state]);

  // 🔥 Cargar reseñas
  useEffect(() => {
    const fetchResenas = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/resenas");
        setResenas(res.data || []);
      } catch (err) {
        console.error("Error cargando reseñas:", err);
        setResenas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, []);

  // 🔥 Eliminar reseña desde modal
  const eliminarResena = async () => {
    if (!resenaSeleccionada) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/resenas/${resenaSeleccionada}`
      );

      // Eliminar de la lista sin recargar
      setResenas((prev) =>
        prev.filter((r) => r._id !== resenaSeleccionada)
      );

      toast.success("✔ Reseña eliminada");
    } catch (err) {
      toast.error("❌ Error al eliminar reseña");
      console.error("Error al eliminar:", err);
    } finally {
      setMostrarModal(false);
      setResenaSeleccionada(null);
    }
  };

  // 🔥 Editar reseña
  const handleEdit = (reseña) => {
    navigate("/resenas", { state: reseña });
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white pt-28 pb-24 px-6">

      {/* GRID DE RESEÑAS */}
      <div className="grid max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resenas.map((r) => (
          <ResenaCard
            key={r._id}
            resena={r}
            onEdit={() => handleEdit(r)}
            onDelete={() => {
              setResenaSeleccionada(r._id);
              setMostrarModal(true);
            }}
          />
        ))}
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <ConfirmDeleteModal
          onClose={() => setMostrarModal(false)}
          onConfirm={eliminarResena}
        />
      )}
    </div>
  );
};

export default VerResenas;
