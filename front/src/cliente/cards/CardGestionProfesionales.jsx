import CountUp from "react-countup";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const CardGestionProfesionales = ({ seccion, icon: Icon, titulo, subtitulo, numProfesionales, texto }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(seccion)}
      className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500 transition-all duration-500 flex flex-col h-full cursor-pointer relative overflow-hidden"
    >
      {/* Indicador de diseño sutil al hacer hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-600 transition-all duration-500 z-0 opacity-20 group-hover:opacity-10"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Icono Estilizado */}
        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 mb-8 shadow-inner">
          <Icon size={30} />
        </div>

        {/* Títulos con font-black */}
        <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-4 uppercase leading-none">
          {titulo}
        </h3>
        <p className="text-slate-500 font-medium mb-10 flex-1 leading-relaxed">
          {subtitulo}
        </p>

        {/* Footer de la tarjeta con Contador */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-4xl font-black text-indigo-600 tracking-tighter">
              <CountUp end={numProfesionales} duration={1.5} />
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {texto}
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all duration-300">
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGestionProfesionales;