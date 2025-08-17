import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import logo from '/logo.png'

// 📁 Asegúrate de que el logo esté en: public/assets/logo.png
// O en: src/assets/logo.png (dependiendo de tu estructura)

export const Footer = () => {
  const mensaje = "Hola, estoy interesado en afiliar mi consultorio o centro médico.";
  const whatsappUrl = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;

  const marca = 'Turnate';

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
                <FaInstagram className="text-pink-500" size={18} />
                <a href="https://www.instagram.com/turnateweb/" target="_blank" rel="noopener noreferrer" className="text-sm">
                  Instagram
                </a>
              </li>
              {/* <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 hover:text-indigo-600 transition-colors">
                <FaInstagram className="text-purple-500" size={18} />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                  Instagram
                </a>
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
                  to="hero-section" 
                  smooth 
                  offset={-150}
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="info" 
                  smooth 
                  offset={-150}
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer"
                >
                  Info
                </Link>
              </li>
              <li>
                <Link 
                  to="beneficios" 
                  smooth 
                  offset={-25}
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer"
                >
                  Beneficios
                </Link>
              </li>
              <li>
                <Link 
                  to="preguntas-frecuentes" 
                  smooth 
                  offset={-150}
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors cursor-pointer"
                >
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-end justify-center">
            <motion.div
              whileHover={{ scale: 1.08 }}  // Agrandar ligeramente al pasar el mouse
              whileTap={{ scale: 0.95 }}
              className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center overflow-hidden rounded-full shadow-2xl transition-transform duration-300"
            >
              {/* Fondo degradado (opcional, para resaltar el logo) */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-teal-200"></div>
              
              {/* Logo */}
              <img
                src={logo} // 📁 Ajusta la ruta si está en otra carpeta
                alt="Logo de Turnate"
                className="w-3/4 h-3/4 object-contain z-50"
              />

              {/* Efecto de brillo al pasar el mouse */}
              {/* <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 group-hover:animate-shine"></span> */}
            </motion.div>

            {/* Texto opcional debajo del logo */}
            {/* <p className="text-gray-500 text-xs mt-3">Chateá con nosotros</p> */}
          </motion.div>
        </div>

        {/* Separador */}
        <motion.div variants={itemVariants} className="my-10 border-t border-gray-200"></motion.div>

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

 
    </footer>
  );
};

export default Footer;