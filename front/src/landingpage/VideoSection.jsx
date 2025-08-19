import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaPlay } from "react-icons/fa";


const VideoSection = () => {
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

  // Enlace al video de YouTube
  const youtubeLink = "https://www.youtube.com/watch?v=tTBl4CSIaLY"; // ← Reemplazar con tu URL real

  return (
    <section
      className="py-12 md:py-20 px-6 sm:px-8 lg:px-12 relative max-w-7xl mx-auto"
      aria-labelledby="video-title"
    >
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-indigo-100 to-blue-100 rounded-full opacity-25 blur-3xl"></div>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 text-center"
      >
        {/* Badge opcional */}
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200 shadow-sm">
            <FaPlay className="w-4 h-4" />
            Mira cómo funciona
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2
          id="video-title"
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Descubrí cómo transformar tu{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            gestión médica
          </span>
        </motion.h2>

        {/* Descripción */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          En solo 3 minutos, te mostramos paso a paso cómo integrar tu consultorio a nuestra plataforma, 
          automatizar turnos y conectar con más pacientes.
        </motion.p>

        {/* Miniatura del video con overlay */}
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          className="max-w-4xl mx-auto"
        >
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver video explicativo en YouTube"
            className="group block relative rounded-3xl overflow-hidden shadow-2xl aspect-video max-h-96 mx-auto"
          >
            {/* Miniatura simulada (puedes reemplazar con una imagen real) */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>

            {/* Overlay con efecto hover */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

            {/* Botón de play animado */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={{
                hover: { scale: 1.1 },
              }}
            >
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/30 backdrop-blur-md border-4 border-white shadow-xl">
                <FaPlay className="w-10 h-10 drop-shadow-lg" />
              </div>
            </motion.div>

            {/* Efecto de brillo al pasar el mouse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-25 group-hover:animate-shine pointer-events-none"></div>
          </a>
        </motion.div>

        {/* Texto secundario opcional */}
        <motion.p
          variants={itemVariants}
          className="text-sm text-gray-500 mt-8"
        >
          Video oficial de Turnate – Actualizado mensualmente con nuevas funciones.
        </motion.p>
      </motion.div>

      {/* Estilos globales para animación de brillo (shine) */}
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

export default VideoSection;