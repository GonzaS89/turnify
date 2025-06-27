import React from 'react';
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5"; // Importamos el icono de cerrar
import logo from '/turnify.png'

export const Header = () => {
  return (
    <div>
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm py-4 z-50 transition-all duration-300">
                <div className="container mx-auto px-4 flex justify-between items-center relative">
                    {/* Logo Centrado en Mobile */}
                    <a href="#hero-section" className="flex-grow flex justify-center md:justify-start">
                        <img src={logo} alt="TurniFy Logo" className='w-24 h-auto md:w-20'/>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <ul className="flex space-x-6">
                            <li><a href="#hero-section" className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Inicio</a></li>
                            
                            <li><a href="#medicos-disponibles"  className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Médicos</a></li>
                            <li><a href="#preguntas-frecuentes" className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">Preguntas Frecuentes</a></li>
                        </ul>
                        <div className="flex space-x-3">
                            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
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
                         
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                           <IoMdMenu className='text-4xl'/>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={"fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform duration-300 hidden"}>
                <div className="bg-white h-full w-64 p-6 shadow-lg ml-auto hidden">
                    <div className="flex justify-end mb-6">
                        <button  className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <IoClose className='text-4xl'/>
                        </button>
                    </div>
                    <nav>
                        <ul className="flex flex-col space-y-4">
                            <li><a href="#hero-section" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" >Inicio</a></li>
                      
                            <li><a href="#medicos-disponibles" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" >Médicos</a></li>
                            <li><a href="#preguntas-frecuentes" className="block text-gray-800 hover:text-blue-600 font-medium text-lg" >Preguntas Frecuentes</a></li>
                            <li className="pt-4 border-t border-gray-200">
                                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors" >
                                    Iniciar Sesión
                                </button>
                            </li>
                            <li>
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors" >
                                    Registrarse
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
    </div>
  )
}
