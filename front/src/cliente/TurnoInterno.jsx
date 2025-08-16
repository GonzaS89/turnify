import { FaCheckCircle, FaUser, FaTrashAlt, FaIdCard, FaTimesCircle, FaShieldAlt, FaPlus, FaPhone } from "react-icons/fa";

const TurnoInterno = ({
  turno,
  id,
  idx,
  estado,
  hora,
  paciente,
  DNI,
  cobertura,
  duracion,
  telefono,
  handleBorrarTurno,
  tapButtonAsignar,
  handleModificarEstadoTurno,
  handleLiberarTurno,
  coberturaElegida,
}) => {
  const formatearHora = (hora) => {
    if (!hora) return "";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const calcularHoraFin = (horaInicio, duracionMinutos) => {
    if (!horaInicio || !duracionMinutos) return "";
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const fechaInicio = new Date();
    fechaInicio.setHours(horas, minutos, 0, 0);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);
    return fechaFin.toTimeString().slice(0, 5);
  };

  // Estado visual
  const estadoConfig = {
    reservado: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", badge: "bg-red-100 text-red-800" },
    disponible: { bg: "bg-green-50", border: "border-green-500", text: "text-green-700", badge: "bg-green-100 text-green-800" },
    finalizado: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
  };

  const config = estadoConfig[estado] || estadoConfig.finalizado;

  return (
    <div
      className={`p-6 rounded-xl border-l-8 ${config.bg} ${config.border} shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      {/* Encabezado: número, horario y estado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        {/* Número y horario */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`font-bold text-lg ${config.text}`}>#{idx + 1}</span>

          {hora && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm font-medium text-gray-800 border border-gray-200">
                {formatearHora(hora)} → {calcularHoraFin(hora, duracion)}
              </span>
              {duracion && (
                <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                  {duracion} min
                </span>
              )}
            </div>
          )}
        </div>

        {/* Estado y botón de eliminación */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${config.badge} shadow-sm`}
          >
            {estado === "reservado" ? "Ocupado" : estado === "disponible" ? "Disponible" : "Finalizado"}
          </span>

          {estado === "disponible" && (
            <button
              onClick={() => handleBorrarTurno(id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1.5 rounded-lg transition-colors duration-150"
              aria-label="Eliminar turno"
            >
              <FaTrashAlt size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      {estado === "reservado" ? (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={() => handleModificarEstadoTurno(id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow transform hover:scale-105"
          >
            <FaCheckCircle size={16} /> Marcar como finalizado
          </button>
          <button
            onClick={() => handleLiberarTurno(id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow transform hover:scale-105"
          >
            <FaTimesCircle size={16} /> Liberar
          </button>
        </div>
      ) : (
        estado === "disponible" && (
          <button
            onClick={() => tapButtonAsignar(turno, idx)}
            className="flex items-center justify-center w-full sm:w-48 xl: gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FaPlus size={16} /> Asignar turno
          </button>
        )
      )}

      {/* Datos del paciente (solo si está reservado) */}
      {DNI && (
        <div className="mt-6 pt-5 border-t border-gray-200 bg-white/80 rounded-xl p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-500" /> Datos del paciente
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Nombre */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <FaUser className="text-gray-500" />
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide">Nombre</div>
                <div className="font-medium text-gray-800">{paciente}</div>
              </div>
            </div>

            {/* DNI */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <FaIdCard className="text-gray-500" />
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide">Documento</div>
                <div className="font-medium text-gray-800">{DNI}</div>
              </div>
            </div>

            {/* Cobertura */}
            {cobertura && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <FaShieldAlt className="text-purple-500" />
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wide">Cobertura</div>
                  <div className="font-medium text-gray-800">{coberturaElegida(cobertura)}</div>
                </div>
              </div>
            )}

            {/* Teléfono */}
            {telefono && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <FaPhone className="text-orange-500" />
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wide">Teléfono</div>
                  <a
                    href={`tel:${telefono}`}
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {telefono}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnoInterno;