import React, { useState, useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { FaUserShield, FaChevronRight } from 'react-icons/fa';
import logo from '/logo.png';
import { Link, animateScroll as scroll } from 'react-scroll';

export const Header = ({ openLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Manejo del scroll del body
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 800, smooth: "easeInOutQuart" });
    closeMobileMenu();
  };

  const menuItems = [
    { to: 'info', label: 'Cómo funciona', offset: -80 },
    { to: 'beneficios', label: 'Beneficios', offset: -80 },
    { to: 'videos', label: 'Videos', offset: -80 },
    { to: 'preguntas-frecuentes', label: 'FAQ', offset: -80 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 border-b border-slate-100 py-3 md:py-4 transition-all duration-300 backdrop-blur-md">
      <div className="container mx-auto px-5 md:px-12 flex items-center justify-between max-w-7xl">
        
        {/* Logo Principal (Siempre visible) */}
        <div onClick={scrollToTop} className="flex-shrink-0 cursor-pointer relative z-[130]">
          <img src={logo} alt="Turnate Logo" className="w-16 md:w-24 h-auto transition-transform hover:scale-105" />
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
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden p-2 text-slate-900 z-[130] relative"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <IoClose size={32} className="text-indigo-600" /> : <IoMdMenu size={32} />}
        </button>
      </div>

      {/* --- MENÚ MÓVIL FULL WIDTH --- */}
      <div
        className={`fixed inset-0 z-[105] md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeMobileMenu} />

        {/* Contenedor Full Width ajustado */}
        <div
          className={`absolute top-0 left-0 w-full bg-white shadow-2xl transition-transform duration-500 ease-in-out rounded-b-[2.5rem] overflow-hidden ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Espaciador superior para no tapar el logo del header (aprox 80px) */}
          <div className="h-[75px] md:h-[85px]" />

          {/* Navegación directamente */}
          <nav className="px-8 pb-10 pt-2">
            <ul className="flex flex-col">
              <li>
                <button
                  onClick={scrollToTop}
                  className="flex items-center justify-between w-full text-slate-900 font-bold text-lg uppercase tracking-tight py-5 border-b border-slate-50 active:bg-slate-50 transition-colors"
                >
                  Inicio
                  <FaChevronRight size={14} className="text-indigo-500/50" />
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
                    className="flex items-center justify-between text-slate-900 font-bold text-lg uppercase tracking-tight py-5 border-b border-slate-50 active:bg-slate-50 cursor-pointer transition-colors"
                  >
                    {item.label}
                    <FaChevronRight size={14} className="text-indigo-500/50" />
                  </Link>
                </li>
              ))}

              {/* Botón Acceso Afiliados */}
              <li className="pt-8">
                <button
                  onClick={() => {
                    openLogin(true);
                    closeMobileMenu();
                  }}
                  className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
                >
                  <FaUserShield size={20} />
                  Acceso Afiliados
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;