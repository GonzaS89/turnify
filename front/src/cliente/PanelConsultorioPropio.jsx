// src/components/PanelConsultorioPropio.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AsociarProfesionalAPerfil from "./AsociarProfesionalAPerfil";
import CrearConsultorioModal from "../cliente/CrearConsultorioModal";

// CARGA DE ICONOS
import {
  FaCalendarAlt,
  FaCog,
  FaShieldAlt,
  FaStethoscope,
  FaIdCard,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaShareAlt,
} from "react-icons/fa";
import { FaHouseMedical, FaUserDoctor } from "react-icons/fa6";

// CARGA DE HOOKS
import useObtenerProfesionalxIdPerfil from "../../customHooks/useObtenerProfesionalxIdPerfil";
import useObtenerConsultorioxIdPerfil from "../../customHooks/useObtenerConsultorioxIdPerfil";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";

// CARGA DE LAYOUTS
import ModalListaTurnos from "../cliente/ModalListaTurnos";

const PanelConsultorioPropio = ({ perfilData: perfil, enviarMedicoID }) => {
  const navigate = useNavigate();
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] = useState(false);
  const [showModalListaTurnos, setShowModalListaTurnos] = useState(false);
  const [showModalCrearConsultorio, setShowModalCrearConsultorio] = useState(false);
  const [refreshProfesionales, setRefreshProfesionales] = useState(null);

  const perfilID = perfil?.id;
  const perfilTipo = perfil.tipo;

  // --- LÓGICA ORIGINAL INTACTA ---
  const {
    consultorios: consultoriosObtenidos,
    isLoading: isLoadingConsultoriosxIdPerfil,
    error: errorConsultoriosxIdPerfil,
    fetchConsultorio,
  } = useObtenerConsultorioxIdPerfil(perfilID);

  const {
    profesional: profesionalesObtenidos,
    isLoading: isLoadingProfesionalesxIdPerfil,
    error: errorProfesionalesxIdPerfil,
    fetchProfesional,
  } = useObtenerProfesionalxIdPerfil(perfilID);

  const medico = profesionalesObtenidos?.[0] || null;
  const medicoID = medico?.id;
  const medicoSlug = medico?.slug;

  const storedSelection = typeof window !== "undefined" ? localStorage.getItem("consultorioSeleccionadoId") : null;
  const [ConsultorioSelecID, setConsultorioSelecID] = useState(storedSelection);

  useEffect(() => {
    if (consultoriosObtenidos && consultoriosObtenidos.length > 0) {
      const primerId = consultoriosObtenidos[0].id;
      if (!ConsultorioSelecID) {
        setConsultorioSelecID(primerId);
        localStorage.setItem("consultorioSeleccionadoId", primerId);
      }
    } else {
      setConsultorioSelecID(null);
      localStorage.removeItem("consultorioSeleccionadoId");
    }
  }, [consultoriosObtenidos]);

  const noHayConsultorioAsociados = !consultoriosObtenidos || consultoriosObtenidos.length === 0;
  const noHayProfesionalesAsociados = !profesionalesObtenidos || profesionalesObtenidos.length === 0;

  const {
    turnos,
    isLoading: isLoadingTurnos,
    error: errorTurnos,
  } = useProfessionalConsultorioTurnos(medicoID, ConsultorioSelecID);

  const refrescarListaProfesionales = () => {
    setRefreshProfesionales((prev) => prev + 1);
  };

  useEffect(() => {
    if (profesionalesObtenidos?.[0] === undefined) {
      setShowModalAsociarProfesional(true);
    } else {
      setShowModalAsociarProfesional(false);
    }
    enviarMedicoID(medicoID);
  }, [profesionalesObtenidos, medicoID]);

  const turnsToday = (estado) => {
    if (!turnos || turnos.length === 0) return 0;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return turnos.filter(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === todayFormatted && turno.estado === estado
    ).length;
  };

  const todayFormatted = new Date().toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase());
  // --- FIN LÓGICA ORIGINAL ---

  if (isLoadingProfesionalesxIdPerfil) return <LoadingCard />;

  if (errorProfesionalesxIdPerfil || !perfil) {
    return (
      <ErrorCard
        title="Error"
        message={errorProfesionalesxIdPerfil?.message || "No se pudo cargar la información del consultorio."}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===== NUEVO ENCABEZADO ESTILO DASHBOARD ===== */}
        <header className="relative overflow-hidden bg-slate-900 rounded-[2rem] shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row justify-between gap-10">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {consultoriosObtenidos?.length > 1 ? "Mis Consultorios" : "Mi Consultorio"}
                </h1>
                <p className="text-indigo-300 font-medium flex items-center gap-2">
                   <FaClock className="text-sm" /> {todayFormatted}
                </p>
              </div>

              {medico ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
                    {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Dr. {medico.nombre} {medico.apellido}</h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wider">
                        <FaStethoscope className="text-indigo-400" /> {medico.especialidad}
                      </span>
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wider">
                        <FaIdCard className="text-indigo-400" /> MP: {medico.matricula}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-indigo-200/60 italic">No hay profesional asociado todavía.</p>
              )}

              {medico && consultoriosObtenidos?.length > 0 && (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    const url = `https://turnate.site/turnos/${medicoSlug}`;
                    const text = "¡Reservá tu turno desde este enlace!";
                    if (navigator.share) {
                      try { await navigator.share({ title: "Turnate", text, url }); } catch (err) { console.error(err); }
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Enlace copiado al portapapeles");
                    }
                  }}
                  className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/20 transform hover:-translate-y-1"
                >
                  <FaShareAlt /> Compartir Agenda Pública
                </button>
              )}
            </div>

            {/* Selector de Consultorios Lateral */}
            <div className="w-full lg:w-[380px] space-y-4">
              <div className="flex items-center justify-between text-white/50 px-2">
                <span className="text-xs font-black uppercase tracking-widest">Seleccionar Sede</span>
                <button 
                  onClick={() => setShowModalCrearConsultorio(true)}
                  className="text-xs font-bold text-indigo-400 hover:text-white transition-colors"
                >
                  + Agregar
                </button>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {consultoriosObtenidos?.map((consultorio) => {
                  const isSelected = ConsultorioSelecID === consultorio.id;
                  return (
                    <button
                      key={consultorio.id}
                      onClick={() => {
                        if (ConsultorioSelecID !== consultorio.id) {
                          setConsultorioSelecID(consultorio.id);
                          localStorage.setItem("consultorioSeleccionadoId", consultorio.id);
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${
                        isSelected 
                          ? "bg-white border-white shadow-xl" 
                          : "bg-white/5 border-white/10 hover:border-white/30 text-white"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-white/10 text-slate-400"}`}>
                        <FaHouseMedical />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-bold text-sm truncate ${isSelected ? "text-slate-900" : "text-white"}`}>{consultorio.nombre}</p>
                        <p className={`text-[11px] truncate ${isSelected ? "text-slate-500" : "text-slate-400"}`}>{consultorio.direccion}</p>
                      </div>
                      {isSelected && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* ===== ACCIONES RÁPIDAS ===== */}
        {consultoriosObtenidos?.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Mi Agenda"
              description="Gestiona pacientes y disponibilidad."
              icon={FaCalendarAlt}
              gradient="from-emerald-500 to-teal-600"
              onClick={() => {
                if (ConsultorioSelecID && medicoID) {
                  navigate(`/micuenta/panelturnos/${ConsultorioSelecID}/${medicoID}`);
                } else {
                  alert("Primero debes seleccionar un consultorio y profesional.");
                }
              }}
              footer={
                <div className="flex items-center justify-between mt-4 bg-black/5 p-3 rounded-xl">
                  <span className="text-2xl font-black text-slate-800">{isLoadingTurnos ? "..." : turnsToday("reservado")}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">Citas Hoy <FaChevronRight size={10} /></span>
                </div>
              }
            />

            <ActionCard
              title="Configuración"
              description="Ajusta horarios y datos de la sede."
              icon={FaCog}
              gradient="from-slate-700 to-slate-900"
              onClick={() => navigate(`/micuenta/datosconsultorio/${ConsultorioSelecID}/${perfilID}`)}
              footer={
                <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 mt-4">
                  <FaCheckCircle className="text-slate-400" /> Configuración Activa
                </span>
              }
            />

            <ActionCard
              title="Coberturas"
              description="Obras sociales y prepagas aceptadas."
              icon={FaShieldAlt}
              gradient="from-indigo-600 to-blue-700"
              onClick={() => navigate(`/micuenta/gestioncoberturas/${ConsultorioSelecID}`)}
              footer={
                <span className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 mt-4">
                  <FaChevronRight /> Gestionar Listado
                </span>
              }
            />
          </section>
        ) : (
          <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-200">
             <FaHouseMedical className="mx-auto text-slate-200 mb-6" size={60} />
             <h3 className="text-xl font-bold text-slate-800">No hay consultorios registrados</h3>
             <p className="text-slate-500 mb-8">Crea tu primer consultorio para empezar a gestionar turnos.</p>
             <button
              onClick={() => setShowModalCrearConsultorio(true)}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100"
             >
               + Crear Consultorio
             </button>
          </div>
        )}

        {/* ===== ESTADÍSTICAS ===== */}
        {medico && !noHayConsultorioAsociados && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Resumen de Actividad</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Turnos Hoy" value={turnsToday("reservado")} icon={FaCalendarAlt} color="text-indigo-600" bg="bg-indigo-50" />
              <StatCard label="Disponibles" value={turnsToday("disponible")} icon={FaClock} color="text-emerald-600" bg="bg-emerald-50" />
              <StatCard label="Completados" value={turnsToday("finalizado")} icon={FaCheckCircle} color="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Ver Lista" value={turnsToday("reservado")} icon={FaCalendarAlt} color="text-slate-700" bg="bg-slate-100" onClick={() => setShowModalListaTurnos(true)} clickable />
            </div>
          </div>
        )}

        {/* MODALES (Mantienen su lógica original) */}
        {showModalCrearConsultorio && (
          <CrearConsultorioModal
            isOpen={true} onClose={() => setShowModalCrearConsultorio(false)}
            perfilID={perfilID} profesionalID={medicoID} perfilTipo={perfilTipo}
            actualizarConsultorio={fetchConsultorio}
          />
        )}
        {noHayProfesionalesAsociados && (
          <AsociarProfesionalAPerfil
            perfilID={perfilID} perfil={perfil}
            onClose={() => setShowModalAsociarProfesional(false)}
            refrescarListaProfesionales={refrescarListaProfesionales}
            profesionalVinculado={!!medicoID} actualizarProfesionales={fetchProfesional}
          />
        )}
        {showModalListaTurnos && (
          <ModalListaTurnos turnos={turnos} onClose={() => setShowModalListaTurnos(false)} />
        )}
      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES CON DISEÑO MEJORADO
const ActionCard = ({ title, description, icon: Icon, gradient, onClick, footer }) => (
  <div
    onClick={onClick}
    className="group bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-2xl border border-slate-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
    {footer}
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, bg, onClick, clickable }) => (
  <div
    onClick={clickable ? onClick : undefined}
    className={`flex flex-col items-center justify-center p-6 ${bg} rounded-3xl transition-all duration-300 ${
      clickable ? "cursor-pointer hover:shadow-xl hover:scale-105" : ""
    }`}
  >
    <Icon className={`${color} mb-3`} size={20} />
    <span className="text-3xl font-black text-slate-900">{value}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</span>
  </div>
);

const LoadingCard = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center space-y-6">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-800 font-black text-xl">Sincronizando Panel...</p>
    </div>
  </div>
);

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center border border-red-100">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaPlus className="rotate-45" size={32} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;