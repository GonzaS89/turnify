import { FaTimesCircle } from "react-icons/fa";
import { PiClockCounterClockwise } from "react-icons/pi";

const formatearHora = (hora) => {
  if (!hora) return "";
  if (typeof hora === "string") return hora.slice(0, 5);
  if (hora instanceof Date) return hora.toTimeString().slice(0, 5);
  return hora;
};

const Turno = ({ turno, index, enviarTurno }) => {
  const isAvailable = turno.estado === "disponible";
  const horaFormateada = formatearHora(turno.hora);

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={() => isAvailable && enviarTurno(turno, index)}
        disabled={!isAvailable}
        aria-label={
          isAvailable
            ? `Seleccionar turno a las ${horaFormateada}`
            : `Turno a las ${horaFormateada} no disponible`
        }
        className={`
          group relative w-full h-28 flex flex-col items-center justify-center
          p-4 rounded-[1.5rem] transition-all duration-300 border-2
          ${isAvailable
            ? `
              bg-white border-slate-200 text-slate-800
              hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-400
              active:scale-95
              `
            : `
              bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed
              `
          }
        `}
      >
        {/* Icono superior estilizado */}
        <div
          className={`
            w-10 h-10 flex items-center justify-center rounded-xl mb-2
            transition-all duration-300
            ${isAvailable 
              ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
              : 'bg-slate-100 text-slate-300'}
          `}
        >
          {isAvailable ? (
            <PiClockCounterClockwise className="text-xl" />
          ) : (
            <FaTimesCircle className="text-xl" />
          )}
        </div>

        {/* Hora con tipografía del SearchModal */}
        <span
          className={`
            text-lg font-black tracking-tight transition-colors duration-300
            ${isAvailable ? 'text-slate-800' : 'text-slate-300'}
          `}
        >
          {horaFormateada}
        </span>

        {/* Estado sutil para turnos ocupados */}
        {!isAvailable && (
          <span className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-widest">
            Ocupado
          </span>
        )}

        {/* Indicador visual de acción para disponibles */}
        {isAvailable && (
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    </div>
  );
};

export default Turno;