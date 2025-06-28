import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
    <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; 2025 TurniFy - Todos los derechos reservados.</p>
        <div className="mt-2 text-sm">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Política de Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Términos y Condiciones</a>
        </div>
    </div>
</footer>
  )
}
