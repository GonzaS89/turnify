// src/components/PanelConsultorioPropio.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AsociarProfesionalAPerfil from "./AsociarProfesionalAPerfil";
import CrearConsultorioModal from "../cliente/CrearConsultorioModal";

// CARGA DE ICONOS
import {
  FaCalendarAlt, FaStethoscope, FaIdCard, FaChevronRight,
  FaClock, FaCheckCircle, FaPlus, FaShareAlt, FaCircleNotch,
  FaExclamationTriangle, FaWhatsapp, FaCalendarDay, FaChevronLeft
} from "react-icons/fa";
import { FaHouseMedical } from "react-icons/fa6";

// CARGA DE HOOKS
import useObtenerProfesionalxIdPerfil from "../../customHooks/useObtenerProfesionalxIdPerfil";
import useObtenerConsultorioxIdPerfil from "../../customHooks/useObtenerConsultorioxIdPerfil";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";

// CARGA DE LAYOUTS
import ModalListaTurnos from "../cliente/ModalListaTurnos";
import { toast, ToastContainer } from "react-toastify";

const PanelConsultorioPropio = ({ perfilData: perfil, enviarMedicoID }) => {
  const navigate = useNavigate();
  const [showModalListaTurnos, setShowModalListaTurnos] = useState(false);
  const [showModalCrearConsultorio, setShowModalCrearConsultorio] = useState(false);
  
  const [fechaVisualizada, setFechaVisualizada] = useState(new Date());

  const perfilID = perfil?.id;
  const perfilTipo = perfil.tipo;

  const { consultorios: consultoriosObtenidos, fetchConsultorio } = useObtenerConsultorioxIdPerfil(perfilID);
  const { profesional: profesionalesObtenidos, isLoading: isLoadingProfesionales, error: errorProfesionales, fetchProfesional } = useObtenerProfesionalxIdPerfil(perfilID);

  const medico = profesionalesObtenidos?.[0] || null;
  const medicoID = medico?.id;
  const medicoSlug = medico?.slug;

  const storedSelection = typeof window !== "undefined" ? localStorage.getItem("consultorioSeleccionadoId") : null;
  const [ConsultorioSelecID, setConsultorioSelecID] = useState(storedSelection);

  useEffect(() => {
    if (consultoriosObtenidos?.length > 0) {
      if (!ConsultorioSelecID) {
        const primerId = consultoriosObtenidos?.[0].id;
        setConsultorioSelecID(primerId);
        localStorage.setItem("consultorioSeleccionadoId", primerId);
      }
    } else {
      setConsultorioSelecID(null);
      localStorage.removeItem("consultorioSeleccionadoId");
    }
  }, [consultoriosObtenidos, ConsultorioSelecID]);

  const { turnos, isLoading: isLoadingTurnos } = useProfessionalConsultorioTurnos(medicoID, ConsultorioSelecID);

  useEffect(() => {
    if (medicoID) enviarMedicoID(medicoID);
  }, [medicoID, enviarMedicoID]);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const fechaVisualizadaStr = fechaVisualizada.toLocaleDateString('en-CA');
  
  const turnosFiltrados = turnos?.filter(t => 
    new Date(t.fecha).toLocaleDateString('en-CA') === fechaVisualizadaStr && 
    t.estado === "reservado"
  ).sort((a, b) => a.hora.localeCompare(b.hora)) || [];

  const countByEstado = (estado) => turnos?.filter(t => 
    new Date(t.fecha).toLocaleDateString('en-CA') === todayStr && t.estado === estado
  ).length || 0;

  const fechaDisplay = fechaVisualizada.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fechaVisualizada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaVisualizada(nuevaFecha);
  };

  if (isLoadingProfesionales) return <LoadingCard />;
  if (errorProfesionales || !perfil) return <ErrorCard title="Error" message={errorProfesionales?.message || "Error al cargar la interfaz."} />;

  const noHayConsultorios = !consultoriosObtenidos || consultoriosObtenidos.length === 0;

  return (
    <div className="min-h-screen py-4 sm:py-12 px-2 sm:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
        
        {/* ENCABEZADO - AJUSTADO PARA MOBILE */}
        <header className="bg-slate-900 text-white rounded-[1.5rem] sm:rounded-[3.5rem] shadow-2xl p-6 sm:p-14 relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
            
            {/* PERFIL MÉDICO */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-5xl font-black italic mb-6 sm:mb-10 uppercase">
                Panel de <span className="text-indigo-500 not-italic">Gestión</span>
              </h1>
              {medico && (
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl sm:text-3xl shadow-2xl shrink-0">
                    {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-3xl font-black mb-1">Dr. {medico.nombre} {medico.apellido}</h2>
                    <div className="flex flex-col sm:flex-row gap-2 text-[8px] sm:text-[10px] uppercase font-black text-slate-400">
                      <span><FaStethoscope className="inline mr-1 text-indigo-400" /> {medico.especialidad}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SEDES - COMPACTO PARA MOBILE */}
            <div className="w-full lg:w-[350px] bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3 ml-1">Tus Sedes</h3>
              <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {consultoriosObtenidos?.map((c) => (
                  <button key={c.id} onClick={() => { setConsultorioSelecID(c.id); localStorage.setItem("consultorioSeleccionadoId", c.id); }}
                    className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 border ${ConsultorioSelecID === c.id ? "bg-white border-indigo-500 text-slate-900" : "bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800"}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-500"><FaHouseMedical size={12} /></div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-black text-[10px] uppercase truncate">{c.nombre}</p>
                      <p className="text-[8px] uppercase opacity-70 truncate">{c.direccion}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowModalCrearConsultorio(true)} className="w-full mt-3 py-2 border border-dashed border-slate-600 text-[8px] font-black rounded-lg text-slate-500 uppercase hover:text-indigo-400">
                <FaPlus className="inline mr-1" /> Nueva Sede
              </button>
            </div>
          </div>
        </header>

        {!noHayConsultorios && (
          <>
            {/* ESTADÍSTICAS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard label="Pacientes" value={countByEstado("reservado")} icon={FaCalendarAlt} color="text-indigo-500" />
              <StatCard label="Libres" value={countByEstado("disponible")} icon={FaClock} color="text-emerald-500" />
              <StatCard label="Atendidos" value={countByEstado("finalizado")} icon={FaCheckCircle} color="text-blue-500" />
              <StatCard label="Ver Agenda" value="IR" icon={FaChevronRight} color="text-slate-400" onClick={() => navigate(`/micuenta/panelturnos/${ConsultorioSelecID}/${medicoID}`)} clickable />
            </div>

            {/* AGENDA */}
            <section className="bg-white rounded-[2rem] p-5 sm:p-10 shadow-lg border border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">Pacientes del día</h3>
                  <p className="text-slate-400 text-[9px] uppercase font-black">{fechaDisplay}</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => cambiarDia(-1)} className="p-2 hover:bg-white rounded-lg"><FaChevronLeft size={12} /></button>
                  <button onClick={() => setFechaVisualizada(new Date())} className="px-3 text-[9px] font-black uppercase">Hoy</button>
                  <button onClick={() => cambiarDia(1)} className="p-2 hover:bg-white rounded-lg"><FaChevronRight size={12} /></button>
                </div>
              </div>

              {isLoadingTurnos ? (
                <div className="py-10 text-center"><FaCircleNotch className="animate-spin text-indigo-600 mx-auto" /></div>
              ) : turnosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {turnosFiltrados.map((turno) => <PacienteDiaCard key={turno.id} turno={turno} />)}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 text-xs font-black uppercase italic border-2 border-dashed border-slate-100 rounded-xl">
                  Sin pacientes para hoy
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <CrearConsultorioModal isOpen={showModalCrearConsultorio} onClose={() => setShowModalCrearConsultorio(false)} perfilID={perfilID} profesionalID={medicoID} perfilTipo={perfilTipo} onSuccess={fetchConsultorio} />
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

const PacienteDiaCard = ({ turno }) => (
  <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="bg-slate-900 px-3 py-1 rounded-lg text-white font-black text-[10px]">{turno.hora.slice(0, 5)}</div>
      <div>
        <p className="font-black text-[10px] uppercase">{turno.apellido_paciente}, {turno.nombre_paciente}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase">{turno.cobertura || 'Particular'}</p>
      </div>
    </div>
    {turno.telefono && (
      <a href={`https://wa.me/${turno.telefono}`} target="_blank" rel="noreferrer" className="text-emerald-500 p-2"><FaWhatsapp size={16} /></a>
    )}
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, onClick, clickable }) => (
  <div onClick={clickable ? onClick : undefined} className={`p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center ${clickable ? "cursor-pointer hover:border-indigo-400" : ""}`}>
    <Icon className={`${color} mb-2`} size={16} />
    <span className="text-xl font-black text-slate-900">{value}</span>
    <span className="text-[8px] font-black uppercase text-slate-400">{label}</span>
  </div>
);

const LoadingCard = () => <div className="min-h-screen flex items-center justify-center text-indigo-600"><FaCircleNotch className="animate-spin" size={40} /></div>;

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center p-8 bg-white rounded-3xl border border-red-100 shadow-xl">
      <h2 className="font-black text-red-500 uppercase">{title}</h2>
      <p className="text-xs text-slate-500 mt-2">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;