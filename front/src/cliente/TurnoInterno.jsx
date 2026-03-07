import { FaCheckCircle, FaUser, FaTrashAlt, FaIdCard, FaTimesCircle, FaShieldAlt, FaPlus, FaPhone, FaUnlock, FaSpinner } from "react-icons/fa";

const TurnoInterno = ({
  turno,
  id,
  idx,
  estado,
  hora,
  paciente,
  DNI,
  cobertura,
  duracion,
  telefono,
  handleBorrarTurno,
  tapButtonAsignar,
  handleModificarEstadoTurno,
  handleLiberarTurno,
  coberturaElegida,
  liberando,
  finalizando
}) => {

  const liberarTurno = id => {
    handleLiberarTurno(id); 
  };

  const formatearHora = (hora) => {
    if (!hora) return "";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const calcularHoraFin = (horaInicio, duracionMinutos) => {
    if (!horaInicio || !duracionMinutos) return "";
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const fechaInicio = new Date();
    fechaInicio.setHours(horas, minutos, 0, 0);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);
    return fechaFin.toTimeString().slice(0, 5);
  };

  const config = {
    reservado: { bg: "bg-white", border: "border-indigo-600", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700", indicator: "bg-indigo-600" },
    disponible: { bg: "bg-white", border: "border-slate-200", text: "text-slate-400", badge: "bg-green-100 text-green-700", indicator: "bg-green-500" },
    finalizado: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-300", badge: "bg-slate-200 text-slate-600", indicator: "bg-slate-400" },
  }[estado] || { bg: "bg-white", border: "border-slate-200", text: "text-slate-400", badge: "bg-slate-100 text-slate-600", indicator: "bg-slate-400" };

  return (
    <div className={`${config.bg} rounded-[2rem] border-2 ${config.border} p-4 md:p-8 shadow-sm transition-all duration-300 hover:shadow-lg group relative overflow-hidden`}>
      
      {/* Indicador lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${config.indicator}`}></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* INFO PRINCIPAL */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-slate-100 rounded-2xl w-14 h-14 md:w-16 md:h-16 shrink-0">
            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Ord</span>
            <span className={`text-lg md:text-xl font-black ${config.text}`}>#{idx + 1}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">
                {formatearHora(hora)} <span className="text-slate-300 font-light mx-1">→</span> {calcularHoraFin(hora, duracion)}
              </span>
              <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${config.badge}`}>
                {estado === "reservado" ? "Ocupado" : estado === "disponible" ? "Disp." : "Finaliz."}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              {duracion} min
            </p>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap">
          {estado === "reservado" && (
            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              <button
                onClick={() => handleModificarEstadoTurno(id)}
                disabled={finalizando}
                className="flex-1 md:flex-none px-4 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                {finalizando ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                {finalizando ? "..." : "Finalizar"}
              </button>
              <button
                onClick={() => liberarTurno(id)}
                disabled={liberando}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
              >
                {liberando ? <FaSpinner className="animate-spin" /> : <FaUnlock />}
              </button>
            </div>
          )}

          {estado === "disponible" && (
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => tapButtonAsignar(turno, idx)}
                className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                <FaPlus /> Asignar
              </button>
              <button
                onClick={() => handleBorrarTurno(id)}
                className="p-3 border-2 border-slate-100 text-slate-300 rounded-xl hover:border-red-200 hover:text-red-500 transition-all"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DETALLES PACIENTE */}
      {estado === "reservado" && DNI && (
        <div className="mt-6 pt-6 border-t border-slate-100 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Paciente</p>
              <p className="text-xs font-black text-slate-800 truncate">{paciente}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">DNI</p>
              <p className="text-xs font-black text-slate-800">{DNI}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Cobertura</p>
              <p className="text-xs font-black text-indigo-600 truncate">{coberturaElegida(cobertura)}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contacto</p>
              <a href={`tel:${telefono}`} className="text-xs font-black text-slate-800 hover:text-indigo-600 flex items-center gap-1">
                <FaPhone size={9} /> {telefono}
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TurnoInterno;