import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaArrowRight } from 'react-icons/fa';

const FAQS = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const mensaje = "Hola, estoy interesado en sus servicios y tengo algunas dudas.";
    const whatsappUrl = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqData = [
        {
            q: '¿Cómo reservo un turno?',
            a: 'Simplemente usá el buscador en la parte superior, filtrá por especialidad o médico, y elegí un horario disponible. Completá tus datos para confirmar, ¡es así de fácil!',
        },
        {
            q: '¿Qué hago si necesito cancelar un turno?',
            a: 'Podés cancelar tu turno a través del enlace que recibiste en el mensaje de confirmación. Te pedimos que canceles con tiempo para que otro paciente pueda usar ese horario.',
        },
        {
            q: '¿Cómo puedo afiliarme como médico o centro médico?',
            a: 'En la sección "Beneficios" encontrarás un botón de contacto para hablar con nuestro equipo. Te guiaremos en la configuración de tu panel para que empieces a gestionar turnos de inmediato.',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <section
            id="preguntas-frecuentes"
            className="py-24 px-6 max-w-7xl mx-auto overflow-hidden"
            aria-labelledby="faq-title"
        >
            <div className="max-w-4xl mx-auto">
                {/* ===== ENCABEZADO ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 space-y-6"
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                            Centro de ayuda
                        </span>
                    </div>

                    <h2
                        id="faq-title"
                        className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase"
                    >
                        Despejá tus <br />
                        <span className="text-indigo-600">Dudas</span>
                    </h2>
                    
                    <p className="text-slate-500 font-bold text-lg md:text-xl pt-4">
                        Respondemos las consultas más habituales. Si no encontrás lo que buscás, escribinos.
                    </p>
                </motion.div>

                {/* ===== LISTA DE FAQS ===== */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    {faqData.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-500 transition-all duration-300"
                        >
                            <button
                                className="w-full flex justify-between items-center p-8 text-left group"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="font-black text-xl md:text-2xl text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
                                    {item.q}
                                </h3>
                                <motion.div
                                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                        openFAQ === index ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'
                                    }`}
                                >
                                    <FaPlus size={20} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openFAQ === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    >
                                        <div className="px-8 pb-8">
                                            <div className="pt-6 border-t border-slate-100">
                                                <p className="text-slate-500 font-bold text-lg leading-relaxed">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ===== CALL TO ACTION ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl hover:bg-indigo-600 transition-all duration-300"
                    >
                        ¿Tenés otra pregunta? Contactanos
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQS;