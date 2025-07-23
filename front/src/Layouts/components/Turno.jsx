import { PiCalendarCheckBold, PiCalendarXBold } from "react-icons/pi";

const Turno = ({ turno, index, enviarTurno }) => {
  const isAvailable = turno.estado === "disponible";

  return (
    <div key={turno.id} className="w-full flex justify-center">
      <button
        onClick={() => enviarTurno(turno, index)}
        className={`
          relative flex flex-col justify-between items-center p-1 rounded-xl border
          transition-all duration-200 ease-in-out w-full aspect-square text-center
          group outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:z-20
          ${
            isAvailable
              ? "bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 border-blue-100 hover:border-blue-300 cursor-pointer"
              : "bg-gray-50 shadow-inner border-gray-100 text-gray-400 cursor-not-allowed opacity-80"
          }
        `}
        disabled={!isAvailable}
      >
        {/* Efectos de fondo y de interacción sutiles para turnos disponibles */}
        {isAvailable && (
          <>
            {/* Resplandor de gradiente muy sutil al pasar el ratón (menos opaco) */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50/30 via-transparent to-transparent opacity-0 pointer-events-none"></div>

            {/* Pequeño punto de confirmación suave */}
            <span
              className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-400 rounded-full
              opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out origin-center delay-50"
            ></span>
          </>
        )}

        {/* Contenido del botón */}
        <div className="flex flex-row items-center justify-center gap-2 relative z-10 w-full h-full">
          {isAvailable ? (
            <PiCalendarCheckBold className="text-4xl text-blue-500 mb-1 group-hover:text-blue-600 transition-colors duration-200" />
          ) : (
            <PiCalendarXBold className="text-4xl text-gray-300 mb-1" />
          )}
          <p className="text-base font-semibold leading-tight text-gray-700 group-hover:text-blue-700 transition-colors duration-200 h-auto">
            #{index + 1}
          </p>
        </div>
        {/* <p
          className={`text-xs font-medium relative z-10 ${
            isAvailable
              ? "text-blue-400 group-hover:text-blue-500 transition-colors duration-200"
              : "text-gray-400"
          }`}
        >
          {isAvailable ? "Seleccionar" : "Reservado"}
        </p> */}
      </button>
    </div>
  );
};

export default Turno;