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
      className="relative mx-auto overflow-hidden flex items-center mt-32 md:max-w-4xl xl:max-w-7xl px-8"
      aria-labelledby="hero-title"
    >


      {/* Contenido */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 lg:gap-16"
          >
            {/* Texto: 50% en lg+ */}
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 lg:max-w-none max-w-xl mx-auto lg:mx-0 flex flex-col justify-center"
            >
              <h1
                id="hero-title"
                className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight mb-5 text-center"
              >
                Turnos médicos{" "}
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  sin complicaciones
                </span>
              </h1>

              <p className="text-lg lg:text-base xl:text-xl text-gray-600 leading-relaxed mb-8 text-center">
                Consultá profesionales disponibles y reservá tu cita en solo unos clics. Rápido, claro y seguro.
              </p>

              <motion.button
                onClick={() => navigate("/buscarprofesionales")}
                className="group mx-auto inline-flex items-center gap-3 px-8 py-4 lg:py-3 xl:py-5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-lg lg:text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-cyan-300 text-center"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="flex items-center gap-2 uppercase md:text-sm lg:text-base xl:text-xl">
                  🔍 Reservar turnos aquí
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

            {/* Imagen: 50% en lg+ */}
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 w-full flex justify-center"
            >
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-none aspect-[4/5] max-h-[520px] rounded-3xl overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Profesional médico - ${currentIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-contain object-center rounded-3xl"
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
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
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