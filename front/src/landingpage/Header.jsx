import React, { useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { FaUserShield, FaChevronRight } from 'react-icons/fa';
import logo from '/logo.png';
import { Link, animateScroll as scroll } from 'react-scroll';

export const Header = ({ openLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Bloquear scroll del body cuando el menú está abierto
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 800, smooth: "easeInOutQuart" });
    closeMobileMenu();
  };

  const menuItems = [
    { to: 'info', label: 'Cómo funciona', offset: -150 },
    { to: 'beneficios', label: 'Beneficios', offset: -150 },
    { to: 'videos', label: 'Videos', offset: -150 },
    { to: 'preguntas-frecuentes', label: 'FAQ', offset: -150 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 border-b border-slate-100 py-4 transition-all duration-300 backdrop-blur-md">
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between max-w-7xl">
        
        {/* Logo */}
        <div onClick={scrollToTop} className="flex-shrink-0 cursor-pointer">
          <img src={logo} alt="Turnate Logo" className="w-20 md:w-24 h-auto transition-transform hover:scale-105" />
        </div>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <ul className="flex items-center gap-6 lg:gap-10">
            <li>
              <button onClick={scrollToTop} className="text-slate-500 hover:text-indigo-600 text-sm font-black uppercase tracking-tighter transition-all relative group">
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </li>
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} smooth={true} duration={800} offset={item.offset} className="text-slate-500 hover:text-indigo-600 text-sm font-black uppercase tracking-tighter cursor-pointer transition-all relative group">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
          <button onClick={() => openLogin(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
            <FaUserShield size={16} /> Acceso Afiliados
          </button>
        </nav>

        {/* Botón Menú Móvil */}
        <button onClick={toggleMobileMenu} className="md:hidden p-2 text-slate-900 z-[110]">
          {isMobileMenuOpen ? <IoClose size={32} /> : <IoMdMenu size={32} />}
        </button>
      </div>

      {/* --- MENÚ MÓVIL CORREGIDO --- */}
      <div
        className={`fixed inset-0 z-[105] md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay oscuro */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />

        {/* Contenedor del Menú */}
        <div
          className={`absolute top-0 right-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header del Menú Móvil */}
          <div className="flex items-center justify-between p-6 border-b border-slate-50">
            <img src={logo} className="w-20 h-auto" alt="Logo" onClick={scrollToTop} />
            <button onClick={closeMobileMenu} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <IoClose size={30} />
            </button>
          </div>

          {/* Enlaces del Menú Móvil */}
          <nav className="flex-1 px-6 py-8 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={scrollToTop}
                  className="flex items-center justify-between w-full text-slate-900 font-black text-xl uppercase tracking-tighter py-5 border-b border-slate-50 hover:text-indigo-600 transition-all"
                >
                  Inicio
                  <FaChevronRight size={14} className="text-slate-300" />
                </button>
              </li>

              {menuItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    smooth={true}
                    duration={600}
                    offset={item.offset}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between text-slate-900 font-black text-xl uppercase tracking-tighter py-5 border-b border-slate-50 hover:text-indigo-600 transition-all"
                  >
                    {item.label}
                    <FaChevronRight size={14} className="text-slate-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botón de Acción en la parte inferior */}
          <div className="p-8 bg-slate-50">
            <button
              onClick={() => {
                openLogin(true);
                closeMobileMenu();
              }}
              className="w-full py-5 bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <FaUserShield size={18} />
              Acceso Afiliados
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;