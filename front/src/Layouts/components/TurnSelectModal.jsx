import { useState, useMemo } from "react";
import useProfessionalConsultorioTurnos from "../../../customHooks/useProfessionalConsultorioTurnos";
import useProfesionalxId from "../../../customHooks/useProfesionalxId";
import useConsultorioxId from "../../../customHooks/useConsultorioxId";
import Turno from "./Turno";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaHome,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaCalendarCheck,
} from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";

const TurnSelectModal = ({ enviarTurnoYOrden, onClose }) => {
  const navigate = useNavigate();
  const { consultorioId } = useParams();
  const { profesionalId } = useParams();

  // Carga de datos
  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(profesionalId);
  const { consultorio: consultorios, isLoading: isLoadingConsultorios, error: errorConsultorios } = useConsultorioxId(consultorioId);
  const consultorio = consultorios?.[0];

  const {
    turnos,
    isLoading: isLoadingTurnos,
    error: errorTurnos,
  } = useProfessionalConsultorioTurnos(profesionalId, consultorio?.id);

  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  // Memo: Médico
  const medico = useMemo(() => {
    return profesional && Array.isArray(profesional) && profesional.length > 0 ? profesional[0] : null;
  }, [profesional]);

  // Fecha actual
  const todayDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Fechas disponibles
  const fechasUnicas = useMemo(() => {
    if (!turnos || !Array.isArray(turnos)) return [];

    return [...new Set(
      turnos
        .filter((t) => t.estado === 'disponible')
        .map((t) => t.fecha)
    )]
      .filter((fecha) => fecha >= todayDate)
      .sort();
  }, [turnos, todayDate]);

  // Turnos filtrados por fecha
  const turnosFiltrados = useMemo(() => {
    return fechaSeleccionada
      ? (turnos?.filter((t) => t.fecha === fechaSeleccionada) || [])
      : [];
  }, [turnos, fechaSeleccionada]);

  // Título del profesional
  const titulo = useMemo(() => {
    const map = {
      doctor: "Dr.",
      doctora: "Dra.",
      licenciado: "Lic.",
      licenciada: "Lcda.",
    };
    return map[medico?.titulo] || "";
  }, [medico?.titulo]);

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
    return dateObj.toLocaleDateString('es-ES', { weekday: 'short' })
      .replace('.', '');
  };

  const obtenerMesCorto = (fecha) => {
    const dateObj = new Date(fecha);
    return dateObj.toLocaleDateString('es-ES', { month: 'short' })
      .replace('.', '');
  };

  // Manejadores
  const handleFechaChange = (e) => {
    setFechaSeleccionada(e.target.value);
  };

  const handleSelectTurno = (turno, index) => {
    navigate(`/formulario-usuario/${consultorio?.id}/${profesionalId}`);
    enviarTurnoYOrden(turno, index + 1);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[300] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-[1.01] max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <FaUserMd className="text-2xl mt-1" />
              <div>
                {isLoadingProfesional ? (
                  <div className="bg-white/30 h-5 rounded w-36 animate-pulse"></div>
                ) : errorProfesional ? (
                  <p className="text-red-100 text-sm flex items-center gap-1">
                    <MdOutlineErrorOutline /> Error al cargar médico
                  </p>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">
                      {titulo} {medico?.nombre} {medico?.apellido}
                    </h2>
                    <p className="text-blue-100 opacity-90">{medico?.especialidad}</p>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/buscarprofesionales')}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Consultorio */}
          {consultorio && !isLoadingConsultorios && !errorConsultorios && (
            <div className="mt-4 flex items-center gap-2 text-blue-100 text-sm">
              {consultorio.tipo === "particular" ? (
                <FaHome className="text-sm" />
              ) : (
                <FaHospital className="text-sm" />
              )}
              <span>
                {consultorio.tipo === "Particular"
                  ? "Consultorio Particular"
                  : `Centro Médico ${consultorio.nombre}`}
              </span>
            </div>
          )}
        </div>

        {/* Cuerpo */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* Selector de Fecha */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Seleccionar Fecha *
            </label>

            {isLoadingTurnos ? (
              <div className="py-4 text-center bg-blue-50 rounded-xl border border-blue-200">
                <BiLoaderCircle className="animate-spin mx-auto text-blue-600" size={24} />
                <p className="text-blue-700 text-sm mt-1">Cargando fechas...</p>
              </div>
            ) : errorTurnos ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <MdOutlineErrorOutline className="mt-0.5" />
                <div>
                  <p className="font-medium">Error al cargar turnos</p>
                  <p className="mt-1">{errorTurnos.message || "Inténtalo más tarde."}</p>
                </div>
              </div>
            ) : fechasUnicas.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-start gap-2">
                <FaExclamationTriangle className="mt-0.5" />
                <div>
                  <p className="font-medium">Sin disponibilidad</p>
                  <p className="mt-1">No hay fechas disponibles próximamente.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={fechaSeleccionada}
                  onChange={handleFechaChange}
                  className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
                >
                  <option value="">Seleccionar fecha</option>
                  {fechasUnicas.map((fecha, index) => (
                    <option key={index} value={fecha}>
                      {obtenerDiaDeLaSemanaCorto(fecha)} {formatearSoloDia(fecha)} de {obtenerMesCorto(fecha)}
                    </option>
                  ))}
                </select>
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Turnos */}
          <div className="space-y-4">
            {!fechaSeleccionada && !isLoadingTurnos && !errorTurnos && fechasUnicas.length > 0 && (
              <div className="text-center py-6 bg-blue-50 rounded-xl border border-blue-200">
                <FaInfoCircle className="mx-auto text-blue-500" size={32} />
                <p className="mt-2 text-blue-700 font-medium">
                  Selecciona una fecha para ver los turnos disponibles.
                </p>
              </div>
            )}

            {fechaSeleccionada && (
              <>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <FaClock className="text-green-500" />
                  Turnos para el {formatearFechaSQL(fechaSeleccionada)}
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
                    <FaClock className="mx-auto text-gray-400" size={32} />
                    <p className="mt-2 text-sm text-gray-600">No hay turnos disponibles en esta fecha.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={() => navigate('/buscarprofesionales')}
            className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Volver a buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnSelectModal;