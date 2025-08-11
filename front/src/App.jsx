import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useProfesionalxId from "../customHooks/useProfesionalxId";

// Componentes
import UserDashboard from "./Layouts/UserDashboard";
import { Footer } from "./Footer";
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


const App = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [idProfesional, setIdProfesional] = useState(null); // ID del profesional
  const [consultorio, setConsultorio] = useState(null); // Estado para almacenar el consultorio seleccionado
  const [dataFormulario, setDataFormulario] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [ordenTurno, setOrdenTurno] = useState(null);

  const { profesional, isLoading, error } = useProfesionalxId(idProfesional);


  const closeLogin = () => setOpenLoginModal(false);
  const openLogin = (value = true) => setOpenLoginModal(value);
  const recibirPass = (pass) => setPassword(pass);

  const recibirIds = (idProfesional, consultorio) => {
    setIdProfesional(idProfesional); // Actualiza el ID del profesional
    setConsultorio(consultorio);
  };

  const recibirTurnoYOrden = (turno, orden) => {
    console.log(turnoSeleccionado)
    setTurnoSeleccionado(turno); // Actualiza el turno seleccionado
    setOrdenTurno(orden); // Actualiza el índice del turno seleccionado
  };

  const recibirDataFormulario = data => {
    setDataFormulario(data)
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">

          {/* Modal de Login con glassmorphism */}
          {openLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={closeLogin}
              ></div>
              
                <Login closeLogin={closeLogin} enviarPassword={recibirPass} />
          
            </div>
          )}

          {/* Contenido principal */}
          <main className="relative flex-grow">
            <Routes>
              <Route path="/" element={<Main openLogin={openLogin} />} />

              <Route
                path="/micuenta"
                element={<UserDashboard />}
              />

              <Route path="/crearconsultorio/:codigoValidacion" element={<CrearConsultorio />} />
              <Route path="/crearprofesional" element={<CrearProfesional />} />
              <Route path="/cancelar-turno/:turnoId" element={<CancelarTurno />} />
              <Route path="/buscarprofesionales" element={<SearchModal enviarIds={recibirIds}/>}/>
              <Route path="/seleccionfecha/:consultorioId/:profesionalId" element={<TurnSelectModal consultorio={consultorio} idProfesional={idProfesional} enviarTurnoYOrden={recibirTurnoYOrden}/>}/>
              <Route path="/formulario-usuario/:consultorioId/:profesionalId" element={<UserFormModal onSubmit={recibirDataFormulario}/>}/>
              <Route path="/confirmacionturno/:consultorioId/:profesionalId" element={<ConfirmationModal formData={dataFormulario} selectedTurno={turnoSeleccionado} ordenTurno={ordenTurno}/>} consultorio={consultorio} profesional={profesional[0]}/>
              <Route path="/micuenta/formulario-usuario/:consultorioId/:profesionalId" element={<UserFormModalInterno onSubmit={recibirDataFormulario}/>}/>
              <Route path="/micuenta/confirmacionturno/:consultorioId/:profesionalId" element={<ConfirmationModalInterno formData={dataFormulario} selectedTurno={turnoSeleccionado} ordenTurno={ordenTurno}/>} consultorio={consultorio} profesional={profesional[0]}/>
              <Route path="/micuenta/panelturnos/:consultorioId/:profesionalId" element={<TurnList enviarTurnoYOrden={recibirTurnoYOrden}/>}/>
              <Route path="/micuenta/generarturnos/:consultorioId/:profesionalId" element={<GenerarTurnosModal />}/>
 
            </Routes>
          </main>

          {/* <Footer /> */}
  
      </div>
    </BrowserRouter>
  );
};

export default App;