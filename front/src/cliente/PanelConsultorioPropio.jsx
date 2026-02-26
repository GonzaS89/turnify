// src/components/PanelConsultorioPropio.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AsociarProfesionalAPerfil from "./AsociarProfesionalAPerfil";
import CrearConsultorioModal from "../cliente/CrearConsultorioModal";

// CARGA DE ICONOS
import {
  FaCalendarAlt, FaShieldAlt, FaStethoscope, FaIdCard, FaChevronRight,
  FaClock, FaCheckCircle, FaPlus, FaShareAlt, FaCircleNotch,
  FaExclamationTriangle, FaWhatsapp, FaCalendarDay
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

  const perfilID = perfil?.id;
  const perfilTipo = perfil.tipo;

  // Datos de Consultorios y Profesional
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
        const primerId = consultoriosObtenidos[0].id;
        setConsultorioSelecID(primerId);
        localStorage.setItem("consultorioSeleccionadoId", primerId);
      }
    } else {
      setConsultorioSelecID(null);
      localStorage.removeItem("consultorioSeleccionadoId");
    }
  }, [consultoriosObtenidos, ConsultorioSelecID]);

  // Hook de turnos (obtiene todos los estados)
  const { turnos, isLoading: isLoadingTurnos } = useProfessionalConsultorioTurnos(medicoID, ConsultorioSelecID);

  useEffect(() => {
    if (medicoID) enviarMedicoID(medicoID);
  }, [medicoID, enviarMedicoID]);

  // --- LÓGICA DE FILTRADO: SOLO RESERVADOS DE HOY ---
  const todayStr = new Date().toLocaleDateString('en-CA');
  
  const turnosReservadosHoy = turnos?.filter(t => 
    new Date(t.fecha).toLocaleDateString('en-CA') === todayStr && 
    t.estado === "reservado"
  ).sort((a, b) => a.hora.localeCompare(b.hora)) || [];

  // Contadores para las StatCards (usando todos los turnos del hook)
  const countByEstado = (estado) => turnos?.filter(t => 
    new Date(t.fecha).toLocaleDateString('en-CA') === todayStr && t.estado === estado
  ).length || 0;

  const todayFormatted = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  if (isLoadingProfesionales) return <LoadingCard />;
  if (errorProfesionales || !perfil) return <ErrorCard title="Error de Sistema" message={errorProfesionales?.message || "Error al cargar la interfaz."} />;

  const noHayConsultorios = !consultoriosObtenidos || consultoriosObtenidos.length === 0;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ENCABEZADO EXECUTIVE */}
        <header className="bg-slate-900 text-white rounded-[3.5rem] shadow-2xl p-10 sm:p-14 relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic leading-none mb-10 uppercase">
                Panel de <span className="text-indigo-500 not-italic">Gestión</span>
              </h1>
              {medico && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                    {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-2">Dr. {medico.nombre} {medico.apellido}</h2>
                    <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                        <FaStethoscope className="text-indigo-400" /> {medico.especialidad}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                        <FaIdCard className="text-indigo-400" /> MP: {medico.matricula}
                      </span>
                    </div>
                    <button onClick={() => {
                        const url = `https://turnate.site/turnos/${medicoSlug}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Enlace de reserva copiado");
                      }} 
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:bg-indigo-500 transition-all uppercase tracking-widest text-[10px]"
                    >
                      <FaShareAlt /> Compartir Enlace
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LISTADO DE SEDES */}
            <div className="w-full lg:w-[380px] space-y-4 bg-slate-800/30 p-6 rounded-[2.5rem] border border-slate-700/50">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">Sedes Activas</h3>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {consultoriosObtenidos?.map((c) => (
                  <button key={c.id} onClick={() => { setConsultorioSelecID(c.id); localStorage.setItem("consultorioSeleccionadoId", c.id); }}
                    className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 border-2 text-left ${ConsultorioSelecID === c.id ? "bg-white border-indigo-500 text-slate-900 shadow-lg scale-[1.02]" : "bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-800"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ConsultorioSelecID === c.id ? "bg-indigo-600 text-white" : "bg-slate-800"}`}><FaHouseMedical size={16} /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-black text-xs uppercase truncate ${ConsultorioSelecID === c.id ? "text-slate-900" : "text-white"}`}>{c.nombre}</p>
                      <p className="text-[9px] font-bold uppercase tracking-tighter opacity-50 truncate">{c.direccion}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowModalCrearConsultorio(true)} className="w-full py-4 border-2 border-dashed border-slate-700 text-slate-500 font-black rounded-2xl hover:border-indigo-500 hover:text-indigo-400 transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                <FaPlus size={10} /> Agregar Nueva Sede
              </button>
            </div>
          </div>
        </header>

        {!noHayConsultorios && (
          <>
            {/* ESTADÍSTICAS RÁPIDAS DEL DÍA */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Pacientes Hoy" value={countByEstado("reservado")} icon={FaCalendarAlt} color="text-indigo-600" />
              <StatCard label="Huecos Libres" value={countByEstado("disponible")} icon={FaClock} color="text-emerald-500" />
              <StatCard label="Ya Atendidos" value={countByEstado("finalizado")} icon={FaCheckCircle} color="text-blue-500" />
              <StatCard label="Gestionar Agenda" value="AGENDA" icon={FaChevronRight} color="text-slate-900" onClick={() => navigate(`/micuenta/panelturnos/${ConsultorioSelecID}/${medicoID}`)} clickable />
            </div>

            {/* HOJA DE RUTA: SOLO RESERVADOS */}
            <section className="bg-white rounded-[3.5rem] p-10 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
                <div className="flex items-center gap-5">
                  <div className="bg-indigo-600 p-4 rounded-[1.5rem] text-white shadow-lg">
                    <FaCalendarDay size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Agenda de Pacientes</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Pendientes para hoy: {todayFormatted}</p>
                  </div>
                </div>
                <button onClick={() => setShowModalListaTurnos(true)} className="px-6 py-3 bg-slate-50 text-slate-500 font-black rounded-xl text-[10px] uppercase hover:bg-indigo-50 transition-all border border-slate-100">
                  Ver Historial / Futuros
                </button>
              </div>

              {isLoadingTurnos ? (
                <div className="py-20 text-center"><FaCircleNotch className="animate-spin text-indigo-600 mx-auto" size={40} /></div>
              ) : turnosReservadosHoy.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {turnosReservadosHoy.map((turno) => (
                    <PacienteDiaCard key={turno.id} turno={turno} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                  <div className="max-w-xs mx-auto space-y-4">
                     <p className="text-slate-300 flex justify-center"><FaCalendarAlt size={40} /></p>
                     <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">
                       No tenés pacientes reservados para hoy
                     </p>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* MODALES Y ASOCIACIONES */}
        <CrearConsultorioModal isOpen={showModalCrearConsultorio} onClose={() => setShowModalCrearConsultorio(false)} perfilID={perfilID} profesionalID={medicoID} perfilTipo={perfilTipo} onSuccess={fetchConsultorio} />
        {showModalListaTurnos && <ModalListaTurnos turnos={turnos} onClose={() => setShowModalListaTurnos(false)} />}
        {!medico && <AsociarProfesionalAPerfil perfilID={perfilID} perfil={perfil} onClose={() => {}} actualizarProfesionales={fetchProfesional} />}
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar theme="dark" />
    </div>
  );
};

// COMPONENTE TARJETA DE PACIENTE (EXECUTIVE STYLE)
const PacienteDiaCard = ({ turno }) => {
  return (
    <div className="p-6 rounded-[2.5rem] bg-white border border-indigo-100 shadow-md ring-1 ring-indigo-50 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-2xl">
            <span className="text-white font-black text-sm">{turno.hora.slice(0, 5)}</span>
          </div>
          <div>
            <p className="text-slate-900 font-black text-sm uppercase tracking-tighter leading-none mb-1">
              {turno.apellido_paciente}, {turno.nombre_paciente}
            </p>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">{turno.cobertura || 'Particular'}</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identidad</span>
          <span className="text-xs font-bold text-slate-600">DNI {turno.DNI}</span>
        </div>
        {turno.telefono && (
          <a 
            href={`https://wa.me/${turno.telefono}`} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
          >
            <FaWhatsapp size={14} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES
const StatCard = ({ label, value, icon: Icon, color, onClick, clickable }) => (
  <div onClick={clickable ? onClick : undefined} className={`p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all flex flex-col items-center justify-center ${clickable ? "cursor-pointer hover:border-indigo-500 hover:shadow-xl" : ""}`}>
    <Icon className={`${color} mb-4`} size={24} />
    <span className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{value}</span>
    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
  </div>
);

const LoadingCard = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <FaCircleNotch className="animate-spin text-indigo-600 mx-auto mb-6" size={50} />
      <h2 className="text-xl font-black text-slate-900 tracking-widest uppercase italic">Sincronizando Turnate...</h2>
    </div>
  </div>
);

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="bg-white rounded-[3rem] shadow-2xl p-16 max-w-xl w-full text-center border-t-[8px] border-red-500">
      <FaExclamationTriangle className="text-red-500 mx-auto mb-6" size={60} />
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase">{title}</h2>
      <p className="text-slate-500 font-bold italic">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;