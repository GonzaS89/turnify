import { useEffect, useState } from 'react';
import { 
  FaUserMd, FaShieldAlt, FaCalendarPlus, FaBuilding, 
  FaInfoCircle, FaTimes, FaChartLine, FaCalendarDay, FaClock, 
  FaWhatsapp, FaChevronRight, FaChevronLeft, FaCheckCircle, FaCalendarAlt, FaCircleNotch
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
  const perfilId = perfil?.id;
  
  // Hooks de datos
  const { consultorios, isLoading: isLoadingConsultorio, error: errorConsultorio, fetchConsultorio } = useObtenerConsultorioxIdPerfil(perfilId);
  const consultorioObtenido = consultorios[0] || null;
  const { nombre, tipo, id: consultorioID } = consultorioObtenido || {};
  
  const { profesional: profesionales, isLoading: isLoadingProfesionales } = useProfesionalxIdConsultorio(consultorioID);
  const { turnos, isLoading: isLoadingTurnos } = useObtenerTurnosxIdConsultorio(consultorioID);

  console.log(turnos)

  // Estados de control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hayConsultorios, setHayConsultorios] = useState(true);
  const [fechaVisualizada, setFechaVisualizada] = useState(new Date());

  const numProfesionales = profesionales?.length || 0;

  useEffect(() => {
    if (!isLoadingConsultorio) {
      const tieneConsultorios = consultorios && consultorios.length > 0;
      setHayConsultorios(tieneConsultorios);
      if (!tieneConsultorios) {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    }
  }, [consultorios, isLoadingConsultorio]);

  // Lógica de filtrado por fecha para estadísticas y lista (Copia del ConsultorioPropio)
  const todayStr = new Date().toLocaleDateString('en-CA');
  const fechaVisualizadaStr = fechaVisualizada.toLocaleDateString('en-CA');

  const countByEstado = (estado) => turnos?.filter(t => 
    new Date(t.fecha).toLocaleDateString('en-CA') === todayStr && t.estado === estado
  ).length || 0;

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fechaVisualizada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaVisualizada(nuevaFecha);
  };

  if (errorConsultorio) return <div className="p-10 text-red-500 font-bold">Error: {errorConsultorio}</div>;
  if (isLoadingConsultorio) return <div className="p-10 text-center animate-pulse text-slate-400">Cargando configuración...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
        
        {/* ENCABEZADO INSTITUCIONAL */}
        <header className="relative overflow-hidden bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-14 shadow-2xl text-white border border-slate-800">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-xl shadow-lg">
                <FaBuilding className="text-white text-[10px]" />
                <span className="text-white font-black text-[9px] uppercase tracking-[0.2em]">
                  {tipo || 'Entidad Médica'}
                </span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight uppercase italic">
                {nombre || "Centro Médico"}
              </h1>
              <div className="flex items-center gap-3">
                 <span className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/5 text-indigo-300">
                  <FaChartLine /> Gestión Institucional
                </span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] min-w-[280px]">
              <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Estado de Sincronización</p>
              <p className="text-lg md:text-2xl font-black tracking-tight capitalize leading-tight flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Sistemas Activos
              </p>
            </div>
          </div>
        </header>

        {!hayConsultorios ? (
          <div className="bg-white rounded-[2rem] p-10 md:p-20 text-center shadow-xl border-2 border-dashed border-slate-200">
             <CrearCentroMedicoModal
              perfilId={perfilId}
              perfilTipo={perfil?.tipo}
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => { setIsModalOpen(false); fetchConsultorio(); }}
              actualizarConsultorios={fetchConsultorio}
            />
            <p className="mt-4 text-slate-500 font-medium">Es necesario configurar su centro médico para continuar.</p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-10">
            
            {/* ESTADÍSTICAS RÁPIDAS (Concepto copiado de ConsultorioPropio) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <StatCard label="Pacientes Hoy" value={countByEstado("reservado")} icon={FaCalendarAlt} color="text-indigo-500" />
              <StatCard label="Cupos Libres" value={countByEstado("disponible")} icon={FaClock} color="text-emerald-500" />
              <StatCard label="Finalizados" value={countByEstado("finalizado")} icon={FaCheckCircle} color="text-blue-500" />
              <StatCard label="Profesionales" value={numProfesionales} icon={FaUserMd} color="text-slate-400" />
            </div>

            {/* GESTIÓN DE EQUIPO Y COBERTURAS */}
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

            {/* PANEL DE ACTIVIDAD DINÁMICO (Concepto ConsultorioPropio) */}
            <ActividadDiaPanel 
              turnos={turnos} 
              isLoading={isLoadingTurnos} 
              fechaVisualizada={fechaVisualizada}
              cambiarDia={cambiarDia}
              setFechaVisualizada={setFechaVisualizada}
              fechaVisualizadaStr={fechaVisualizadaStr}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Actividad Adaptado
const ActividadDiaPanel = ({ turnos, isLoading, fechaVisualizada, cambiarDia, setFechaVisualizada, fechaVisualizadaStr }) => {
  const fechaDisplay = fechaVisualizada.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  const turnosPorMedico = turnos?.reduce((acc, t) => {
    const fechaTurno = t.fecha.split('T')[0];
    // Filtramos por la fecha que el usuario está visualizando en los controles
    if (fechaTurno === fechaVisualizadaStr && t.estado === "reservado") {
      const nombreCompleto = `${t.nombreProfesional} ${t.apellidoProfesional}`;
      if (!acc[nombreCompleto]) acc[nombreCompleto] = [];
      acc[nombreCompleto].push(t);
    }
    return acc;
  }, {});

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-lg border border-slate-100">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Actividad de Consultorios</h3>
          <p className="text-slate-400 text-[9px] md:text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
            <FaCalendarDay className="text-indigo-500" /> {fechaDisplay}
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button onClick={() => cambiarDia(-1)} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm"><FaChevronLeft size={12} /></button>
          <button onClick={() => setFechaVisualizada(new Date())} className="px-4 text-[10px] font-black uppercase text-slate-600 hover:text-indigo-600">Ver fechas</button>
          <button onClick={() => cambiarDia(1)} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm"><FaChevronRight size={12} /></button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <FaCircleNotch className="animate-spin text-indigo-600" size={30} />
          <p className="text-[10px] font-black uppercase text-slate-400">Sincronizando Agenda...</p>
        </div>
      ) : (
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
            <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic text-xs px-4">
              Sin pacientes citados para esta fecha
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const ProfesionalActividadCard = ({ nombreMedico, turnos }) => {
  const turnosOrdenados = [...turnos].sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shrink-0 shadow-lg shadow-indigo-100">
            <FaUserMd size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-800 text-xs md:text-sm uppercase leading-tight truncate">{nombreMedico}</p>
            <p className="text-indigo-400 font-bold text-[8px] md:text-[9px] uppercase tracking-widest mt-0.5 truncate">
              {turnos[0]?.especialidad || 'Especialista'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black text-[9px] md:text-[10px] uppercase">
            {turnos.length} <span className="hidden sm:inline">Pacientes</span>
            </span>
        </div>
      </div>

      <div className="p-3 md:p-4 max-h-80 overflow-y-auto custom-scrollbar space-y-2 md:space-y-3">
        {turnosOrdenados.map((turno) => (
          <div key={turno.id} className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div className="bg-slate-900 px-2.5 py-1.5 rounded-xl shrink-0">
                <span className="text-white font-black text-[10px] md:text-xs tracking-tighter">{turno.hora.slice(0, 5)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 font-black text-[10px] md:text-xs uppercase mb-0.5 truncate">
                  {turno.apellido_paciente}, {turno.nombre_paciente}
                </p>
                <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-bold uppercase tracking-tight">
                  <p className="text-slate-400 hidden xs:block">DNI: {turno.DNI}</p>
                  <p className="text-indigo-500 font-black truncate">{turno.cobertura === '' ? 'Particular' : turno.cobertura}</p>
                </div>
              </div>
            </div>
            {turno.telefono && (
              <a href={`https://wa.me/${turno.telefono}`} target="_blank" rel="noreferrer" className="p-2 md:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shrink-0 ml-2 shadow-sm">
                <FaWhatsapp size={16} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente reutilizable de Tarjeta de Estadística
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
    <div className={`${color} bg-current/10 p-2 rounded-xl mb-3`}>
        <Icon size={18} />
    </div>
    <span className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
    <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1 text-center">{label}</span>
  </div>
);

export default PanelCentroMedico;