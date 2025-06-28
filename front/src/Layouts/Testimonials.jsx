import React, { useState, useEffect, useRef } from 'react';
import Testimonial from './components/Testimonial'; // Asegúrate de importar tu componente de testimonio

const testimonials = [
  {
    testimonio: '"Reservar mi turno con la Dra. López fue increíblemente fácil. Pude ver todos los horarios disponibles en un minuto y elegir el que mejor me quedaba, sin tener que llamar ni esperar. Me ahorró muchísimo tiempo."',
    persona: 'Ana G., 42 años',
    causa: 'ginecológica',
  },
  {
    testimonio: '"Necesitaba ver a un dermatólogo con urgencia y TurniFy me salvó. Encontré un turno para el mismo día y la confirmación me llegó al instante. La verdad, es un sistema muy práctico y eficiente."',
    persona: 'Diego P., 29 años',
    causa: 'dermatológica',
  },
  {
    testimonio: '"Gracias a los recordatorios automáticos, no me volví a olvidar de un turno. Es un detalle que realmente hace la diferencia, sobre todo con una agenda tan ocupada. ¡Muy recomendable!"',
    persona: 'Sofía L., 55 años',
    causa: 'fisioterapéutica',
  },
  {
    testimonio: '"El servicio es súper intuitivo. Como paciente, me da la tranquilidad de que mi turno está confirmado y mis datos están seguros. Es el futuro de la gestión de turnos médicos."',
    persona: 'Martín R., 34 años',
    causa: 'cardiológica',
  },
];

const TestimonialCarousel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const scrollSpeed = .5; // Velocidad de desplazamiento en píxeles por frame

    const scrollCarousel = () => {
      if (carouselRef.current) {
        // Mueve el carrusel un poco a la derecha
        carouselRef.current.scrollLeft += scrollSpeed;
        
        // Cuando llega al final, lo reinicia para crear el efecto de loop
        // El 'scrollWidth' es el ancho total del contenido y 'clientWidth' es el ancho visible
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollCarousel);
    };

    animationFrameId = requestAnimationFrame(scrollCarousel);

    // Limpia el efecto cuando el componente se desmonta
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Duplicamos los testimonios para que haya suficiente contenido para el loop
  const infiniteTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-12 bg-blue-50 rounded-xl shadow-md px-4 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Testimonios de nuestros usuarios</h2>
      <div 
        ref={carouselRef}
        className="
          flex
          w-full
          overflow-x-hidden
          py-4
          gap-8
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {infiniteTestimonials.map((data, index) => (
          // Usamos 'flex-none' para que los elementos no se encojan
          <div key={index} className="flex-none w-80 md:w-96">
            <Testimonial
              testimonio={data.testimonio}
              persona={data.persona}
              causa={data.causa}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialCarousel;