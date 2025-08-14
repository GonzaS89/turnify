import React, { useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import logo from './assets/logo.png';
import { Link } from 'react-scroll';

export const Header = ({ openLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm py-4 transition-all duration-300"
      role="banner"
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between relative max-w-7xl">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={closeMobileMenu}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg scale-100 lg:scale-[1.3]"
          aria-label="Ir a la página de inicio"
        >
          <img
            src={logo}
            alt="Turnate - Plataforma de reservas médicas"
            className="w-20 h-auto transition-transform duration-300 hover:scale-105"
          />
        </a>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {[
              { to: 'hero-section', label: 'Inicio', offset: -150 },
              { to: 'info', label: 'Info', offset: -150 },
              { to: 'beneficios', label: 'Beneficios', offset: -150 },
              { to: 'preguntas-frecuentes', label: 'Preguntas Frecuentes', offset: -150 },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  smooth
                  duration={800}
                  offset={item.offset}
                  className="text-gray-700 hover:text-indigo-600 font-medium cursor-pointer transition-colors duration-200 relative group"
                  aria-label={`Ir a ${item.label}`}
                >
                  {item.label}
                  {/* Línea decorativa animada */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Botón de Iniciar Sesión */}
          <button
            onClick={() => {
              openLogin(true);
              closeMobileMenu();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-105"
            aria-label="Abrir formulario de inicio de sesión"
          >
            Acceso para afiliados
          </button>
        </nav>

        {/* Botón de menú móvil */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors duration-200"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
        >
          {isMobileMenuOpen ? (
            <IoClose className="text-3xl" />
          ) : (
            <IoMdMenu className="text-3xl" />
          )}
        </button>
      </div>

      {/* Menú Móvil */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out h-screen flex flex-col  ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-400 ease-cubic-bezier ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera del menú */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              <img src={logo} className='w-20' alt="" />
            </h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
              aria-label="Cerrar menú móvil"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-6 bg-white">
            <ul className="space-y-4">
              {[
                { to: 'hero-section', label: 'Inicio', offset: -150, emoji: '🏡' },
                { to: 'info', label: 'Info', offset: -150, emoji: 'ℹ️' },
                { to: 'beneficios', label: 'Beneficios', offset: -150, emoji: '✨' },
                { to: 'preguntas-frecuentes', label: 'Preguntas Frecuentes', offset: -150, emoji: '❓' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    smooth
                    duration={600}
                    offset={item.offset}
                    onClick={closeMobileMenu}
                    className="block text-gray-700 hover:text-indigo-600 font-medium text-lg py-3 px-4 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                  >
                    {item.emoji} {item.label} 
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA en el footer */}
          <div className="p-6 border-t border-gray-200 bg-white h-full">
            <button
              onClick={() => {
                openLogin(true);
                closeMobileMenu();
              }}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
               🔐 Acceso para afiliados
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// === Estilos custom para animaciones ===
<style jsx>{`
  .ease-cubic-bezier {
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  }
`}</style>