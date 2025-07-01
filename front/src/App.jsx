import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import Steps from './Layouts/Steps';
import Benefits from './Layouts/Benefits';
import FAQS from './Layouts/FAQS';
import Testimonials from './Layouts/Testimonials';

// IMPORTACION DE CUSTOM HOOKS
import useAllProfesionals from '../customHooks/useAllProfesionals';

// Lista dummy de Obras Sociales/Prepagas
const dummyInsurances = [
    "OSDE",
    "Swiss Medical",
    "Galeno",
    "Medifé",
    "Omint",
    "Sancor Salud",
    "Prevención Salud",
    "Accord Salud",
];

// Componente principal de la aplicación
const App = () => {
    // CARGA DE CUSTOM HOOKS
    const { profesionales, isLoading, error } = useAllProfesionals();

    // Estados para la lista filtrada de doctores (búsqueda principal)
    // Inicializamos con un array vacío para evitar errores antes de que los datos carguen
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    // Estados para los inputs del formulario de búsqueda principal
    const [specialty, setSpecialty] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [date, setDate] = useState(''); // Fecha para la búsqueda principal

    // Estados para el Modal REUTILIZABLE de "Reservar/Ver Turnos"
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctorForSlots, setSelectedDoctorForSlots] = useState(null); // El doctor cuyos turnos estamos viendo
    const [filteredSlotsForDoctor, setFilteredSlotsForDoctor] = useState([]); // Turnos para el doctor seleccionado, filtrados por fecha
    const [bookingDateFilter, setBookingDateFilter] = useState(''); // Filtro de fecha dentro del modal de turnos
    const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null); // El turno específico elegido para reservar

    const [selectedAppointment, setSelectedAppointment] = useState(null); // El objeto de la cita para la confirmación

    // Estados para la información del paciente (solo al confirmar la reserva)
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [patientInsurance, setPatientInsurance] = useState('Particular'); // Nuevo estado para obra social, por defecto 'Particular'
    const [message, setMessage] = useState(''); // Mensajes de usuario (éxito/error)

    // useEffect para inicializar filteredDoctors y para la búsqueda principal
    useEffect(() => {
        // Solo actualizamos filteredDoctors una vez que 'profesionales' tenga datos
        if (profesionales && profesionales.length > 0) {
            let currentFilteredDoctors = profesionales;

            if (specialty) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.especialidad === specialty);
            }
            if (doctorName) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc =>
                    doc.name.toLowerCase().includes(doctorName.toLowerCase())
                );
            }
            // Si 'date' fuera a filtrar doctores (no turnos), la lógica iría aquí.
            // Actualmente, 'date' solo se usa para la búsqueda inicial en el Hero.

            setFilteredDoctors(currentFilteredDoctors);
        } else if (!isLoading && !error) {
            // Si no hay profesionales y la carga ha terminado sin error, significa que no hay data.
            setFilteredDoctors([]);
        }
    }, [specialty, doctorName, profesionales, isLoading, error]); // Dependencias: profesionales para re-renderizar cuando los datos llegan

    // useEffect para filtrar turnos *dentro del Modal de Ver Turnos/Reservar*
    useEffect(() => {
        if (selectedDoctorForSlots) {
            let currentSlots = selectedDoctorForSlots.availableSlots;

            // Filtrar por la fecha seleccionada en el modal
            if (bookingDateFilter) {
                currentSlots = currentSlots.filter(slot => slot.date === bookingDateFilter);
            }
            setFilteredSlotsForDoctor(currentSlots);
        }
    }, [selectedDoctorForSlots, bookingDateFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setMessage("Búsqueda actualizada.");
        setTimeout(() => setMessage(''), 2000);
        const resultsSection = document.getElementById('resultados-busqueda');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- Manejadores del Modal de Reservar/Ver Turnos ---
    const openDoctorSlotsModal = (doctor) => {
        setSelectedDoctorForSlots(doctor);
        // Selecciona automáticamente la primera fecha disponible si existe, o la deja vacía
        const uniqueDates = [...new Set(doctor.availableSlots.map(slot => slot.date))].sort();
        if (uniqueDates.length > 0) {
            setBookingDateFilter(uniqueDates[0]); // Establece por defecto la primera fecha disponible
        } else {
            setBookingDateFilter('');
        }

        setSelectedSlotForBooking(null); // Asegura que no haya un turno pre-seleccionado para el formulario de reserva
        setShowBookingModal(true);
    };

    // Función para seleccionar un turno específico y mostrar el formulario de reserva (dentro del mismo modal)
    const selectSlotAndShowBookingForm = (doctor, slot) => {
        setSelectedAppointment({ doctor, slot }); // Establece los detalles de la cita para la confirmación
        setSelectedSlotForBooking(slot); // Esto activa el renderizado condicional dentro del modal
        setPatientInsurance('Particular'); // Establece la obra social por defecto a 'Particular' cuando se selecciona un turno
    };

    // Función para volver del formulario de reserva a la selección de turnos
    const goBackToSlotSelection = () => {
        setSelectedSlotForBooking(null);
        setSelectedAppointment(null); // También limpia la cita seleccionada al volver
        setPatientName(''); // Limpia los datos del paciente al volver
        setPatientEmail('');
        setPatientPhone('');
        setPatientInsurance('Particular'); // Reinicia la obra social al volver
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
        setPatientInsurance('Particular'); // Reinicia la obra social al cerrar
        setMessage('');
    };

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        // Verifica que selectedAppointment tenga propiedades antes de acceder a ellas
        if (!selectedAppointment || !selectedAppointment.doctor || !selectedAppointment.slot) {
            setMessage("Error: Datos de reserva incompletos o no seleccionados.");
            return;
        }

        console.log("Reserva confirmada (simulada):", {
            doctorId: selectedAppointment.doctor.id,
            doctorName: selectedAppointment.doctor.name,
            specialty: selectedAppointment.doctor.specialty,
            appointmentDate: selectedAppointment.slot.date,
            appointmentTime: selectedAppointment.slot.time,
            appointmentLocation: selectedAppointment.slot.location, // Incluye la ubicación específica del turno
            patientName: patientName,
            patientEmail: patientEmail,
            patientPhone: patientPhone,
            patientInsurance: patientInsurance, // Incluye la obra social seleccionada
            timestamp: new Date()
        });

        // --- Aquí iría la integración real con Mercado Pago Checkout Pro ---
        // Esto implicaría hacer una llamada a tu backend para crear la preferencia de pago
        // y luego redirigir al usuario a la URL de Checkout Pro de Mercado Pago.
        // Ejemplo conceptual (NO FUNCIONARÁ SIN UN BACKEND):
        /*
        fetch('/api/create-mercadopago-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctor: selectedAppointment.doctor,
                slot: selectedAppointment.slot,
                patient: { name: patientName, email: patientEmail, phone: patientPhone, insurance: patientInsurance }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.checkoutProUrl) {
                window.location.href = data.checkoutProUrl; // Redirigir al Checkout Pro
            } else {
                setMessage("Error al iniciar el pago. Intenta de nuevo.");
            }
        })
        .catch(error => {
            console.error("Error al crear preferencia de pago:", error);
            setMessage("Error de conexión al procesar el pago.");
        });
        */


        setMessage("¡Tu turno ha sido reservado con éxito!");

        // Simula el cierre del modal después de un tiempo
        setTimeout(() => {
            closeBookingModal();
        }, 2000);
    };

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
                        {/* <div className="flex flex-col items-start w-full md:w-1/3">
                            <label htmlFor="doctor-name" className="block text-base font-semibold text-gray-700 mb-2">Nombre del médico (opcional)</label>
                            <input
                                type="text"
                                id="doctor-name"
                                placeholder="Ej: Dr. Juan Pérez"
                                className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                            />
                        </div> */}
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
                            Buscar Turno
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
                                        group
                                    ">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                                            <img
                                                // Corregido: Agregado ?. y || para manejar doctor.name indefinido
                                                src={`https://placehold.co/96x96/007bff/ffffff?text=${doctor.name?.split(' ').map(n => n[0]).join('') || 'MD'}`}
                                                alt={`Foto de ${doctor.name || 'Médico'}`}
                                                className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-4 border-blue-400 group-hover:border-purple-400 transition-colors duration-300"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/000000?text=MD"; }}
                                            />
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">Dr. {doctor.apellido}, {doctor.nombre}</h3>
                                                <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.especialidad}</p>
                                                {/* Muestra la ubicación del doctor si está definida */}
                                                {doctor.direccion ?
                                                (
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        {doctor.direccion}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500 text-sm mt-1">Ubicación no especificada.</p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-6 text-base leading-relaxed">{doctor.bio}</p>
                                        <div className="mt-4">
                                            <button
                                                onClick={() => openDoctorSlotsModal(doctor)}
                                                className="w-full px-5 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all duration-300 shadow-md"
                                            >
                                                Ver Turnos
                                            </button>
                                        </div>
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
            </main>

            <Footer />

            {/* Modal de Reservar/Ver Turnos (REUTILIZADO tanto para ver turnos como para confirmar la reserva) */}
            {showBookingModal && selectedDoctorForSlots && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="
                        bg-white rounded-2xl shadow-3xl p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg
                        relative my-8
                        opacity-100 transform scale-100 transition-all duration-300 ease-out
                    ">
                        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                {selectedSlotForBooking ? 'Confirmar Reserva' : `Turnos de ${selectedDoctorForSlots.name}`}
                            </h3>
                            <button
                                onClick={closeBookingModal}
                                className="
                                    text-gray-500 hover:text-gray-700 text-4xl leading-none
                                    p-1 rounded-full hover:bg-gray-100 transition-colors duration-200
                                "
                            >
                                &times;
                            </button>
                        </div>

                        {message && (
                            <div className={`p-4 mb-6 rounded-lg text-white text-center font-semibold transition-all duration-300 ${message.includes('éxito') ? 'bg-green-500' : 'bg-red-500'}`}>
                                {message}
                            </div>
                        )}

                        {/* Renderizado condicional: Muestra la selección de turnos o el formulario de reserva */}
                        {!selectedSlotForBooking ? (
                            <>
                                <div className="mb-6">
                                    <label htmlFor="booking-date-filter" className="block text-gray-700 text-sm font-bold mb-2">Selecciona una fecha:</label>
                                    <select
                                        id="booking-date-filter"
                                        className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        value={bookingDateFilter}
                                        onChange={(e) => setBookingDateFilter(e.target.value)}
                                    >
                                        {/* Obtener fechas únicas disponibles para el doctor seleccionado */}
                                        {[...new Set(selectedDoctorForSlots.availableSlots.map(slot => slot.date))]
                                            .sort() // Ordenar fechas cronológicamente
                                            .map(dateOption => (
                                                <option key={dateOption} value={dateOption}>{dateOption}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="max-h-[40vh] overflow-y-auto pr-2">
                                    {filteredSlotsForDoctor.length > 0 ? (
                                        <div className="flex flex-wrap gap-3 justify-center">
                                            {filteredSlotsForDoctor.map((slot, index) => (
                                                <button
                                                    key={`${selectedDoctorForSlots.id}-${slot.date}-${slot.time}-${index}`}
                                                    className="
                                                        px-4 py-2 text-sm md:px-5 md:py-2 md:text-base
                                                        bg-blue-100 text-blue-800 rounded-full font-medium
                                                        hover:bg-blue-200 hover:text-blue-900 transition-all duration-200
                                                        shadow-sm hover:shadow-md
                                                    "
                                                    onClick={() => selectSlotAndShowBookingForm(selectedDoctorForSlots, slot)}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic text-center py-4">No hay turnos disponibles para la fecha seleccionada.</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Formulario de Confirmación de Reserva (cuando se selecciona un turno)
                            selectedAppointment && (
                                <>
                                    <div id="modal-details" className="mb-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                                        <p className="mb-2"><span className="font-semibold text-gray-800">Médico:</span> {selectedAppointment.doctor.name}</p>
                                        <p className="mb-2"><span className="font-semibold text-gray-800">Especialidad:</span> {selectedAppointment.doctor.specialty}</p>
                                        <p className="mb-2"><span className="font-semibold text-gray-800">Fecha:</span> {selectedAppointment.slot.date}</p>
                                        <p className="mb-2"><span className="font-semibold text-gray-800">Hora:</span> {selectedAppointment.slot.time}</p>
                                        {/* Muestra la ubicación completa del turno seleccionado aquí */}
                                        <p className="mb-4"><span className="font-semibold text-gray-800">Ubicación:</span> {selectedAppointment.slot.location}</p>
                                    </div>
                                    <form onSubmit={handleConfirmBooking} className="space-y-4 sm:space-y-5">
                                        <div>
                                            <label htmlFor="patient-name" className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
                                            <input
                                                type="text"
                                                id="patient-name"
                                                className="
                                                    w-full py-2 px-3 sm:py-3 sm:px-4 border border-gray-300 rounded-lg text-gray-700
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                                    shadow-sm text-sm sm:text-base
                                                "
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="patient-email" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                id="patient-email"
                                                className="
                                                    w-full py-2 px-3 sm:py-3 sm:px-4 border border-gray-300 rounded-lg text-gray-700
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                                    shadow-sm text-sm sm:text-base
                                                "
                                                value={patientEmail}
                                                onChange={(e) => setPatientEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="patient-phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                                            <input
                                                type="tel"
                                                id="patient-phone"
                                                className="
                                                    w-full py-2 px-3 sm:py-3 sm:px-4 border border-gray-300 rounded-lg text-gray-700
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                                    shadow-sm text-sm sm:text-base
                                                "
                                                value={patientPhone}
                                                onChange={(e) => setPatientPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                           {/* Selección de Obra Social */}
                                           <div>
                                               <label htmlFor="patient-insurance" className="block text-gray-700 text-sm font-bold mb-2">Obra Social / Prepaga:</label>
                                               <select
                                                   id="patient-insurance"
                                                   className="
                                                       w-full py-2 px-3 sm:py-3 sm:px-4 border border-gray-300 rounded-lg text-gray-700
                                                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                                       shadow-sm text-sm sm:text-base
                                                   "
                                                   value={patientInsurance}
                                                   onChange={(e) => setPatientInsurance(e.target.value)}
                                                   required
                                               >
                                                   <option value="Particular">Particular</option>
                                                   {dummyInsurances.sort().map(insurance => (
                                                       <option key={insurance} value={insurance}>{insurance}</option>
                                                   ))}
                                               </select>
                                           </div>
                                        <button
                                            type="submit"
                                            className="
                                                w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg
                                                focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200
                                                shadow-md hover:shadow-lg text-base sm:text-lg
                                            "
                                        >
                                            Confirmar Reserva
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goBackToSlotSelection}
                                            className="
                                                w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg mt-2
                                                focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200
                                                shadow-md hover:shadow-lg text-base sm:text-lg
                                            "
                                        >
                                            Volver a elegir turno
                                        </button>
                                    </form>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;