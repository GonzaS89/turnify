import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FcCalendar,
  FcSmartphoneTablet,
  FcBullish,
  FcSms,
  FcLeave,
} from "react-icons/fc";

// Componente Benefit (refactorizado para máxima elegancia)
const Benefit = ({ icono, titulo, contenido }) => {
  return (
    <motion.div
      className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 h-full flex flex-col text-center"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      {/* Icono con fondo animado */}
      <div className="inline-flex justify-center items-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-2xl group-hover:from-indigo-100 group-hover:to-indigo-200 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icono, { className: "w-8 h-8" })}
      </div>

      {/* Título */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-700 transition-colors">
        {titulo}
      </h3>

      {/* Descripción */}
      <p className="text-gray-600 leading-relaxed flex-grow">
        {contenido}
      </p>
    </motion.div>
  );
};

const Benefits = () => {
  const mensaje =
    "Hola, vine de Turnate y quiero afiliar mi consultorio o centro médico. ¿Pueden ayudarme?";
  const whatsappLink = `https://wa.me/5493815588504?text=${encodeURIComponent(
    mensaje
  )}`;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  // Variants para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="beneficios"
      className="relative py-8 md:py-14 lg:y-28 px-6 sm:px-8 lg:px-12 overflow-hidden bg-white/50 rounded-xl lg:rounded-[100px] max-w-7xl mx-auto"
      aria-labelledby="benefits-title"
    >
      {/* Fondo decorativo con blobs animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-30 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-l from-pink-100 to-rose-100 rounded-full opacity-25 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -top-20 right-1/3 w-72 h-72 bg-gradient-to-t from-blue-100 to-indigo-100 rounded-full opacity-20 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        ></div>
      </div>

      {/* Contenido principal */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto relative z-10"
        aria-labelledby="benefits-title"
      >
        {/* Badge con efecto de brillo */}
        <motion.div
  variants={itemVariants}
  className="flex justify-center items-center w-full mb-8"
>
  <div className="inline-flex justify-center items-center gap-3 px-6 py-3 backdrop-blur-md 
    border border-indigo-200 text-indigo-700 font-semibold text-sm uppercase tracking-wider 
    rounded-full shadow-md bg-white/70"
  >
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
    </span>
    <span>Beneficios de Afiliarte</span>
  </div>
</motion.div>

        {/* Título principal */}
        <motion.h2
          id="benefits-title"
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight"
        >
          Optimiza tu gestión y expande tu{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            práctica profesional
          </span>
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-4xl mx-auto mb-16 text-center leading-relaxed"
        >
          Para médicos y centros de salud, nuestra plataforma es la herramienta
          clave para{" "}
          <span className="font-semibold text-gray-800">simplificar procesos</span>,{" "}
          <span className="font-semibold text-gray-800">atraer nuevos pacientes</span>{" "}
          y{" "}
          <span className="font-semibold text-gray-800">mejorar la experiencia</span>.
        </motion.p>

        {/* Grid de beneficios */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-6 auto-rows-fr"
        >
          <Benefit
            icono={<FcCalendar />}
            titulo="Gestión 24/7"
            contenido="Agenda online siempre activa. Reduce carga administrativa y mantén tu calendario perfectamente organizado."
          />
          <Benefit
            icono={<FcBullish />}
            titulo="Más Pacientes"
            contenido="Aparece en nuestro directorio médico y llega a miles de pacientes en busca de especialistas como vos."
          />
          <Benefit
            icono={<FcSms />}
            titulo="Recordatorios Smart"
            contenido="Envía notificaciones automáticas por WhatsApp y email para reducir ausencias y mejorar la comunicación."
          />
          <Benefit
            icono={<FcSmartphoneTablet />}
            titulo="Reserva Móvil"
            contenido="Tus pacientes reservan, modifican o cancelan turnos desde cualquier dispositivo, con solo unos toques."
          />
          <Benefit
            icono={<FcLeave />}
            titulo="Minimiza Ausencias"
            contenido="Reduce hasta un 70% las faltas gracias a recordatorios proactivos y confirmaciones automáticas."
          />
        </motion.div>

        {/* Call to Action – Botón premium con animación */}
        <motion.div
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp para afiliarte"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-full shadow-xl relative overflow-hidden transition-all duration-300"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 25px 35px -10px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Fondo gradiente animado */}
            <span
              className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            ></span>
            {/* Efecto de brillo lateral */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine"></span>

            {/* Contenido */}
            <span className="relative z-10 flex items-center gap-2">
              Conectá tu consultorio hoy
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </motion.a>

          {/* Texto secundario opcional */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-500 mt-4"
          >
            Soporte rápido y asistencia personalizada en cada paso del proceso.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Estilos globales adicionales (puedes ponerlos en tu CSS global o en un archivo aparte) */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default Benefits;