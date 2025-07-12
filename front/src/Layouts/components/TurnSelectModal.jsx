import { useState } from "react";

// IMPORTACION DE CUSTOM HOOKS //

import useProfessionalConsultorioTurnos from "../../../customHooks/useProfessionalConsultorioTurnos";
import useProfesionalxId from "../../../customHooks/useProfesionalxId";

// IMPORTACION DE ICONOS //

import { PiCalendarCheckBold, PiCalendarXBold } from "react-icons/pi";

const TurnSelectModal = ({
  consultorio,
  idConsultorio,
  idProfesional,
  enviarTurnoYOrden,
  cerrarModalTurnos,
}) => {
  // CARGA DE CUSTOM HOOKS

  const {
    turnos,
    isLoading: isLoadingTurnos,
    error: errorTurnos,
  } = useProfessionalConsultorioTurnos(idProfesional, idConsultorio);

  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(idProfesional);

  const medico = profesional[0]


  // DECLARACION DE ESTADOS
  // `fechaSeleccionada` almacenará la fecha elegida por el usuario en el selector.
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  // DECLARACION DE FUNCIONES

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    // `getMonth()` es 0-indexed (0 para enero, 11 para diciembre), por eso se suma 1.
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const turnosFiltrados = fechaSeleccionada
    ? turnos.filter((turno) => turno.fecha === fechaSeleccionada)
    : turnos;

  const handleFechaChange = (event) => {
    setFechaSeleccionada(event.target.value);
    console.log("Fecha seleccionada:", event.target.value);
  };

  const fechasUnicas = [...new Set(turnos?.map((turno) => turno.fecha))]
    // El filtro compara las cadenas de fecha 'YYYY-MM-DD'.
    // Esta comparación funciona correctamente para ordenar fechas cronológicamente.
    .filter((fecha) => fecha >= getTodayDate())
    // Ordena las fechas de forma ascendente (la más antigua primero)
    .sort();

  const formatearFechaSQL = (fecha) => {
    const date = new Date(fecha);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses son 0-index
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSelectTurno = (turno, index) => {
    enviarTurnoYOrden(turno, index + 1);
    console.log("Turno seleccionado:", turno, "Orden:", index + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6">
      <div
        className={`bg-white rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center items-center gap-6 max-h-[90vh] lg:h-auto`}
      >
        {/* Sección de Información del Consultorio */}
        {consultorio && (
        <div class="text-center pb-4 border-b border-blue-200 mb-4 px-2">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-2">
          {isLoadingProfesional ? (
          <span class="animate-pulse text-indigo-600">Cargando...</span>
          ) : errorProfesional ? (
          <span class="text-red-600">
            Error al cargar el profesional
          </span>
          ) : (
          <span class="text-indigo-700">
            Dr/a {""}
            {medico?.nombre || "Nombre no disponible"}{" "}
            {medico?.apellido || "Apellido no disponible"}
          </span>
          )}
        </h1>
        <p class="text-2xl sm:text-3xl font-semibold text-gray-700 leading-tight">
          {consultorio.tipo === "propio"
          ? "Consultorio particular"
          : `Centro médico ${consultorio.nombre}`}
        </p>
        <p class="text-base sm:text-lg text-gray-600 mt-2">
          <span class="font-medium">
            {consultorio.direccion || "Dirección no disponible"}
          </span>
          ,
          <span class="font-medium">
            {" "}
            {consultorio.localidad || "Localidad no disponible"}
          </span>
        </p>
        <p class="text-base sm:text-lg text-gray-600 mt-1">
          Horario: <span class="font-semibold">{consultorio.inicio}</span> a{" "}
          <span class="font-semibold">{consultorio.cierre}</span> Hs.
        </p>
      </div>
        )}

        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-6">
          Elegí una fecha
        </h2>

        <div class="w-full">
          {isLoadingTurnos ? (
            <p class="text-blue-600 text-base sm:text-lg text-center font-medium animate-pulse py-6 px-4 bg-blue-50 rounded-xl shadow-inner border border-blue-100">
              Cargando turnos...
            </p>
          ) : errorTurnos ? (
            <div class="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-center text-sm sm:text-base shadow-md">
              <p class="font-bold mb-1">¡Ups! Error al cargar los turnos:</p>
              <p>
                {errorTurnos.message ||
                  "Por favor, inténtalo de nuevo más tarde."}
              </p>
            </div>
          ) : (
            <>
              {/* Selector de fechas */}
              <div class="relative mb-4">
                <select
                  name="fecha"
                  id="fecha-select"
                  onChange={handleFechaChange}
                  class="block w-full p-3 sm:p-4 border border-gray-300 rounded-xl text-base sm:text-lg text-gray-700 appearance-none focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer pr-10 shadow-sm hover:border-gray-400"
                  defaultValue="" // Asegura que la opción "Selecciona una fecha" sea la predeterminada al cargar el modal
                >
                  <option value="" disabled>
                    Selecciona una fecha disponible
                  </option>
                  {/* Mapea solo las fechas únicas a partir de hoy, ya filtradas y ordenadas por `fechasUnicas` */}
                  {fechasUnicas?.map((fecha, index) => (
                    <option key={index} value={fecha}>
                      {formatearFechaSQL(fecha)}
                    </option>
                  ))}
                </select>
                {/* Icono de flecha para el selector */}
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg
                    class="fill-current h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Título que muestra la fecha seleccionada para los turnos */}
        {fechaSeleccionada && (
          <h3 class="text-xl sm:text-2xl font-bold text-gray-800 text-center mt-4 mb-4 pb-3 border-b-2 border-blue-200">
            Turnos para el{" "}
            <span class="text-blue-700">
              {formatearFechaSQL(fechaSeleccionada)}
            </span>
          </h3>
        )}

        <div class="flex-grow overflow-y-auto max-h-[300px] sm:max-h-[400px] pr-2 w-full custom-scrollbar">
          {fechaSeleccionada ? (
            turnosFiltrados.length > 0 ? (
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 mt-4">
                {turnosFiltrados.map((turno, index) => (
                  <div key={turno.id} class="w-full flex justify-center">
                    <button
                      onClick={() => handleSelectTurno(turno, index)}
                      class={`
            relative flex flex-col justify-between items-center p-3 sm:p-4 rounded-xl border-2 
            transition-all duration-300 ease-in-out w-full aspect-square text-center
            group outline-none cursor-pointer
            focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:z-20
            
            ${
              turno.estado === "disponible"
                ? "bg-white shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0.5 active:shadow-md border-gray-200 hover:border-blue-500 text-gray-800"
                : "bg-gray-100 shadow-inner border-gray-200 text-gray-400 cursor-not-allowed opacity-75"
            }
        `}
                      disabled={turno.estado !== "disponible"}
                    >
                      {/* Dynamic Background Effects for Available Turns */}
                      {turno.estado === "disponible" && (
                        <>
                          {/* Subtle Radial Gradient Glow on Hover */}
                          <div class="absolute inset-0 rounded-xl bg-gradient-radial from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>

                          {/* Small Checkmark Indicator - Appears on Hover/Focus */}
                          <svg
                            class="absolute top-2 left-2 w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 group-focus-visible:scale-100 origin-top-left"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </>
                      )}

                      {/* Content of the Button */}
                      <div class="flex flex-col items-center gap-2 relative z-10 w-full">
                        {turno.estado === "disponible" ? (
                          <PiCalendarCheckBold class="text-5xl sm:text-6xl text-blue-600 mb-1 sm:mb-2 group-hover:text-blue-700 transition-colors duration-200 drop-shadow-sm" />
                        ) : (
                          <PiCalendarXBold class="text-5xl sm:text-6xl text-gray-400 mb-1 sm:mb-2" />
                        )}
                        <p class="text-base sm:text-lg font-extrabold leading-tight text-gray-800 group-hover:text-blue-800 transition-colors duration-200">
                          Turno #{index + 1}
                        </p>
                      </div>
                      <p
                        class={`text-xs sm:text-sm font-medium relative z-10 ${
                          turno.estado === "disponible"
                            ? "text-green-600 group-hover:text-green-700 transition-colors duration-200"
                            : "text-gray-400"
                        }`}
                      >
                        {turno.estado === "disponible"
                          ? "Disponible"
                          : "Reservado"}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p class="text-gray-600 text-base sm:text-lg text-center mt-6 sm:mt-8 py-8 px-4 bg-yellow-50 rounded-xl shadow-inner border border-yellow-100">
                No hay turnos disponibles para esta fecha. ¡Intentá con otra!
              </p>
            )
          ) : (
            <p class="text-gray-600 text-base sm:text-lg text-center mt-6 sm:mt-8 py-8 px-4 bg-blue-50 rounded-xl shadow-inner border border-blue-100">
              Por favor, selecciona una fecha para ver los turnos disponibles.
            </p>
          )}
        </div>

        {/* Botón para cerrar el modal */}
        <button
          onClick={cerrarModalTurnos}
          className="mt-4 sm:mt-6 w-full py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-base sm:text-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TurnSelectModal;
