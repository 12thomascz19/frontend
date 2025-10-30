import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import Registro from "./pages/Register";
import BibliotecaJuegos from "./pages/BibliotecaJuegos";
import Estadisticas from "./pages/Estadisticas";
import Home from "./pages/Home";
import Cuenta from "./pages/Cuenta";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/biblioteca" element={<BibliotecaJuegos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/cuenta" element={<Cuenta/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
