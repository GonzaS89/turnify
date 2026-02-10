import React, { useState, useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/logo.png';
import { Link } from 'react-scroll';

export const Header = ({ openLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Manejador de scroll para cambiar el estilo
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { to: 'hero-section', label: 'Inicio', offset: -150, emoji: '🏠' },
    { to: 'info', label: 'Proceso', offset: -150, emoji: '⚡' },
    { to: 'beneficios', label: 'Beneficios', offset: -150, emoji: '✨' },
    { to: 'videos', label: 'Tour', offset: -150, emoji: '🎥' },
    { to: 'preguntas-frecuentes', label: 'FAQ', offset: -150, emoji: '❓' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex justify-center p-4 lg:p-6 pointer-events-none">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          w-full max-w-7xl flex items-center justify-between px-6 py-3 
          transition-all duration-500 pointer-events-auto
          ${scrolled 
            ? 'bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] border border-white/20' 
            : 'bg-transparent rounded-none border-transparent'
          }
        `}
      >
        {/* LOGO */}
        <Link to="hero-section" smooth className="cursor-pointer group">
          <img
            src={logo}
            alt="Turnate"
            className={`transition-all duration-500 ${scrolled ? 'w-16 lg:w-20' : 'w-24 lg:w-28'} group-hover:scale-105`}
          />
        </Link>

        {/* NAV DESKTOP - Estilo Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              smooth
              duration={800}
              offset={item.offset}
              className="px-5 py-2 text-sm font-black text-slate-600 hover:text-indigo-600 rounded-xl transition-all hover:bg-white cursor-pointer"
              activeClass="bg-white !text-indigo-600 shadow-sm"
              spy={true}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ACCIONES */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => openLogin(true)}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <span className="text-xs opacity-50">🔐</span> Acceso Afiliados
          </button>

          {/* MENÚ MÓVIL TRIGGER */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-3 bg-slate-100 rounded-xl text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <IoMdMenu size={24} />
          </button>
        </div>
      </motion.div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[110] md:hidden flex justify-end pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[85%] max-w-sm bg-white h-screen shadow-2xl p-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-12">
                <img src={logo} className="w-20" alt="" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                  <IoClose size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    smooth
                    className="flex items-center gap-4 p-4 text-xl font-black text-slate-900 hover:bg-indigo-50 rounded-2xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => {
                  openLogin(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 mt-auto"
              >
                🔐 Acceso Privado
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;