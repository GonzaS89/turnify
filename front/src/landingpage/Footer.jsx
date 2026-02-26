import { FaWhatsapp, FaPhone, FaInstagram, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import logo from '/logo.png';

export const Footer = () => {
  const mensaje = "Hola, estoy interesado en afiliar mi consultorio o centro médico.";
  const whatsappUrl = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;
  const marca = 'Turnate';

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative w-full bg-white pt-24 overflow-hidden">
      {/* Línea de acento superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Identidad */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              {marca}<span className="text-indigo-600">.</span>
            </h3>
            <p className="text-slate-500 font-bold leading-relaxed">
              La plataforma líder en gestión de turnos médicos para profesionales independientes y centros de salud de vanguardia.
            </p>
          </motion.div>

          {/* Contacto Institucional */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FaWhatsapp size={20} />
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-slate-900 font-black text-sm hover:text-indigo-600 transition-colors">
                  WhatsApp Directo
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FaInstagram size={20} />
                </div>
                <a href="https://www.instagram.com/turnateweb/" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-black text-sm hover:text-indigo-600 transition-colors">
                  Instagram
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FaPhone size={18} />
                </div>
                <span className="text-slate-900 font-black text-sm">+54 381 5588504</span>
              </li>
            </ul>
          </motion.div>

          {/* Navegación */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Navegación</h4>
            <ul className="grid grid-cols-1 gap-4">
              {['Inicio', 'Info', 'Beneficios', 'Preguntas frecuentes'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Preguntas frecuentes' ? 'preguntas-frecuentes' : item.toLowerCase()}
                    smooth
                    offset={-100}
                    className="text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Logo / Badge */}
          <motion.div variants={itemVariants} className="flex flex-col items-center lg:items-end justify-start">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <img
                src={logo}
                alt="Turnate Logo"
                className="w-24 h-24 object-contain grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Barra de Copyright - Estilo Institucional Negro */}
      <div className="bg-slate-900 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-black text-xs uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {marca} 
            </p>
            <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">
              Todos los derechos reservados.
            </p>
          </div>
          
          {/* <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Hecho con <FaHeart className="text-red-500 animate-pulse" /> en Tucumán
          </div> */}
{/* 
          <div className="flex gap-6">
            <button className="text-slate-500 hover:text-white text-[10px] font-black uppercase transition-colors">Privacidad</button>
            <button className="text-slate-500 hover:text-white text-[10px] font-black uppercase transition-colors">Términos</button>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;