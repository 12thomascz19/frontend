import React from "react";
import { motion } from "framer-motion";

// Componente modal para confirmar la eliminación de una reseña
function ConfirmDeleteModal({ onClose, onConfirm }) {
  return (
    // Fondo oscuro y modal centrado
    <motion.div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}  // Opacidad inicial para animación de aparición
      animate={{ opacity: 1 }}  // Opacidad al aparecer
    >
      {/* Contenedor del modal con animación de escala */}
      <motion.div
        className="bg-[#1A1A2E] p-6 rounded-xl shadow-xl w-[90%] max-w-sm border border-[#6C63FF50]"
        initial={{ scale: 0.8 }}  // Escala inicial más pequeña
        animate={{ scale: 1 }}    // Escala normal al aparecer
      >
        {/* Título */}
        <h2 className="text-xl font-bold text-white text-center">
          ¿Eliminar reseña?
        </h2>

        {/* Mensaje informativo */}
        <p className="text-gray-300 mt-2 text-center">
          Esta acción no se puede deshacer.
        </p>

        {/* Botones de acción */}
        <div className="flex justify-between mt-5">
          {/* Botón cancelar */}
          <button
            onClick={onClose} // Cierra el modal sin hacer nada
            className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700"
          >
            Cancelar
          </button>

          {/* Botón confirmar */}
          <button
            onClick={onConfirm} // Ejecuta la acción de eliminar
            className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ConfirmDeleteModal;
