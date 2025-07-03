import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import Steps from './Layouts/Steps';
import Benefits from './Layouts/Benefits';
import FAQS from './Layouts/FAQS';
import Testimonials from './Layouts/Testimonials';
import ConsultorioInfo from './Layouts/components/ConsultorioInfo';

// IMPORTACION DE CUSTOM HOOKS
import useAllProfesionals from '../customHooks/useAllProfesionals';
import useProfessionalConsultorioTurnos from '../customHooks/useProfessionalConsultorioTurnos';
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

    console.log(turnos)

    const [fechaSeleccionada, setFechaSeleccionada] = useState(''); // Fecha seleccionada para ver turnos   

    const handleFechaChange = (event) => {
        setFechaSeleccionada(event.target.value);
        console.log("Fecha seleccionada:", event.target.value);
      };

     const turnosFiltrados = 
     fechaSeleccionada ? turnos.filter(turno => turno.fecha === fechaSeleccionada)
        : turnos;  

        console.log(turnosFiltrados)

    // Estado para la lista filtrada de doctores (búsqueda principal)
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    // Estados para los inputs del formulario de búsqueda principal
    const [specialty, setSpecialty] = useState('');
    const [date, setDate] = useState(''); // Fecha para la búsqueda principal

    // Estados para el Modal REUTILIZABLE de "Reservar/Ver Turnos"
    const [selectedDoctorForSlots, setSelectedDoctorForSlots] = useState(null); // El doctor cuyos turnos estamos viendo
 // Turnos para el doctor seleccionado, filtrados por fecha
    const [bookingDateFilter, setBookingDateFilter] = useState(''); // Filtro de fecha dentro del modal de turnos

    const [message, setMessage] = useState(''); // Mensajes de usuario (éxito/error)

    // useEffect para inicializar filteredDoctors y para la búsqueda principal
    useEffect(() => {
        // Solo actualizamos filteredDoctors una vez que 'profesionales' tenga datos
        if (profesionales && profesionales.length > 0) {
            let currentFilteredDoctors = profesionales;

            if (specialty) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.especialidad === specialty);
            }
            // Si 'date' fuera a filtrar doctores (no turnos), la lógica iría aquí.
            // Actualmente, 'date' solo se usa para la búsqueda inicial en el Hero.

            setFilteredDoctors(currentFilteredDoctors);
        } else if (!isLoading && !error) {
            // Si no hay profesionales y la carga ha terminado sin error, significa que no hay data.
            setFilteredDoctors([]);
        }
    }, [specialty, profesionales, isLoading, error]); // Dependencias: profesionales para re-renderizar cuando los datos llegan

    // useEffect para filtrar turnos *dentro del Modal de Ver Turnos/Reservar*

    const handleSearch = (e) => {
        e.preventDefault();
        setMessage("Búsqueda actualizada.");
        setTimeout(() => setMessage(''), 2000);
        const resultsSection = document.getElementById('resultados-busqueda');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Abre el modal para ver los turnos de un doctor específico
    const openDoctorSlotsModal = (doctor) => {


        setSelectedSlotForBooking(null); // Asegura que no haya un turno pre-seleccionado para el formulario de reserva
        setShowBookingModal(true);
    };

    // Función para seleccionar un turno específico y mostrar el formulario de reserva (dentro del mismo modal)
    const selectSlotAndShowBookingForm = (doctor, slot) => {
        setSelectedAppointment({ doctor, slot }); // Establece los detalles de la cita para la confirmación
        setSelectedSlotForBooking(slot); // Esto activa el renderizado condicional dentro del modal
        setPatientInsurance(''); // Limpia la obra social al seleccionar un turno
    };

    // Función para volver del formulario de reserva a la selección de turnos
    const goBackToSlotSelection = () => {
        setSelectedSlotForBooking(null);
        setSelectedAppointment(null); // También limpia la cita seleccionada al volver
        setPatientName(''); // Limpia los datos del paciente al volver
        setPatientEmail('');
        setPatientPhone('');
        setPatientInsurance(''); // Reinicia la obra social al volver
    };

    const closeBookingModal = () => {
        setShowBookingModal(false);
        setSelectedDoctorForSlots(null);
        setFilteredSlotsForDoctor([]);
        setBookingDateFilter('');
        setSelectedSlotForBooking(null);
        setSelectedAppointment(null); // Asegura que se borre al cerrar completamente el modal
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
        setPatientInsurance(''); // Reinicia la obra social al cerrar
        setMessage('');
    };

    //    function formatearFechaSQL (fecha) {
    //     const date = new Date(fecha);

    //     // Get the day, month, and year in UTC
    //     const day = String(date.getUTCDate()).padStart(2, '0');
    //     const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    //     const year = date.getUTCFullYear();
    //     const formattedDate = `${day}/${month}/${year}`;

    //     return formattedDate;
    //     }   

    const fechasUnicas = [...new Set(turnos.map(turno => turno.fecha))];

    const formatearFechaSQL = (fecha) => {
        const date = new Date(fecha);
        // Obtener el día, mes y año en UTC
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
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
                //MODAL DE ELECCION DE TURNOS //
                {idConsultorio && idProfesional && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl flex flex-col">
                      <h2 className="text-2xl font-bold mb-4">Turnos Disponibles</h2>
                      {isLoadingTurnos ? (
                          <p className="text-blue-600">Cargando turnos...</p>
                      ) : errorTurnos ? (
                          <p className="text-red-600">Error al cargar los turnos: {errorTurnos.message}</p>
                      ) : (
                          <>
                              <select name="" id="" onChange={handleFechaChange} className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                                  <option value="">Selecciona una fecha</option>
                                  {fechasUnicas.map((fecha, index) => (
                                      <option key={index} value={fecha}>{formatearFechaSQL(fecha)}</option>
                                  ))}
                              </select>
              
                          </>
                      )}
              
                      <div>
                          {fechaSeleccionada ? (
                              <div className="mt-4 space-y-4">
                                  {turnosFiltrados.map(turno => (
                                      <div key={turno.id} className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow">
              
                                          <button
                                              onClick={() => selectSlotAndShowBookingForm(turno)}
                                              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                          >
                                              Reservar
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-gray-600">No hay turnos disponibles para esta fecha.</p>
                          )}
                      </div>
                      <button onClick={closeBookingModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                          Cerrar
                      </button>
                  </div>
              </div>
                )}


            </main>

            <Footer />

            {/* Modal de Reservar/Ver Turnos (REUTILIZADO tanto para ver turnos como para confirmar la reserva) */}

        </div>
    );
};

export default App;