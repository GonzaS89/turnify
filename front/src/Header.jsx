import React, { useState } from 'react'; // Import useState
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import logo from '/turnify.png'

export const Header = ( { openLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu visibility

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <header className={`"fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm py-4 z-50 transition-all duration-300"`}>
        <div className="container mx-auto px-4 flex justify-between items-center relative">
          {/* Logo Centrado en Mobile */}
          <a href="#hero-section" className="flex-grow flex justify-center md:justify-start" onClick={closeMobileMenu}>
            <img src={logo} alt="TurniFy Logo" className='w-24 h-auto md:w-20'/>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              <li><a href="#hero-section" className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Inicio</a></li>
              <li><a href="#medicos-disponibles" className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Médicos</a></li>
              <li><a href="#preguntas-frecuentes" className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Preguntas Frecuentes</a></li>
            </ul>
            <div className="flex space-x-3">
              <button
                onClick={() => { openLogin(true); closeMobileMenu(); }} // Close menu when login is clicked
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                Iniciar Sesión
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Registrarse
              </button>
            </div>
          </nav>

          {/* Hamburger Menu Button for Mobile */}
          <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={toggleMobileMenu} // Toggle menu on click
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Open mobile menu" // Accessibility
            >
              <IoMdMenu className='text-4xl'/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
  <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`}>
  {/* The actual menu panel */}
  <div className={`bg-white h-full w-72 p-6 shadow-xl ml-auto transform transition-transform duration-400 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}> {/* Wider panel, stronger shadow, different easing */}
    <div className="flex justify-between items-center mb-10"> {/* Aligned close button and potentially a logo/title */}
      {/* Optional: You could add a small logo here for consistency */}
      {/* <img src={logo} alt="TurniFy" className="w-20" /> */}
      <h3 className="text-xl font-bold text-gray-800">Menú</h3> {/* Simple menu title */}
      <button
        onClick={closeMobileMenu}
        className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-full transition-colors" // Removed hover background for cleaner look
        aria-label="Cerrar menú móvil"
        title="Cerrar menú"
      >
        <IoClose className='text-3xl'/> {/* Consistent icon size */}
      </button>
    </div>
    <nav className="flex-grow">
      <ul className="flex flex-col space-y-2"> {/* Tighter vertical spacing for links */}
        <li>
          <a
            href="#hero-section"
            className="block text-gray-700 hover:text-blue-600 font-medium text-lg py-3 px-2 rounded-lg hover:bg-blue-50 transition-colors duration-200" // Added horizontal padding and rounded hover background
            onClick={closeMobileMenu}
          >
            Inicio
          </a>
        </li>
        <li>
          <a
            href="#medicos-disponibles"
            className="block text-gray-700 hover:text-blue-600 font-medium text-lg py-3 px-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            Médicos
          </a>
        </li>
        <li>
          <a
            href="#preguntas-frecuentes"
            className="block text-gray-700 hover:text-blue-600 font-medium text-lg py-3 px-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            Preguntas Frecuentes
          </a>
        </li>
      </ul>
    </nav>
    <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col gap-4">
      <button
        onClick={() => { openLogin(true); closeMobileMenu(); }}
        className="w-full px-5 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-base shadow-sm hover:shadow-md" > {/* Slightly more rounded, added subtle shadow */}
        Iniciar Sesión
      </button>
      <button
        className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-base shadow-md hover:shadow-lg" > {/* Slightly more rounded, stronger shadow */}
        Registrarse
      </button>
    </div>
  </div>
</div>
    </div>
  );
};