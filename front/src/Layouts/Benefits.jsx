import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FcCalendar, FcSmartphoneTablet, FcBullish, FcSms, FcLeave } from "react-icons/fc";

// Asegúrate de que el componente 'Benefit' exista y esté correctamente importado
// import Benefit from './components/Benefit';

const Benefit = ({ icono, titulo, contenido }) => (
    <div className="
        p-8
        bg-white
        rounded-2xl
        shadow-xl
        border
        border-gray-100
        hover:shadow-2xl
        transition-shadow
        duration-300
        h-full
        flex
        flex-col
        items-center
        text-center
        space-y-4
    ">
        <div className="
            p-3
            bg-indigo-50
            rounded-full
            inline-flex
            justify-center
            items-center
            mb-4
            transform
            transition-transform
            duration-300
            group-hover:scale-110
        ">
            {icono}
        </div>
        <h3 className="
            text-xl
            font-bold
            text-gray-900
            leading-tight
            mb-2
        ">
            {titulo}
        </h3>
        <p className="
            text-gray-600
            leading-relaxed
            text-base
            flex-grow
        ">
            {contenido}
        </p>
    </div>
);

const Benefits = () => {
    // Reemplaza con tu número de WhatsApp (código de país + número)
    const whatsappLink = "https://wa.me/5493814482619"; // Ejemplo para Argentina

    // Crear una referencia al elemento que queremos observar
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Definir las variantes de animación para Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Retraso entre los elementos hijos
                delayChildren: 0.2, // Retraso antes de que los hijos comiencen a animarse
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <section
            id='beneficios'
            className="
                relative
                py-24
                px-6
                sm:px-8
                lg:px-12
            
                overflow-hidden
            "
        >
            {/* Fondo de gradiente y formas animadas */}
            <div className="absolute inset-0">
                <div className="
                    absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl animate-blob-1
                "></div>
                <div className="
                    absolute bottom-10 right-10 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-blob-2
                "></div>
                <div className="
                    absolute -bottom-20 left-1/4 w-96 h-96 bg-pink-200 rounded-full opacity-15 blur-3xl animate-blob-3
                "></div>
            </div>

            {/* Contenido principal, envuelto en motion.div para animar */}
            <motion.div
                ref={ref} // Asignamos la referencia para detectar la visibilidad
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="
                    max-w-7xl
                    mx-auto
                    relative
                    z-10
                    text-center
                "
            >
                {/* Badge decorativo */}
                <motion.div variants={itemVariants} className="
                    inline-flex items-center justify-center gap-2 px-5 py-2
                    bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700
                    rounded-full text-sm font-semibold uppercase tracking-wide mb-6
                ">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping-slow"></div>
                    <span>Descubre las ventajas</span>
                </motion.div>

                {/* Título principal */}
                <motion.h2 variants={itemVariants} className="
                    text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4
                    leading-tight
                ">
                    Optimiza tu gestión y expande tu <br />
                    <span className="
                        bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent
                    ">
                        práctica profesional
                    </span>
                </motion.h2>

                {/* Subtítulo */}
                <motion.p variants={itemVariants} className="
                    text-lg text-gray-600 max-w-4xl mx-auto mb-16 leading-relaxed
                ">
                    Para médicos y centros de salud, nuestra plataforma es la herramienta clave para
                    <span className="font-bold text-gray-800"> simplificar procesos</span>,
                    <span className="font-bold text-gray-800"> atraer nuevos pacientes</span> y
                    <span className="font-bold text-gray-800"> mejorar la experiencia</span>.
                </motion.p>

                {/* Grid de beneficios */}
                <div className="
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 auto-rows-fr
                ">
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icono={<FcCalendar className="w-12 h-12" />}
                            titulo={'Gestión 24/7'}
                            contenido={'Ofrece un sistema de turnos online y reduce la carga administrativa. Tu agenda siempre organizada.'}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icono={<FcBullish className="w-12 h-12" />}
                            titulo={'Más Pacientes'}
                            contenido={'Aparece en nuestro directorio y llega a una audiencia más amplia. Expande tu visibilidad sin esfuerzo.'}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icono={<FcSms className="w-12 h-12" />}
                            titulo={'Recordatorios Smart'}
                            contenido={'Envía notificaciones automáticas y personalizadas a tus pacientes, mejorando la comunicación.'}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icono={<FcSmartphoneTablet className="w-12 h-12" />}
                            titulo={'Reserva Móvil'}
                            contenido={'Tus pacientes pueden reservar, modificar o cancelar turnos desde cualquier dispositivo, a su conveniencia.'}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icono={<FcLeave className="w-12 h-12" />}
                            titulo={'Minimiza Ausencias'}
                            contenido={'Reduce significativamente la tasa de ausentismo con recordatorios de turno proactivos vía WhatsApp.'}
                        />
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div variants={itemVariants} className="mt-20">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex items-center justify-center gap-2 px-10 py-4 text-white
                            font-extrabold rounded-full transition-all duration-300 transform
                            hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r
                            from-indigo-600 to-purple-600 hover:from-indigo-700
                            hover:to-purple-700 ring-4 ring-indigo-300/50 group
                        "
                    >
                        Comenzar Ahora
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Benefits;
