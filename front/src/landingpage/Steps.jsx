import React, { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

// Si no usas un componente externo "Step", lo integramos directamente
// Aquí no necesitas importarlo, lo creamos inline

const Steps = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  const inView = useInView(ref, { threshold: 0.15 });

  const controls = useAnimation();

  const steps = [
    {
      titulo: "1. Busca a tu médico",
      contenido:
        "Usa nuestro buscador inteligente para filtrar por especialidad, nombre o fecha y encuentra al profesional de la salud ideal.",
      icon: "🔍",
      color: "from-blue-500 to-blue-600",
    },
    {
      titulo: "2. Elige un horario",
      contenido:
        "Selecciona el turno que mejor se adapte a tu agenda de entre los horarios disponibles. Es rápido y sencillo.",
      icon: "📅",
      color: "from-teal-500 to-emerald-600",
    },
    {
      titulo: "3. Confirma tu reserva",
      contenido:
        "Completa tus datos personales y recibe la confirmación de tu turno al instante por correo y WhatsApp.",
      icon: "✅",
      color: "from-green-500 to-teal-500",
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
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="info"
      ref={ref}
      className="py-8 md:py-12 lg:py-16  lg:max-w-4xl xl:max-w-7xl mx-auto relative overflow-hidden bg-white/50 rounded-xl lg:rounded-[100px] px-4"
      aria-labelledby="steps-title"
    >
      <div>
        {/* === Fondo decorativo con blobs animados === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 -left-20 w-96 h-96 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full opacity-30 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "7s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-teal-100 to-emerald-100 rounded-full opacity-25 blur-3xl animate-pulse-slow"
          style={{ animationDuration: "9s", animationDelay: "2s" }}
        ></div>
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Encabezado animado */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-indigo-200 text-indigo-700 font-semibold text-sm uppercase tracking-wider rounded-full shadow-md mx-auto mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <span>CÓMO FUNCIONA</span>
          </motion.div>

          <motion.h2
            id="steps-title"
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-4xl xl:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
          >
            Agenda tu turno en{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              3 simples pasos
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-base xl:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            Rápido, fácil y sin complicaciones. Tu salud merece lo mejor, y tu tiempo también.
          </motion.p>
        </motion.div>

        {/* Contenedor de pasos */}
        <div className="max-w-6xl mx-auto relative">
          {/* Línea de progreso (solo desktop) */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: "90%" } : { width: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
            />
          </div>

          {/* Grid de pasos */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                className="relative"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Número del paso (decorativo) */}
                <div
                  className={`absolute -top-6 -left-6 w-12 xl:w-16 h-12 xl:h-16 rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg xl:text-3xl flex items-center justify-center shadow-lg z-20`}
                >
                  {index + 1}
                </div>

                {/* Tarjeta del paso */}
                <motion.div
                  className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-3xl transition-all duration-500 h-full cursor-default relative group"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 30px 40px -10px rgba(0, 0, 0, 0.18)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icono */}
                  <div className="text-6xl md:text-3xl xl:text-5xl mb-6 drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Título */}
                  <h3 className="text-2xl md:text-xl xl:text-2xl font-bold text-gray-800 mb-4 leading-tight">
                    {step.titulo}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-600 leading-relaxed xl:text-lg">
                    {step.contenido}
                  </p>

                  {/* Efecto de brillo lateral (opcional) */}
                  <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      </div>
    
   
    </section>
  );
};

export default Steps;