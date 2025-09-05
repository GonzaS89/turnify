import { FaTimesCircle } from "react-icons/fa";
import { PiClockCounterClockwise } from "react-icons/pi"; // Icono más moderno y distintivo
import { motion } from "framer-motion"; // Opcional: para animaciones más fluidas (si usas Framer Motion)

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
          group relative w-full max-w-[120px] h-32 flex flex-col items-center justify-center
          p-4 rounded-2xl transition-all duration-300 border-2 shadow-sm
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:z-10
          ${isAvailable
            ? `
              bg-gradient-to-b from-white to-blue-50 border-blue-200 text-gray-800
              hover:shadow-lg hover:scale-105 hover:border-blue-300 hover:from-blue-50 hover:to-blue-100
              active:scale-95
              focus:ring-blue-200/50 focus:ring-offset-2
              `
            : `
              bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-70
              hover:scale-100
              focus:ring-gray-200/50
              `
          }
        `}
      >
        {/* Icono central con fondo circular suave */}
        <div
          className={`
            w-12 h-12 flex items-center justify-center rounded-full mb-2
            transition-all duration-300 transform group-hover:scale-110
            ${isAvailable 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-200 text-gray-400'}
          `}
        >
          {isAvailable ? (
            <PiClockCounterClockwise className="text-xl" />
          ) : (
            <FaTimesCircle className="text-xl" />
          )}
        </div>

        {/* Hora principal */}
        <span
          className={`
            text-lg font-semibold tracking-tight transition-colors duration-300
            ${isAvailable ? 'text-gray-800' : 'text-gray-500'}
          `}
        >
          {horaFormateada}
        </span>

        {/* Estado (solo si no está disponible) */}
        {!isAvailable && (
          <span className="text-[0.65rem] font-medium text-gray-500 mt-1 uppercase tracking-wide">
            Ocupado
          </span>
        )}

        {/* Decoración sutil: icono pequeño en esquina inferior derecha */}
        {isAvailable && (
          <PiClockCounterClockwise
            className="absolute bottom-2 right-2 text-xs text-blue-300 opacity-60 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Overlay sutil al hacer hover (solo si está disponible) */}
        {isAvailable && (
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-50/30 to-transparent 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        )}

        {/* Borde animado sutil en hover */}
        {isAvailable && (
          <div
            className="absolute inset-0 rounded-2xl border-2 border-blue-300 opacity-0 
                       group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
          />
        )}
      </button>
    </div>
  );
};

export default Turno;