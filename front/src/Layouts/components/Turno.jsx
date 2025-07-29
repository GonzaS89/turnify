import { PiCalendarCheckFill, PiCalendarXFill } from "react-icons/pi";

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
    <div className="flex justify-center">
      <button
        onClick={() => isAvailable && enviarTurno(turno, index)}
        disabled={!isAvailable}
        className={`
          relative w-full max-w-[108px] aspect-square flex flex-col items-center justify-between
          p-3 rounded-2xl transition-all duration-300 transform
          bg-white border-2
          shadow-sm hover:shadow-2xl hover:scale-105 active:scale-100
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:z-10
          ${isAvailable
            ? `
              border-blue-100 text-blue-800
              hover:border-blue-300
              focus:ring-blue-200 focus:ring-offset-2
              `
            : `
              border-gray-100 bg-gray-50 text-gray-400
              cursor-not-allowed opacity-60
              focus:ring-gray-100
              `
          }
        `}
        aria-label={isAvailable
          ? `Seleccionar turno a las ${horaFormateada}`
          : `Turno a las ${horaFormateada} no disponible`
        }
      >
        {/* Icono con fondo suave */}
        <div className={`
          w-10 h-10 flex items-center justify-center rounded-full text-4xl
          transition-all duration-300
          ${isAvailable
            ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
            : 'bg-gray-100 text-gray-300'}
        `}>
          {isAvailable ? (
            <PiCalendarCheckFill />
          ) : (
            <PiCalendarXFill />
          )}
        </div>

        {/* Hora grande y clara */}
        <span className={`
          text-xl font-bold transition-colors duration-300
          ${isAvailable ? 'text-gray-800' : 'text-gray-400'}
        `}>
          {horaFormateada}
        </span>

        

        {/* Overlay sutil al pasar el mouse (solo disponible) */}
        {isAvailable && (
          <div className="absolute inset-0 rounded-2xl bg-blue-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none"></div>
        )}

        {/* Bordes animados tipo "glow" (solo disponible) */}
        {isAvailable && (
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-200 opacity-0 group-hover:opacity-40 animate-pulse group-hover:animate-none transition-all duration-500 pointer-events-none"></div>
        )}
      </button>
    </div>
  );
};

export default Turno;