import React, { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { FaSearch, FaRegClock, FaCheckCircle } from "react-icons/fa";

const Steps = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { threshold: 0.15 });
  const controls = useAnimation();

  const steps = [
    {
      titulo: "1. Busca a tu médico",
      contenido: "Usa nuestro buscador inteligente para filtrar por especialidad y localidad. Encontrá al profesional ideal en segundos.",
      icon: <FaSearch className="text-white text-3xl" />,
      color: "bg-indigo-600 shadow-indigo-200",
    },
    {
      titulo: "2. Elige un horario",
      contenido: "Seleccioná el turno que mejor se adapte a tu agenda de entre los horarios disponibles en tiempo real.",
      icon: <FaRegClock className="text-white text-3xl" />,
      color: "bg-slate-900 shadow-slate-200",
    },
    {
      titulo: "3. Confirmación Instantánea",
      contenido: "Completá tus datos y listo. Recibís los detalles de tu turno por WhatsApp de forma automática y segura.",
      icon: <FaCheckCircle className="text-white text-3xl" />,
      color: "bg-emerald-500 shadow-emerald-200",
    },
  ];

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="info"
      ref={ref}
      className="py-24 max-w-7xl mx-auto px-6"
      aria-labelledby="steps-title"
    >
      {/* === ENCABEZADO ESTILO TURNATE === */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center max-w-4xl mx-auto mb-20 space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 mb-4">
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            Proceso de Reserva
          </span>
        </div>

        <h2
          id="steps-title"
          className="text-5xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase"
        >
          Agenda tu turno en <br />
          <span className="text-indigo-600">3 simples pasos</span>
        </h2>

        <p className="text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto pt-4">
          Rápido, fácil y sin complicaciones. Tu salud merece lo mejor, y tu tiempo también.
        </p>
      </motion.div>

      {/* === GRID DE PASOS === */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-500 transition-all duration-500 flex flex-col items-center text-center h-full"
          >
            {/* Círculo de Icono */}
            <div className={`w-20 h-20 ${step.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
              {step.icon}
            </div>

            {/* Texto informativo */}
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              {step.titulo}
            </h3>
            
            <p className="text-slate-500 font-bold leading-relaxed text-base">
              {step.contenido}
            </p>

            {/* Indicador de número (fondo sutil) */}
            <span className="absolute top-6 right-10 text-8xl font-black text-slate-50 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
              0{index + 1}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Steps;