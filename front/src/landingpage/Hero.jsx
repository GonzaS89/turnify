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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] pt-20 px-4 md:px-8">
      {/* --- ELEMENTOS DE FONDO (Diseño Orgánico) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-blue-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-purple-100/40 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* BLOQUE DE TEXTO (7 Columnas) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Tecnología en Salud</span>
            </div>

            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Turnos médicos <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                re-imaginados.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
              Eliminamos la fricción entre vos y tu salud. Una interfaz fluida para conectar con los mejores especialistas del país.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <motion.button
                onClick={() => navigate("/buscarprofesionales")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 transition-all hover:bg-slate-800"
              >
                Reservar ahora
              </motion.button>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Ver especialistas
              </button>
            </div>
          </motion.div>

          {/* BLOQUE DE IMAGEN (5 Columnas - Estilo Bento) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-4 border border-slate-100">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-slate-50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Glass Card Flotante */}
                <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute bottom-6 right-6 left-6 p-4 backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl shadow-xl z-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">✓</div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Próxima Disponibilidad</p>
                      <p className="text-sm font-black text-slate-900">Hoy, 14:30 hs</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Controles de Imagen Minimalistas */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-1.5 transition-all duration-300 rounded-full ${i === currentIndex ? "h-8 bg-blue-600" : "h-4 bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;