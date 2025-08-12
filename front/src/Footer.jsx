import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export const Footer = () => {
  const mensaje = "Hola, estoy interesado en afiliar mi consultorio o centro médico.";
const whatsappUrl = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className="relative py-10 mt-auto border-t border-gray-200 bg-white/80 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {/* Línea decorativa superior con gradiente azul suave */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-6 text-center"
      >
        {/* Texto de derechos */}
        <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-800">Ya tenés turno</span>.
          <br className="sm:hidden" />
          <span className="text-gray-500">
            Facilitando tu acceso a la salud con simplicidad y cuidado.
          </span>
        </p>

        {/* Botón principal: WhatsApp */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 px-7 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-2xl transition-all duration-200 transform group mx-auto max-w-xs"
        >
          <FaWhatsapp
            size={22}
            className="text-white transition-transform duration-300 group-hover:scale-110"
          />
          <span>Chateá con nosotros</span>
          <span className="translate-x-0 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            →
          </span>
        </motion.a>

        {/* Mensaje de cierre cálido */}
        <div className="mt-8">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-teal-700 bg-teal-50 rounded-full font-medium border border-teal-100">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            Tu salud, organizada en un clic
          </span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
