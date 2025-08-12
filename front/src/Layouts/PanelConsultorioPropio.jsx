// src/components/PanelConsultorioPropio.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaCalendarAlt, FaCog, FaShieldAlt, FaStethoscope, FaIdCard, FaUserPlus } from 'react-icons/fa';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import CrearProfesional from './cards/CrearProfesional';
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

  // Manejo de errores y carga
  if (!consultorio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-200">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500">Datos del consultorio no disponibles.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-blue-200">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando datos del médico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-200">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500">Error al cargar datos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ===== ENCABEZADO ===== */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Info del médico */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold">Consultorio Virtual</h1>

              {medico ? (
                <div className="mt-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                    {medico.nombre.charAt(0)}
                    {medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {medico.nombre} {medico.apellido}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm opacity-90">
                      <span className="flex items-center gap-1">
                        <FaStethoscope size={14} /> {medico.especialidad}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaIdCard size={14} /> Matrícula: {medico.matricula}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-blue-100 mt-2">No hay médico asociado a este consultorio.</p>
              )}
            </div>

            {/* Fecha actual */}
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-5 py-3 text-center">
              <p className="text-sm opacity-90">Hoy es</p>
              <p className="font-bold text-lg capitalize">
                {new Date().toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ===== TARJETAS DE ACCESO RÁPIDO ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Mi Agenda */}
          <div
            onClick={() => navigate(`/micuenta/panelturnos/${consultorioID}/${medicoID}`)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white group-hover:from-green-600 group-hover:to-emerald-700 transition">
                <FaCalendarAlt className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Mi Agenda</h3>
            <p className="text-gray-600 text-sm mb-3">Visualiza y gestiona tus turnos diarios.</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{isLoadingTurnos ? '...' : turnsToday()}</span>
              <span className="text-xs text-gray-500 font-medium">hoy</span>
            </div>
          </div>

          {/* Ajustes del Consultorio */}
          <div
            onClick={() => navigate(`/micuenta/datosconsultorio/${consultorio?.id}`)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg text-white group-hover:from-gray-600 group-hover:to-gray-700 transition">
                <FaCog className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Ajustes</h3>
            <p className="text-gray-600 text-sm mb-3">Configura tu consultorio y preferencias.</p>
            <div className="flex items-center justify-between">
              <span className="inline-block bg-gray-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Configurar
              </span>
            </div>
          </div>

          {/* Coberturas Médicas */}
          <div
            onClick={() => navigate(`/micuenta/gestioncoberturas/${consultorioID}`)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white group-hover:from-blue-600 group-hover:to-indigo-700 transition">
                <FaShieldAlt className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Coberturas</h3>
            <p className="text-gray-600 text-sm mb-3">Gestiona obras sociales y prepagas aceptadas.</p>
            <div className="flex items-center justify-between">
              <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Gestionar
              </span>
            </div>
          </div>

          {/* Asociar Profesional */}
          {!medico && (
            <div
              onClick={() => setShowModalAsociarProfesional(true)}
              className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white group-hover:from-indigo-600 group-hover:to-purple-700 transition">
                  <FaUserPlus className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Asociar Médico</h3>
              <p className="text-gray-600 text-sm mb-3">Vincula un profesional a este consultorio.</p>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Asociar
                </span>
              </div>
            </div>
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

export default PanelConsultorioPropio;