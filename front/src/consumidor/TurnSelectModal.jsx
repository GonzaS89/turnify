import { useState, useMemo, useEffect, useRef } from "react";
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
  const fechaRefs = useRef({}); // 👈 Para centrar fechas seleccionadas

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

  // Hooks de datos
  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } =
    useProfesionalxId(profesionalId || 0);

  const { consultorios, isLoading: isLoadingConsultorios, error: errorConsultorios } = 
    useProfessionalConsultorios(profesionalId || 0);

  const [consultorioSelec, setConsultorioSelec] = useState(null);

  // Establecer primer consultorio al cargar
  useEffect(() => {
    if (!isLoadingConsultorios && Array.isArray(consultorios) && consultorios.length > 0) {
      setConsultorioSelec(consultorios[0].id);
    } else if (consultorios?.length === 0) {
      setConsultorioSelec(null);
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

  useEffect(() => {
    setFechaSeleccionada("");
  }, [consultorioSelec]);

  // 👇 Centrar fecha seleccionada
  useEffect(() => {
    if (fechaSeleccionada && fechaRefs.current[fechaSeleccionada]) {
      fechaRefs.current[fechaSeleccionada].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [fechaSeleccionada]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[300] xl:p-4 animate-fade-in">
      {/* Contenedor principal: responsive */}
      <div className="bg-white xl:rounded-2xl shadow-xl w-screen xl:max-w-6xl h-[100dvh] xl:h-[95vh] flex flex-col lg:flex-row lg:overflow-hidden overflow-auto border border-gray-100">

        {/* COLUMNA IZQUIERDA — Información del profesional */}
        <div className="lg:w-2/5 p-6 bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col justify-between">
          <div>
            {/* Encabezado médico + Botón de cerrar */}
<div className="flex items-start justify-between gap-4 mb-6 relative">
  <div className="flex items-center gap-3 min-w-0">
    <FaUserMd className="text-3xl text-white/90 flex-shrink-0 mt-1" aria-hidden="true" />
    <div>
      {isLoadingProfesional ? (
        <div className="space-y-2">
          <div className="bg-white/30 h-5 rounded w-40 animate-pulse"></div>
          <div className="bg-white/30 h-4 rounded w-28 animate-pulse"></div>
        </div>
      ) : errorProfesional ? (
        <p className="text-red-100 text-sm flex items-center gap-1">
          <MdOutlineErrorOutline /> <span>Error al cargar médico</span>
        </p>
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-bold capitalize leading-tight">
            {titulo} {medico?.nombre} {medico?.apellido}
          </h2>
          <p className="text-blue-100 opacity-90 text-sm md:text-base">{medico?.especialidad}</p>
        </>
      )}
    </div>
  </div>

  {/* 👇 BOTÓN DE CERRAR - SIEMPRE VISIBLE */}
  <button
    onClick={() => navigate("/buscarprofesionales")}
    className="absolute lg:hidden top-0 right-0 p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 z-10"
    aria-label="Cerrar y volver al buscador"
  >
    <FaTimes size={20} />
  </button>
</div>

            {/* Selector de consultorio */}
            {Array.isArray(consultorios) && consultorios.length > 0 && !isLoadingProfesional && !errorProfesional && (
              <div className="mt-6">
                {consultorios.length > 1 && (
                  <p className="text-sm md:text-base text-white/90 mb-3 font-medium">Seleccioná un consultorio</p>
                )}

                <div className="space-y-3">
                  {consultorios.map((cons) => (
                    <div
                      key={cons.id}
                      className={`
                        p-4 rounded-xl border transition-all duration-200 cursor-pointer
                        ${
                          cons.id === consultorioSelec
                            ? "bg-white text-gray-800 border-white shadow-md"
                            : "bg-white/10 border-white/30 hover:bg-white/20"
                        }
                      `}
                      onClick={() => setConsultorioSelec(cons.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`
                            w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0
                            ${
                              cons.id === consultorioSelec
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-white/30 text-white"
                            }
                          `}
                        >
                          {cons.tipo === "Particular" ? <FaHome size={12} /> : <FaHospital size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {cons.tipo === 'centro médico' && (
                            <p className="font-medium text-sm truncate">{cons.nombre}</p>
                          )}
                          <p className="text-xs truncate">{cons.direccion}</p>
                          <p className={`text-[0.65rem] ${cons.id === consultorioSelec ? 'text-gray-600' : 'text-white/70'}`}>
                            {cons.localidad}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isLoadingProfesional && (
              <div className="mt-6 space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white/30 h-12 rounded-xl animate-pulse"></div>
                ))}
              </div>
            )}
          </div>

         
        </div>

        {/* COLUMNA DERECHA — Selector de fecha + turnos */}
        <div className="lg:w-3/5 flex flex-col h-full">
          {/* Encabezado secundario (solo desktop) */}
          <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Seleccioná tu turno</h3>
            <button
              onClick={() => navigate("/buscarprofesionales")}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
            
            {/* Selector de Fecha — ¡AHORA CON BOTONES! */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <label className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" /> Seleccionar Fecha *
              </label>

              {isLoadingTurnos ? (
                <div className="py-5 text-center">
                  <BiLoaderCircle className="animate-spin mx-auto text-blue-600" size={28} />
                  <p className="text-blue-700 text-sm mt-2 font-medium">Cargando fechas disponibles...</p>
                </div>
              ) : errorTurnos ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
                  <MdOutlineErrorOutline className="mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Error al cargar turnos</p>
                    <p className="mt-1 text-sm">{errorTurnos.message || "Inténtalo más tarde."}</p>
                  </div>
                </div>
              ) : fechasUnicas.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm flex items-start gap-3">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Sin disponibilidad</p>
                    <p className="mt-1 text-sm">No hay fechas disponibles próximamente.</p>
                  </div>
                </div>
              ) : (
                /* 👇 NUEVO: Botones horizontales con centrado automático */
                <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
                  {fechasUnicas.map((fecha, index) => {
                    const diaCorto = obtenerDiaDeLaSemanaCorto(fecha);
                    const diaNumero = formatearSoloDia(fecha);
                    const mesCorto = obtenerMesCorto(fecha);
                    const isActive = fecha === fechaSeleccionada;

                    return (
                      <button
                        key={index}
                        ref={el => fechaRefs.current[fecha] = el}
                        onClick={() => handleFechaChange({ target: { value: fecha } })}
                        className={`
                          relative flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                          border-2 flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px]
                          ${isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                          }
                        `}
                        aria-pressed={isActive}
                        aria-label={`Seleccionar turno para ${diaCorto} ${diaNumero} de ${mesCorto}`}
                      >
                        <span className="text-xs uppercase tracking-wide font-bold">{diaCorto}</span>
                        <span className="text-lg font-bold mt-1">{diaNumero}</span>
                        <span className="text-xs mt-0.5">{mesCorto}</span>

                        {/* Badge "Hoy" */}
                        {fecha === todayDate && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[0.6rem] px-1 py-0.5 rounded-full font-bold">Hoy</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Turnos */}
            <div className="space-y-4">
              {!fechaSeleccionada && !isLoadingTurnos && !errorTurnos && fechasUnicas.length > 0 && (
                <div className="text-center py-8 bg-blue-50 rounded-xl border border-blue-200">
                  <FaInfoCircle className="mx-auto text-blue-500" size={36} />
                  <p className="mt-3 text-blue-700 font-medium text-sm">
                    Selecciona una fecha para ver los turnos disponibles.
                  </p>
                </div>
              )}

              {fechaSeleccionada && (
                <>
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <FaClock className="text-green-600" />
                    Turnos disponibles — {formatearFechaSQL(fechaSeleccionada)}
                  </h3>

                  {turnosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {turnosFiltrados.map((turno, index) => (
                        <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                      <FaClock className="mx-auto text-gray-400" size={36} />
                      <p className="mt-3 text-gray-600 font-medium text-sm">No hay turnos disponibles en esta fecha.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* PIE */}
          <div className="p-5 bg-white border-t border-gray-200">
            <button
              onClick={() => navigate("/buscarprofesionales")}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium text-sm"
            >
              ← Volver a buscar profesionales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnSelectModal;