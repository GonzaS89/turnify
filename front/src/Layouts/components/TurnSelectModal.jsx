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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-2 sm:p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col justify-between gap-4 max-h-[95vh] w-full max-w-md lg:max-w-2xl overflow-hidden`} // CAMBIO AQUÍ: 'lg:max-w-xl' a 'lg:max-w-2xl'
      >
        {/* All content that should shrink and allow turns to grow */}
        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar-hidden">
          {/* Sección de Información del Consultorio */}
          {consultorio && (
            <div className="text-center pb-3 border-b border-blue-200 mb-3 px-1 w-full">
              <h1 className="text-lg sm:text-xl font-extrabold text-indigo-800 mb-1">
                {isLoadingProfesional ? (
                  <span className="animate-pulse text-indigo-600">Cargando...</span>
                ) : errorProfesional ? (
                  <span className="text-red-600">
                    Error al cargar el profesional
                  </span>
                ) : (
                  <span className="text-indigo-700 text-sm sm:text-2xl">
                    Dr/a {""}
                    {medico?.nombre || "Nombre no disponible"}{" "}
                    {medico?.apellido || "Apellido no disponible"}
                  </span>
                )}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-gray-700 leading-tight">
                {consultorio.tipo === "propio"
                  ? "Consultorio particular"
                  : `Centro médico ${consultorio.nombre}`}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                <span className="font-medium">
                  {consultorio.direccion || "Dirección no disponible"}
                </span>
                ,
                <span className="font-medium">
                  {" "}
                  {consultorio.localidad || "Localidad no disponible"}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Horario: <span className="font-semibold">{consultorio.inicio}</span> a{" "}
                <span className="font-semibold">{consultorio.cierre}</span> Hs.
              </p>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 text-center mb-4">
            Elegí una fecha
          </h2>

          <div className="w-full">
            {isLoadingTurnos ? (
              <p className="text-blue-600 text-sm sm:text-base text-center font-medium animate-pulse py-4 px-3 bg-blue-50 rounded-xl shadow-inner border border-blue-100">
                Cargando turnos...
              </p>
            ) : errorTurnos ? (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center text-xs sm:text-sm shadow-md">
                <p className="font-bold mb-1">¡Ups! Error al cargar los turnos:</p>
                <p>
                  {errorTurnos.message ||
                    "Por favor, inténtalo de nuevo más tarde."}
                </p>
              </div>
            ) : (
              <>
                {/* Selector de fechas */}
                <div className="relative mb-3">
                  <select
                    name="fecha"
                    id="fecha-select"
                    onChange={handleFechaChange}
                    className="block w-full p-2 sm:p-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-700 appearance-none focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer pr-8 shadow-sm hover:border-gray-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona una fecha disponible
                    </option>
                    {fechasUnicas?.map((fecha, index) => (
                      <option key={index} value={fecha}>
                        {formatearFechaSQL(fecha)}
                      </option>
                    ))}
                  </select>
                  {/* Icono de flecha para el selector */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
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
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center mt-3 mb-3 pb-2 border-b-2 border-blue-200 w-full">
              Turnos para el{" "}
              <span className="text-blue-700">
                {formatearFechaSQL(fechaSeleccionada)}
              </span>
            </h3>
          )}
        </div>

        {/* This is the section we want to ensure visibility for */}
        <div className="flex-grow overflow-y-auto max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)] pr-1 w-full custom-scrollbar">
          {fechaSeleccionada ? (
            turnosFiltrados.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-3"> {/* AGREGADO: lg:grid-cols-5 para más columnas en pantallas grandes */}
                {turnosFiltrados.map((turno, index) => (
                  <div key={turno.id} className="w-full flex justify-center">
                    <button
                      onClick={() => handleSelectTurno(turno, index)}
                      className={`
            relative flex flex-col justify-between items-center p-2 sm:p-3 rounded-xl border-2
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
                          <div className="absolute inset-0 rounded-xl bg-gradient-radial from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>

                          {/* Small Checkmark Indicator - Appears on Hover/Focus */}
                          <svg
                            className="absolute top-1 left-1 w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 group-focus-visible:scale-100 origin-top-left"
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
                      <div className="flex flex-col items-center gap-1 relative z-10 w-full">
                        {turno.estado === "disponible" ? (
                          <PiCalendarCheckBold className="text-4xl sm:text-5xl text-blue-600 mb-1 group-hover:text-blue-700 transition-colors duration-200 drop-shadow-sm" />
                        ) : (
                          <PiCalendarXBold className="text-4xl sm:text-5xl text-gray-400 mb-1" />
                        )}
                        <p className="text-sm sm:text-base font-extrabold leading-tight text-gray-800 group-hover:text-blue-800 transition-colors duration-200">
                          Turno #{index + 1}
                        </p>
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-medium relative z-10 ${
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
              <p className="text-gray-600 text-sm sm:text-base text-center mt-4 sm:mt-6 py-6 px-3 bg-yellow-50 rounded-xl shadow-inner border border-yellow-100">
                No hay turnos disponibles para esta fecha. ¡Intentá con otra!
              </p>
            )
          ) : (
            <p className="text-gray-600 text-sm sm:text-base text-center mt-4 sm:mt-6 py-6 px-3 bg-blue-50 rounded-xl shadow-inner border border-blue-100">
              Por favor, selecciona una fecha para ver los turnos disponibles.
            </p>
          )}
        </div>

        {/* Botón para cerrar el modal */}
        <button
          onClick={cerrarModalTurnos}
          className="mt-3 sm:mt-4 w-full py-2 sm:py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TurnSelectModal;