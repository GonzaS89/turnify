import { useState } from "react"; // Ya no necesitamos useRef

// IMPORTACION DE CUSTOM HOOKS //

import useProfessionalConsultorioTurnos from "../../../customHooks/useProfessionalConsultorioTurnos";
import useProfesionalxId from "../../../customHooks/useProfesionalxId";

import Turno from "./Turno"; // Importación del componente Turno

// IMPORTACION DE ICONOS //



const TurnSelectModal = ({
  idProfesional,
  enviarTurnoYOrden,
  cerrarModalTurnos,
}) => {
  // CARGA DE CUSTOM HOOKS
  const {
    turnos,
    isLoading: isLoadingTurnos,
    error: errorTurnos,
  } = useProfessionalConsultorioTurnos(idProfesional);

  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(idProfesional);

  // Asegurarse de que `profesional` es un array y tiene al menos un elemento
  const medico = profesional && profesional.length > 0 ? profesional[0] : null;


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
    : []; // Si no hay fecha seleccionada, no mostrar turnos

  // Modificado: Ya no necesita fechaElement para scrollIntoView
  const handleFechaChange = (event) => {
    const nuevaFecha = event.target.value;
    setFechaSeleccionada(nuevaFecha);
    // La funcionalidad de scrollIntoView se elimina ya que la cuadrícula no será desplazable
  };

  const fechasUnicas = [...new Set(turnos?.map((turno) => turno.fecha))]
    // El filtro compara las cadenas de fecha 'YYYY-MM-DD'.
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

  const formatearSoloDia = (fecha) => { // Cambiado el nombre de la función para mayor claridad
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}`;
  };

  const obtenerDiaDeLaSemanaCorto = (fecha) => { // Cambiado el nombre de la función
    const dateObj = new Date(fecha);
    const options = { weekday: 'short' };
    return dateObj.toLocaleDateString('es-ES', options);
  };

  const obtenerMesCorto = (fecha) => {
    const dateObj = new Date(fecha);
    const options = { month: 'short' };
    return dateObj.toLocaleDateString('es-ES', options);
  };

  const handleSelectTurno = (turno, index) => {
    enviarTurnoYOrden(turno, index + 1);
    // console.log("Turno seleccionado:", turno, "Orden:", index + 1); // Descomentar para depurar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-2 sm:p-4 font-inter">
      {/* Contenedor principal del modal */}
      <div
        className={`bg-white rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col justify-between gap-4 w-full max-w-md lg:max-w-4xl lg:h-[95vh] xl:h-auto`}
      >
        {/* Contenido superior (información del consultorio y profesional) */}
        <div className="flex flex-col gap-3">
          {/* Sección de Información del Consultorio */}
          {consultorio && (
            <div className="text-center pb-3 border-b border-blue-100 mb-3 px-1 w-full">
              <h1 className="text-lg sm:text-xl font-extrabold text-indigo-700 mb-1">
                {isLoadingProfesional ? (
                  <span className="animate-pulse text-indigo-500">Cargando...</span>
                ) : errorProfesional ? (
                  <span className="text-red-500">
                    Error al cargar el profesional
                  </span>
                ) : (
                  <span className="text-indigo-600 text-sm sm:text-2xl">
                    Dr/a {""}
                    {medico?.nombre || "Nombre no disponible"}{" "}
                    {medico?.apellido || "Apellido no disponible"}
                  </span>
                )}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-gray-600 leading-tight">
                {consultorio.tipo === "propio"
                  ? "Consultorio particular"
                  : `Centro médico ${consultorio.nombre}`}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                <span className="font-medium">
                  {consultorio.direccion || "Dirección no disponible"}
                </span>
                ,
                <span className="font-medium">
                  {" "}
                  {consultorio.localidad || "Localidad no disponible"}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Horario: <span className="font-semibold">{consultorio.inicio}</span> a{" "}
                <span className="font-semibold">{consultorio.cierre}</span> Hs.
              </p>
            </div>
          )}
        </div>

        {/* Contenedor principal de selección de fecha y turnos */}
        <div className="flex flex-col lg:flex-row flex-grow gap-4 sm:gap-6 overflow-hidden">
          {/* Sección de Selección de Fechas */}
          {/* Eliminado overflow-hidden para que el contenido se ajuste a la cuadrícula */}
          <div className="flex flex-col items-center basis-full lg:basis-1/3 p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-700 text-center mb-4">
              Elegí una fecha
            </h2>

            <div className="w-full">
              {isLoadingTurnos ? (
                <p className="text-blue-500 text-sm sm:text-base text-center font-medium animate-pulse py-4 px-3 bg-white rounded-xl shadow-sm border border-blue-100">
                  Cargando turnos...
                </p>
              ) : errorTurnos ? (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-center text-xs sm:text-sm shadow-md">
                  <p className="font-bold mb-1">¡Ups! Error al cargar los turnos:</p>
                  <p>
                    {errorTurnos.message ||
                      "Por favor, inténtalo de nuevo más tarde."}
                  </p>
                </div>
              ) : (
                <>
                  {fechasUnicas.length > 0 ? (
                    <div
                      // Eliminada la ref ya que no hay scroll automático
                      // Cambiado a grid para un layout de cuadrícula
                      className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-2 sm:gap-3 justify-items-center"
                    >
                      {fechasUnicas?.map((fecha, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleFechaChange({ target: { value: fecha } })} // Ya no pasamos e.currentTarget
                          className={`
                            flex flex-col items-center justify-center py-3 px-5 rounded-lg border-2
                            transition-all duration-300 ease-in-out text-center
                            group outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-400
                            ${fechaSeleccionada === fecha
                              ? "bg-blue-600 text-white shadow-md border-blue-700 scale-105"
                              : "bg-white text-gray-800 shadow-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                            }
                          `}
                        >
                          <p className={`text-sm sm:text-base font-bold ${fechaSeleccionada === fecha ? "text-white" : "text-gray-700"}`}>
                            {obtenerDiaDeLaSemanaCorto(fecha)}
                          </p>
                          <p className={`text-xl sm:text-2xl font-extrabold ${fechaSeleccionada === fecha ? "text-white" : "text-gray-900"}`}>
                            {formatearSoloDia(fecha)}
                          </p>
                          <p className={`text-xs sm:text-sm font-medium ${fechaSeleccionada === fecha ? "text-blue-100" : "text-gray-600"}`}>
                            {obtenerMesCorto(fecha)} {/* Muestra solo MM/YYYY */}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base text-center mt-4 sm:mt-6 py-6 px-3 bg-yellow-50 rounded-xl shadow-inner border border-yellow-100">
                      No hay fechas disponibles para seleccionar.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sección de Turnos Disponibles */}
          <div className="flex flex-col basis-full lg:basis-2/3 p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-100 overflow-hidden">
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 text-center mb-3 pb-2 border-b-2 border-green-200 w-full">
              Turnos disponibles
              
            </h3>

            {/* Contenedor de los turnos con scroll */}
            <div className="flex-grow overflow-y-auto max-h-[calc(100vh-450px)] lg:max-h-full pr-1 custom-scrollbar-vertical">
              {fechaSeleccionada ? (
                turnosFiltrados.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-3">
                    {turnosFiltrados.map((turno, index) => (
                      <Turno turno={turno} index={index} enviarTurno={handleSelectTurno}/>
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
          </div>
        </div>

        {/* Botón para cerrar el modal */}
        <button
          onClick={cerrarModalTurnos}
          className="mt-3 sm:mt-4 w-full py-2 sm:py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base shadow-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TurnSelectModal;
