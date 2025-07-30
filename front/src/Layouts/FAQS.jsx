import React, { useState } from 'react'

const FAQS = () => {

    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqData = [
        {
            q: '¿Cómo reservo un turno?',
            a: 'Simplemente utiliza el buscador en la parte superior de la página, filtra por especialidad o médico y elige uno de los horarios disponibles. Luego, completa tus datos para confirmar la reserva.'
        },
        {
            q: '¿Qué hago si necesito cancelar un turno?',
            a: 'Puedes cancelar tu turno a través del enlace que recibiste en el correo electrónico de confirmación. Por favor, cancela con al menos 24 horas de anticipación para permitir que otro paciente lo utilice.'
        },
        {
            q: '¿Qué métodos de pago se aceptan?',
            a: 'Actualmente, el pago se realiza directamente en la consulta. Estamos trabajando para integrar opciones de pago en línea en el futuro.'
        },
        {
            q: '¿Cómo puedo afiliarme como médico o centro médico?',
            a: 'En la sección "Beneficios de Afiliarte" encontrarás un botón de contacto para que nuestro equipo te ayude a crear tu perfil y comiences a recibir reservas.'
        },
    ];

    return (
        <section id="preguntas-frecuentes" className="py-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-10">Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((item, index) => (
                    <div
                    key={index}
                    className="
                      group
                      relative
                      bg-white
                      p-8
                      rounded-3xl
                      shadow-2xl
                      border-2
                      border-transparent
                      transition-all
                      duration-500
                      hover:scale-[1.02]
                      hover:shadow-3xl
                      hover:border-blue-400
                      cursor-pointer
                      overflow-hidden
                    "
                  >
                    {/* Capa de brillo con gradiente que aparece al hacer hover */}
                    <div className="
                      absolute
                      inset-0
                      rounded-3xl
                      bg-gradient-to-br
                      from-blue-50
                      via-white
                      to-purple-50
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "></div>
                    
                    {/* Contenido principal de la tarjeta */}
                    <div className="relative z-10">
                      <div
                        className="
                          flex
                          justify-between
                          items-center
                          font-extrabold
                          text-xl
                          text-gray-900
                          select-none
                        "
                        onClick={() => toggleFAQ(index)}
                      >
                        <span>{item.q}</span>
                        <span
                          className={`
                            text-3xl
                            text-transparent
                            bg-clip-text
                            bg-gradient-to-r
                            from-blue-600
                            to-purple-600
                            transform
                            transition-transform
                            duration-300
                            group-hover:scale-110
                            ${openFAQ === index ? 'rotate-45' : ''}
                          `}
                        >
                          +
                        </span>
                      </div>
                      <div
                        className={`
                          overflow-hidden
                          transition-all
                          duration-700
                          ease-in-out
                          ${openFAQ === index ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}
                        `}
                      >
                        <p className="
                          text-gray-700
                       
                          leading-relaxed
                          border-t
                          border-gray-200
                          mt-2
                          pt-4
                        ">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
        </section>
    )
}

export default FAQS
