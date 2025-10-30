import React, { useEffect, useState } from "react";
import API from "../services/api";
import MisJuegos from "../components/Juegos/MisJuegos";

const Cuenta = () => {
  const [usuario, setUsuario] = useState(null);
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(userData);

    const fetchJuegos = async () => {
      try {
        const res = await API.get("/juegos/mis-juegos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJuegos(res.data);
      } catch (err) {
        console.error("Error al obtener juegos:", err.response?.data || err);
      }
    };

    if (token) fetchJuegos();
  }, []);

  if (!usuario)
    return (
      <div className="text-center text-[#FF4081] mt-10">
        Debes iniciar sesión para ver tu cuenta.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white p-8">
      <h1 className="text-3xl font-bold text-[#6C63FF] mb-6">
        Bienvenido, {usuario.nombre}! 🎮
      </h1>

      <h2 className="text-xl text-[#00E5FF] mb-4">Tus juegos guardados:</h2>

      {juegos.length === 0 ? (
        <p className="text-[#B0B3C2]">Aún no has añadido ningún juego.</p>
      ) : (
        <MisJuegos juegos={juegos} />
      )}
    </div>
  );
};

export default Cuenta;
