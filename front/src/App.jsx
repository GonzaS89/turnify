// src/App.js
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useProfesionalxId from "../customHooks/useProfesionalxId";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// MONTAR LAYOUTS 

//CONSUMIDOR

import SearchModal from "./consumidor/SearchModal";
import TurnSelectModal from "./consumidor/TurnSelectModal";
import UserFormModal from "./consumidor/UserFormModal";
import ConfirmationModal from "./consumidor/ConfirmationModal";
import CancelarTurno from "./consumidor/CancelarTurno";

// CLIENTE 

import UserDashboard from "./cliente/UserDashboard";
import GestionProfesionales from "./cliente/GestionProfesionales";
import CrearPerfil from "./cliente/CrearPerfil";
import CrearProfesional from "./cliente/CrearProfesionalModal";
import ConfirmationModalInterno from "./cliente/ConfirmationModalInterno";
import UserFormModalInterno from "./cliente/UserFormModalInterno";
import TurnList from "./cliente/TurnList";
import GenerarTurnosModal from "./cliente/GenerarTurnosModal";
import ConsultorioSettingsModal from "./cliente/ConsultorioSettingsModal";
import GestionCoberturas from "./cliente/GestionCoberturas";
import TurnListCentroMedico from "./cliente/TurnListCentroMedico";

// LANDING PAGE

import Login from "./landingpage/Login";
import Main from "./landingpage/Main";

// GESTION INTERNA


import PlantillaCodigosActivacion from "./Layouts/PlantillaCodigosActivacion";

import PanelAdmin from "./admin/PanelAdmin";




// React Icons
import { FaSun, FaMoon } from 'react-icons/fa';

// Contexto
import { useTheme } from "./ThemeContext"; // Ajusta la ruta según tu estructura

const App = () => {
  const { darkMode, toggleDarkMode } = useTheme(); // ✅ Usamos el contexto

   

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [idProfesional, setIdProfesional] = useState(null);
  const [consultorio, setConsultorio] = useState(null);
  const [dataFormulario, setDataFormulario] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [ordenTurno, setOrdenTurno] = useState(null);
  const [pass, setPass] = useState(null);
  const [idTurnoReprogramado, setIdTurnoReprogramado] = useState(null);


  const { profesional, isLoading, error } = useProfesionalxId(idProfesional);

  const closeLogin = () => setOpenLoginModal(false);
  const openLogin = (value = true) => setOpenLoginModal(value);

  const recibirIds = (idProfesional, consultorio) => {
    setIdProfesional(idProfesional);
    setConsultorio(consultorio);
  };

  const recibirTurnoYOrden = (turno, orden) => {
    setTurnoSeleccionado(turno);
    setOrdenTurno(orden);
  };

  const recibirDataFormulario = (data) => {
    setDataFormulario(data);
  };

  const recibirPass = (data) => {
    setPass(data);
  };

  const recibirTurnoReprogramado = (turnoId) => {
    setIdTurnoReprogramado(turnoId);
    console.log(turnoId)
  }


  return (
    <BrowserRouter>
     
      <div className="flex flex-col min-h-screen 
                     bg-gradient-to-r from-cyan-200 to-violet-200
                     dark:from-gray-900 dark:to-gray-800
                     rounded-xl shadow relative
                     transition-colors duration-700 ease-in-out"
                     style={{
  backgroundColor: "#ffffff",
  backgroundImage: `
    /* Capa 3: Patrón geométrico técnico (Cruces de precisión) */
    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234f46e5' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M19 19V5h2v14h14v2H21v14h-2V21H5v-2h14z'/%3E%3C/g%3E%3C/svg%3E"),
    /* Capa 2: Gradiente de "Aura" Indigo en la esquina superior */
    radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.08) 0px, transparent 40%),
    /* Capa 1: Gradiente de "Luz" Esmeralda sutil en la inferior derecha */
    radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 40%)
  `,
  backgroundAttachment: 'fixed', // Esto hace que el patrón se quede quieto mientras el contenido fluye (parallax sutil)
}}>
        
        {/* Botón de modo oscuro usando contexto */}
        {/* <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 p-3 rounded-full
                     bg-yellow-100 dark:bg-gray-800
                     text-yellow-600 dark:text-yellow-300
                     shadow-lg hover:shadow-xl
                     transition-transform duration-200 ease-in-out transform hover:scale-110
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {darkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
        </button> */}
        
        {/* Modal de Login */}
        {openLoginModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-[200]">
            <div
              className="absolute inset-0 bg-black/75"
              onClick={closeLogin}
            ></div>
            <Login closeLogin={closeLogin} />
          </div>
        )}

         



        <main className="relative flex-grow">
          <Routes>
            <Route path="/" element={<Main openLogin={openLogin} />} />
            <Route path="/micuenta" element={<UserDashboard enviarPass={recibirPass} />} />
            <Route path="/crearperfil/:codigo" element={<CrearPerfil handleCrearConsultorio={() => setOpenLoginModal(true)} />} />
            <Route path="/crearprofesional" element={<CrearProfesional />} />
            <Route path="/cancelar-turno/:turnoId" element={<CancelarTurno idTurnoReprogramado={recibirTurnoReprogramado}/>} />
            <Route path="/buscarprofesionales" element={<SearchModal enviarIds={recibirIds} />} />
            <Route path="turnos/:profesionalSlug" element={<TurnSelectModal consultorio={consultorio} idProfesional={idProfesional} enviarTurnoYOrden={recibirTurnoYOrden} />} />
            <Route path="/formulario-usuario/:consultorioId/:profesionalId" element={<UserFormModal onSubmit={recibirDataFormulario} />} />
            <Route path="/confirmacionturno/:consultorioId/:profesionalId" element={<ConfirmationModal formData={dataFormulario} selectedTurno={turnoSeleccionado} ordenTurno={ordenTurno} consultorio={consultorio} profesional={profesional?.[0]} idTurnoReprogramado = {idTurnoReprogramado}/>} />
            <Route path="/micuenta/formulario-usuario/:consultorioId/:profesionalId" element={<UserFormModalInterno onSubmit={recibirDataFormulario} />} />
            <Route path="/micuenta/confirmacionturno/:consultorioId/:profesionalId" element={<ConfirmationModalInterno formData={dataFormulario} selectedTurno={turnoSeleccionado} ordenTurno={ordenTurno} consultorio={consultorio} profesional={profesional?.[0]} />} />
            <Route path="/micuenta/panelturnos/:consultorioId/:profesionalId" element={<TurnList enviarTurnoYOrden={recibirTurnoYOrden} />} />
            <Route path="/micuenta/panelturnos-centromedico/:consultorioId/:profesionalId" element={<TurnListCentroMedico enviarTurnoYOrden={recibirTurnoYOrden} />} />
            <Route path="/micuenta/generarturnos/:consultorioId/:profesionalId" element={<GenerarTurnosModal />} />
            <Route path="/codigosdisponibles" element={<PlantillaCodigosActivacion />} />
            <Route path="/micuenta/datosconsultorio/:consultorioId/:perfilId" element={<ConsultorioSettingsModal password={pass} />} />
            <Route path="/micuenta/gestioncoberturas/:consultorioId" element={<GestionCoberturas />} />
            <Route path="/micuenta/gestionprofesionales/:consultorioId" element={<GestionProfesionales />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/admin" element={<PanelAdmin />} />
          </Routes>
        </main>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
         key="app-toast"
        style={{zIndex: 999999}}
      />
    </BrowserRouter>
  );
};

export default App;