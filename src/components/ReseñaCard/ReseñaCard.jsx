import React from "react";
import { FaEllipsisV } from "react-icons/fa";

const ResenaCard = ({ resena = {}, onEdit, onDelete }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Seguridad: evitar undefined
  const usuarioIdResena = resena?.usuario?._id || resena?.usuarioId;
  const usuarioNombreResena =
    resena?.usuario?.nombre || resena?.usuarioNombre || "Usuario desconocido";

  const soyYo = user?.id && usuarioIdResena && user.id === usuarioIdResena;

  return (
    <div className="bg-[#1F1F1F] border border-gray-700 rounded-xl p-4 mb-4 shadow-md relative transition-all">
      {/* Botón de 3 puntos SOLO si la reseña es mía */}
      {soyYo && (
        <div className="absolute top-3 right-3 cursor-pointer text-gray-300 hover:text-white">
          <FaEllipsisV onClick={() => onEdit(resena)} />
        </div>
      )}

      {/* Nombre del usuario */}
      <p className="text-sm text-gray-400 mb-1">
        <strong className="text-white">
          {soyYo ? "Yo" : usuarioNombreResena}
        </strong>
      </p>

      {/* Rating */}
      <p className="text-yellow-400 mb-2">⭐ {resena?.puntuacion || 0} / 5</p>

      {/* Comentario */}
      <p className="text-gray-300">{resena?.comentario || "Sin comentario"}</p>

      {/* Botón eliminar SOLO si soy yo */}
      {soyYo && (
        <button
          className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          onClick={() => onDelete(resena._id)}
        >
          Eliminar
        </button>
      )}
    </div>
  );
};

export default ResenaCard;
