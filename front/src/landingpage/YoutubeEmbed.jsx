import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const YouTubeEmbed = () => {
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

  // ID del video de YouTube (ejemplo: dQw4w9WgXcQ → de https://youtu.be/dQw4w9WgXcQ)
  const videoId = "tTBl4CSIaLY"; // ← Reemplazar con tu ID real
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&modestbranding=1`;

  return (
    <section
      className="py-12 md:py-20 px-6 sm:px-8 lg:px-12 relative max-w-7xl mx-auto"
      aria-labelledby="video-title"
    >
      {/* Fondo decorativo sutil (igual que en Benefits) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-indigo-100 to-blue-100 rounded-full opacity-25 blur-3xl"></div>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* Badge opcional */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200 shadow-sm backdrop-blur-sm">
            ▶️ Mira el tutorial
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2
          id="video-title"
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6 leading-tight"
        >
          Conocé en acción cómo funciona{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Turnate
          </span>
        </motion.h2>

        {/* Descripción */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center leading-relaxed"
        >
          Este video te muestra paso a paso cómo médicos y centros de salud usan nuestra plataforma 
          para automatizar turnos, reducir ausencias y mejorar la experiencia del paciente.
        </motion.p>

        {/* Contenedor del video embebido */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-shadow duration-300 aspect-video"
        >
          <iframe
            src={youtubeEmbedUrl}
            title="Tutorial de Turnate - Gestión de turnos médicos"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </motion.div>

        {/* Texto secundario opcional */}
        <motion.p
          variants={itemVariants}
          className="text-sm text-gray-500 mt-8 text-center"
        >
          Video oficial de Turnate – Actualizado mensualmente. Puedes activar subtítulos y pantalla completa.
        </motion.p>
      </motion.div>

      {/* Animación de brillo lateral (compartida con Benefits) */}
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

export default YouTubeEmbed;