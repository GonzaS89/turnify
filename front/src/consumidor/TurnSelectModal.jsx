import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useProfessionalConsultorios from "../../customHooks/useProfessionalConsultorios";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
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
} from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";

const TurnSelectModal = ({ enviarTurnoYOrden, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { profesionalSlug } = useParams();
  const [profesionalId, setProfesionalId] = useState(null);
  


  // Traer el ID del profesional
  useEffect(() => {
    const fetchProfesionalId = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profesionales/${profesionalSlug}`);
        const prof = Array.isArray(res.data) ? res.data[0] : res.data;
        if (prof?.id) setProfesionalId(prof.id);
        else console.error("No se encontró el profesional");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfesionalId();
  }, [profesionalSlug]);

  

  // Siempre llamamos los hooks aunque profesionalId sea null
  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } =
    useProfesionalxId(profesionalId || 0);

    const { consultorios, isLoading: isLoadingConsultorios, error: errorConsultorios } = useProfessionalConsultorios(profesionalId || 0);

const [consultorioSelec, setConsultorioSelec] = useState(null);

// Cuando los consultorios carguen, establecer el primero como seleccionado
useEffect(() => {
  if (!isLoadingConsultorios && Array.isArray(consultorios) && consultorios.length > 0) {
    setConsultorioSelec(consultorios[0].id);
  } else if (consultorios?.length === 0) {
    setConsultorioSelec(null); // o un valor por defecto
  }
}, [consultorios, isLoadingConsultorios]);

  const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } =
    useProfessionalConsultorioTurnos(profesionalId || 0, consultorioSelec || 0);

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
    return [...new Set(turnos.filter(t => t.estado === "disponible").map(t => t.fecha))]
      .filter(fecha => fecha >= todayDate)
      .sort();
  }, [turnos, todayDate]);

  // Turnos filtrados por fecha
  const turnosFiltrados = useMemo(() => {
    return fechaSeleccionada ? (turnos?.filter(t => t.fecha === fechaSeleccionada) || []) : [];
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

  const formatearFechaSQL = fecha => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatearSoloDia = fecha => new Date(fecha).getDate().toString().padStart(2, "0");
  const obtenerDiaDeLaSemanaCorto = fecha =>
    new Date(fecha).toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");
  const obtenerMesCorto = fecha =>
    new Date(fecha).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");

  // Manejadores
  const handleFechaChange = e => setFechaSeleccionada(e.target.value);
  const handleSelectTurno = (turno, index) => {
    navigate(`/formulario-usuario/${consultorioSelec}/${profesionalId}`);
    enviarTurnoYOrden(turno, index + 1);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[300] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform max-h-[90vh] flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
  <div className="flex items-start justify-between gap-4">
    {/* Información del médico */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-3">
        <FaUserMd className="text-2xl text-white/90" aria-hidden="true" />
        <div>
          {isLoadingProfesional ? (
            <div className="bg-white/30 h-5 rounded w-36 animate-pulse" aria-label="Cargando nombre"></div>
          ) : errorProfesional ? (
            <p className="text-red-100 text-sm flex items-center gap-1">
              <MdOutlineErrorOutline /> <span>Error al cargar médico</span>
            </p>
          ) : (
            <>
              <h2 className="text-xl font-bold capitalize truncate">
                {titulo} {medico?.nombre} {medico?.apellido}
              </h2>
              <p className="text-blue-100 opacity-90 truncate">{medico?.especialidad}</p>
            </>
          )}
        </div>
      </div>

      {/* Consultorios */}
      {Array.isArray(consultorios) && consultorios.length > 0 && !isLoadingProfesional && !errorProfesional && (
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-100">
        {consultorios.map((cons) => (
 <div
  key={cons.id}
  className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-xs transition-all duration-200
    ${cons.id === consultorioSelec
      ? "bg-white/40 backdrop-blur border border-white/50 scale-100 shadow-lg shadow-white/10"
      : "bg-white/15 hover:bg-white/25 border border-white/30 cursor-pointer hover:scale-102"}
  `}
  onClick={() => setConsultorioSelec(cons.id)}
>
  {/* Icono pequeño */}
  <div className={`
    w-5 h-5 flex items-center justify-center rounded-full
    ${cons.id === consultorioSelec 
      ? "bg-indigo-100 text-indigo-700" 
      : "bg-white/30 text-indigo-100"}
    text-[0.6rem] transition-colors
  `}>
    {cons.tipo === "Particular" ? (
      <FaHome />
    ) : (
      <FaHospital />
    )}
  </div>

  {/* Texto mínimo */}
  <span className="text-white font-medium max-w-[120px]">
    {cons.direccion}
  </span>

  {/* Solo localidad si hay espacio (opcional en mobile) */}
  <span className="sm:inline text-white/80 text-[0.65rem]">
    {cons.localidad}
  </span>
</div>
        ))}
      </div>
      )}

      {/* Estado de carga o error para consultorios (opcional) */}
      {isLoadingProfesional && (
        <div className="flex gap-2 mt-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white/30 h-6 rounded-full w-24 animate-pulse"></div>
          ))}
        </div>
      )}
    </div>

    {/* Botón de cerrar */}
    <button
      onClick={() => navigate("/buscarprofesionales")}
      className="text-white hover:bg-white/20 rounded-full p-1 transition flex-shrink-0"
      aria-label="Volver al buscador de profesionales"
    >
      <FaTimes size={20} />
    </button>
  </div>
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
                      <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />
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
            onClick={() => navigate("/buscarprofesionales")}
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
