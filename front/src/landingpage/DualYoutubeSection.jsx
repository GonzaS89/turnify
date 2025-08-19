import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DualYouTubeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // IDs de los videos de YouTube (reemplazalos con los reales)
  const videoConsultorios = "G5VylYGq3_k"; // ← Video para médicos individuales
  const videoCentros = "eEzls-hZghY"; // ← Video para centros médicos

  const embedUrl = (id) =>
    `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&showinfo=0&modestbranding=1`;

  return (
    <section
      className="py-16 md:py-24 px-6 sm:px-8 lg:px-12 relative max-w-7xl mx-auto"
      aria-labelledby="dual-video-title"
    >
      {/* Fondos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-l from-pink-100 to-rose-100 rounded-full opacity-25 blur-3xl"></div>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* Badge diferenciada */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/80 backdrop-blur-md text-indigo-700 rounded-full border border-indigo-200 shadow-md">
            🎥 Videos explicativos
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.h2
                  id="video-title"
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 text-center mb-6 leading-tight"
                >
                  Conocé en acción cómo funciona{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Turnate
                  </span>
                </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg xl:text-xl text-gray-600 max-w-4xl mx-auto mb-16 text-center leading-relaxed"
        >
          Elegí el camino que mejor se adapta a tu modelo: desde el consultorio
          individual hasta el centro médico con múltiples especialistas. Te
          mostramos cómo funciona en ambos casos.
        </motion.p>

        {/* Grid de videos */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto"
        >
          {/* Video - Consultorios */}
          <div className="flex flex-col">
            <div className="bg-white p-1 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={embedUrl(videoConsultorios)}
                  title="Tutorial para consultorios médicos - Turnate"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="mt-5 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Para{" "}
                <span className="text-indigo-600">
                  consultorios individuales
                </span>
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Gestioná tu agenda con total autonomía, mejorá la comunicación
                con tus pacientes y aumentá tu visibilidad en la plataforma.
                Ideal para médicos independientes que buscan profesionalizar su
                práctica sin complicaciones.
              </p>
            </div>
          </div>

          {/* Video - Centros Médicos */}
          <div className="flex flex-col">
            <div className="bg-white p-1 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={embedUrl(videoCentros)}
                  title="Tutorial para centros médicos - Turnate"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="mt-5 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Para <span className="text-purple-600">centros médicos</span>
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Gestioná múltiples profesionales, especialidades y turnos
                simultáneos. Con panel administrativo y sincronización
                en tiempo real.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA opcional debajo */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <a
            href="https://wa.me/5493815588504?text=Hola,%20quiero%20más%20información%20para%20mi%20consultorio%20o%20centro%20médico"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Comunicáte con nosotros
            <svg
              className="w-5 h-5"
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
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Asesoramiento gratuito y personalizado según tu modelo de negocio.
          </p>
        </motion.div>
      </motion.div>

      {/* Animación de brillo (compartida) */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default DualYouTubeSection;
