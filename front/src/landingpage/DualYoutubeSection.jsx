import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DualYouTubeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const videoConsultorios = "G5VylYGq3_k"; 
  const videoCentros = "eEzls-hZghY";

  const embedUrl = (id) =>
    `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1&controls=1`;

  return (
    <section ref={ref} id="videos" className="py-24 relative overflow-hidden bg-white">
      {/* Luces de fondo dinámicas */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-50/50 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Experiencia Turnate
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            Diseñado para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              cada escala.
            </span>
          </motion.h2>
        </div>

        {/* Grid Dual Estilo 2026 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* OPCIÓN 1: CONSULTORIOS */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group space-y-8"
          >
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <iframe
                src={embedUrl(videoConsultorios)}
                className="w-full h-full object-cover"
                allowFullScreen
                loading="lazy"
                title="Consultorios"
              />
            </div>
            <div className="px-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase rounded-lg">Individual</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Consultorios Médicos</h3>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Autonomía total para el profesional independiente. Gestioná tu agenda, reducibilidad y recordatorios automáticos en un solo panel intuitivo.
              </p>
            </div>
          </motion.div>

          {/* OPCIÓN 2: CENTROS MÉDICOS */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group space-y-8"
          >
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <iframe
                src={embedUrl(videoCentros)}
                className="w-full h-full object-cover"
                allowFullScreen
                loading="lazy"
                title="Centros Médicos"
              />
            </div>
            <div className="px-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-black uppercase rounded-lg">Enterprise</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Centros de Salud</h3>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Potencia multi-especialidad. Control administrativo centralizado, gestión de múltiples agendas y analíticas avanzadas de rendimiento por médico.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Footer CTA con estilo Floating Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 md:p-12 rounded-[3rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="relative z-10 text-center md:text-left">
            <h4 className="text-3xl font-black tracking-tight mb-2">¿Necesitás una demo guiada?</h4>
            <p className="text-slate-400 font-medium tracking-wide">Nuestro equipo te ayuda a configurar tu flujo de trabajo ideal.</p>
          </div>
          
          <a
            href="https://wa.me/5493815588504"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-10 py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-lg hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            Hablar con un asesor
          </a>

          {/* Decoración abstracta interna */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -z-0" />
        </motion.div>
      </div>
    </section>
  );
};

export default DualYouTubeSection;