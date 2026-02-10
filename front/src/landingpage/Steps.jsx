import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Steps = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const steps = [
    {
      titulo: "Encuentra tu especialista",
      contenido: "Nuestra IA analiza tu necesidad para conectarte con el profesional ideal en segundos.",
      icon: "🔍",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "hover:border-blue-400/50",
    },
    {
      titulo: "Sincroniza tu agenda",
      contenido: "Visualiza la disponibilidad real. Elegir un horario nunca fue tan fluido y visual.",
      icon: "📅",
      gradient: "from-indigo-500/20 to-purple-500/20",
      border: "hover:border-indigo-400/50",
    },
    {
      titulo: "Gestión instantánea",
      contenido: "Confirmación encriptada y recordatorios vía WhatsApp para que no pierdas nada.",
      icon: "⚡",
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "hover:border-emerald-400/50",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-[#fafafa] relative overflow-hidden">
      {/* Elementos decorativos de fondo (Blobs) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-200/30 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-purple-200/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header con estilo 2026 */}
        <div className="text-left mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-2 text-blue-600 font-bold tracking-[0.2em] uppercase text-xs"
          >
            <span className="w-8 h-[2px] bg-blue-600"></span>
            El proceso
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            Tu salud en <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              tres movimientos.
            </span>
          </motion.h2>
        </div>

        {/* Grid de Pasos (Estilo Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className={`
                h-full p-8 rounded-[2.5rem] bg-white border border-slate-100 
                shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] 
                transition-all duration-500 ease-out
                group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]
                group-hover:-translate-y-2
                ${step.border}
              `}>
                
                {/* Badge de número minimalista */}
                <div className="flex justify-between items-start mb-12">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500`}>
                    {step.icon}
                  </div>
                  <span className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                    0{i + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {step.titulo}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {step.contenido}
                  </p>
                </div>

                {/* Línea decorativa inferior */}
                <div className="mt-8 w-full h-[1px] bg-slate-100 relative overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={isInView ? { x: "100%" } : {}}
                    transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer de la sección */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-slate-900 text-white"
        >
          <div className="text-center md:text-left">
            <p className="text-lg font-bold">¿Listo para empezar?</p>
            <p className="text-slate-400 text-sm">No requiere registro previo para buscar.</p>
          </div>
          <button className="px-8 py-4 bg-blue-500 hover:bg-blue-400 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/20">
            Explorar Médicos 🔍
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Steps;