import React from "react";
// Importo los íconos de React Icons que voy a usar en el footer
import { FaGithub, FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

function Footer()  {
  return (
    // Footer principal con fondo oscuro, texto gris claro y algo de padding
    <footer className="bg-[#0A0E24] text-[#B0B3C2] mt-20 pt-12 pb-10 text-sm border-t border-[#1F2347] w-full">
      {/* Contenedor principal con padding y grid de 3 columnas en pantallas medianas */}
      <div className="w-full px-10 md:px-20 grid md:grid-cols-3 gap-12">
        {/* ---------------------- */}
        {/*   SECCIÓN 1: SOBRE NOSOTROS / ABOUT */}
        {/* ---------------------- */}
        <div>
          <h2 className="text-[#00E5FF] font-semibold text-lg mb-3">
            GameTracker
          </h2>
          {/* Descripción de la aplicación */}
          <p>
            GameTracker es una aplicación web para crear tu propia biblioteca
            personal de videojuegos, con la posibilidad de gestionarlos,
            escribir reseñas y llevar estadísticas de tu experiencia como gamer.
          </p>
        </div>

        {/* ---------------------- */}
        {/*   SECCIÓN 2: NAVEGACIÓN / LINKS */}
        {/* ---------------------- */}
        <div>
          <h2 className="text-[#00E5FF] font-semibold text-lg mb-3">
            Navegación
          </h2>
          {/* Lista de enlaces internos (no tienen <Link> aún, solo texto) */}
          <ul className="space-y-2">
            <li className="hover:text-white transition">Explorar Juegos</li>
            <li className="hover:text-white transition">Mi Biblioteca</li>
            <li className="hover:text-white transition">Mis Reseñas</li>
            <li className="hover:text-white transition">Mis Estadísticas</li>
          </ul>
        </div>

        {/* ---------------------- */}
        {/*   SECCIÓN 3: CONTACTO / SOCIAL */}
        {/* ---------------------- */}
        <div>
          <h2 className="text-[#00E5FF] font-semibold text-lg mb-3">
            Contáctame
          </h2>

          {/* Íconos de redes sociales con hover para cambiar de color */}
          <div className="flex gap-4 text-xl mt-2 ">
            <a
              href="https://github.com/12thomascz19"
              className="hover:text-white transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.facebook.com/thomas.cano.7161/"
              className="hover:text-white transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/thomas_zapata12/"
              className="hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              href="mailto:thomascanozapata571@gmail.com"
              className="hover:text-white transition"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* ---------------------- */}
      {/*   LÍNEA DIVISORIA / COPYRIGHT */}
      {/* ---------------------- */}
      <div className="border-t border-[#1F2347] mt-10 pt-6 text-center w-full">
        {/* Información de copyright */}
        <p>© 2025 GameTracker | Proyecto final para Jóvenes CreaTIvos</p>
        <p className="mt-1">
          Desarrollado por{" "}
          <span className="text-[#00E5FF] font-semibold">
            Thomas Cano Zapata
          </span>
        </p>
        <p className="mt-1 opacity-70">Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

// Exporto el footer para poder usarlo en otros componentes
export default Footer;
