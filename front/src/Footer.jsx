import React from "react";
import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-scroll";

export const Footer = () => {
  const mensaje = "Hola, estoy interesado en afiliar mi consultorio o centro médico.";
  const whatsappUrl = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;

  const marca = 'Turnate'

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <footer className="relative w-full bg-white overflow-hidden mt-24">
      {/* Fondo decorativo con blobs suaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 -right-20 w-64 h-64 bg-gradient-to-tl from-pink-50 to-red-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Línea superior con gradiente elegante */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

      {/* Contenido principal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20"
      >
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-center md:text-left">
          
          {/* Logo / Nombre */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
              {marca}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Facilitando tu acceso a la salud con simplicidad, tecnología y cuidado humano.
            </p>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-gray-900 mb-5 text-lg">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 hover:text-indigo-600 transition-colors">
                <FaWhatsapp className="text-emerald-500" size={18} />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 hover:text-indigo-600 transition-colors">
                <FaInstagram className="text-purple-500" size={18} />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                  Instagram
                </a>
              </li>
              {/* <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                <FaEnvelope className="text-indigo-500" size={18} />
                <span className="text-sm">hola@yatenturno.com</span>
              </li> */}
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                <FaPhone className="text-indigo-500" size={18} />
                <span className="text-sm">+54 381 5588504</span>
              </li>
            </ul>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-gray-900 mb-5 text-lg">Enlaces</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                to={'info'} 
                smooth = {true}
                offset={-150}
                className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer">
                  Info
                </Link>
              </li>
              <li>
                <Link 
                to={'beneficios'} 
                smooth = {true}
                offset={-25}
                className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer">
                  Beneficios
                </Link>
              </li>
              <li>
                <Link 
                to={'preguntas-frecuentes'} 
                smooth = {true}
                offset={-150}
                className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer">
                  Preguntas frecuentas
                </Link>
              </li>
            
            </ul>
          </motion.div>

          {/* CTA Premium: Botón WhatsApp */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-end">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full max-w-xs inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-full shadow-xl relative overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine"></span>
              <span className="relative flex items-center gap-2 z-10">
                <FaWhatsapp size={18} />
                Chateá con nosotros
              </span>
            </motion.a>

            {/* Badge de disponibilidad */}
            {/* <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs text-teal-700 bg-teal-50 rounded-full font-medium border border-teal-100">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
              Soporte en vivo
            </div> */}
          </motion.div>
        </div>

        {/* Separador */}
        <motion.div
          variants={itemVariants}
          className="my-10 border-t border-gray-200"
        ></motion.div>

        {/* Derechos de autor */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-700">{marca}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Diseñado con cuidado para profesionales de la salud y sus pacientes.
          </p>
        </motion.div>
      </motion.div>

      {/* Estilos globales (animaciones) */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;