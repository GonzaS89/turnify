import React, { useState, useEffect } from 'react';
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5"; // Importamos el icono de cerrar
import logo from '/turnify.png' // Asegúrate de que esta ruta sea correcta para tu logo

// Dummy data to replace Firestore calls
const dummyDoctors = [
    {
        id: "doc-1",
        name: "Dr. Ana García",
        specialty: "Cardiología",
        location: "Av. Corrientes 123, CABA",
        bio: "Especialista en cardiología clínica y ecocardiografía con más de 15 años de experiencia.",
        availableSlots: [
            { date: "2025-07-01", time: "09:00" },
            { date: "2025-07-01", time: "10:00" },
            { date: "2025-07-02", time: "11:00" },
            { date: "2025-07-03", time: "14:00" },
        ]
    },
    {
        id: "doc-2",
        name: "Dr. Juan Pérez",
        specialty: "Odontología",
        location: "Calle Falsa 123, CABA",
        bio: "Odontólogo general con enfoque en estética dental y tratamientos de blanqueamiento.",
        availableSlots: [
            { date: "2025-07-01", time: "14:00" },
            { date: "2025-07-02", time: "09:30" },
            { date: "2025-07-02", time: "10:30" },
            { date: "2025-07-04", time: "16:00" },
        ]
    },
    {
        id: "doc-3",
        name: "Dra. Laura Sánchez",
        specialty: "Pediatría",
        location: "Rivadavia 456, CABA",
        bio: "Pediatra con amplia experiencia en atención infantil y vacunación. Atiende a niños de todas las edades.",
        availableSlots: [
            { date: "2025-07-03", time: "09:00" },
            { date: "2025-07-03", time: "10:00" },
            { date: "2025-07-04", time: "11:00" },
            { date: "2025-07-05", time: "12:00" },
        ]
    },
    {
        id: "doc-4",
        name: "Dr. Roberto Gómez",
        specialty: "Dermatología",
        location: "Av. Libertador 789, CABA",
        bio: "Dermatólogo especialista en acné, rosácea y tratamientos estéticos de la piel.",
        availableSlots: [
            { date: "2025-07-01", time: "15:00" },
            { date: "2025-07-05", time: "09:00" },
            { date: "2025-07-05", time: "10:00" },
        ]
    },
];

const faqData = [
    {
        q: '¿Cómo reservo un turno?',
        a: 'Simplemente utiliza el buscador en la parte superior de la página, filtra por especialidad o médico y elige uno de los horarios disponibles. Luego, completa tus datos para confirmar la reserva.'
    },
    {
        q: '¿Qué hago si necesito cancelar un turno?',
        a: 'Puedes cancelar tu turno a través del enlace que recibiste en el correo electrónico de confirmación. Por favor, cancela con al menos 24 horas de anticipación para permitir que otro paciente lo utilice.'
    },
    {
        q: '¿Qué métodos de pago se aceptan?',
        a: 'Actualmente, el pago se realiza directamente en la consulta. Estamos trabajando para integrar opciones de pago en línea en el futuro.'
    },
    {
        q: '¿Cómo puedo afiliarme como médico o centro de salud?',
        a: 'En la sección "Beneficios de Afiliarte" encontrarás un botón o un formulario de contacto para que nuestro equipo te ayude a crear tu perfil y comiences a recibir reservas.'
    },
];

