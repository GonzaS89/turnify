import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const BenefitCard = ({ icon, title, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    whileHover={{ y: -10 }}
    className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/50 to-transparent group"
  >
    <div className="h-full bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500">
      <div className="w-14 h-14 mb-6 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-slate-200">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{text}</p>
      
      {/* Decorative tag */}
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
      </div>
    </div>
  </motion.div>
);

const Benefits = () => {
  const whatsappLink = "https://wa.me/5493815588504?text=Hola! Quiero afiliar mi consultorio.";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const benefitsData = [
    { title: "Gestión 24/7", text: "Tu agenda nunca duerme. Recibe reservas mientras descansas.", icon: "🌙" },
    { title: "Multi-dispositivo", text: "Control total desde tu smartphone, tablet o desktop.", icon: "📱" },
    { title: "WhatsApp Sync", text: "Recordatorios automáticos que reducen el ausentismo un 70%.", icon: "💬" },
    { title: "Cero Burocracia", text: "Simplifica el alta de pacientes y la gestión de historias.", icon: "⚡" },
    { title: "Reportes Pro", text: "Analiza el crecimiento de tu consultorio con datos reales.", icon: "📊" }
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-[#f8fafc]">
      {/* Ambient Light Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em]"
          >
            Partnership
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none"
          >
            Escalá tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              práctica médica.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-slate-500 text-lg font-medium"
          >
            Herramientas de nivel empresarial para profesionales independientes.
          </motion.p>
        </div>

        {/* Bento-Inspired Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitsData.map((b, i) => (
            <BenefitCard key={i} title={b.title} text={b.text} icon={b.icon} delay={i * 0.1} />
          ))}
          
          {/* Tarjeta de CTA integrada en el Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="lg:col-span-1 p-8 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col justify-center items-center text-center space-y-6 shadow-2xl shadow-indigo-200"
          >
            <h3 className="text-2xl font-bold italic">"El cambio que tu secretaría necesitaba."</h3>
            <a 
              href={whatsappLink}
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Contactar ahora
            </a>
          </motion.div>
        </div>

        {/* Social Proof Sutil */}
        <div className="mt-20 flex justify-center items-center gap-12 opacity-40 grayscale">
          <span className="font-black text-2xl tracking-widest uppercase">Seguro</span>
          <span className="font-black text-2xl tracking-widest uppercase">Rápido</span>
          <span className="font-black text-2xl tracking-widest uppercase">Global</span>
        </div>
      </div>
    </section>
  );
};

export default Benefits;