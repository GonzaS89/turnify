import { FaCheckCircle } from "react-icons/fa"

const TurnAsignedModal = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
    <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Turno Asignado</h2>
        <p className="text-gray-600 mb-6">Tu turno ha sido asignado exitosamente.</p>
        <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => window.location.reload()}
        >
            Aceptar
        </button>
      
    </div>
  )
}

export default TurnAsignedModal
