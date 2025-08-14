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


const App = () => {
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
      {/* ✅ Este div ya no tiene container */}
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-100 to-cyan-200 rounded-xl shadow relative">
        
        {/* Modal de Login */}
        {openLoginModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6  z-[200]">
            <div
              className="absolute inset-0 bg-black/75"
              onClick={closeLogin}
            ></div>
            <Login closeLogin={closeLogin} />
          </div>
        )}

        <ToastContainer position="top-right" autoClose={1000} />

        {/* Contenido principal: ahora Main controla el container */}
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
          </Routes>
        </main>

        {/* Aquí iría el Footer si lo agregas */}
      </div>
    </BrowserRouter>
  );
};

export default App;

