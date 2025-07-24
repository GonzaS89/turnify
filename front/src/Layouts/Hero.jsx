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
        // Añadido mt-16 (o un valor que compense la altura del header) para evitar la superposición
        <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 mt-16"> 
            {/* Hero Section */}
            <div
                id="hero-section"
                className="
                    relative overflow-hidden
                    bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900
                    text-center py-16 sm:py-24 lg:py-28
                    rounded-3xl shadow-2xl px-4 mx-4 sm:mx-6 lg:mx-8
                "
            >
                {/* Efectos de fondo decorativos */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 translate-x-32 translate-y-32"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
                        Agenda tu turno médico{" "}
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">fácil y rápido</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                        Encuentra profesionales, consulta disponibilidad y reserva tu cita en línea.
                    </p>

                    {/* Botón para abrir el modal */}
                    <button
                        onClick={openModal}
                        className="
                            px-6 py-3 sm:px-8 sm:py-4
                            bg-gradient-to-r from-green-500 to-emerald-600
                            text-white font-bold text-lg sm:text-xl rounded-xl
                            shadow-lg hover:shadow-xl
                            hover:from-green-600 hover:to-emerald-700
                            transition-all duration-300 transform hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-green-400
                            border border-green-400/30
                        "
                    >
                        Buscar Profesionales
                    </button>
                </div>
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
