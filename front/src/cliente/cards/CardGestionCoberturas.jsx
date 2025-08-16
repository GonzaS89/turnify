import { useNavigate } from "react-router";
const CardGestionCoberturas = ( { seccion, titulo, icon: Icon,  subtitulo, texto, emoji }) => {

    const navigate = useNavigate()

  return (
    
    <div
          onClick={()=> navigate(seccion)}
          className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white group-hover:from-blue-600 group-hover:to-indigo-700 transition">
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{titulo}</h3>
          <p className="text-gray-600 text-sm mb-3">{subtitulo}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">{emoji}</span>
            <span className="text-xs text-gray-500">{texto}</span>
          </div>
        </div>
  )
}

export default CardGestionCoberturas