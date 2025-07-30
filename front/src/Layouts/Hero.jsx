// src/components/Hero.jsx
import { useState } from "react";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import SearchModal from "./components/SearchModal"; // Modal de búsqueda
import img from "../assets/medic.png"; // Imagen de fondo (opcional)

const Hero = ({ enviarIds }) => {
    const { profesionales, isLoading, error } = useAllProfesionals();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <section className="pt-20 mt-32 lg:mt-0 pb-16 sm:pt-24 sm:pb-20 lg:pt-32" id="hero-section">
            <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Contenedor en dos columnas */}
                <div className="flex flex-col items-center lg:flex-row gap-12 lg:gap-16">
                    {/* Columna de texto */}
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-5">
                            Agenda tu turno médico{" "}
                            <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-transparent bg-clip-text">fácil y rápido</span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
                            Encuentra profesionales de confianza, consulta disponibilidad en tiempo real y reserva tu cita en línea sin complicaciones.
                        </p>

                        <button
                            onClick={openModal}
                            className="
                                px-6 py-3 sm:px-8 sm:py-4
                                bg-gradient-to-r from-sky-500 to-sky-700
                                text-white font-bold text-lg rounded-xl
                                shadow-lg hover:shadow-xl
                                hover:from-blue-500 hover:to-blue-900
                                transition-all duration-300 transform hover:scale-105
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-100 focus:ring-green-400
                                border border-green-400/30
                                mx-auto lg:mx-0
                            "
                        >
                            Buscar Profesionales
                        </button>
                    </div>

                    {/* Columna de imagen */}
                    <div className="flex-1 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            {/* Imagen de médico o salud */}
                            <img
                                src={img}
                                alt="Doctor atendiendo paciente"
                                className="rounded-2xl object-cover w-full h-auto"
                                style={{ aspectRatio: "4/5" }}
                            />

                            {/* Badge decorativo */}
                            <div className="absolute -bottom-4 -right-4 bg-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <span className="text-green-600 font-bold text-sm">✔️</span>
                                <span className="text-gray-700 text-sm font-medium">Turnos online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Efecto de fondo suave opcional */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-70 rounded-3xl"></div>
            </div>

            {/* Modal de búsqueda */}
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