import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import Steps from './Layouts/Steps';
import Benefits from './Layouts/Benefits';
import FAQS from './Layouts/FAQS';
import Testimonials from './Layouts/Testimonials';
import ConsultorioInfo from './Layouts/components/ConsultorioInfo';
import UserFormModal from './Layouts/components/UserFormModal';
import ConfirmationModal from './Layouts/components/ConfirmationModal'; // Importa el nuevo modal de confirmación

// IMPORTACION DE ICONOS //
import { PiCalendarCheckBold, PiCalendarXBold } from "react-icons/pi";

// IMPORTACION DE CUSTOM HOOKS
import useAllProfesionals from '../customHooks/useAllProfesionals';
import useProfessionalConsultorioTurnos from '../customHooks/useProfessionalConsultorioTurnos';
import useConsultorioxId from '../customHooks/useConsultorioxId';
import useProfesionalxId from '../customHooks/useProfesionalxId';
import useCoberturaxIdConsultorio from '../customHooks/useCoberturaxIdConsultorio';

// Componente principal de la aplicación
const App = () => {
    const [idConsultorio, setIdConsultorio] = useState(null);
    const recibirIdConsultorio = (id) => {
        setIdConsultorio(id);
    };

    const [idProfesional, setIdProfesional] = useState(null);
    const recibirIdProfesional = (id) => {
        setIdProfesional(id);
    }

    // CARGA DE CUSTOM HOOKS
    const { profesionales, isLoading, error } = useAllProfesionals();
    const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(idProfesional, idConsultorio);
    const { consultorio, isLoading: isLoadingConsultorio, error: errorConsultorio } = useConsultorioxId(idConsultorio);
    const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(idProfesional);
    const { coberturas, isLoading: isLoadingCoberturas, error: errorCoberturas } = useCoberturaxIdConsultorio(idConsultorio);

    const prof = profesional[0];
    const consult = consultorio[0];

    // console.log(prof); // Mantener para depuración si es necesario
    // console.log(coberturas); // Mantener para depuración si es necesario
    // console.log(consult); // Mantener para depuración si es necesario

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


    // Estado para la lista filtrada de doctores (búsqueda principal)
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    // Estados para los inputs del formulario de búsqueda principal
    const [specialty, setSpecialty] = useState('');
    const [date, setDate] = useState(''); // Fecha para la búsqueda principal

    const [message, setMessage] = useState(''); // Mensajes de usuario (éxito/error)

    // useEffect para inicializar filteredDoctors y para la búsqueda principal
    useEffect(() => {
        // Solo actualizamos filteredDoctors una vez que 'profesionales' tenga datos
        if (profesionales && profesionales.length > 0) {
            let currentFilteredDoctors = profesionales;

            if (specialty) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.especialidad === specialty);
            }
            setFilteredDoctors(currentFilteredDoctors);
        } else if (!isLoading && !error) {
            setFilteredDoctors([]);
        }
    }, [specialty, profesionales, isLoading, error]); // Dependencias: profesionales para re-renderizar cuando los datos llegan

    const handleSearch = (e) => {
        e.preventDefault();
        setMessage("Búsqueda actualizada.");
        setTimeout(() => setMessage(''), 2000);
        const resultsSection = document.getElementById('resultados-busqueda');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
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
                {/* Sección Hero */}
                <section id="hero-section" className="
                    bg-gradient-to-r from-blue-500 to-purple-600
                    text-center py-16 sm:py-24 rounded-3xl shadow-xl px-4 mb-16
                    relative overflow-hidden
                ">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-24 -translate-y-24"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-16 translate-y-16"></div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                        Reserva tu turno médico de forma <span className="text-blue-200">rápida y sencilla</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-12 drop-shadow-sm">
                        Encuentra la especialidad y el profesional que necesitas, y agenda tu cita en segundos.
                    </p>

                    <form onSubmit={handleSearch} className="
                        flex flex-col md:flex-row justify-center items-end gap-4 md:gap-6
                        bg-white bg-opacity-90 p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto
                        transform translate-y-16 relative z-10 mb-24 md:mb-0
                    ">
                        <div className="flex flex-col items-start w-full md:w-1/3">
                            <label htmlFor="specialty" className="text-base font-semibold text-gray-700 mb-2">Especialidad</label>
                            <select
                                id="specialty"
                                name="specialty"
                                className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                            >
                                <option value="">Todas las especialidades</option>
                                {/* Obtener especialidades únicas de todos los doctores */}
                                {[...new Set(profesionales?.map(doc => doc.especialidad))].sort().map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col items-start w-full md:w-1/3">
                            <label htmlFor="date" className="block text-base font-semibold text-gray-700 mb-2">Fecha (opcional)</label>
                            <input
                                type="date"
                                id="date"
                                className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="
                            w-full md:w-auto px-8 py-3
                            bg-green-500 text-white rounded-lg font-bold text-lg
                            hover:bg-green-600 transition-all duration-300 transform hover:scale-105
                            shadow-md hover:shadow-lg
                        ">
                            Buscar médicos
                        </button>
                    </form>
                </section>

                {/* Sección de Resultados de Búsqueda: Solo para doctores ahora */}
                <section id="resultados-busqueda" className="mt-28 mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
                        Médicos Disponibles
                    </h2>

                    {message && (
                        <div className={`p-4 mb-8 rounded-lg text-white text-center font-semibold transition-all duration-300 ${message.includes('éxito') ? 'bg-green-500 shadow-md' : 'bg-red-500 shadow-md'}`}>
                            {message}
                        </div>
                    )}

                    {/* Muestra mensajes de carga, error o si no hay médicos */}
                    {isLoading && (
                        <p className="text-center text-blue-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-blue-100">Cargando profesionales...</p>
                    )}

                    {error && (
                        <p className="text-center text-red-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-red-100">Error: {error.message || "No se pudo cargar la información de los profesionales."}</p>
                    )}

                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDoctors?.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <div key={doctor.id} className="
                                        bg-white rounded-2xl shadow-xl p-6 border border-gray-100
                                        transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-300
                                        group flex flex-col justify-between h-full
                                    ">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                                            <img
                                                src={`https://placehold.co/96x96/007bff/ffffff?text=${doctor.name?.split(' ').map(n => n[0]).join('') || 'MD'}`}
                                                alt={`Foto de ${doctor.name || 'Médico'}`}
                                                className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-4 border-blue-400 group-hover:border-purple-400 transition-colors duration-300"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/000000?text=MD"; }}
                                            />
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">Dr. {doctor.apellido}, {doctor.nombre}</h3>
                                                <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.especialidad}</p>

                                            </div>

                                        </div>

                                        <p className="text-gray-700 mb-6 text-base leading-relaxed">{doctor.bio}</p>
                                        <ConsultorioInfo professionalId={doctor.id} enviarIdConsultorio={recibirIdConsultorio} enviarIdProfesional={recibirIdProfesional} />

                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-gray-100">
                                    No se encontraron médicos con los criterios de búsqueda. Por favor, intenta con otra especialidad, nombre o fecha.
                                </p>
                            )}
                        </div>
                    )}
                </section>

                <hr className="my-16 border-gray-200 border-t-2" />
                <Steps />
                <hr className="my-16 border-gray-200 border-t-2" />
                <Benefits />
                <hr className="my-16 border-gray-200 border-t-2" />
                <Testimonials />
                <hr className="my-16 border-gray-200 border-t-2" />
                <FAQS />
                <hr className="my-16 border-gray-200 border-t-2" />

                {/* Sección de Llamada a la Acción (CTA) */}
                <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-24 translate-y-24"></div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                        ¿Listo para reservar tu próximo turno?
                    </h2>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 drop-shadow-sm">
                        Únete a miles de personas que ya disfrutan de la comodidad de agendar sus citas médicas en un solo lugar.
                    </p>
                    <button className="
                        px-12 py-5 bg-white text-blue-700 font-bold text-xl rounded-full
                        hover:bg-blue-100 transition-all duration-300 transform hover:scale-105
                        shadow-lg hover:shadow-xl
                    ">
                        ¡Encuentra tu médico ahora!
                    </button>
                </section>

                {/* MODAL DE ELECCION DE TURNOS */}
                {/* Solo se muestra si showModalTurnos es true, y los otros modales están cerrados */}
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