// Main App component
const App = () => {
    // State for doctors and filtered doctors
    const [doctors, setDoctors] = useState(dummyDoctors);
    const [filteredDoctors, setFilteredDoctors] = useState(dummyDoctors);

    // State for search form inputs
    const [specialty, setSpecialty] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [date, setDate] = useState('');

    // State for mobile menu and booking modal
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [message, setMessage] = useState('');

    // State for FAQ accordion
    const [openFAQ, setOpenFAQ] = useState(null); // State to track the open FAQ item

    // Function to handle smooth scrolling
    const handleScrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
        }
    };

    // Use useEffect to trigger filtering whenever a search input changes
    useEffect(() => {
        let currentFilteredDoctors = doctors;

        if (specialty) {
            currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.specialty === specialty);
        }

        if (doctorName) {
            currentFilteredDoctors = currentFilteredDoctors.filter(doc =>
                doc.name.toLowerCase().includes(doctorName.toLowerCase())
            );
        }

        if (date) {
            currentFilteredDoctors = currentFilteredDoctors.map(doc => ({
                ...doc,
                availableSlots: doc.availableSlots.filter(slot => slot.date === date)
            })).filter(doc => doc.availableSlots.length > 0);
        }

        setFilteredDoctors(currentFilteredDoctors);
    }, [specialty, doctorName, date, doctors]);

    // This function is now only used to prevent form submission and can display a message
    const handleSearch = (e) => {
        e.preventDefault();
        setMessage("Búsqueda actualizada.");
        setTimeout(() => setMessage(''), 2000);
        // Also scroll to the doctors list after searching
        handleScrollToSection(e, 'medicos-disponibles');
    };

    // Open booking modal
    const openBookingModal = (doctor, slot) => {
        setSelectedAppointment({ doctor, slot });
        setShowBookingModal(true);
    };

    // Close booking modal
    const closeBookingModal = () => {
        setShowBookingModal(false);
        setSelectedAppointment(null);
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
        setMessage('');
    };
    
    // Handle appointment booking confirmation (simulated)
    const handleConfirmBooking = (e) => {
        e.preventDefault();
        if (!selectedAppointment) {
            setMessage("Error: Datos de reserva incompletos.");
            return;
        }

        console.log("Reserva confirmada:", {
            doctorId: selectedAppointment.doctor.id,
            doctorName: selectedAppointment.doctor.name,
            specialty: selectedAppointment.doctor.specialty,
            appointmentDate: selectedAppointment.slot.date,
            appointmentTime: selectedAppointment.slot.time,
            patientName: patientName,
            patientEmail: patientEmail,
            patientPhone: patientPhone,
            timestamp: new Date()
        });

        setMessage("¡Tu turno ha sido reservado con éxito!");
        
        setTimeout(() => {
            closeBookingModal();
        }, 2000);
    };

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm py-4 z-50 transition-all duration-300">
                <div className="container mx-auto px-4 flex justify-between items-center relative">
                    {/* Logo Centrado en Mobile */}
                    <a href="#hero-section" className="flex-grow flex justify-center md:justify-start">
                        <img src={logo} alt="TurniFy Logo" className='w-24 h-auto md:w-20'/>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <ul className="flex space-x-6">
                            <li><a href="#hero-section" onClick={(e) => handleScrollToSection(e, 'hero-section')} className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Inicio</a></li>
                            <li><a href="#especialidades-populares" onClick={(e) => handleScrollToSection(e, 'especialidades-populares')} className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Especialidades</a></li>
                            <li><a href="#medicos-disponibles" onClick={(e) => handleScrollToSection(e, 'medicos-disponibles')} className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Médicos</a></li>
                            <li><a href="#preguntas-frecuentes" onClick={(e) => handleScrollToSection(e, 'preguntas-frecuentes')} className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Preguntas Frecuentes</a></li>
                        </ul>
                        <div className="flex space-x-3">
                            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                                Iniciar Sesión
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                Registrarse
                            </button>
                        </div>
                    </nav>

                    {/* Hamburger Menu Button for Mobile */}
                    <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                           <IoMdMenu className='text-4xl'/>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="bg-white h-full w-64 p-6 shadow-lg ml-auto">
                    <div className="flex justify-end mb-6">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <IoClose className='text-4xl'/>
                        </button>
                    </div>
                    <nav>
                        <ul className="flex flex-col space-y-4">
                            <li><a href="#hero-section" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" onClick={(e) => handleScrollToSection(e, 'hero-section')}>Inicio</a></li>
                            <li><a href="#especialidades-populares" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" onClick={(e) => handleScrollToSection(e, 'especialidades-populares')}>Especialidades</a></li>
                            <li><a href="#medicos-disponibles" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" onClick={(e) => handleScrollToSection(e, 'medicos-disponibles')}>Médicos</a></li>
                            <li><a href="#preguntas-frecuentes" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" onClick={(e) => handleScrollToSection(e, 'preguntas-frecuentes')}>Preguntas Frecuentes</a></li>
                            <li className="pt-4 border-t border-gray-200">
                                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                    Iniciar Sesión
                                </button>
                            </li>
                            <li>
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                    Registrarse
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content - Added pt-24 to prevent content from being hidden behind the fixed header */}
            <main className="container mx-auto px-4 pt-24 mt-8">
                {/* Hero Section */}
                <section id="hero-section" className="bg-blue-50 text-center py-12 sm:py-20 rounded-xl shadow-md px-4 mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Reserva tu turno médico de forma <span className="text-blue-600">rápida y sencilla</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Encuentra la especialidad y el profesional que necesitas, y agenda tu cita en segundos.
                    </p>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center gap-4">
                        <div className="flex flex-col items-start w-full md:w-auto">
                            <label htmlFor="specialty" className="text-sm font-bold text-gray-700 mb-1">Especialidad</label>
                            <select
                                id="specialty"
                                name="specialty"
                                className="p-3 border border-gray-300 rounded-lg text-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                            >
                                <option value="">Selecciona una especialidad</option>
                                <option value="Cardiología">Cardiología</option>
                                <option value="Odontología">Odontología</option>
                                <option value="Pediatría">Pediatría</option>
                                <option value="Dermatología">Dermatología</option>
                                <option value="Nutrición">Nutrición</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-start w-full md:w-auto">
                            <label htmlFor="doctor-name" className="text-sm font-bold text-gray-700 mb-1">Nombre del médico (opcional)</label>
                            <input
                                type="text"
                                id="doctor-name"
                                placeholder="Ej: Dr. Juan Pérez"
                                className="p-3 border border-gray-300 rounded-lg text-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-start w-full md:w-auto">
                            <label htmlFor="date" className="text-sm font-bold text-gray-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                className="p-3 border border-gray-300 rounded-lg text-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full md:w-auto self-end px-8 py-3 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105">
                            Buscar Turno
                        </button>
                    </form>
                </section>

                {/* --- */}
                {/* How it Works Section */}
                <section className="py-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Cómo funciona TurniFy?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Busca a tu médico</h3>
                            <p className="text-gray-600">
                                Usa el buscador para filtrar por especialidad, nombre o fecha y encuentra al profesional ideal.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Elige un horario</h3>
                            <p className="text-gray-600">
                                Selecciona el turno que mejor se adapte a tu agenda de los horarios disponibles.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Confirma y listo</h3>
                            <p className="text-gray-600">
                                Completa tus datos y recibe la confirmación de tu turno al instante.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="my-12 border-gray-200" />

                {/* Benefits Section */}
                <section className="py-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Beneficios de Afiliarte a TurniFy</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                        Para médicos y centros de salud, nuestra plataforma es la herramienta clave para optimizar tu gestión.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-teal-100 transform transition-transform duration-300 hover:scale-105">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Agenda Automatizada</h3>
                            <p className="text-gray-700">
                                Reduce la carga administrativa y evita sobrecargas con un sistema de turnos 24/7.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-teal-100 transform transition-transform duration-300 hover:scale-105">
                            <div className="text-6xl mb-4">📈</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Mayor Visibilidad</h3>
                            <p className="text-gray-700">
                                Atrae nuevos pacientes y expande tu práctica profesional apareciendo en nuestro directorio.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-teal-100 transform transition-transform duration-300 hover:scale-105">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunicación Fluida</h3>
                            <p className="text-gray-700">
                                Envía recordatorios automáticos y mantén a tus pacientes informados sin esfuerzo.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="my-12 border-gray-200" />
                
                {/* Popular Specialties Section */}
                <section id="especialidades-populares" className="py-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Especialidades Populares</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <img src="https://placehold.co/100x100/e0f2fe/1d4ed8?text=🧠" alt="Neurología" className="w-16 h-16 mb-2" />
                            <span className="text-sm font-semibold text-gray-700 text-center">Neurología</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <img src="https://placehold.co/100x100/e0f2fe/1d4ed8?text=🦷" alt="Odontología" className="w-16 h-16 mb-2" />
                            <span className="text-sm font-semibold text-gray-700 text-center">Odontología</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <img src="https://placehold.co/100x100/e0f2fe/1d4ed8?text=👶" alt="Pediatría" className="w-16 h-16 mb-2" />
                            <span className="text-sm font-semibold text-gray-700 text-center">Pediatría</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <img src="https://placehold.co/100x100/e0f2fe/1d4ed8?text=🩺" alt="Clínica Médica" className="w-16 h-16 mb-2" />
                            <span className="text-sm font-semibold text-gray-700 text-center">Clínica Médica</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <img src="https://placehold.co/100x100/e0f2fe/1d4ed8?text=❤️" alt="Cardiología" className="w-16 h-16 mb-2" />
                            <span className="text-sm font-semibold text-gray-700 text-center">Cardiología</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <img src="https://placehold.co/100x100/e0f2fe/1d4ed8?text=💪" alt="Kinesiología" className="w-16 h-16 mb-2" />
                            <span className="text-sm font-semibold text-gray-700 text-center">Kinesiología</span>
                        </div>
                    </div>
                </section>

                <hr className="my-12 border-gray-200" />

                {/* Results Section */}
                <section id="medicos-disponibles" className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">Médicos disponibles</h2>

                    {message && (
                        <div className={`p-4 mb-4 rounded-lg text-white text-center ${message.includes('éxito') ? 'bg-green-500' : 'bg-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doctor => (
                                <div key={doctor.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 text-center sm:text-left">
                                        <img
                                            src={`https://placehold.co/80x80/007bff/ffffff?text=${doctor.name.split(' ').map(n => n[0]).join('')}`}
                                            alt={`Foto de ${doctor.name}`}
                                            className="w-20 h-20 rounded-full mb-4 sm:mb-0 sm:mr-4 object-cover border-2 border-blue-400"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/cccccc/000000?text=MD"; }}
                                        />
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                                            <p className="text-blue-600 font-semibold">{doctor.specialty}</p>
                                            <p className="text-gray-500 text-sm mt-1">{doctor.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">{doctor.bio}</p>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-gray-700 mb-2">Horarios disponibles:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                                                doctor.availableSlots.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                                                        onClick={() => openBookingModal(doctor, slot)}
                                                    >
                                                        {slot.date} - {slot.time}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm">No hay turnos disponibles para la fecha seleccionada.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 text-lg col-span-full py-10">No se encontraron médicos con los criterios de búsqueda.</p>
                        )}
                    </div>
                </section>
                
                <hr className="my-12 border-gray-200" />

                {/* Testimonials Section */}
                <section className="py-12 bg-blue-50 rounded-xl shadow-md px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Lo que dicen nuestros pacientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
                            <p className="text-gray-700 italic mb-4">
                                "Reservar un turno con mi cardiólogo fue increíblemente fácil. Encontré un horario para el mismo día y evité la espera telefónica. ¡Excelente servicio!"
                            </p>
                            <p className="font-bold text-blue-600">- María L., Paciente de Cardiología</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
                            <p className="text-gray-700 italic mb-4">
                                "Utilicé TurniFy para mi hijo y la experiencia fue fantástica. Pude ver los turnos de la pediatra y elegir el que me convenía desde mi celular."
                            </p>
                            <p className="font-bold text-blue-600">- Sofía R., Madre de paciente</p>
                        </div>
                    </div>
                </section>

                <hr className="my-12 border-gray-200" />
                
                {/* FAQ Section */}
                <section id="preguntas-frecuentes" className="py-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Preguntas Frecuentes</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqData.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg">
                                <div
                                    className="flex justify-between items-center font-bold text-lg text-gray-800"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span>{item.q}</span>
                                    <span className="text-2xl transform transition-transform duration-300">
                                        {openFAQ === index ? '−' : '+'}
                                    </span>
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        openFAQ === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <p className="text-gray-600 pt-2">{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="my-12 border-gray-200" />
                
                {/* Call to Action (CTA) Section */}
                <section className="text-center py-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        ¿Listo para reservar tu próximo turno?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Únete a miles de personas que ya disfrutan de la comodidad de agendar sus citas médicas en un solo lugar.
                    </p>
                    <button className="px-10 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        ¡Encuentra tu médico ahora!
                    </button>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2025 Mi Turno Salud. Todos los derechos reservados.</p>
                    <div className="mt-2 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white mx-2">Política de Privacidad</a>
                        <a href="#" className="text-gray-400 hover:text-white mx-2">Términos y Condiciones</a>
                    </div>
                </div>
            </footer>

            {/* Booking Modal (Original) */}
            {showBookingModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-3xl font-bold text-gray-900">Confirmar Reserva</h3>
                            <button onClick={closeBookingModal} className="text-gray-500 hover:text-gray-700 text-4xl leading-none">
                                &times;
                            </button>
                        </div>
                        {message && (
                            <div className={`p-3 mb-4 rounded-lg text-white text-center ${message.includes('éxito') ? 'bg-green-500' : 'bg-red-500'}`}>
                                {message}
                            </div>
                        )}
                        <div id="modal-details" className="mb-6 text-gray-700">
                            <p className="mb-2"><span className="font-semibold">Médico:</span> {selectedAppointment.doctor.name}</p>
                            <p className="mb-2"><span className="font-semibold">Especialidad:</span> {selectedAppointment.doctor.specialty}</p>
                            <p className="mb-2"><span className="font-semibold">Fecha:</span> {selectedAppointment.slot.date}</p>
                            <p className="mb-2"><span className="font-semibold">Hora:</span> {selectedAppointment.slot.time}</p>
                            <p className="mb-2"><span className="font-semibold">Ubicación:</span> {selectedAppointment.doctor.location}</p>
                        </div>
                        <form onSubmit={handleConfirmBooking}>
                            <div className="mb-4">
                                <label htmlFor="patient-name" className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="patient-name"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="patient-email" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="patient-email"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={patientEmail}
                                    onChange={(e) => setPatientEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="patient-phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                                <input
                                    type="tel"
                                    id="patient-phone"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Confirmar Reserva
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;