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
  FaArrowLeft,
} from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";

const TurnSelectModal = ({ enviarTurnoYOrden, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { profesionalSlug } = useParams();
  const [profesionalId, setProfesionalId] = useState(null);
  const fechaRefs = useRef({});

  // --- LÓGICA DE DATOS ORIGINAL ---
  useEffect(() => {
    const fetchProfesionalId = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profesionales/${profesionalSlug}`);
        const prof = Array.isArray(res.data) ? res.data[0] : res.data;
        if (prof?.id) setProfesionalId(prof.id);
      } catch (err) { console.error(err); }
    };
    fetchProfesionalId();
  }, [profesionalSlug]);

  const { profesional, isLoading: isLoadingProfesional, error: errorProfesional } = useProfesionalxId(profesionalId || 0);
  const { consultorios, isLoading: isLoadingConsultorios } = useProfessionalConsultorios(profesionalId || 0);
  const [consultorioSelec, setConsultorioSelec] = useState(null);

  useEffect(() => {
    if (!isLoadingConsultorios && Array.isArray(consultorios) && consultorios.length > 0) {
      setConsultorioSelec(consultorios[0].id);
    }
  }, [consultorios, isLoadingConsultorios]);

  const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(profesionalId || 0, consultorioSelec || 0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const medico = useMemo(() => {
    return profesional && Array.isArray(profesional) && profesional.length > 0 ? profesional[0] : null;
  }, [profesional]);

  const todayDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const fechasUnicas = useMemo(() => {
    if (!turnos || !Array.isArray(turnos)) return [];
    return [...new Set(turnos.filter(t => t.estado === "disponible").map(t => t.fecha))]
      .filter(fecha => fecha >= todayDate)
      .sort();
  }, [turnos, todayDate]);

  const turnosFiltrados = useMemo(() => {
    return fechaSeleccionada ? (turnos?.filter(t => t.fecha === fechaSeleccionada) || []) : [];
  }, [turnos, fechaSeleccionada]);

  const titulo = useMemo(() => {
    const map = { doctor: "Dr.", doctora: "Dra.", licenciado: "Lic.", licenciada: "Lcda." };
    return map[medico?.titulo] || "";
  }, [medico?.titulo]);

  // --- FORMATEO ORIGINAL DE FECHAS ---
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

  const handleFechaChange = e => setFechaSeleccionada(e.target.value);
  const handleSelectTurno = (turno, index) => {
    navigate(`/formulario-usuario/${consultorioSelec}/${profesionalId}`);
    enviarTurnoYOrden(turno, index + 1);
    onClose?.();
  };

  useEffect(() => {
    setFechaSeleccionada("");
  }, [consultorioSelec]);

  useEffect(() => {
    if (fechaSeleccionada && fechaRefs.current[fechaSeleccionada]) {
      fechaRefs.current[fechaSeleccionada].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [fechaSeleccionada]);

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col h-screen w-full overflow-hidden animate-fade-in">
      
      {/* HEADER: Pantalla Completa - Estilo Azul/Indigo */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/buscarprofesionales")} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <FaUserMd className="text-4xl text-indigo-400 hidden md:block" />
            <div>
              <h2 className="text-2xl md:text-3xl font-black capitalize">
                {isLoadingProfesional ? "Cargando..." : `${titulo} ${medico?.nombre} ${medico?.apellido}`}
              </h2>
              <p className="text-slate-400 text-sm md:text-base">{medico?.especialidad}</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/buscarprofesionales")} className="text-slate-400 hover:text-white text-4xl font-light">
          <FaTimes />
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* PANEL IZQUIERDO: Consultorios */}
        <aside className="lg:w-1/3 xl:w-1/4 bg-white border-r border-slate-200 p-8 overflow-y-auto">
          <h3 className="text-slate-800 text-xl font-black mb-8">Sedes de Atención</h3>
          <div className="space-y-4">
            {consultorios?.map((cons) => (
              <div
                key={cons.id}
                onClick={() => setConsultorioSelec(cons.id)}
                className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                  cons.id === consultorioSelec ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl h-fit ${cons.id === consultorioSelec ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {cons.tipo === "Particular" ? <FaHome /> : <FaHospital />}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${cons.id === consultorioSelec ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {cons.nombre || "Sede"}
                    </p>
                    <p className="text-slate-400 text-sm">{cons.direccion}</p>
                    <p className="text-indigo-500 text-xs font-black mt-2 uppercase">{cons.localidad}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* PANEL DERECHO: Agenda y Turnos */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          
          {/* SECTOR FECHAS (Formato de botones original) */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-12">
            <label className="text-slate-800 text-xl font-black mb-8 flex items-center gap-3">
              <FaCalendarAlt className="text-indigo-600" /> Seleccionar Fecha
            </label>

            {isLoadingTurnos ? (
              <div className="py-10 text-center"><BiLoaderCircle className="animate-spin text-indigo-600 text-4xl mx-auto" /></div>
            ) : fechasUnicas.length === 0 ? (
              <p className="text-slate-400 font-bold text-center py-10">Sin disponibilidad próximamente.</p>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide">
                {fechasUnicas.map((fecha, index) => {
                  const isActive = fecha === fechaSeleccionada;
                  return (
                    <button
                      key={index}
                      ref={el => fechaRefs.current[fecha] = el}
                      onClick={() => handleFechaChange({ target: { value: fecha } })}
                      className={`
                        flex-shrink-0 px-6 py-6 rounded-[2rem] font-bold transition-all duration-300 border-2 flex flex-col items-center min-w-[90px]
                        ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-300'}
                      `}
                    >
                      <span className="text-[10px] uppercase tracking-widest mb-1">{obtenerDiaDeLaSemanaCorto(fecha)}</span>
                      <span className="text-2xl font-black">{formatearSoloDia(fecha)}</span>
                      <span className="text-xs uppercase mt-1">{obtenerMesCorto(fecha)}</span>
                      {fecha === todayDate && (
                        <span className="mt-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">Hoy</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* TURNOS (Mapeo original) */}
          <div className="space-y-6">
            {!fechaSeleccionada && fechasUnicas.length > 0 && (
              <div className="text-center py-20 bg-indigo-50/30 rounded-[2rem] border border-dashed border-indigo-100">
                <FaInfoCircle className="mx-auto text-indigo-300 text-5xl mb-4" />
                <p className="text-indigo-900 font-bold text-lg">Selecciona una fecha para ver los turnos disponibles.</p>
              </div>
            )}

            {fechaSeleccionada && (
              <>
                <h3 className="text-slate-800 text-2xl font-black flex items-center gap-3 mb-8">
                  <FaClock className="text-indigo-600" /> Turnos — {formatearFechaSQL(fechaSeleccionada)}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {turnosFiltrados.length > 0 ? (
                    turnosFiltrados.map((turno, index) => (
                      <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />
                    ))
                  ) : (
                    <p className="col-span-full text-slate-400 font-bold italic py-10">No hay horarios para este día.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TurnSelectModal;