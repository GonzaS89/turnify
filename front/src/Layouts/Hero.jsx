// src/components/Hero.jsx
import { useState, useEffect } from "react";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import SearchModal from "./components/SearchModal";
import img from "../assets/medic.png";
import img2 from "../assets/medic2.png";
import img3 from "../assets/medic4.png";
import img4 from "../assets/medic3.png";

const Hero = ({ enviarIds }) => {
    const { profesionales, isLoading, error } = useAllProfesionals();
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const images = [img, img2, img3, img4];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section id="hero-section" className="relative pt-24 pb-20 overflow-hidden mt-24">
            {/* Fondos decorativos (opcionales) */}
            <div className="absolute -top-24 -left-32 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[180px] opacity-30 -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-100 rounded-full blur-[120px] opacity-30 -z-10"></div>

            <div className="relative px-6 mx-auto max-w-7xl">
                {/* Layout para móviles: columna, luego fila en lg */}
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16">
                    
                    {/* Texto (arriba en móvil) */}
                    <div className="flex-1 text-center lg:text-left max-w-lg space-y-6 order-2 lg:order-1">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                            Turnos médicos{" "}
                            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                                sin complicaciones
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Consultá profesionales disponibles y reservá tu cita en solo unos clics. Rápido, claro y seguro.
                        </p>

                        <div className="mt-4">
                            <button
                                onClick={openModal}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-lg rounded-full shadow-md hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                            >
                                🔍 Buscar Profesionales
                            </button>
                        </div>
                    </div>

                    {/* Carrusel de imágenes (abajo en móvil, arriba en escritorio) */}
                    <div className="flex-1 flex justify-center order-1 lg:order-2 w-full">
                        <div 
                            className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-lg aspect-[4/5] max-h-[500px]"
                            style={{ height: "auto", aspectRatio: "4 / 5" }}
                        >
                            {/* Fondo de profundidad */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-3xl blur-xl opacity-40 scale-110 pointer-events-none"></div>

                            {/* Imágenes rotativas */}
                            {images.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Profesional médico ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-contain rounded-3xl transition-all duration-1000 ease-in-out ${
                                        index === currentIndex
                                            ? "opacity-100 scale-100 z-10"
                                            : "opacity-0 scale-95 z-0"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
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