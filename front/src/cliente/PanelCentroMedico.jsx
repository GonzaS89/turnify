import { useState, useEffect } from 'react';
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

  const recibirProfesionalID = (id) => {
    setProfesionalID(id);
    setShowModalTurnos(true);
  };

  // if (isLoadingConsultorio) return <LoadingPanel />;
  if (errorConsultorio) return <ErrorPanel message={errorConsultorio} />;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ===== ENCABEZADO INSTITUCIONAL ===== */}
        <header className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl text-white">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-600 px-4 py-1.5 rounded-xl shadow-lg">
                <FaBuilding className="text-white text-xs" />
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">
                  {tipo || 'Entidad Médica'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                {nombre || "Centro Médico"}
              </h1>
              <div className="flex items-center gap-4 text-indigo-300">
                <span className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/5">
                  <FaChartLine /> Gestión Activa
                </span>
                <p className="text-slate-400 font-bold italic text-sm tracking-tight">
                  Panel de Control Administrativo
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] min-w-[300px]">
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Reloj del Sistema</p>
              <p className="text-2xl font-black tracking-tight capitalize leading-tight">
                {currentDate}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-[100px]"></div>
        </header>

        {!hayConsultorios ? (
          <div className="bg-white rounded-[4rem] p-20 text-center shadow-xl border-2 border-dashed border-slate-200 animate-fade-in">
             <CrearCentroMedicoModal
              perfilId={perfilId}
              perfilTipo={perfil?.tipo}
              isOpen={true}
              onSuccess={() => { setHayConsultorios(true); fetchConsultorio(); }}
              actualizarConsultorios={fetchConsultorio}
            />
          </div>
        ) : (
          <div className="space-y-12">
            {/* TARJETAS DE ACCIÓN RÁPIDA - CORREGIDAS */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <CardGestionProfesionales
    seccion={`/micuenta/gestionprofesionales/${consultorioID}`}
    icon={FaUserMd}
    titulo="Equipo Médico"
    subtitulo="Altas, bajas y gestión de especialidades."
    numProfesionales={numProfesionales}
    texto="médicos vinculados"
    isLoading={isLoadingProfesionales}
    onClick={() => setShowGestionMedicos(true)}
    // Eliminamos los "!" y usamos clases de visibilidad clara
    className="rounded-[3rem] p-10 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
  />

  <CardGestionCoberturas
    seccion={`/micuenta/gestioncoberturas/${consultorioID}`}
    titulo="Coberturas"
    icon={FaShieldAlt}
    subtitulo="Configuración de obras sociales y prepagas."
    emoji="🛡️"
    texto="Configurar"
    // Eliminamos los "!" y aseguramos fondo blanco con texto oscuro
    className="rounded-[3rem] p-10 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
  />
</section>

            {/* PANEL DE ACTIVIDAD INTEGRADO */}
            <ActividadDiaPanel turnos={turnos} isLoading={isLoadingTurnos} />

            {/* MODALES DE GESTIÓN */}
            {showModalTurnos && (
              <div className="bg-white rounded-[3rem] shadow-2xl border border-indigo-100 overflow-hidden">
                <div className="bg-slate-900 px-8 py-5 flex justify-between items-center text-white">
                  <h2 className="text-xl font-black uppercase">Agenda del Profesional</h2>
                  <button onClick={() => setShowModalTurnos(false)}><FaTimes size={24} /></button>
                </div>
                <div className="p-8">
                  <TurnListCentroMedico profesionalId={profesionalID} consultorioId={consultorioID} onClose={() => setShowModalTurnos(false)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================================
// COMPONENTE ACTIVIDAD DEL DÍA (ITERANDO POR TURNOS)
// ==========================================================

const ActividadDiaPanel = ({ turnos, isLoading }) => {
  // Obtenemos fecha de hoy en formato local YYYY-MM-DD
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Agrupamos turnos por nombre del profesional
  const turnosPorMedico = turnos?.reduce((acc, t) => {
    const fechaTurno = t.fecha.split('T')[0]; // Extrae "2026-02-25" de la cadena ISO
    
    if (fechaTurno === today) {
      const nombreCompleto = `${t.nombreProfesional} ${t.apellidoProfesional}`;
      if (!acc[nombreCompleto]) acc[nombreCompleto] = [];
      acc[nombreCompleto].push(t);
    }
    return acc;
  }, {});

  if (isLoading) return <div className="p-10 text-center text-slate-400 font-black uppercase text-xs">Cargando actividad diaria...</div>;

  return (
    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl">
            <FaCalendarDay className="text-white text-xl" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 uppercase">Actividad del Día</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {turnosPorMedico && Object.keys(turnosPorMedico).length > 0 ? (
          Object.keys(turnosPorMedico).map((medico) => (
            <ProfesionalActividadCard 
              key={medico} 
              nombreMedico={medico} 
              turnos={turnosPorMedico[medico]} 
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic">
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
    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600"><FaUserMd size={20} /></div>
          <div>
            <p className="font-black text-slate-800 text-sm uppercase leading-none">{nombreMedico}</p>
            <p className="text-indigo-400 font-bold text-[9px] uppercase tracking-widest mt-1">
              {turnos[0]?.especialidad}
            </p>
          </div>
        </div>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black text-[10px] uppercase">
          {turnos.length} Pacientes
        </span>
      </div>

      <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar space-y-3">
        {turnosOrdenados.map((turno) => (
          <div key={turno.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 px-3 py-2 rounded-xl">
                <span className="text-white font-black text-xs">{turno.hora.slice(0, 5)}</span>
              </div>
              <div>
                <p className="text-slate-800 font-black text-xs uppercase mb-1">
                  {turno.apellido_paciente}, {turno.nombre_paciente}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                  <p className="text-slate-400">DNI: {turno.DNI}</p>
                  <span className="text-slate-200">•</span>
                  <p className="text-indigo-500">{turno.cobertura == '' ? 'Particular' : turno.cobertura}</p>
                </div>
              </div>
            </div>
            {turno.telefono && (
              <a href={`https://wa.me/${turno.telefono}`} target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                <FaWhatsapp size={18} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ... LoadingPanel y ErrorPanel se mantienen iguales al final del archivo

export default PanelCentroMedico;