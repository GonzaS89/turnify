import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Imágenes
import img from "../assets/medic.png";
import img2 from "../assets/medic2.png";
import img3 from "../assets/medic4.png";
import img4 from "../assets/medic3.png";

const Hero = ({ enviarIds, openModalProf }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const images = [img, img2, img3, img4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="hero-section"
      className="relative w-full overflow-hidden mt-4 lg:mt-32"
      aria-labelledby="hero-title"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>

      {/* Bubbles animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute -top-32 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full opacity-30 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-10 -right-10 w-80 h-80 bg-gradient-to-l from-teal-100 to-purple-100 rounded-full opacity-25 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-t from-indigo-100 to-cyan-100 rounded-full opacity-20 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        ></div>
      </div>

      {/* Contenido con padding lateral, pero fondo completo */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-28 md:py-32">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16"
          >
            {/* Texto */}
            <motion.div
              variants={itemVariants}
              className="flex-1 text-center lg:text-left max-w-lg mx-auto lg:mx-0"
            >
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5"
              >
                Turnos médicos{" "}
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  sin complicaciones
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                Consultá profesionales disponibles y reservá tu cita en solo unos clics. Rápido, claro y seguro.
              </p>

              <motion.button
                onClick={() => navigate("/buscarprofesionales")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-cyan-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="flex items-center gap-2 uppercase">
                  🔍 Buscar turnos aquí
                  <svg
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
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
              </motion.button>
            </motion.div>

            {/* Carrusel */}
            <motion.div variants={itemVariants} className="flex-1 flex justify-center w-full">
              <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-lg aspect-[4/5] max-h-[520px] rounded-3xl overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Profesional médico - ${currentIndex + 1}`}
                    className="bg-white/20 absolute inset-0 w-full h-full object-contain object-center rounded-3xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </AnimatePresence>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-white scale-125 shadow-md"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;