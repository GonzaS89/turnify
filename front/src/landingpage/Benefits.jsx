import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaRegCalendarAlt,
  FaMobileAlt,
  FaWhatsapp,
  FaChartBar,
  FaUserShield,
  FaArrowRight,
  FaPlus
} from "react-icons/fa";

// Componente Benefit (Refactorizado con estética Institucional)
const Benefit = ({ icono, titulo, contenido }) => {
  return (
    <motion.div
      className="group bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 hover:shadow-2xl hover:border-indigo-500 transition-all duration-500 h-full flex flex-col items-center text-center"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Icono con estética Turnate */}
      <div className="w-20 h-20 mb-8 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-indigo-100/50">
        {React.cloneElement(icono, { className: "text-3xl" })}
      </div>

      {/* Título - Estilo Black */}
      <h3 className="text-2xl font-black text-slate-900 mb-4 leading-none uppercase tracking-tighter">
        {titulo}
      </h3>

      {/* Descripción - Estilo Bold Slate */}
      <p className="text-slate-500 font-bold leading-relaxed flex-grow text-base">
        {contenido}
      </p>
    </motion.div>
  );
};

const Benefits = () => {
  const mensaje = "Hola, vine de Turnate y quiero afiliar mi consultorio o centro médico. ¿Pueden ayudarme?";
  const whatsappLink = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      id="beneficios"
      className="relative py-24 px-6 max-w-7xl mx-auto overflow-hidden"
      aria-labelledby="benefits-title"
    >
      <motion.div
        ref={ref}
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
                Ventajas para Profesionales
              </span>
            </div>
          </motion.div>

          <motion.h2
            id="benefits-title"
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase"
          >
            Optimiza tu gestión y <br />
            <span className="text-indigo-600">expande tu práctica</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-slate-500 font-bold text-lg md:text-xl max-w-3xl mx-auto pt-4"
          >
            Nuestra plataforma es la herramienta clave para 
            <span className="text-slate-900"> simplificar procesos</span>, atraer pacientes y 
            <span className="text-slate-900"> mejorar la experiencia</span> de atención.
          </motion.p>
        </div>

        {/* ===== GRID DE BENEFICIOS ===== */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <Benefit
            icono={<FaRegCalendarAlt />}
            titulo="Gestión 24/7"
            contenido="Agenda online siempre activa. Reduce la carga administrativa y mantén tu calendario perfectamente organizado."
          />
          <Benefit
            icono={<FaChartBar />}
            titulo="Control Total"
            contenido="Accede a métricas de tus turnos, asistencias y rendimiento de tu consultorio desde cualquier dispositivo."
          />
          <Benefit
            icono={<FaWhatsapp />}
            titulo="Recordatorios"
            contenido="Notificaciones automáticas por WhatsApp para reducir ausencias y mejorar la puntualidad de tus pacientes."
          />
          <Benefit
            icono={<FaMobileAlt />}
            titulo="Acceso Remoto"
            contenido="Gestioná tus citas desde tu celular o tablet. Tu consultorio siempre con vos, donde sea que estés."
          />
          <Benefit
            icono={<FaUserShield />}
            titulo="Seguridad"
            contenido="Protección total de los datos de tus pacientes."
          />
          <Benefit
            icono={<FaPlus className="text-white" />}
            titulo="Escalabilidad"
            contenido="Ideal tanto para consultorios particulares como para grandes centros médicos con múltiples profesionales."
          />
        </motion.div>

        {/* ===== CALL TO ACTION ===== */}
        <motion.div
          variants={itemVariants}
          className="mt-24 text-center"
        >
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl hover:bg-indigo-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Conectá tu consultorio hoy
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </motion.a>
          
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-8">
            Asistencia personalizada en cada paso del proceso
          </p>
        </motion.div>
      </motion.div>

      {/* Decoración sutil de fondo */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-slate-100 rounded-full blur-[120px] opacity-60"></div>
    </section>
  );
};

export default Benefits;