import { useState, useEffect } from "react";

// CARGA DE SECCIONES

import Hero from "./Hero";
import Steps from "./Steps";
import Benefits from "./Benefits";
import FAQS from "./FAQS";
// import Testimonials from "./Testimonials";
import { Header } from "./Header";

import {Footer} from './Footer'

// CARGA DE LAYOUTS

import ConfirmationModal from "../consumidor/ConfirmationModal";
import UserFormModal from "../consumidor/UserFormModal";

// CARGA DE HOOK

import useProfesionalxId from "../../customHooks/useProfesionalxId";


const Main = ({ openLogin }) => {
  const [idProfesional, setIdProfesional] = useState(null); // ID del profesional
  const [selectedTurno, setSelectedTurno] = useState(null); // Turno seleccionado para la reserva
  const [ordenTurno, setOrdenTurno] = useState(null); // Índice del turno seleccionado para la reserva

  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false); // Estado para mostrar el modal de turnos

  // NUEVOS ESTADOS para el modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userFormData, setUserFormData] = useState(null); // Almacena los datos del formulario de usuario temporalmente}


  // DECLARACION DE FUNCIONES

  const recibirTurnoYOrden = (turno, orden) => {
    setSelectedTurno(turno); // Actualiza el turno seleccionado
    setOrdenTurno(orden); // Actualiza el índice del turno seleccionado
    setShowUserFormModal(true); // Abre el modal de formulario de usuario

  };

  const [openModalProf, setOpenModalProf] = useState(false); // Estado para controlar la apertura del modal de turnos

  const cerrarModalTurnos = () => {
    setOpenModalProf(false)
    setShowConfirmationModal(false); // Cierra el modal de confirmación si está abierto
    setShowModalTurnos(false); // Cierra el modal de turnos
    setConsultorio(null); // Limpia el ID del consultorio al cerrar el modal
    setIdProfesional(null); // Limpia el ID del profesional al cerrar el modal
    setSelectedTurno(null); // Limpia el turno seleccionado al cerrar el modal
    setOrdenTurno(null); // Limpia el índice del turno seleccionado al cerrar el modal
  };

  const [consultorio, setConsultorio] = useState(null); // Estado para almacenar el consultorio seleccionado

  const recibirIds = (idProfesional, consultorio) => {
    setIdProfesional(idProfesional); // Actualiza el ID del profesional
    setConsultorio(consultorio);
  };

  const actualizarTurnos = () => {
    console.log("Turno reservado")
  }


  // CARGA DE CUSTOM HOOKS

  const { profesional } = useProfesionalxId(idProfesional);


  const prof = profesional[0];

  useEffect(() => {
    idProfesional && setShowModalTurnos(true); // Abre el modal de turnos si hay un ID de consultorio
  }, [idProfesional]);

  // Función para manejar la selección de un turno y abrir el formulario de usuario

  // Funciones para el modal de formulario de usuario
  const handleCloseUserFormModal = () => {
    setShowUserFormModal(false);
    setSelectedTurno(null); // Limpia el turno seleccionado cuando se cierra el formulario
    cerrarModalTurnos(); // Cierra ambos modales para una experiencia limpia
  };

  const handleUserFormSubmit = (formData) => {
    // Aquí no se envía aún, solo se guardan los datos y se abre el modal de confirmación
    setUserFormData(formData); // Guarda los datos del formulario
    setShowUserFormModal(false); // Cierra el formulario de usuario
    setShowConfirmationModal(true); // Abre el modal de confirmación
  };

  // NUEVAS FUNCIONES para el modal de confirmación
  const handleConfirmBooking = () => {
    console.log("¡Reserva Confirmada!");
    console.log("Datos del usuario:", userFormData);
    console.log("Turno a reservar:", selectedTurnoForBooking);
  };

  const handleEditBooking = () => {
    setShowConfirmationModal(false); // Cierra el modal de confirmación
    setShowUserFormModal(true); // Reabre el formulario de usuario para editar
  };

 



 return (
  <>
    <main className="container relative mx-auto">
      <Header openLogin={openLogin} openModalProf={openModalProf}/>
      <Hero enviarIds={recibirIds} />
        <hr className="my-16 border-gray-500 border-t-2" />
      <Steps />
      <hr className="my-16 border-gray-500 border-t-2" />
      <Benefits />
      <hr className="my-16 border-gray-500 border-t-2" />
      {/* <Testimonials />
      <hr className="my-16 border-gray-200 border-t-2" /> */}
      <FAQS />
     
    </main>

    {/* Footer fuera del contenedor, ocupa todo el ancho */}
    <div className="w-full">
      <Footer />
    </div>

    {/* Modales (fuera del flujo principal) */}
    {showUserFormModal && (
      <UserFormModal
        isOpen={showUserFormModal}
        onClose={handleCloseUserFormModal}
        onSubmit={handleUserFormSubmit}
        coberturas={coberturas}
      />
    )}

    {showConfirmationModal && (
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={cerrarModalTurnos}
        onConfirm={handleConfirmBooking}
        onEdit={handleEditBooking}
        profesional={prof}
        consultorio={consultorio}
        formData={userFormData}
        coberturasOptions={coberturas}
        selectedTurno={selectedTurno}
        ordenTurno={ordenTurno}
        actualizarTurnos={actualizarTurnos}
      />
    )}
  </>
);
};

export default Main;
