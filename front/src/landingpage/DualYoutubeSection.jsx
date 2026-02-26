import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaPlayCircle, FaArrowRight } from "react-icons/fa";

const DualYouTubeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const videoConsultorios = "G5VylYGq3_k"; 
  const videoCentros = "eEzls-hZghY";

  const embedUrl = (id) =>
    `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&showinfo=0&modestbranding=1`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
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

  return (
    <section
      ref={ref}
      className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden"
      id="videos"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* ===== ENCABEZADO ===== */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                Centro de aprendizaje
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase"
          >
            Conocé Turnate <br />
            <span className="text-indigo-600">en acción</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto pt-4"
          >
            Elegí el video tutorial según tu modelo: gestión individual para médicos independientes o panel administrativo para grandes centros.
          </motion.p>
        </div>

        {/* ===== GRID DE VIDEOS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Video 1 - Consultorios */}
          <motion.div variants={itemVariants} className="space-y-8 flex flex-col">
            <div className="bg-white p-3 rounded-[3rem] shadow-2xl border border-slate-100 group transition-all duration-500">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden relative">
                <iframe
                  src={embedUrl(videoConsultorios)}
                  title="Tutorial para consultorios médicos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="text-center md:text-left px-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
                <FaPlayCircle className="text-indigo-600" /> Consultorios
              </h3>
              <p className="mt-3 text-slate-500 font-bold leading-relaxed">
                Ideal para profesionales autónomos. Aprendé a configurar tu disponibilidad, gestionar pacientes y reducir ausencias con avisos automáticos.
              </p>
            </div>
          </motion.div>

          {/* Video 2 - Centros Médicos */}
          <motion.div variants={itemVariants} className="space-y-8 flex flex-col">
            <div className="bg-white p-3 rounded-[3rem] shadow-2xl border border-slate-100 group transition-all duration-500">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden relative">
                <iframe
                  src={embedUrl(videoCentros)}
                  title="Tutorial para centros médicos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="text-center md:text-left px-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
                <FaPlayCircle className="text-slate-900" /> Centros Médicos
              </h3>
              <p className="mt-3 text-slate-500 font-bold leading-relaxed">
                Dominá la gestión de múltiples especialistas, agendas simultáneas y el panel de administración centralizado para tu entidad.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ===== CALL TO ACTION ===== */}
        <motion.div variants={itemVariants} className="mt-24 text-center">
          <motion.a
            href="https://wa.me/5493815588504"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl hover:bg-indigo-600 transition-all duration-300"
          >
            Quiero asesoramiento gratuito
            <FaArrowRight />
          </motion.a>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-8">
            ¿Tenés dudas técnicas? Nuestro soporte está listo para ayudarte.
          </p>
        </motion.div>
      </motion.div>

      {/* Decoraciones de fondo sutiles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
    </section>
  );
};

export default DualYouTubeSection;