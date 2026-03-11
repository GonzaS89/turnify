import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Imágenes
import img from "../assets/medic.png";
import img2 from "../assets/medic2.png";
import img3 from "../assets/medic4.png";
import img4 from "../assets/medic3.png";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const images = [img, img2, img3, img4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative mx-auto flex items-center mt-24 md:mt-48 max-w-7xl px-6 md:px-12 overflow-hidden">
      <div className="relative z-10 w-full">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12"
          >
            {/* ===== BLOQUE DE TEXTO ===== */}
            {/* En mobile: primero el texto. md:text-left asegura alineación en escritorio */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6 mt-8 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  Plataforma Turnate 🩺
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1] md:leading-[0.9] tracking-tighter uppercase">
                Turnos médicos <br />
                <span className="text-indigo-600">sin vueltas</span>
              </h1>

              <p className="text-slate-500 font-bold text-base md:text-lg lg:text-xl leading-relaxed max-w-lg">
                Gestioná tus citas con profesionales de forma simple, rápida y totalmente digital. El control de tu salud, en un solo lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
                <motion.button
                  onClick={() => navigate("/buscarprofesionales")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 md:px-10 py-4 md:py-5 bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                >
                  🔍 Buscar Profesionales
                </motion.button>
              </div>
            </div>

            {/* ===== BLOQUE DE IMAGEN (SLIDER) ===== */}
            {/* 'flex' en mobile para que aparezca abajo. 'hidden md:flex' si prefieres que NO aparezca en mobile */}
            <div className="w-full md:w-1/2 flex justify-center relative mt-4 md:mt-0">
              {/* Decoración de fondo - Ajustada para mobile */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[120%] h-[80%] md:h-[120%] bg-indigo-100/50 rounded-full blur-[60px] md:blur-[100px] -z-10"></div>
              
              {/* Contenedor imagen: Escala reducida en mobile (max-w-[280px]) vs desktop (max-w-[450px]) */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] aspect-[4/5] bg-white rounded-[2.5rem] md:rounded-[4rem] p-3 md:p-4 shadow-2xl border border-slate-100 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt="Médico"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover rounded-[2rem] md:rounded-[3rem]"
                  />
                </AnimatePresence>

                {/* Indicadores (Dots) - Más pequeños en mobile */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 bg-slate-900/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 md:h-2 rounded-full transition-all ${
                        index === currentIndex ? "w-6 md:w-8 bg-white" : "w-1.5 md:w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;