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
            a: 'Simplemente usa el buscador en la parte superior, filtra por especialidad o médico, y elige un horario disponible. Completa tus datos para confirmar, ¡es así de fácil!'
        },
        {
            q: '¿Qué hago si necesito cancelar un turno?',
            a: 'Puedes cancelar tu turno a través del enlace que recibiste en el correo de confirmación. Te pedimos que canceles con al menos 24 horas de anticipación para que otro paciente pueda usar ese horario.'
        },
        {
            q: '¿Qué métodos de pago se aceptan?',
            a: 'Actualmente, el pago se realiza directamente en la consulta. Estamos trabajando para integrar opciones de pago en línea para ofrecerte más flexibilidad en el futuro.'
        },
        {
            q: '¿Cómo puedo afiliarme como médico o centro médico?',
            a: 'En la sección "Beneficios de Afiliarte" encontrarás un botón de contacto para hablar con nuestro equipo. Te guiaremos en la creación de tu perfil para que empieces a recibir reservas de inmediato.'
        },
    ];

    return (
        <section id="preguntas-frecuentes" className="py-20 lg:py-24">
            <div className="
                max-w-7xl
                mx-auto
                px-4
                sm:px-6
                lg:px-8
            ">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="
                        text-3xl
                        sm:text-4xl
                        lg:text-5xl
                        font-extrabold
                        text-gray-900
                        mb-4
                    ">
                        ¿Tienes Preguntas?
                    </h2>
                    <p className="
                        text-lg
                        text-gray-600
                        max-w-xl
                        mx-auto
                        leading-relaxed
                    ">
                        Aquí respondemos a las dudas más comunes. Si no encuentras lo que buscas, no dudes en contactarnos.
                    </p>
                </div>

                <div className="
                    max-w-4xl
                    mx-auto
                    space-y-6
                ">
                    {faqData.map((item, index) => (
                        <motion.div
                            key={index}
                            className="
                                bg-white
                                rounded-3xl
                                shadow-lg
                                overflow-hidden
                                transition-all
                                duration-300
                                border
                                border-gray-200
                                hover:border-indigo-400
                                cursor-pointer
                            "
                            whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="
                                flex
                                justify-between
                                items-center
                                p-6
                                sm:p-8
                                select-none
                            ">
                                <span className="
                                    font-bold
                                    text-xl
                                    text-gray-800
                                ">
                                    {item.q}
                                </span>
                                <motion.span
                                    className="
                                        text-3xl
                                        text-indigo-600
                                        font-light
                                        ml-4
                                    "
                                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    +
                                </motion.span>
                            </div>

                            <AnimatePresence>
                                {openFAQ === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        className="
                                            p-6
                                            sm:p-8
                                            pt-0
                                        "
                                    >
                                        <p className="
                                            text-gray-700
                                            leading-relaxed
                                            border-t
                                            border-gray-200
                                            pt-6
                                        ">
                                            {item.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQS;