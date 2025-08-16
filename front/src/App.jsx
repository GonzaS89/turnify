// src/App.js
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useProfesionalxId from "../customHooks/useProfesionalxId";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// Componentes
import UserDashboard from "./Layouts/UserDashboard";
import Login from "./Layouts/Login";
import Main from "./Layouts/Main";
import CrearConsultorio from "./Layouts/CrearConsultorio";
import CrearProfesional from "./Layouts/CrearProfesionalModal";
import CancelarTurno from "./Layouts/CancelarTurno";
import SearchModal from "./Layouts/components/SearchModal";
import TurnSelectModal from "./Layouts/components/TurnSelectModal";
import UserFormModal from "./Layouts/components/UserFormModal";
import ConfirmationModal from "./Layouts/components/ConfirmationModal";
import ConfirmationModalInterno from "./Layouts/components/ConfirmationModalInterno";
import UserFormModalInterno from "./Layouts/components/UserFormModalInterno";
import TurnList from "./Layouts/TurnList";
import GenerarTurnosModal from "./Layouts/components/GenerarTurnosModal";
import PlantillaCodigosActivacion from "./Layouts/PlantillaCodigosActivacion";
import ConsultorioSettingsModal from "./Layouts/components/ConsultorioSettingsModal";
import GestionCoberturas from "./Layouts/components/GestionCoberturas";
import GestionProfesionales from "./Layouts/components/GestionProfesionales";
import TurnListCentroMedico from "./Layouts/TurnListCentroMedico";

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




  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen 
                     bg-gradient-to-r from-cyan-200 to-violet-200
                     dark:from-gray-900 dark:to-gray-800
                     rounded-xl shadow relative
                     transition-colors duration-700 ease-in-out"
                     style={{
        // Fondo: degradado suave + patrón de ondas tenue (base64)
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230ea5e9' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/svg%3E"),
          linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #ffffff 100%)
        `,
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
      />



        <main className="relative flex-grow">
          <Routes>
            <Route path="/" element={<Main openLogin={openLogin} />} />
            <Route path="/micuenta" element={<UserDashboard enviarPass={recibirPass} />} />
            <Route path="/crearconsultorio/:codigo" element={<CrearConsultorio handleCrearConsultorio={() => setOpenLoginModal(true)} />} />
            <Route path="/crearprofesional" element={<CrearProfesional />} />
            <Route path="/cancelar-turno/:turnoId" element={<CancelarTurno />} />
            <Route path="/buscarprofesionales" element={<SearchModal enviarIds={recibirIds} />} />
            <Route path="/seleccionfecha/:consultorioId/:profesionalId" element={<TurnSelectModal consultorio={consultorio} idProfesional={idProfesional} enviarTurnoYOrden={recibirTurnoYOrden} />} />
            <Route path="/formulario-usuario/:consultorioId/:profesionalId" element={<UserFormModal onSubmit={recibirDataFormulario} />} />
            <Route path="/confirmacionturno/:consultorioId/:profesionalId" element={<ConfirmationModal formData={dataFormulario} selectedTurno={turnoSeleccionado} ordenTurno={ordenTurno} consultorio={consultorio} profesional={profesional?.[0]} />} />
            <Route path="/micuenta/formulario-usuario/:consultorioId/:profesionalId" element={<UserFormModalInterno onSubmit={recibirDataFormulario} />} />
            <Route path="/micuenta/confirmacionturno/:consultorioId/:profesionalId" element={<ConfirmationModalInterno formData={dataFormulario} selectedTurno={turnoSeleccionado} ordenTurno={ordenTurno} consultorio={consultorio} profesional={profesional?.[0]} />} />
            <Route path="/micuenta/panelturnos/:consultorioId/:profesionalId" element={<TurnList enviarTurnoYOrden={recibirTurnoYOrden} />} />
            <Route path="/micuenta/panelturnos-centromedico/:consultorioId/:profesionalId" element={<TurnListCentroMedico enviarTurnoYOrden={recibirTurnoYOrden} />} />
            <Route path="/micuenta/generarturnos/:consultorioId/:profesionalId" element={<GenerarTurnosModal />} />
            <Route path="/codigosdisponibles" element={<PlantillaCodigosActivacion />} />
            <Route path="/micuenta/datosconsultorio/:consultorioId" element={<ConsultorioSettingsModal password={pass} />} />
            <Route path="/micuenta/gestioncoberturas/:consultorioId" element={<GestionCoberturas />} />
            <Route path="/micuenta/gestionprofesionales/:consultorioId" element={<GestionProfesionales />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;