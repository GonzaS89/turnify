import React from 'react'
import Benefit from './components/Benefit';
import { FcCalendar, FcSmartphoneTablet, FcBullish, FcSms, FcLeave } from "react-icons/fc";

const Benefits = () => {
    // Reemplaza con tu número de WhatsApp (código de país + número)
    const whatsappLink = "https://wa.me/5493814482619"; // Ejemplo para Argentina


    return (
        <section 
        id='beneficios'
        className="
            py-20
            px-4
            bg-white/70
            rounded-2xl
            text-center
            relative
            overflow-hidden
        ">
            {/* Elementos decorativos de fondo */}
            <div className="
                absolute
                top-10
                left-10
                w-32
                h-32
                bg-indigo-200
                rounded-full
                opacity-10
                blur-xl
                animate-pulse
            "></div>
            <div className="
                absolute
                bottom-10
                right-10
                w-48
                h-48
                bg-purple-200
                rounded-full
                opacity-10
                blur-xl
                animate-pulse
                delay-1000
            "></div>
            
            {/* Contenido principal */}
            <div className="
                max-w-7xl
                mx-auto
                relative
                z-10
            ">
                {/* Badge decorativo */}
                <div className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    bg-indigo-100
                    text-indigo-700
                    rounded-full
                    text-sm
                    font-medium
                    mb-6
                    animate-fade-in
                ">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>VENTAJAS EXCLUSIVAS</span>
                </div>

                {/* Título principal */}
                <h2 className="
                    text-4xl
                    font-bold
                    text-gray-900
                    mb-6
                    leading-tight
                    animate-fade-in-up
                ">
                    Beneficios de Afiliarte a{' '}
                    <span className="
                        bg-gradient-to-r
                        from-indigo-600
                        to-purple-600
                        bg-clip-text
                        text-transparent
                    ">
                        TurniFy
                    </span>
                </h2>

                {/* Subtítulo */}
                <p className="
                    text-xl
                    text-gray-600
                    max-w-3xl
                    mx-auto
                    mb-16
                    leading-relaxed
                    animate-fade-in-up
                    delay-100
                ">
                    Para médicos y centros de salud, nuestra plataforma es la herramienta clave 
                    para <span className="font-semibold text-gray-800">optimizar tu gestión</span> 
                    {' '}y mejorar la experiencia de tus pacientes.
                </p>

                {/* Grid de beneficios */}
                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-5
                    gap-6
                    auto-rows-fr
                    animate-fade-in-up
                    delay-200
                ">
                    <div className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
                        <Benefit 
                            icono={<FcCalendar />} 
                            titulo={'Todo organizado'} 
                            contenido={'Reduce la carga administrativa y evita sobrecargas con un sistema de turnos 24/7.'} 
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
                        <Benefit 
                            icono={<FcBullish />} 
                            titulo={'Mayor Visibilidad'} 
                            contenido={'Atrae nuevos pacientes y expande tu práctica profesional apareciendo en nuestro directorio.'} 
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '500ms'}}>
                        <Benefit 
                            icono={<FcSms />} 
                            titulo={'Comunicación Fluida'} 
                            contenido={'Envía recordatorios automáticos y mantén a tus pacientes informados sin esfuerzo.'} 
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '600ms'}}>
                        <Benefit 
                            icono={<FcSmartphoneTablet/>} 
                            titulo={'Acceso móvil'} 
                            contenido={'Tus pacientes pueden reservar, reprogramar o cancelar turnos desde su celular en cualquier momento.'} 
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '700ms'}}>
                        <Benefit 
                            icono={<FcLeave />} 
                            titulo={'Reduce Ausencias'} 
                            contenido={'Disminuye el ausentismo de pacientes con recordatorios de turno por WhatsApp.'} 
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="
                    mt-16
                    animate-fade-in-up
                    delay-300
                ">
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            group
                            bg-gradient-to-r
                            from-indigo-600
                            to-purple-600
                            hover:from-indigo-700
                            hover:to-purple-700
                            text-white
                            font-semibold
                            py-4
                            px-8
                            rounded-full
                            transition-all
                            duration-300
                            transform
                            hover:scale-105
                            hover:shadow-xl
                            shadow-lg
                            inline-flex
                            items-center
                            gap-2
                            cursor-pointer
                        "
                    >
                        Comenzar Ahora
                        <svg 
                            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Benefits