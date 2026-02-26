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
  FaCircleNotch,
  FaExclamationTriangle
} from "react-icons/fa";
import { FaHouseMedical } from "react-icons/fa6";

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

  const todayFormatted = new Date()
    .toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());

  if (isLoadingProfesionalesxIdPerfil) return <LoadingCard />;

  if (errorProfesionalesxIdPerfil || !perfil) {
    return (
      <ErrorCard
        title="Error de Sistema"
        message={errorProfesionalesxIdPerfil?.message || "Error al cargar la interfaz del consultorio."}
      />
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* ===== ENCABEZADO EXECUTIVE ===== */}
        <header className="bg-slate-900 text-white rounded-[3rem] shadow-2xl p-10 sm:p-14 mb-12 relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            
            <div className="flex-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter italic leading-none mb-10 uppercase">
                Panel de <span className="text-indigo-500 not-italic">Gestión</span>
              </h1>

              {medico ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-500/20">
                    {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tight mb-3">
                      Dr. {medico.nombre} {medico.apellido}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-2 bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-700">
                        <FaStethoscope className="text-indigo-400" size={16} /> {medico.especialidad}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-700">
                        <FaIdCard className="text-indigo-400" size={16} /> Matrícula: {medico.matricula}
                      </span>
                    </div>
                    
                    {consultoriosObtenidos.length > 0 && (
                      <div className="mt-8">
                        <button
                          onClick={async () => {
                            const url = `https://turnate.site/turnos/${medicoSlug}`;
                            const text = "¡Reservá tu turno desde este enlace!";
                            if (navigator.share) {
                              try { await navigator.share({ title: "Turnate", text, url }); } catch (err) { console.error(err); }
                            } else {
                              navigator.clipboard.writeText(url);
                              alert("Enlace copiado al portapapeles");
                            }
                          }}
                          className="inline-flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl hover:bg-indigo-500 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
                        >
                          <FaShareAlt /> Compartir Enlace de Turnos
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-2xl font-black italic">No se detectó profesional vinculado...</p>
              )}
            </div>

            {/* LISTADO DE SEDES / CONSULTORIOS */}
            <div className="w-full lg:w-[400px] space-y-5 bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Sedes de Atención</h3>
              <div className="max-h-72 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
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
                      className={`w-full p-6 rounded-[2rem] transition-all flex items-center gap-5 border-2 text-left ${
                        isSelected 
                        ? "bg-white border-indigo-500 text-slate-900 shadow-xl scale-[1.02]" 
                        : "bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-600"}`}>
                        <FaHouseMedical size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-base uppercase truncate leading-tight ${isSelected ? "text-slate-900" : "text-white"}`}>
                          {consultorio.nombre}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 truncate mt-1">
                          {consultorio.direccion}
                        </p>
                      </div>
                      {isSelected && <FaCheckCircle className="text-indigo-600" size={20} />}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowModalCrearConsultorio(true)}
                className="w-full py-5 border-2 border-dashed border-slate-600 text-slate-400 font-black rounded-[2rem] hover:border-indigo-500 hover:text-indigo-400 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
              >
                <FaPlus /> Agregar Nueva Sede
              </button>
            </div>
          </div>
        </header>

        {/* ===== ACCESOS RÁPIDOS ===== */}
        {consultoriosObtenidos?.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <ActionCard
              title="MI AGENDA"
              description="Visualice y gestione sus turnos del día."
              icon={FaCalendarAlt}
              color="indigo"
              onClick={() => {
                if (ConsultorioSelecID && medicoID) navigate(`/micuenta/panelturnos/${ConsultorioSelecID}/${medicoID}`);
                else alert("Seleccione un consultorio.");
              }}
              value={isLoadingTurnos ? "..." : turnsToday("reservado")}
            />
          
            <ActionCard
              title="COBERTURAS"
              description="Gestione convenios con prepagas."
              icon={FaShieldAlt}
              color="blue"
              onClick={() => navigate(`/micuenta/gestioncoberturas/${ConsultorioSelecID}`)}
            />
          </section>
        )}

        {/* ===== ESTADÍSTICAS DEL DÍA ===== */}
        {medico && !noHayConsultorioAsociados && (
          <div className="bg-white rounded-[3rem] shadow-xl p-12 border border-slate-100 mb-12">
            <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Resumen de Actividad <span className="text-indigo-600">/</span> {todayFormatted}
              </h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard label="Reservas Hoy" value={turnsToday("reservado")} icon={FaCalendarAlt} color="text-indigo-600" />
              <StatCard label="Libres" value={turnsToday("disponible")} icon={FaClock} color="text-emerald-600" />
              <StatCard label="Finalizados" value={turnsToday("finalizado")} icon={FaCheckCircle} color="text-blue-600" />
              <StatCard 
                label="Abrir Agenda" 
                value="VER" 
                icon={FaChevronRight} 
                color="text-slate-900" 
                onClick={() => setShowModalListaTurnos(true)} 
                clickable 
              />
            </div>
          </div>
        )}

        {/* MODALES */}
        {showModalCrearConsultorio && (
          <CrearConsultorioModal
            isOpen={true} onClose={() => setShowModalCrearConsultorio(false)}
            perfilID={perfilID} profesionalID={medicoID} perfilTipo={perfilTipo}
            actualizarConsultorio={fetchConsultorio}
          />
        )}

        {noHayProfesionalesAsociados && (
          <AsociarProfesionalAPerfil
            perfilID={perfilID} perfil={perfil} onClose={() => setShowModalAsociarProfesional(false)}
            refrescarListaProfesionales={refrescarListaProfesionales} profesionalVinculado={!!medicoID}
            actualizarProfesionales={fetchProfesional}
          />
        )}

        {showModalListaTurnos && (
          <ModalListaTurnos turnos={turnos} onClose={() => setShowModalListaTurnos(false)} />
        )}
      </div>
    </div>
  );
};

// ===== COMPONENTES AUXILIARES REDISEÑADOS =====

const ActionCard = ({ title, description, icon: Icon, color, onClick, value }) => {
  const themes = {
    indigo: "from-indigo-600 to-indigo-800",
    slate: "from-slate-800 to-slate-950",
    blue: "from-blue-700 to-blue-900"
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 cursor-pointer transition-all hover:scale-[1.04] hover:shadow-2xl active:scale-95"
    >
      <div className={`inline-flex p-6 rounded-[1.5rem] bg-gradient-to-br ${themes[color]} text-white mb-10 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter uppercase">{title}</h3>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed mb-8">{description}</p>
      <div className="flex items-center justify-between border-t border-slate-50 pt-8">
        <span className="text-4xl font-black text-slate-900">{value ?? "IR"}</span>
        <FaChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-colors" size={20} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, onClick, clickable }) => (
  <div
    onClick={clickable ? onClick : undefined}
    className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center justify-center ${
      clickable 
      ? "border-indigo-100 bg-indigo-50/20 cursor-pointer hover:border-indigo-600 hover:bg-white hover:shadow-2xl" 
      : "border-slate-50 bg-slate-50/50"
    }`}
  >
    <Icon className={`${color} mb-5`} size={30} />
    <span className="text-5xl font-black text-slate-900 tracking-tighter mb-2 leading-none">{value}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
  </div>
);

const LoadingCard = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="p-20 bg-white rounded-[4rem] shadow-2xl text-center border border-slate-100">
      <FaCircleNotch className="animate-spin text-indigo-600 mx-auto mb-10" size={80} />
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Sincronizando<span className="text-indigo-600">...</span></h2>
    </div>
  </div>
);

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="bg-white rounded-[4rem] shadow-2xl p-20 max-w-2xl w-full text-center border-b-[12px] border-red-500">
      <FaExclamationTriangle className="text-red-500 mx-auto mb-10" size={80} />
      <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">{title}</h2>
      <p className="text-slate-500 font-bold text-xl leading-relaxed italic">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;