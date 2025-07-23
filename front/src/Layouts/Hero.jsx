// src/components/Hero.jsx
import { useState } from "react";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import SearchModal from "./components/SearchModal"; // Importa el nuevo componente modal

const Hero = ({ enviarIds }) => {
    // CARGA DE CUSTOM HOOKS (permanecen aquí porque los datos se necesitan en el modal)
    const { profesionales, isLoading, error } = useAllProfesionals();

    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    // Función para abrir el modal
    const openModal = () => {
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <section className="mt-32">
            {/* Hero Section */}
            <div
                id="hero-section"
                className="
                    relative overflow-hidden
                    bg-gradient-to-br from-blue-600 to-purple-700
                    text-center py-20 sm:py-28 lg:py-32
                    rounded-b-[3rem] shadow-2xl px-4 mb-20
                "
            >
                {/* Decorative background circles */}
                <div className="absolute top-0 left-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-x-32 -translate-y-32 blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-24 translate-y-24 blur-xl"></div>

                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-down">
                    Reserva tu turno médico de forma{" "}
                    <span className="text-blue-200">rápida y sencilla</span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-base text-blue-100 max-w-3xl mx-auto mb-10 drop-shadow-md animate-fade-in-up">
                    Encuentra la especialidad y el profesional que necesitas, y agenda tu
                    cita en segundos.
                </p>

                {/* Botón para abrir el modal */}
                <button
                    onClick={openModal}
                    className="
                        px-10 py-4
                        bg-green-500 text-white rounded-xl font-bold text-xl
                        hover:bg-green-600 transition-all duration-300 transform hover:scale-105
                        shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300
                    "
                >
                    Buscar Médicos Ahora
                </button>
            </div>

            {/* Renderiza el SearchModal y le pasa las props necesarias */}
            <SearchModal
                showModal={showModal}
                onClose={closeModal}
                profesionales={profesionales}
                isLoading={isLoading}
                error={error}
                enviarIds={enviarIds}
            />
        </section>
    );
};

export default Hero;