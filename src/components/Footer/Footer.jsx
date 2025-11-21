import React from "react";
import { FaGithub, FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0A0E24] text-[#B0B3C2] mt-20 pt-12 pb-10 text-sm border-t border-[#1F2347] w-full">
      {/* CONTENEDOR FULL WIDTH */}
      <div className="w-full px-10 md:px-20 grid md:grid-cols-3 gap-12">
        {/* ---------------------- */}
        {/*   SECCIÓN 1: ABOUT     */}
        {/* ---------------------- */}
        <div>
          <h2 className="text-[#00E5FF] font-semibold text-lg mb-3">
            GameTracker
          </h2>
          <p>
            GameTracker es una aplicación web para crear tu propia biblioteca
            personal de videojuegos, con la posibilidad de gestionarlos,
            escribir reseñas y llevar estadísticas de tu experiencia como gamer.
          </p>
        </div>

        {/* ---------------------- */}
        {/*  SECCIÓN 2: ENLACES     */}
        {/* ---------------------- */}
        <div>
          <h2 className="text-[#00E5FF] font-semibold text-lg mb-3">
            Navegación
          </h2>
          <ul className="space-y-2">
            <li className="hover:text-white transition">Explorar Juegos</li>
            <li className="hover:text-white transition">Mi Biblioteca</li>
            <li className="hover:text-white transition">Mis Reseñas</li>
            <li className="hover:text-white transition">Mis Estadísticas</li>
          </ul>
        </div>

        {/* ---------------------- */}
        {/*  SECCIÓN 3: CONTACTO    */}
        {/* ---------------------- */}
        <div>
          <h2 className="text-[#00E5FF] font-semibold text-lg mb-3">
            Contáctame
          </h2>

          <div className="flex gap-4 text-xl mt-2 ">
            <a href="https://github.com/12thomascz19" className="hover:text-white transition">
              <FaGithub />
            </a>
            <a href="https://www.facebook.com/thomas.cano.7161/" className="hover:text-white transition">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/thomas_zapata12/" className="hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="mailto:thomascanozapata571@gmail.com" className="hover:text-white transition">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* ---------------------- */}
      {/*   LÍNEA DIVISORIA       */}
      {/* ---------------------- */}
      <div className="border-t border-[#1F2347] mt-10 pt-6 text-center w-full">
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

export default Footer;
