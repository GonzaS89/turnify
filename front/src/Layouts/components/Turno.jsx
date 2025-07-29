import { PiCalendarCheckFill, PiCalendarXFill } from "react-icons/pi";

const Turno = ({ turno, index, enviarTurno }) => {
  const isAvailable = turno.estado === "disponible";

  return (
    <div className="flex justify-center">
      <button
        onClick={() => isAvailable && enviarTurno(turno, index)}
        disabled={!isAvailable}
        className={`
          relative w-full max-w-[100px] aspect-square flex flex-col items-center justify-center
          p-3 rounded-2xl border-2 transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isAvailable
            ? `
              bg-gradient-to-br from-white to-gray-50 border-gray-300 text-gray-800
              shadow-md hover:shadow-lg
              hover:border-blue-400 hover:-translate-y-1
              active:scale-95
              focus:ring-blue-500 focus:ring-offset-white
              `
            : `
              bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-500
              shadow-inner cursor-not-allowed opacity-80
              focus:ring-gray-400 focus:ring-offset-gray-100
              `
          }
        `}
        aria-label={isAvailable ? `Seleccionar turno número ${index + 1}` : `Turno número ${index + 1} no disponible`}
      >
        {/* Contenedor del ícono con fondo circular */}
        <div className={`
          mb-2 flex items-center justify-center rounded-full p-2 transition-all duration-300
          ${isAvailable 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-200 text-gray-400'}
        `}>
          {isAvailable ? (
            <PiCalendarCheckFill className="text-xl" />
          ) : (
            <PiCalendarXFill className="text-xl" />
          )}
        </div>

        {/* Número de Turno con estilo de badge */}
        <span className={`
          text-sm font-black px-2.5 py-1 rounded-full transition-all duration-300
          ${isAvailable 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'bg-gray-400 text-white'}
        `}>
          {turno.hora}
        </span>

        {/* Estado del turno como texto pequeño */}
        <span className={`
          text-[0.6rem] font-bold mt-1 transition-all duration-300
          ${isAvailable 
            ? 'text-blue-600' 
            : 'text-gray-500'}
        `}>
          {isAvailable ? 'LIBRE' : 'OCUPADO'}
        </span>

        {/* Efecto de resplandor sutil para turnos disponibles */}
        {isAvailable && (
          <div className="absolute inset-0 rounded-2xl bg-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        )}
      </button>
    </div>
  );
};

export default Turno;
