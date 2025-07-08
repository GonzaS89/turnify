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

// IMPORTACION DE ICONOS //
import { PiCalendarCheckBold, PiCalendarXBold } from "react-icons/pi";

// IMPORTACION DE CUSTOM HOOKS

import useProfessionalConsultorioTurnos from '../customHooks/useProfessionalConsultorioTurnos';
import useConsultorioxId from '../customHooks/useConsultorioxId';
import useProfesionalxId from '../customHooks/useProfesionalxId';
import useCoberturaxIdConsultorio from '../customHooks/useCoberturaxIdConsultorio';

// Componente principal de la aplicación
const App = () => {
    
    // ESTADOS PARA ID DE PROFESIONAL Y CONSULTORIO
    const [idConsultorio, setIdConsultorio] = useState(null); // ID
    const [idProfesional, setIdProfesional] = useState(null); // ID del profesional

    const recibirIds = (idConsultorio, idProfesional) => {
        setIdConsultorio(idConsultorio);
        setIdProfesional(idProfesional);
        console.log("IDs recibidos:", idConsultorio, idProfesional);
    }

    // CARGA DE CUSTOM HOOKS
   
    const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(idProfesional, idConsultorio);
    const { consultorio, isLoading: isLoadingConsultorio, error: errorConsultorio } = useConsultorioxId(idConsultorio);
    const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(idProfesional);
    const { coberturas, isLoading: isLoadingCoberturas, error: errorCoberturas } = useCoberturaxIdConsultorio(idConsultorio);

    const prof = profesional[0];
    const consult = consultorio[0];

    const [fechaSeleccionada, setFechaSeleccionada] = useState(''); // Fecha seleccionada para ver turnos

    const handleFechaChange = (event) => {
        setFechaSeleccionada(event.target.value);
        console.log("Fecha seleccionada:", event.target.value);
    };

    const turnosFiltrados =
        fechaSeleccionada ? turnos.filter(turno => turno.fecha === fechaSeleccionada)
            : turnos;

    const [showModalTurnos, setShowModalTurnos] = useState(false); // Estado para mostrar el modal de turnos

    // Estados para el modal de formulario de usuario
    const [showUserFormModal, setShowUserFormModal] = useState(false);
    const [selectedTurnoForBooking, setSelectedTurnoForBooking] = useState(null); // Almacena el turno seleccionado para el formulario

    // NUEVOS ESTADOS para el modal de confirmación
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [userFormData, setUserFormData] = useState(null); // Almacena los datos del formulario de usuario temporalmente

    useEffect(() => {
        // Si hay un consultorio seleccionado, mostramos el modal de turnos
        if (idConsultorio) {
            setShowModalTurnos(true);
        } else {
            setShowModalTurnos(false);
        }
    }, [idConsultorio]);

    const [ordenTurno, setOrdenTurno] = useState(''); // Estado para ordenar los turnos

    const cerrarModalTurnos = () => {
        setShowModalTurnos(false);
        setFechaSeleccionada(''); // Limpia la fecha seleccionada al cerrar el modal
        setIdConsultorio(null); // Limpia el ID del consultorio al cerrar el modal
        setIdProfesional(null); // Limpia el ID del profesional al cerrar el modal
        setSelectedTurnoForBooking(null); // Asegura que se limpie el turno seleccionado
        setShowUserFormModal(false); // Asegura que el modal de formulario también se cierre si está abierto
        setShowConfirmationModal(false); // Asegura que el modal de confirmación también se cierre
        setUserFormData(null); // Limpia los datos del formulario de usuario
    }

    // Función para manejar la selección de un turno y abrir el formulario de usuario
    const handleSelectTurno = (turno, index) => {
        setSelectedTurnoForBooking(turno);
        setShowUserFormModal(true);
        setOrdenTurno(index+1)
        // No cerramos showModalTurnos aquí, ya que el UserFormModal se superpondrá
    };

    // Funciones para el modal de formulario de usuario
    const handleCloseUserFormModal = () => {
        setShowUserFormModal(false);
        setSelectedTurnoForBooking(null); // Limpia el turno seleccionado cuando se cierra el formulario
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
        // TODO: Aquí es donde harías la llamada FINAL a tu backend para guardar la reserva
        // Por ejemplo: axios.post('/api/confirmar-reserva', { ...userFormData, turnoId: selectedTurnoForBooking.id });

        // Después de enviar, puedes mostrar un mensaje de éxito y cerrar el modal
        alert('¡Turno reservado con éxito!'); // Considera reemplazar esto con un modal de éxito más elegante
        cerrarModalTurnos(); // Cierra todos los modales
    };

    const handleEditBooking = () => {
        setShowConfirmationModal(false); // Cierra el modal de confirmación
        setShowUserFormModal(true); // Reabre el formulario de usuario para editar
    };
   

    // Función para formatear fechas (ya existente)
    const fechasUnicas = [...new Set(turnos.map(turno => turno.fecha))];
    const formatearFechaSQL = (fecha) => {
        const date = new Date(fecha);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 font-sans text-gray-800">
            <Header />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 mt-8">
                
                <Hero enviarIds=  {recibirIds}/>
                

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
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6">
                        <div className={`bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl flex-col gap-6`}>
                            {/* Información del Consultorio - Nueva Sección */}
                            {consult && (
                                <div className="text-center pb-4 border-b border-gray-200">
                                    <p className="text-xl sm:text-2xl font-extrabold text-blue-700">
                                        {consult.tipo === 'propio' ? 'Consultorio particular' : `Centro médico ${consult.nombre}`}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                                        {consult.direccion || 'Dirección no disponible'}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                                        {consult.localidad || 'Dirección no disponible'}
                                    </p>
                                </div>
                            )}
                            {/* Fin de la Nueva Sección */}

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2">Elegí una fecha</h2>

                            {isLoadingTurnos ? (
                                <p className="text-blue-600 text-base sm:text-lg text-center font-medium animate-pulse">Cargando turnos...</p>
                            ) : errorTurnos ? (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm sm:text-base">
                                    <p className="font-semibold">Error al cargar los turnos:</p>
                                    <p>{errorTurnos.message}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <select
                                            name="fecha"
                                            id="fecha-select"
                                            onChange={handleFechaChange}
                                            className="block w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer pr-10"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Selecciona una fecha disponible</option>
                                            {fechasUnicas.map((fecha, index) => (
                                                <option key={index} value={fecha}>
                                                    {formatearFechaSQL(fecha)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            )}

                            {fechaSeleccionada && (
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 text-center mt-2 sm:mt-4 border-b pb-2">
                                    Turnos para el {formatearFechaSQL(fechaSeleccionada)}
                                </h3>
                            )}

                            <div className="flex-grow overflow-y-auto max-h-[250px] sm:max-h-[350px] pr-2">
                                {fechaSeleccionada ? (
                                    turnosFiltrados.length > 0 ? (
                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 justify-items-center mt-4">
                                            {turnosFiltrados.map((turno, index) => (
                                                <div key={turno.id} className="w-full flex justify-center">
                                                    <button
                                                        onClick={() => handleSelectTurno(turno,index)} // Llama a la nueva función
                                                        className={`flex flex-col items-center p-3 sm:p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out w-full
                                                        ${turno.estado === 'disponible'
                                                                ? 'bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 cursor-pointer transform hover:scale-105'
                                                                : 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                                                            }`}
                                                        disabled={turno.estado !== 'disponible'}
                                                    >
                                                        {turno.estado === 'disponible' ? (
                                                            <PiCalendarCheckBold className="text-5xl sm:text-6xl text-green-600 mb-1 sm:mb-2" />
                                                        ) : (
                                                            <PiCalendarXBold className="text-5xl sm:text-6xl text-gray-500 mb-1 sm:mb-2" />
                                                        )}
                                                        <p className="text-base sm:text-lg font-bold">Turno #{index + 1}</p>
                                                        <p className={`text-xs sm:text-sm ${turno.estado === 'disponible' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                                                            {turno.estado === 'disponible' ? 'Disponible' : 'Reservado'}
                                                        </p>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-base sm:text-lg text-center mt-6 sm:mt-8">
                                            No hay turnos disponibles para esta fecha. ¡Intentá con otra!
                                        </p>
                                    )
                                ) : (
                                    <p className="text-gray-600 text-base sm:text-lg text-center mt-6 sm:mt-8">
                                        Por favor, selecciona una fecha para ver los turnos disponibles.
                                    </p>
                                )}
                            </div>

                            {fechaSeleccionada && (
                                <p className="text-xs sm:text-sm text-yellow-800 text-center mt-4 sm:mt-6 p-2 sm:p-3 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm mx-auto max-w-xs sm:max-w-md">
                                    <span className="font-bold">¡Importante! Horario de atención:</span> Los turnos se llevan a cabo entre {consult?.inicio} y {consult?.cierre} hs.
                                    <br />
                                    <span className="block mt-1 italic text-2xs sm:text-xs text-yellow-700">
                                        (Tiempo estimado por turno: 20 minutos, sujeto a cambios.)
                                    </span>
                                </p>
                            )}

                            <button
                                onClick={() => cerrarModalTurnos()}
                                className="mt-4 sm:mt-6 w-full py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-base sm:text-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
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
                        selectedTurno={selectedTurnoForBooking} // Pasamos el turno para mostrarlo en la confirmación
                        ordenTurno={ordenTurno} // Pasamos el índice del turno seleccionado para mostrarlo en la confirmación
                    />
                )}

            </main>

            <Footer />
        </div>
    );
};

export default App;
