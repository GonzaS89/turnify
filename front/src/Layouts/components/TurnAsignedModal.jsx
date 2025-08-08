import { FaCheckCircle } from "react-icons/fa"

const TurnAsignedModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="
        bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-6 sm:p-8 
        w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center text-center gap-5 sm:gap-6 
        border border-blue-100 transform scale-95 opacity-0 animate-scale-in
      ">
        <FaCheckCircle className="text-blue-500 text-6xl sm:text-7xl mb-4 animate-bounce-in" /> {/* Icono azul y animación */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 mb-3 leading-tight tracking-tight"> {/* Título en azul */}
          ¡Turno Asignado!
        </h2>
        <p className="text-gray-700 mb-6 text-base sm:text-lg"> {/* Texto del mensaje en gris oscuro */}
          Tu turno ha sido asignado exitosamente y está listo para ser gestionado.
        </p>
        {/* Aquí puedes añadir un botón, por ejemplo, para cerrar el modal o ir a una sección de "Mis turnos" */}
        {/*
        <button
          className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
        >
          Ir a mis turnos
        </button>
        */}
      </div>
    </div>
  )
}

export default TurnAsignedModal