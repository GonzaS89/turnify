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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4 font-sans">
      {/* Contenedor principal del modal - Rediseñado con estilo moderno */}
      <div
        className="bg-white rounded-3xl shadow-2xl p-5 flex flex-col gap-4 w-full max-w-md md:max-w-3xl lg:max-w-5xl h-[90vh] overflow-hidden border border-gray-100 relative"
      >
        {/* Efecto de fondo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-10 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-5 translate-y-24 -translate-x-24"></div>
        
        {/* Header del modal con información del profesional */}
        <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
               
               <button 
                 onClick={cerrarModalTurnos}
                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
          {consultorio && (
            <div className="text-center pb-4 border-b border-gray-200">
              
              
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                {isLoadingProfesional ? (
                  <span className="animate-pulse bg-gray-200 rounded-lg inline-block w-48 h-6"></span>
                ) : errorProfesional ? (
                  <span className="text-red-500">
                    Error al cargar el profesional
                  </span>
                ) : (
                  <span>
                    Dr/a {medico?.nombre || "Nombre no disponible"}{" "}
                    {medico?.apellido || "Apellido no disponible"}
                  </span>
                )}
              </h1>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
                <p className="text-lg font-bold text-gray-800 leading-tight mb-2">
                  {consultorio.tipo === "propio"
                    ? "Consultorio particular"
                    : `Centro médico ${consultorio.nombre}`}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center sm:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-semibold">
                      {consultorio.direccion || "Dirección no disponible"}
                    </span>
                  </div>
                  <span className="hidden sm:block mx-1">•</span>
                  <span className="font-semibold">
                    {consultorio.localidad || "Localidad no disponible"}
                  </span>
                </div>
                <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Horario: <span className="font-bold text-blue-700">{consultorio.inicio}</span> a{" "}
                    <span className="font-bold text-blue-700">{consultorio.cierre}</span> Hs.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenedor principal de selección de fecha y turnos */}
        <div className="flex flex-col lg:flex-row flex-grow gap-5 overflow-hidden relative z-10">
          
          {/* Sección de Selección de Fechas - Rediseñada */}
          <div className="flex flex-col basis-full lg:basis-2/5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
              <h2 className="text-xl font-black text-white text-center">
                Seleccionar Fecha
              </h2>
            </div>
            <div className="p-4 flex-grow">
              <div className="w-full">
                {isLoadingTurnos ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                    <p className="text-blue-600 font-semibold">Cargando turnos...</p>
                  </div>
                ) : errorTurnos ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="font-bold">¡Error al cargar los turnos!</p>
                    </div>
                    <p className="text-sm">
                      {errorTurnos.message || "Por favor, inténtalo de nuevo más tarde."}
                    </p>
                  </div>
                ) : (
                  <>
                    {fechasUnicas.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3 justify-items-center max-h-[280px] overflow-y-auto custom-scrollbar p-4">
                        {fechasUnicas?.map((fecha, index) => (
                          <button
                            key={index}
                            onClick={() => handleFechaChange({ target: { value: fecha } })}
                            className={`
                              flex flex-col items-center justify-center p-3 rounded-xl border-2
                              transition-all duration-300 ease-out
                              transform hover:scale-105 px-4
                              ${fechaSeleccionada === fecha
                                ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-700 shadow-lg -translate-y-1"
                                : "bg-white text-gray-800 border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 shadow"
                              }
                            `}
                          >
                            <p className={`text-xs font-black uppercase ${fechaSeleccionada === fecha ? "text-white" : "text-gray-500"}`}>
                              {obtenerDiaDeLaSemanaCorto(fecha)}
                            </p>
                            <p className={`text-2xl font-black ${fechaSeleccionada === fecha ? "text-white" : "text-gray-900"}`}>
                              {formatearSoloDia(fecha)}
                            </p>
                            <p className={`text-xs font-bold ${fechaSeleccionada === fecha ? "text-blue-100" : "text-gray-500"}`}>
                              {obtenerMesCorto(fecha)}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-dashed border-yellow-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 font-semibold">
                          No hay fechas disponibles
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Por el momento no hay turnos programados
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Sección de Turnos Disponibles - Rediseñada */}
          <div className="flex flex-col basis-full lg:basis-3/5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4">
              <h3 className="text-xl font-black text-white text-center">
                Turnos Disponibles
              </h3>
            </div>
            <div className="p-4 flex-grow flex flex-col">
  {fechaSeleccionada ? (
    turnosFiltrados.length > 0 ? (
      <>
        {/* <div className="text-center mb-3">
          <p className="text-gray-600 font-semibold">
            {formatearFechaSQL(fechaSeleccionada)}
          </p>
        </div> */}
        <div className="flex-grow overflow-y-auto max-h-[150px] lg:max-h-[250px] pr-2 custom-scrollbar py-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pb-2">
            {turnosFiltrados.map((turno, index) => (
              <Turno 
                key={turno.id} 
                turno={turno} 
                index={index} 
                enviarTurno={handleSelectTurno}
              />
            ))}
          </div>
        </div>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center flex-grow py-8 text-center bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-dashed border-yellow-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-600 font-semibold">
          No hay turnos disponibles
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Para esta fecha no hay horarios disponibles
        </p>
      </div>
    )
  ) : (
    <div className="flex flex-col items-center justify-center flex-grow py-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-gray-600 font-semibold">
        Selecciona una fecha
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Para ver los turnos disponibles elige una fecha
      </p>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnSelectModal;