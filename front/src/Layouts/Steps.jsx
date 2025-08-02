import React, { useState, useEffect } from "react";
import Step from "./components/Step"; // Asumo que tienes un componente Step

const Steps = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 } // Aumentado el umbral para que la animación empiece un poco más tarde
        );

        const current = document.getElementById("info");
        if (current) observer.observe(current);

        return () => {
            if (current) observer.unobserve(current);
        };
    }, []);

    const contenidoSteps = [
        {
            titulo: "1. Busca a tu médico",
            contenido: "Usa nuestro buscador inteligente para filtrar por especialidad, nombre o fecha y encuentra al profesional de la salud ideal.",
            referencia: "medico",
            color: "from-blue-500 to-blue-600",
            icon: "🔍",
        },
        {
            titulo: "2. Elige un horario",
            contenido: "Selecciona el turno que mejor se adapte a tu agenda de entre los horarios disponibles. Es rápido y sencillo.",
            referencia: "dia",
            color: "from-teal-500 to-emerald-600",
            icon: "📅",
        },
        {
            titulo: "3. Confirma tu reserva",
            contenido: "Completa tus datos personales y recibe la confirmación de tu turno al instante por correo y WhatsApp.",
            referencia: "ok",
            color: "from-green-500 to-teal-500",
            icon: "✅",
        },
    ];

    return (
        <section
            id="info"
            className="py-24 relative overflow-hidden"
        >
            {/* === Fondo estilizado y gradientes flotantes === */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0"></div>
               
            </div>

            {/* === CONTENIDO PRINCIPAL === */}
            <div className="container mx-auto px-6 relative z-10">
                {/* Encabezado */}
                <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <span className="
                        inline-flex
                        items-center
                        gap-2
                        px-6
                        py-2
                        text-sm
                        font-semibold
                        bg-white
                        backdrop-blur-sm
                        text-indigo-700
                        rounded-full
                        mb-6
                        shadow-md
                        border
                        border-indigo-100
                        animate-fade-in
                    ">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-slow"></div>
                        <span>CÓMO FUNCIONA</span>
                    </span>
                    <h2 className="
                        text-3xl
                        sm:text-4xl
                        md:text-5xl
                        font-extrabold
                        text-gray-900
                        leading-tight
                        mb-6
                        
                    ">
                        Agenda tu turno en{" "}
                        <span className="
                            bg-gradient-to-r
                            from-indigo-600
                            to-blue-600
                            text-transparent
                            bg-clip-text
                        ">
                            3 simples pasos
                        </span>
                    </h2>
                    <p className="
                        text-lg
                        text-gray-600
                        leading-relaxed
                        font-light
                        
                    ">
                        Rápido, fácil y sin complicaciones. Tu salud merece lo mejor, y tu tiempo también.
                    </p>
                </div>

                {/* Contenedor de pasos */}
                <div className="max-w-6xl mx-auto relative">
                    {/* Línea progresiva animada (solo desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                        <div
                            className={`absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full transition-all duration-1000 ease-out ${isVisible ? "w-[calc(100%-10%)]" : "w-0"}`}
                        ></div>
                    </div>

                    {/* Grid de los pasos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                        {contenidoSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`
                                    relative
                                    transform
                                    transition-all
                                    duration-700
                                    ease-out
                                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                                `}
                                style={{ transitionDelay: `${400 + index * 250}ms` }}
                            >
                                {/* Círculo del paso */}
                                <div className="
                                    absolute
                                    -top-6
                                    left-1/2
                                    transform
                                    -translate-x-1/2
                                    md:left-auto
                                    md:top-1/2
                                    md:-translate-y-1/2
                                    md:-translate-x-1/2
                                    w-14
                                    h-14
                                    rounded-full
                                    bg-gradient-to-br
                                    from-white
                                    to-gray-50
                                    shadow-xl
                                    border
                                    border-gray-200
                                    flex
                                    items-center
                                    justify-center
                                    z-20
                                ">
                                    <div className="
                                        text-xl
                                        font-bold
                                        bg-gradient-to-r
                                        from-indigo-600
                                        to-blue-600
                                        text-transparent
                                        bg-clip-text
                                    ">
                                        {index + 1}
                                    </div>
                                </div>
                                {/* Tarjeta */}
                                <div className="
                                    bg-white
                                    p-8
                                    rounded-3xl
                                    shadow-2xl
                                    border
                                    border-gray-200
                                    transition-all
                                    duration-500
                                    transform
                                    h-full
                                    hover:scale-[1.03]
                                    hover:shadow-3xl
                                    md:mt-0
                                    mt-8
                                ">
                                    {/* Icono del paso */}
                                    <div className="
                                        text-5xl
                                        mb-4
                                        inline-block
                                        text-blue-500
                                    ">
                                        {step.icon}
                                    </div>
                                    <h3 className="
                                        text-2xl
                                        font-bold
                                        text-gray-800
                                        mb-2
                                    ">
                                        {step.titulo}
                                    </h3>
                                    <p className="
                                        text-gray-600
                                        leading-relaxed
                                    ">
                                        {step.contenido}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Steps;