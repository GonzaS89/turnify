import { FaShieldAlt } from "react-icons/fa"

const Coberturas = ( { ejecutarCard }) => {
  return (
    <div
        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={ejecutarCard}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">Coberturas</h3>
            <p className="text-gray-600 text-sm mb-4">Gestiona obras sociales</p>
          </div>
          <FaShieldAlt className="text-purple-500 text-2xl" />
        </div>
        <div className="mt-4">
          <span className="inline-block bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
            Administrar
          </span>
        </div>
      </div>
  )
}

export default Coberturas
