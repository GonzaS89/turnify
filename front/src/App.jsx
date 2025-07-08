import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import Hero from './Layouts/Hero';
import Steps from './Layouts/Steps';
import Benefits from './Layouts/Benefits';
import FAQS from './Layouts/FAQS';
import Testimonials from './Layouts/Testimonials';
import UserFormModal from './Layouts/components/UserFormModal';
import ConfirmationModal from './Layouts/components/ConfirmationModal'
import Separator from './Layouts/components/Separator';
import TurnSelectModal from './Layouts/components/TurnSelectModal';


// IMPORTACION DE CUSTOM HOOKS

import useConsultorioxId from '../customHooks/useConsultorioxId';
import useProfesionalxId from '../customHooks/useProfesionalxId';
import useCoberturaxIdConsultorio from '../customHooks/useCoberturaxIdConsultorio';

// Componente principal de la aplicación
const App = () => {

    // DECLARACIÓN DE ESTADOS
    const [idConsultorio, setIdConsultorio] = useState(null); // ID
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
        setOrdenTurno(orden);   // Actualiza el índice del turno seleccionado
        setShowUserFormModal(true); // Abre el modal de formulario de usuario
        console.log("Turno recibido:", turno, "Orden:", orden);
    }

    const recibirIds = (idConsultorio, idProfesional) => {
        setIdConsultorio(idConsultorio); // Actualiza el ID del consultorio
        setIdProfesional(idProfesional); // Actualiza el ID del profesional
        console.log("IDs recibidos:", idConsultorio, idProfesional);
    }

    // CARGA DE CUSTOM HOOKS

    const { consultorio } = useConsultorioxId(idConsultorio);
    const { profesional } = useProfesionalxId(idProfesional);
    const { coberturas } = useCoberturaxIdConsultorio(idConsultorio);

    const prof = profesional[0];
    const consult = consultorio[0];
    



    // Estados para el modal de formulario de usuario

   

    useEffect(() => {
        // Si hay un consultorio seleccionado, mostramos el modal de turnos
        if (idConsultorio) {
            setShowModalTurnos(true);
        } else {
            setShowModalTurnos(false);
        }
    }, [idConsultorio]);

    const cerrarModalTurnos = () => {
        setShowModalTurnos(false);
        setIdConsultorio(null); // Limpia el ID del consultorio al cerrar el modal
        setIdProfesional(null); // Limpia el ID del profesional al cerrar el modal
        setSelectedTurno(null); // Asegura que se limpie el turno seleccionado
        setShowUserFormModal(false); // Asegura que el modal de formulario también se cierre si está abierto
        setShowConfirmationModal(false); // Asegura que el modal de confirmación también se cierre
        setUserFormData(null); // Limpia los datos del formulario de usuario
    }

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
        console.log('¡Reserva Confirmada!');
        console.log('Datos del usuario:', userFormData);
        console.log('Turno a reservar:', selectedTurnoForBooking);       
    };

    const handleEditBooking = () => {
        setShowConfirmationModal(false); // Cierra el modal de confirmación
        setShowUserFormModal(true); // Reabre el formulario de usuario para editar
    };


    // Función para formatear fechas (ya existente)
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 font-sans text-gray-800">
            <Header />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 mt-8">

                <Hero enviarIds={recibirIds} />
                <hr className="my-16 border-gray-200 border-t-2" />
                <Steps />
                <hr className="my-16 border-gray-200 border-t-2" />
                <Benefits />
                <hr className="my-16 border-gray-200 border-t-2" />
                <Testimonials />
                <hr className="my-16 border-gray-200 border-t-2" />
                <FAQS />
                <hr className="my-16 border-gray-200 border-t-2" />
                <Separator />

                {showModalTurnos && !showUserFormModal && !showConfirmationModal && (
                    <TurnSelectModal
                        consultorio={consult}
                        idConsultorio={idConsultorio}
                        idProfesional={idProfesional}
                        enviarTurnoYOrden={recibirTurnoYOrden}
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
                        consultorio={consult} // Pasamos el consultorio para mostrar su información
                        formData={userFormData}
                        coberturasOptions={coberturas} // Pasamos las opciones de cobertura para mostrar el nombre completo
                        selectedTurno={selectedTurno} // Pasamos el turno para mostrarlo en la confirmación
                        ordenTurno={ordenTurno} // Pasamos el índice del turno seleccionado para mostrarlo en la confirmación
                    />
                )}

            </main>

            <Footer />
        </div>
    );
};

export default App;
