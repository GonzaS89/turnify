// src/components/PanelConsultorioPropio.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  FaCalendarAlt, 
  FaCog, 
  FaShieldAlt, 
  FaStethoscope, 
  FaIdCard, 
  FaUserPlus,
  FaChevronRight,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import AsociarProfesionalAConsultorio from './AsociarProfesionalAConsultorio';

const PanelConsultorioPropio = ({ consultorioData: consultorio }) => {
  const navigate = useNavigate();
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] = useState(false);

  const consultorioID = consultorio?.id;
  const { profesional, isLoading, error } = useProfesionalxIdConsultorio(consultorioID);

  const medico = profesional?.[0] || null;
  const medicoID = medico?.id;

  const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(
    medicoID,
    consultorioID
  );

  // Turnos reservados para hoy
  const turnsToday = () => {
    if (!turnos || turnos.length === 0) return 0;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;
    return turnos.filter(
      (turno) =>
        new Date(turno.fecha).toISOString().split('T')[0] === todayFormatted && turno.estado === 'reservado'
    ).length;
  };

  // Formatear fecha actual
  const todayFormatted = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).replace(/^\w/, (c) => c.toUpperCase());

  // Manejo de estados
  if (!consultorio) {
    return <ErrorCard title="Datos no disponibles" message="No se pudo cargar la información del consultorio." />;
  }

  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <ErrorCard 
        title="Error de carga" 
        message={error.message || "No se pudo cargar el profesional."} 
      />
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ===== ENCABEZADO ===== */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white rounded-3xl shadow-2xl p-8 mb-8 transform transition-all hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Info del médico */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Tu consultorio virtual
              </h1>

              {medico ? (
                <div className="mt-6 flex items-center space-x-5">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm shadow-lg border border-white/30">
                    {medico.nombre.charAt(0)}
                    {medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {medico.nombre} {medico.apellido}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-100">
                      <span className="flex items-center gap-1.5">
                        <FaStethoscope size={14} /> {medico.especialidad}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaIdCard size={14} /> Matrícula: {medico.matricula}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-blue-100 mt-4 text-lg italic">
                  Aún no tienes un profesional asociado.
                </p>
              )}
            </div>

            {/* Fecha actual - Diseño moderno */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 text-center min-w-48 shadow-lg">
              <div className="flex items-center justify-center mb-1">
                <FaClock className="text-white/80 mr-2" size={16} />
                <p className="text-sm opacity-90 font-medium">Hoy es</p>
              </div>
              <p className="font-bold text-lg leading-tight capitalize tracking-wide">
                {todayFormatted}
              </p>
            </div>
          </div>
        </div>

        {/* ===== TARJETAS DE ACCESO RÁPIDO ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Mi Agenda */}
          <ActionCard
            title="Mi Agenda"
            description="Visualiza y gestiona tus turnos diarios."
            icon={FaCalendarAlt}
            gradient="from-green-500 to-emerald-600"
            onClick={() => navigate(`/micuenta/panelturnos/${consultorioID}/${medicoID}`)}
            footer={
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{isLoadingTurnos ? '...' : turnsToday()}</span>
                <span className="text-sm text-green-100 font-medium flex items-center gap-1">
                  hoy <FaChevronRight size={12} />
                </span>
              </div>
            }
          />

          {/* Ajustes del Consultorio */}
          <ActionCard
            title="Ajustes"
            description="Configura tu consultorio y preferencias."
            icon={FaCog}
            gradient="from-gray-500 to-gray-700"
            onClick={() => navigate(`/micuenta/datosconsultorio/${consultorio?.id}`)}
            footer={
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gray-700/50 px-3 py-1 rounded-full">
                <FaCheckCircle size={12} /> Configurar
              </span>
            }
          />

          {/* Coberturas Médicas */}
          <ActionCard
            title="Coberturas"
            description="Gestiona obras sociales y prepagas aceptadas."
            icon={FaShieldAlt}
            gradient="from-blue-500 to-indigo-600"
            onClick={() => navigate(`/micuenta/gestioncoberturas/${consultorioID}`)}
            footer={
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600/50 px-3 py-1 rounded-full">
                <FaChevronRight size={12} /> Gestionar
              </span>
            }
          />

          {/* Asociar Profesional */}
          {!medico && (
            <ActionCard
              title="Asociar Médico"
              description="Vincula un profesional a este consultorio."
              icon={FaUserPlus}
              gradient="from-indigo-500 to-purple-600"
              onClick={() => setShowModalAsociarProfesional(true)}
              footer={
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-purple-600/50 px-3 py-1 rounded-full">
                  <FaChevronRight size={12} /> Asociar
                </span>
              }
            />
          )}
        </div>

        {/* Modal de asociación */}
        {showModalAsociarProfesional && (
          <AsociarProfesionalAConsultorio
            consultorioID={consultorioID}
            onClose={() => setShowModalAsociarProfesional(false)}
          />
        )}
      </div>
    </div>
  );
};

// ===== COMPONENTES AUXILIARES =====

// Tarjeta de acción reutilizable
const ActionCard = ({ title, description, icon: Icon, gradient, onClick, footer }) => (
  <div
    onClick={onClick}
    className={`group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:border-blue-200`}
  >
    <div className="flex items-start justify-between mb-5">
      <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl text-white shadow-lg group-hover:shadow-xl transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
    <div className="mt-2">
      {footer}
    </div>
  </div>
);

// Estado de carga
const LoadingCard = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-blue-100">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 border-b-transparent mx-auto mb-5"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando...</h2>
      <p className="text-gray-500">Estamos preparando tu panel de control.</p>
    </div>
  </div>
);

// Mensaje de error
const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-red-200">
      <div className="text-red-500 text-6xl mb-5">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;