import CountUp from "react-countup";
import { useNavigate } from "react-router";

const CardGestionProfesionales = ({ seccion, icon: Icon, titulo, subtitulo, numprofesionales, texto }) => {

  const navigate = useNavigate()

  return (
    <div
              onClick={() => navigate(seccion)}
              className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white group-hover:from-purple-600 group-hover:to-purple-700 transition">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{titulo}</h3>
              <p className="text-gray-600 text-sm mb-3">{subtitulo}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  <CountUp end={numprofesionales} duration={1.5} />
                </span>
                <span className="text-xs text-gray-500">{texto}</span>
              </div>
            </div>
  )
}

export default CardGestionProfesionales