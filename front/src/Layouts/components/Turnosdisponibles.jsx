import useProfessionalConsultorioTurnos from "../../../customHooks/useProfessionalConsultorioTurnos";

const Turnosdisponibles = ({ idProfesional, idConsultorio }) => {
  const { turnos, isLoading, error } = useProfessionalConsultorioTurnos(idProfesional, idConsultorio);

  // Variable para almacenar la fecha más temprana (formateada como DD/MM)
  let fechaMasTempranaFormateada = null;

 

  // Obtener la fecha actual (sin hora) para comparar
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizamos para comparar solo la fecha

  if (!isLoading && !error && turnos && turnos.length > 0) {
    // Filtrar turnos disponibles y con fecha >= hoy
    const turnosDisponibles = turnos
      .filter((turno) => turno.estado === "disponible")
      .map((turno) => ({ ...turno, fecha: new Date(turno.fecha) }))
      .filter(({ fecha }) => fecha >= hoy);

    if (turnosDisponibles.length > 0) {
      const fechaMinima = new Date(Math.min(...turnosDisponibles.map((t) => t.fecha)));
      const dia = String(fechaMinima.getDate()).padStart(2, "0");
      const mes = String(fechaMinima.getMonth() + 1).padStart(2, "0");
      fechaMasTempranaFormateada = `${dia}/${mes}`;
    }
  }


  return (
    <div className="flex items-center justify-center">
      {isLoading ? (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full animate-pulse">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          <span className="text-[10px] font-medium text-gray-500">Buscando...</span>
        </div>
      ) : error ? (
        <span className="text-[9px] text-red-500 font-medium bg-red-50 px-2.5 py-1 rounded-full">
          Error
        </span>
      ) : fechaMasTempranaFormateada ? (
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-blue-100 flex items-center gap-1.5">
          📅 Turnos disponibles desde: {fechaMasTempranaFormateada}
        </span>
      ) : (
        <span className="text-[9px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
          Sin disponibilidad
        </span>
      )}
    </div>
  );
};

export default Turnosdisponibles;