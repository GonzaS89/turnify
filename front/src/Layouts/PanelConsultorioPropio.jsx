// src/components/PanelConsultorioPropio.jsx
import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaClock, FaCog, FaShieldAlt, FaUserMd, FaStethoscope, FaIdCard } from 'react-icons/fa';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import TurnList from './TurnList';
import ConsultorioSettingsModal from './components/ConsultorioSettingsModal';
import GenerarTurnosModal from './components/GenerarTurnosModal';
import GestionCoberturas from './components/GestionCoberturas';

const PanelConsultorioPropio = ({ consultorioData: consultorio }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCoberturasModal, setShowCoberturasModal] = useState(false);
  const consultorioID = consultorio?.id;
  const { profesional, isLoading, error } = useProfesionalxIdConsultorio(consultorioID);

  const [showTurnosList, setShowTurnosList] = useState(false);
  const medico = profesional ? profesional[0] : null;

  const medicoID = medico?.id;
  
  
  
  const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(
    medicoID, consultorioID
  );

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const actualizarTurnos = () => {
    setRefreshTrigger( setRefreshTrigger(prevKey => prevKey + 1 ) );
  }

  setTimeout(() => {
    setRefreshTrigger(0)
  }, 1000);

  


  // Calcula turnos reservados para hoy usando useMemo para optimización
  const turnsToday = useMemo(() => {
    if (!turnos || turnos.length === 0) return 0;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    return turnos.filter(turno =>
      new Date(turno.fecha).toISOString().split('T')[0] === todayFormatted &&
      turno.estado === 'reservado'
    ).length;
  }, [turnos]);


  if (!consultorio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500 font-medium">Datos del consultorio no disponibles.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl">Cargando datos del médico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500">Error al cargar datos del médico: {error.message}</p>
        </div>
      </div>
    );
  }

  // --- Función para abrir el modal de ajustes generales del consultorio ---
  const handleConsultorioSettings = () => {
    setShowSettingsModal(true);
  };

  // --- Función para abrir el modal de gestión de coberturas ---
  const handleOpenCoberturasModal = () => {
    setShowCoberturasModal(true);
  };

  // --- NUEVA FUNCIÓN: Manejar la actualización del consultorio desde el modal de ajustes ---
  const handleConsultorioUpdatedFromSettings = (updatedData) => {
    console.log("Datos del consultorio actualizados recibidos en PanelConsultorioPropio:", updatedData);
    setShowSettingsModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con información del médico */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-green-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                Panel de Control
              </h1>
              {medico && (
                <div className="flex items-center mt-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4">
                    <FaUserMd className="text-gray-500 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Dr./Dra. {medico.nombre} {medico.apellido}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {medico.especialidad && (
                        <div className="flex items-center text-gray-600">
                          <FaStethoscope className="mr-2 text-green-500" />
                          <span>{medico.especialidad}</span>
                        </div>
                      )}
                      {medico.matricula && (
                        <div className="flex items-center text-gray-600">
                          <FaIdCard className="mr-2 text-blue-500" />
                          <span>Matrícula: {medico.matricula}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-gray-600 text-lg">
                Gestión simplificada para tu consultorio
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card: Mi Agenda */}
          <div 
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setShowTurnosList(true)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">Mi Agenda</h3>
                <p className="text-gray-600 text-sm mb-4">Visualiza y organiza tus turnos</p>
              </div>
              <FaCalendarAlt className="text-green-500 text-2xl" />
            </div>
            <div className="mt-4">
              {isLoadingTurnos ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
                  <span className="text-green-700">Cargando...</span>
                </div>
              ) : errorTurnos ? (
                <span className="text-red-500 text-sm">Error</span>
              ) : (
                <div>
                  <span className="text-3xl font-bold text-green-700">{turnsToday}</span>
                  <p className="text-gray-600 text-sm mt-1">turnos hoy</p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Habilitar Turnos */}
          <div 
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">Habilitar Turnos</h3>
                <p className="text-gray-600 text-sm mb-4">Abre nuevos horarios para pacientes</p>
              </div>
              <FaClock className="text-indigo-500 text-2xl" />
            </div>
            <div className="mt-4">
              <span className="inline-block bg-indigo-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Administrar
              </span>
            </div>
          </div>

          {/* Card: Ajustes del Consultorio */}
          <div 
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={handleConsultorioSettings}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">Ajustes</h3>
                <p className="text-gray-600 text-sm mb-4">Configura tu consultorio</p>
              </div>
              <FaCog className="text-gray-500 text-2xl" />
            </div>
            <div className="mt-4">
              <span className="inline-block bg-gray-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Configurar
              </span>
            </div>
          </div>

          {/* Card: Gestión de Coberturas */}
          <div 
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={handleOpenCoberturasModal}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">Coberturas</h3>
                <p className="text-gray-600 text-sm mb-4">Gestiona obras sociales</p>
              </div>
              <FaShieldAlt className="text-purple-500 text-2xl" />
            </div>
            <div className="mt-4">
              <span className="inline-block bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Administrar
              </span>
            </div>
          </div>
        </div>

        {/* Renderizado condicional para TurnList */}
        {showTurnosList && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <TurnList
              profesionalId={medico?.id}
              consultorioId={consultorio?.id}
              onClose={() => setShowTurnosList(false)}
              openModalHabilitarTurnos={() => setShowModal(true)}
               refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {/* Modal para Habilitar Turnos */}
        {showModal && (
          <GenerarTurnosModal 
          medico={medicoID} 
          consultorio={consultorioID} 
          closeModalHabilitarTurnos = {() => setShowModal(false)}
          actualizarTurnos={actualizarTurnos}
          />
        )}

        {/* Modal para Ajustes Generales del Consultorio */}
        <ConsultorioSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          consultorio={consultorio}
          onConsultorioUpdated={handleConsultorioUpdatedFromSettings} 
        />

        {/* Nuevo Modal para Gestión de Coberturas */}
        <GestionCoberturas
          isOpen={showCoberturasModal}
          onClose={() => setShowCoberturasModal(false)}
          consultorioId={consultorio?.id}
        />
      </div>
    </div>
  );
};

export default PanelConsultorioPropio;