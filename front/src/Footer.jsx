import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Opcional: para animaciones suaves

export const Footer = () => {
  const whatsappUrl = "https://wa.me/5491112345678?text=Hola,%20vine%20de%20Ya%20tenés%20turno";
  const instagramUrl = "https://instagram.com/yatienesturno";

  // Animaciones con framer-motion (opcional, pero recomendado)
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <footer className="relative py-10 mt-auto border-t border-white/20 bg-white/70 backdrop-blur-lg shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      {/* Línea decorativa superior con gradiente azul claro */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(100, 160, 220, 0.4), transparent)',
        }}
      />

      {/* Contenido animado */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-6"
      >
        {/* Texto principal */}
        <p className="text-gray-700 text-sm md:text-base font-medium mb-6 text-center">
          &copy; {new Date().getFullYear()} Ya tenés turno - Todos los derechos reservados.
        </p>

        {/* Botones de contacto */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          
          {/* WhatsApp Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-xl transform group"
          >
            <FaWhatsapp size={20} className="text-white" />
            <span>Contacto por WhatsApp</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">
              →
            </span>
          </motion.a>

          {/* Instagram Button */}
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-xl"
          >
            <FaInstagram size={20} />
            <span>Síguenos en Instagram</span>
          </motion.a>
        </div>

        {/* Badge con mensaje cálido */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-cyan-700 bg-cyan-100 hover:bg-cyan-200 rounded-full font-medium transition-colors duration-200 cursor-default">
            <span className="animate-pulse">●</span>
            Hecho con cuidado para tu salud
          </span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;