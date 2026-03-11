// src/components/PanelCentroMedico.jsx
import { useEffect, useState } from 'react';
import { 
  FaUserMd, FaShieldAlt, FaCalendarPlus, FaBuilding, 
  FaInfoCircle, FaTimes, FaChartLine, FaCalendarDay, FaClock, FaWhatsapp 
} from 'react-icons/fa';

// Componentes y Hooks
import GestionProfesionales from '../cliente/GestionProfesionales';
import TurnListCentroMedico from '../cliente/TurnListCentroMedico';
import CardGestionProfesionales from '../cliente/cards/CardGestionProfesionales';
import CardGestionCoberturas from '../cliente/cards/CardGestionCoberturas';
import CrearCentroMedicoModal from '../cliente/CrearCentroMedicoModal';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useObtenerConsultorioxIdPerfil from '../../customHooks/useObtenerConsultorioxIdPerfil';
import useObtenerTurnosxIdConsultorio from '../../customHooks/useObtenerTurnosxIdConsultorio';

const PanelCentroMedico = ({ perfilData: perfil, profesionalVinculado }) => {
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const perfilId = perfil?.id;
  const { consultorios, isLoading: isLoadingConsultorio, error: errorConsultorio, fetchConsultorio } = useObtenerConsultorioxIdPerfil(perfilId);
  const consultorioObtenido = consultorios[0] || null;
  const { nombre, tipo, id: consultorioID } = consultorioObtenido || {};
  
  const { profesional: profesionales, isLoading: isLoadingProfesionales } = useProfesionalxIdConsultorio(consultorioID);
  const { turnos, isLoading: isLoadingTurnos } = useObtenerTurnosxIdConsultorio(consultorioID);

  const numProfesionales = profesionales?.length || 0;
  const [showGestionMedicos, setShowGestionMedicos] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false);
  const [profesionalID, setProfesionalID] = useState(null);
  const [hayConsultorios, setHayConsultorios] = useState(consultorios.length > 0);

  useEffect(() => {
    setHayConsultorios(consultorios.length > 0);
  }, [consultorios]);

  if (errorConsultorio) return <ErrorPanel message={errorConsultorio} />;

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-12">
        
        {/* ===== ENCABEZADO INSTITUCIONAL - ADAPTADO ===== */}
        <header className="relative overflow-hidden bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-14 shadow-2xl text-white">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-xl shadow-lg">
                <FaBuilding className="text-white text-[10px]" />
                <span className="text-white font-black text-[9px] uppercase tracking-[0.2em]">
                  {tipo || 'Entidad Médica'}
                </span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight uppercase">
                {nombre || "Centro Médico"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-indigo-300">
                <span className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/5">
                  <FaChartLine /> Gestión Activa
                </span>
                <p className="text-slate-400 font-bold italic text-xs tracking-tight">
                  Panel Administrativo
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] w-full lg:w-auto min-w-[250px]">
              <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Fecha Actual</p>
              <p className="text-lg md:text-2xl font-black tracking-tight capitalize leading-tight">
                {currentDate}
              </p>
            </div>
          </div>
          {/* Decoración */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-indigo-500 rounded-full opacity-10 blur-[80px] md:blur-[100px]"></div>
        </header>

        {!hayConsultorios ? (
          <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-10 md:p-20 text-center shadow-xl border-2 border-dashed border-slate-200 animate-fade-in">
             <CrearCentroMedicoModal
              perfilId={perfilId}
              perfilTipo={perfil?.tipo}
              isOpen={true}
              onSuccess={() => { setHayConsultorios(true); fetchConsultorio(); }}
              actualizarConsultorios={fetchConsultorio}
            />
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12">
            {/* TARJETAS DE ACCIÓN RÁPIDA */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <CardGestionProfesionales
                seccion={`/micuenta/gestionprofesionales/${consultorioID}`}
                icon={FaUserMd}
                titulo="Equipo Médico"
                subtitulo="Altas, bajas y especialidades."
                numProfesionales={numProfesionales}
                texto="médicos vinculados"
                isLoading={isLoadingProfesionales}
                className="rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 bg-white border border-slate-200 shadow-sm"
              />

              <CardGestionCoberturas
                seccion={`/micuenta/gestioncoberturas/${consultorioID}`}
                titulo="Coberturas"
                icon={FaShieldAlt}
                subtitulo="Configuración de prepagas."
                emoji="🛡️"
                texto="Configurar"
                className="rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 bg-white border border-slate-200 shadow-sm"
              />
            </section>

            {/* PANEL DE ACTIVIDAD INTEGRADO */}
            <ActividadDiaPanel turnos={turnos} isLoading={isLoadingTurnos} />
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================================
// COMPONENTE ACTIVIDAD DEL DÍA - ADAPTADO
// ==========================================================

const ActividadDiaPanel = ({ turnos, isLoading }) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const turnosPorMedico = turnos?.reduce((acc, t) => {
    const fechaTurno = t.fecha.split('T')[0];
    if (fechaTurno === today) {
      const nombreCompleto = `${t.nombreProfesional} ${t.apellidoProfesional}`;
      if (!acc[nombreCompleto]) acc[nombreCompleto] = [];
      acc[nombreCompleto].push(t);
    }
    return acc;
  }, {});

  if (isLoading) return <div className="p-10 text-center text-slate-400 font-black uppercase text-[10px]">Cargando...</div>;

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-200 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 md:pb-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-emerald-500 p-2.5 md:p-3 rounded-xl md:rounded-2xl">
            <FaCalendarDay className="text-white text-lg md:text-xl" />
          </div>
          <h3 className="text-lg md:text-2xl font-black text-slate-800 uppercase leading-none">Actividad del Día</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {turnosPorMedico && Object.keys(turnosPorMedico).length > 0 ? (
          Object.keys(turnosPorMedico).map((medico) => (
            <ProfesionalActividadCard 
              key={medico} 
              nombreMedico={medico} 
              turnos={turnosPorMedico[medico]} 
            />
          ))
        ) : (
          <div className="col-span-full py-12 md:py-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic text-xs px-4">
            No hay actividad para hoy ({today})
          </div>
        )}
      </div>
    </div>
  );
};

const ProfesionalActividadCard = ({ nombreMedico, turnos }) => {
  const turnosOrdenados = [...turnos].sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 md:p-2.5 rounded-lg md:rounded-xl text-indigo-600 shrink-0">
            <FaUserMd size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-800 text-xs md:text-sm uppercase leading-tight truncate">{nombreMedico}</p>
            <p className="text-indigo-400 font-bold text-[8px] md:text-[9px] uppercase tracking-widest mt-0.5 truncate">
              {turnos[0]?.especialidad}
            </p>
          </div>
        </div>
        <span className="bg-indigo-600 text-white px-2 py-1 rounded-md font-black text-[8px] md:text-[10px] uppercase shrink-0">
          {turnos.length} <span className="hidden sm:inline">Pacientes</span>
        </span>
      </div>

      <div className="p-3 md:p-4 max-h-80 overflow-y-auto custom-scrollbar space-y-2 md:space-y-3">
        {turnosOrdenados.map((turno) => (
          <div key={turno.id} className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div className="bg-slate-900 px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl shrink-0">
                <span className="text-white font-black text-[10px] md:text-xs">{turno.hora.slice(0, 5)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 font-black text-[10px] md:text-xs uppercase mb-0.5 truncate">
                  {turno.apellido_paciente}, {turno.nombre_paciente}
                </p>
                <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-bold uppercase tracking-tight">
                  <p className="text-slate-400 hidden xs:block">DNI: {turno.DNI}</p>
                  <p className="text-indigo-500 truncate">{turno.cobertura === '' ? 'Particular' : turno.cobertura}</p>
                </div>
              </div>
            </div>
            {turno.telefono && (
              <a href={`https://wa.me/${turno.telefono}`} target="_blank" rel="noreferrer" className="p-2 md:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg md:rounded-xl hover:bg-emerald-600 hover:text-white transition-all shrink-0 ml-2">
                <FaWhatsapp size={16} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelCentroMedico;