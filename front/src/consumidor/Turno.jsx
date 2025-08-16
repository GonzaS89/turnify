import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PiClock } from "react-icons/pi";

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
        aria-label={
          isAvailable
            ? `Seleccionar turno a las ${horaFormateada}`
            : `Turno a las ${horaFormateada} no disponible`
        }
        className={`
          relative w-full max-w-[112px] aspect-square flex flex-col items-center justify-between
          p-4 rounded-2xl transition-all duration-300 transform
          bg-white border-2 shadow-sm hover:shadow-2xl hover:scale-105 active:scale-100
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
      >
        {/* Icono central con fondo suave */}
        <div
          className={`
            w-10 h-10 flex items-center justify-center rounded-full text-lg
            transition-all duration-300
            ${isAvailable 
              ? 'bg-blue-50 text-blue-600' 
              : 'bg-gray-100 text-gray-300'}
          `}
        >
          {isAvailable ? (
            <FaCheckCircle className="text-xl" />
          ) : (
            <FaTimesCircle className="text-xl" />
          )}
        </div>

        {/* Hora destacada */}
        <span
          className={`
            text-xl font-bold transition-colors duration-300
            ${isAvailable ? 'text-gray-800' : 'text-gray-400'}
          `}
        >
          {horaFormateada}
        </span>

        {/* Icono de reloj decorativo en esquina */}
        <PiClock className="absolute bottom-2 right-2 text-xs text-gray-300" />

        {/* Overlay al hacer hover (solo si está disponible) */}
        {isAvailable && (
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-transparent 
                       opacity-0 hover:opacity-60 transition-opacity duration-300 pointer-events-none"
          />
        )}

        {/* Efecto de pulso suave en bordes (solo disponible) */}
        {isAvailable && (
          <div
            className="absolute inset-0 rounded-2xl border-2 border-blue-200 opacity-0 
                       hover:opacity-50 animate-pulse hover:animate-none transition-all duration-500 
                       pointer-events-none"
          />
        )}
      </button>
    </div>
  );
};

export default Turno;