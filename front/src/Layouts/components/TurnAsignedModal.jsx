import { FaCheckCircle } from "react-icons/fa"

const TurnAsignedModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="
        bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-6 sm:p-8 
        w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center text-center gap-5 sm:gap-6 
        border border-blue-100 transform scale-95 opacity-0 animate-scale-in
      ">
        <FaCheckCircle className="text-green-500 text-6xl sm:text-7xl mb-4 animate-bounce-in" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3 leading-tight tracking-tight">
          ¡Turno Asignado!
        </h2>
        <p className="text-gray-600 mb-6 text-base sm:text-lg">
          Tu turno ha sido asignado exitosamente y está listo para ser gestionado.
        </p>
       
      </div>
    </div>
  )
}

export default TurnAsignedModal