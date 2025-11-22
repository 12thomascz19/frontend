import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Componente para editar un juego en un modal
export default function EditModal({ open, data, onClose, onSave }) {
  // Estado local para manejar los cambios del formulario
  const [form, setForm] = useState(data);

  // Si open es false, no mostramos el modal
  if (!open) return null;

  // Función para actualizar los valores del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    // AnimatePresence permite animaciones al montar y desmontar el modal
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} // Opacidad inicial
        animate={{ opacity: 1 }} // Opacidad al aparecer
        exit={{ opacity: 0 }} // Opacidad al desaparecer
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        {/* Contenedor del modal con animación de escala */}
        <motion.div
          initial={{ scale: 0.8 }} // Escala inicial más pequeña
          animate={{ scale: 1 }} // Escala normal al aparecer
          exit={{ scale: 0.8 }} // Escala al cerrar
          className="bg-white rounded-xl shadow-xl p-6 w-[400px]"
        >
          <h2 className="text-xl font-bold mb-4">Editar Juego</h2>

          {/* Campos del formulario */}
          <input
            name="titulo"
            className="w-full border p-2 rounded mb-2"
            value={form.titulo}
            onChange={handleChange}
          />

          <input
            name="descripcion"
            className="w-full border p-2 rounded mb-2"
            value={form.descripcion}
            onChange={handleChange}
          />

          <input
            name="plataforma"
            className="w-full border p-2 rounded mb-2"
            value={form.plataforma}
            onChange={handleChange}
          />

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose} // Cierra el modal
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancelar
            </button>

            <button
              onClick={() => onSave(form)} // Llama a la función onSave pasando los datos actualizados
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
