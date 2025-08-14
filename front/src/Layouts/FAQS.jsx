import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqData = [
        {
            q: '¿Cómo reservo un turno?',
            a: 'Simplemente usa el buscador en la parte superior, filtra por especialidad o médico, y elige un horario disponible. Completa tus datos para confirmar, ¡es así de fácil!',
        },
        {
            q: '¿Qué hago si necesito cancelar un turno?',
            a: 'Puedes cancelar tu turno a través del enlace que recibiste en el correo de confirmación. Te pedimos que canceles con al menos 24 horas de anticipación para que otro paciente pueda usar ese horario.',
        },
        {
            q: '¿Cómo puedo afiliarme como médico o centro médico?',
            a: 'En la sección "Beneficios de Afiliarte" encontrarás un botón de contacto para hablar con nuestro equipo. Te guiaremos en la creación de tu perfil para que empieces a recibir reservas de inmediato.',
        },
    ];

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
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

    const iconRotate = {
        open: { rotate: 45, transition: { duration: 0.3, ease: 'easeInOut' } },
        closed: { rotate: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <section
            id="preguntas-frecuentes"
            className="py-20 lg:py-28 overflow-hidden bg-white/50 rounded-xl lg:rounded-[100px]"
            aria-labelledby="faq-title"
        >
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
                {/* Encabezado con animación */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <h2
                        id="faq-title"
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-5"
                    >
                        Preguntas <span className="text-indigo-600">Frecuentes</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed opacity-90">
                        Aquí respondemos a las dudas más comunes. Si no encuentras lo que buscas, no dudes en contactarnos.
                    </p>
                </motion.div>

                {/* Lista de FAQs */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-5 max-w-4xl mx-auto"
                >
                    {faqData.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-4 focus-within:ring-indigo-100"
                            onClick={() => toggleFAQ(index)}
                            tabIndex="0"
                            role="button"
                            aria-expanded={openFAQ === index}
                            aria-controls={`faq-answer-${index}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleFAQ(index);
                                }
                            }}
                        >
                            {/* Pregunta */}
                            <div className="flex justify-between items-center p-6 sm:p-8 cursor-pointer group">
                                <h3 className="font-semibold text-xl sm:text-2xl text-gray-800 leading-tight flex-1 group-hover:text-indigo-700 transition-colors duration-200">
                                    {item.q}
                                </h3>
                                <motion.span
                                    className="text-3xl font-light text-indigo-600 bg-indigo-50 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 ml-6"
                                    variants={iconRotate}
                                    animate={openFAQ === index ? 'open' : 'closed'}
                                >
                                    +
                                </motion.span>
                            </div>

                            {/* Respuesta */}
                            <AnimatePresence initial={false}>
                                {openFAQ === index && (
                                    <motion.div
                                        id={`faq-answer-${index}`}
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        className="px-6 sm:px-8 pb-6 sm:pb-8"
                                        role="region"
                                        aria-labelledby={`faq-question-${index}`}
                                    >
                                        <div className="border-t border-gray-200 pt-6">
                                            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                                                {item.a}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Llamado a la acción final */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <a
                        href="#contacto"
                        className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-105"
                    >
                        ¿Tienes otra pregunta? Contáctanos
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQS;