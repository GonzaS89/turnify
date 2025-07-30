import { useState, useEffect } from "react";
import Hero from "./Hero";
import Steps from "./Steps";
import Benefits from "./Benefits";
import FAQS from "./FAQS";
import Testimonials from "./Testimonials";
import { Header } from "../Header";
import UserFormModal from "./components/UserFormModal";
import ConfirmationModal from "./components/ConfirmationModal";
import Separator from "./components/Separator";
import TurnSelectModal from "./components/TurnSelectModal";
// Importamos los custom hooks necesarios   

import useProfesionalxId from "../../customHooks/useProfesionalxId";
import useProfessionalConsultorios from '../../customHooks/useProfessionalConsultorios';
import useCoberturaxIdConsultorio from '../../customHooks/useCoberturaxIdConsultorio';

const Main = ({ openLogin }) => {
  const [idProfesional, setIdProfesional] = useState(null); // ID del profesional
  const [selectedTurno, setSelectedTurno] = useState(null); // Turno seleccionado para la reserva
  const [ordenTurno, setOrdenTurno] = useState(null); // Índice del turno seleccionado para la reserva

  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false); // Estado para mostrar el modal de turnos

  // NUEVOS ESTADOS para el modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userFormData, setUserFormData] = useState(null); // Almacena los datos del formulario de usuario temporalmente


  // DECLARACION DE FUNCIONES

  const recibirTurnoYOrden = (turno, orden) => {
    setSelectedTurno(turno); // Actualiza el turno seleccionado
    setOrdenTurno(orden); // Actualiza el índice del turno seleccionado
    setShowUserFormModal(true); // Abre el modal de formulario de usuario
    console.log("Turno recibido:", turno, "Orden:", orden);
  };

  const cerrarModalTurnos = () => {
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

  const { coberturas } = useCoberturaxIdConsultorio(consultorio?.id);



  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <Header openLogin={openLogin} />
      <Hero enviarIds={recibirIds} />

      <Steps />
      <hr className="my-16 border-gray-200 border-t-2" />
      <Benefits />
      <hr className="my-16 border-gray-200 border-t-2" />
      <Testimonials />
      <hr className="my-16 border-gray-200 border-t-2" />
      <FAQS />
      <hr className="my-16 border-gray-200 border-t-2" />
    

      {showModalTurnos && !showUserFormModal && !showConfirmationModal && (
        <TurnSelectModal
          consultorio={consultorio} // Pasamos el consultorio para mostrar su información
          idProfesional={idProfesional} // Pasamos el ID del profesional
          enviarTurnoYOrden={recibirTurnoYOrden} // Pasamos la función para recibir el turno y orden
          cerrarModalTurnos={cerrarModalTurnos} // Pasamos la función para cerrar el modal
        />
      )}

      {/* Modal de Formulario de Usuario */}
      {showUserFormModal && (
        <UserFormModal
          isOpen={showUserFormModal}
          onClose={handleCloseUserFormModal}
          onSubmit={handleUserFormSubmit}
          coberturas={coberturas} // Asegúrate de pasar las coberturas aquí
        />
      )}

      {/* Nuevo Modal de Confirmación */}
      {showConfirmationModal && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={cerrarModalTurnos} // Cierra todos los modales si se cancela desde aquí
          onConfirm={handleConfirmBooking}
          onEdit={handleEditBooking}
          profesional={prof} // Pasamos el profesional para mostrar su nombre
          consultorio={consultorio} // Pasamos el consultorio para mostrar su información
          formData={userFormData}
          coberturasOptions={coberturas} // Pasamos las opciones de cobertura para mostrar el nombre completo
          selectedTurno={selectedTurno} // Pasamos el turno para mostrarlo en la confirmación
          ordenTurno={ordenTurno} // Pasamos el índice del turno seleccionado para mostrarlo en la confirmación
        />
      )}


    </main>
  );
};

export default Main;
