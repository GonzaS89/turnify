import React, { useState, useEffect } from 'react';
import { Header } from './Header'; // Asegúrate de que Header tenga estilos modernos
import { Footer } from './Footer'; // Asegúrate de que Footer tenga estilos modernos
import Steps from './Layouts/Steps'; // Asume que estos ya están estilizados internamente
import Benefits from './Layouts/Benefits'; // Asume que estos ya están estilizados internamente
import FAQS from './Layouts/FAQS'; // Asume que estos ya están estilizados internamente
import Testimonials from './Layouts/Testimonials'; // Asume que estos ya están estilizados internamente

// Dummy data to replace Firestore calls
const dummyDoctors = [
    {
        id: "doc-1",
        name: "Dr. Ana García",
        specialty: "Cardiología",
        location: "Av. Corrientes 123, CABA",
        bio: "Especialista en cardiología clínica y ecocardiografía con más de 15 años de experiencia, brindando atención integral y personalizada a sus pacientes.",
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
        bio: "Odontólogo general con enfoque en estética dental y tratamientos de blanqueamiento. Comprometido con la salud bucal y la sonrisa de sus pacientes.",
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
        bio: "Pediatra con amplia experiencia en atención infantil y vacunación. Atiende a niños de todas las edades con un enfoque cariñoso y preventivo.",
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
        bio: "Dermatólogo especialista en acné, rosácea y tratamientos estéticos de la piel. Ofrece soluciones personalizadas para cada tipo de piel.",
        availableSlots: [
            { date: "2025-07-01", time: "15:00" },
            { date: "2025-07-05", time: "09:00" },
            { date: "2025-07-05", time: "10:00" },
        ]
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


    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [message, setMessage] = useState('');

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
        // Implementar desplazamiento suave a la sección 'medicos-disponibles' si lo necesitas
        const doctorsSection = document.getElementById('medicos-disponibles');
        if (doctorsSection) {
          doctorsSection.scrollIntoView({ behavior: 'smooth' });
        }
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 font-sans text-gray-800">
            {/* Header - Se asume que este componente ya está estilizado para que coincida con el tema */}
            <Header />
            
            {/* Main Content - Added pt-24 to prevent content from being hidden behind the fixed header */}
            <main className="container mx-auto px-4 pt-24 mt-8">
                {/* Hero Section */}
                <section id="hero-section" className="
                    bg-gradient-to-r from-blue-500 to-purple-600
                    text-center py-16 sm:py-24 rounded-3xl shadow-xl px-4 mb-16
                    relative overflow-hidden
                ">
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-24 -translate-y-24"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-16 translate-y-16"></div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                        Reserva tu turno médico de forma <span className="text-blue-200">rápida y sencilla</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-12 drop-shadow-sm">
                        Encuentra la especialidad y el profesional que necesitas, y agenda tu cita en segundos.
                    </p>

                    <form onSubmit={handleSearch} className="
                        flex flex-col md:flex-row justify-center items-end gap-6
                        bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto
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
                                <option value="Cardiología">Cardiología</option>
                                <option value="Odontología">Odontología</option>
                                <option value="Pediatría">Pediatría</option>
                                <option value="Dermatología">Dermatología</option>
                                <option value="Nutrición">Nutrición</option>
                                {/* Agrega más especialidades aquí */}
                            </select>
                        </div>
                        <div className="flex flex-col items-start w-full md:w-1/3">
                            <label htmlFor="doctor-name" className="block text-base font-semibold text-gray-700 mb-2">Nombre del médico (opcional)</label>
                            <input
                                type="text"
                                id="doctor-name"
                                placeholder="Ej: Dr. Juan Pérez"
                                className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
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

                {/* Sección de Médicos Disponibles */}
                <section id="medicos-disponibles" className="mt-28 mb-16"> {/* Ajustado el margen superior */}
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Médicos Disponibles</h2>

                    {message && (
                        <div className={`p-4 mb-8 rounded-lg text-white text-center font-semibold transition-all duration-300 ${message.includes('éxito') ? 'bg-green-500 shadow-md' : 'bg-red-500 shadow-md'}`}>
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doctor => (
                                <div key={doctor.id} className="
                                    bg-white rounded-2xl shadow-xl p-6 border border-gray-100
                                    transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-300
                                    group
                                ">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                                        <img
                                            src={`https://placehold.co/96x96/007bff/ffffff?text=${doctor.name.split(' ').map(n => n[0]).join('')}`}
                                            alt={`Foto de ${doctor.name}`}
                                            className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-4 border-blue-400 group-hover:border-purple-400 transition-colors duration-300"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/000000?text=MD"; }}
                                        />
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{doctor.name}</h3>
                                            <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.specialty}</p>
                                            <p className="text-gray-500 text-sm mt-1">{doctor.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-6 text-base leading-relaxed">{doctor.bio}</p>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-gray-800 mb-3">Horarios disponibles:</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                                                doctor.availableSlots.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        className="
                                                            px-5 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium
                                                            hover:bg-blue-200 hover:text-blue-900 transition-all duration-200
                                                            shadow-sm hover:shadow-md
                                                        "
                                                        onClick={() => openBookingModal(doctor, slot)}
                                                    >
                                                        {slot.date} - {slot.time}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm italic">No hay turnos disponibles para la fecha seleccionada.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-gray-100">
                                No se encontraron médicos con los criterios de búsqueda. Por favor, intenta con otra especialidad, nombre o fecha.
                            </p>
                        )}
                    </div>
                </section>

                {/* Separador */}
                <hr className="my-16 border-gray-200 border-t-2" />

                {/* How it Works Section - Se asume que este componente ya está estilizado */}
                <Steps />

                {/* Separador */}
                <hr className="my-16 border-gray-200 border-t-2" />

                {/* Benefits Section - Se asume que este componente ya está estilizado */}
                <Benefits />

                {/* Separador */}
                <hr className="my-16 border-gray-200 border-t-2" />

                {/* Testimonials Section - Se asume que este componente ya está estilizado */}
                <Testimonials />

                {/* Separador */}
                <hr className="my-16 border-gray-200 border-t-2" />
                
                {/* FAQ Section - Se asume que este componente ya está estilizado */}
                <FAQS />

                {/* Separador */}
                <hr className="my-16 border-gray-200 border-t-2" />
                
                {/* Call to Action (CTA) Section */}
                <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-16 relative overflow-hidden">
                    {/* Elementos decorativos */}
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

            {/* Footer - Se asume que este componente ya está estilizado */}
            <Footer />

            {/* Booking Modal (Estilizado) */}
            {showBookingModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="
                        bg-white rounded-2xl shadow-3xl p-8 w-full max-w-lg
                        transform scale-95 opacity-0 animate-scale-in
                        relative
                    ">
                        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                            <h3 className="text-3xl font-extrabold text-gray-900">Confirmar Reserva</h3>
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
                            <div className={`
                                p-4 mb-6 rounded-lg text-white text-center font-semibold text-lg
                                transition-all duration-300 shadow-md
                                ${message.includes('éxito') ? 'bg-green-500' : 'bg-red-500'}
                            `}>
                                {message}
                            </div>
                        )}
                        <div id="modal-details" className="mb-6 text-gray-700 leading-relaxed">
                            <p className="mb-2"><span className="font-semibold text-gray-800">Médico:</span> {selectedAppointment.doctor.name}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-800">Especialidad:</span> {selectedAppointment.doctor.specialty}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-800">Fecha:</span> {selectedAppointment.slot.date}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-800">Hora:</span> {selectedAppointment.slot.time}</p>
                            <p className="mb-4"><span className="font-semibold text-gray-800">Ubicación:</span> {selectedAppointment.doctor.location}</p>
                        </div>
                        <form onSubmit={handleConfirmBooking} className="space-y-5">
                            <div>
                                <label htmlFor="patient-name" className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="patient-name"
                                    className="
                                        w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                        shadow-sm
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
                                        w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                        shadow-sm
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
                                        w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                                        shadow-sm
                                    "
                                    value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="
                                    w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200
                                    shadow-md hover:shadow-lg
                                "
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