import { useState } from "react";
// IMPORTACION DE CUSTOM HOOKS //
import useProfessionalConsultorioTurnos from "../../../customHooks/useProfessionalConsultorioTurnos";
import useProfesionalxId from "../../../customHooks/useProfesionalxId";
import Turno from "./Turno"; // Importación del componente Turno
// IMPORTACION DE ICONOS //

const TurnSelectModal = ({
  consultorio,
  idProfesional,
  enviarTurnoYOrden,
  cerrarModalTurnos,
}) => {
  // CARGA DE CUSTOM HOOKS
  const {
    turnos,
    isLoading: isLoadingTurnos,
    error: errorTurnos,
  } = useProfessionalConsultorioTurnos(idProfesional, consultorio?.id);
  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(idProfesional);
  // Asegurarse de que `profesional` es un array y tiene al menos un elemento
  const medico = profesional && profesional.length > 0 ? profesional[0] : null;
  // DECLARACION DE ESTADOS
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  // DECLARACION DE FUNCIONES
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const turnosFiltrados = fechaSeleccionada
    ? turnos.filter((turno) => turno.fecha === fechaSeleccionada)
    : [];

  const handleFechaChange = (event) => {
    setFechaSeleccionada(event.target.value);
  };

  const fechasUnicas = [
    ...new Set(
      turnos
        ?.filter((turno) => turno.estado === 'disponible') // Solo si está disponible
        .map((turno) => turno.fecha)
    )
  ]
    .filter((fecha) => fecha >= getTodayDate())
    .sort();

  const formatearFechaSQL = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatearSoloDia = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}`;
  };

  const obtenerDiaDeLaSemanaCorto = (fecha) => {
    const dateObj = new Date(fecha);
    return dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
  };

  const obtenerMesCorto = (fecha) => {
    const dateObj = new Date(fecha);
    return dateObj.toLocaleDateString('es-ES', { month: 'short' });
  };

  const handleSelectTurno = (turno, index) => {
    enviarTurnoYOrden(turno, index + 1);
  };

  return (
    <div className="fixed inset-0 bg-opacity-75 bg-black flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col max-h-[95vh] overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {isLoadingProfesional ? (
                  <span className="animate-pulse bg-gray-200 rounded h-5 inline-block w-32"></span>
                ) : errorProfesional ? (
                  <span className="text-red-500 text-sm">Error al cargar profesional</span>
                ) : (
                  `Dr/a ${medico?.nombre || "N/A"} ${medico?.apellido || "N/A"}`
                )}
              </h1>
              {consultorio && (
                <div className="mt-1 text-xs sm:text-sm text-gray-600">
                  <p className="font-medium">{consultorio.tipo === "propio" ? "Consultorio Particular" : `Centro Médico ${consultorio.nombre}`}</p>
                  <p>{consultorio.direccion}, {consultorio.localidad}</p>
                  {/* <p className="mt-1">Horario: <span className="font-semibold">{consultorio.inicio} a {consultorio.cierre} Hs</span></p> */}
                </div>
              )}
            </div>
            <button 
              onClick={cerrarModalTurnos}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200 self-start"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          
          {/* Selector de Fecha */}
          <div className="mb-6">
            <label htmlFor="fecha-selector" className="block text-sm font-semibold text-gray-700 mb-2">
              Seleccionar Fecha
            </label>
            <div className="relative">
              <select
                id="fecha-selector"
                value={fechaSeleccionada}
                onChange={handleFechaChange}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                disabled={isLoadingTurnos || errorTurnos || fechasUnicas.length === 0}
              >
                <option value="">-- Elegir Fecha --</option>
                {fechasUnicas.map((fecha, index) => (
                  <option key={index} value={fecha}>
                    {obtenerDiaDeLaSemanaCorto(fecha)} {formatearSoloDia(fecha)} de {obtenerMesCorto(fecha)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {fechasUnicas.length === 0 && !isLoadingTurnos && !errorTurnos && (
              <p className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                No hay fechas disponibles para este profesional.
              </p>
            )}
          </div>

          {/* Mostrar Turnos o Mensajes */}
          <div>
            {isLoadingTurnos && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-blue-600 font-medium">Cargando turnos...</p>
              </div>
            )}

            {errorTurnos && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-bold">Error al cargar turnos</p>
                </div>
                <p className="text-xs mt-1">
                  {errorTurnos.message || "Por favor, inténtalo de nuevo."}
                </p>
              </div>
            )}

            {fechaSeleccionada && !isLoadingTurnos && !errorTurnos && (
              <>
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Turnos disponibles para el {formatearFechaSQL(fechaSeleccionada)}
                </h3>
                
                {turnosFiltrados.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {turnosFiltrados.map((turno, index) => (
                      <Turno 
                        key={turno.id} 
                        turno={turno} 
                        index={index} 
                        enviarTurno={handleSelectTurno}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      No hay turnos disponibles para esta fecha.
                    </p>
                  </div>
                )}
              </>
            )}

            {!fechaSeleccionada && !isLoadingTurnos && !errorTurnos && (
              <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm font-medium text-blue-700">
                  Por favor, selecciona una fecha para ver los turnos disponibles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnSelectModal;
