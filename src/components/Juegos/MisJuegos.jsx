import React from "react";

const MisJuegos = ({ juegos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {juegos.map((juego) => (
        <div
          key={juego._id}
          className="bg-[#1A1A2E] border border-[#6C63FF] rounded-xl p-4 shadow-[0_0_10px_rgba(108,99,255,0.4)] hover:shadow-[0_0_15px_#00E5FF] transition duration-300"
        >
          <h3 className="text-lg font-semibold text-[#00E5FF]">
            {juego.titulo}
          </h3>
          <p className="text-[#B0B3C2] mt-2">{juego.descripcion}</p>
          <span className="text-[#00FF88] text-sm mt-3 block">
            🎯 Progreso: {juego.progreso || 0}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default MisJuegos;
