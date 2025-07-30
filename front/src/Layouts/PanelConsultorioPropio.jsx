// src/components/PanelConsultorioPropio.jsx
import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaClock, FaCog, FaShieldAlt, FaUserMd, FaStethoscope, FaIdCard } from 'react-icons/fa';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import TurnList from './TurnList';
import ConsultorioSettingsModal from './components/ConsultorioSettingsModal';
import GenerarTurnosModal from './components/GenerarTurnosModal';
import GestionCoberturas from './components/GestionCoberturas';
import Coberturas from './cards/Coberturas';

const PanelConsultorioPropio = ({ consultorioData: consultorio }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCoberturasModal, setShowCoberturasModal] = useState(false);
  const [showTurnosList, setShowTurnosList] = useState(false);

  const consultorioID = consultorio?.id;
  const { profesional, isLoading, error } = useProfesionalxIdConsultorio(consultorioID);

  const medico = profesional ? profesional[0] : null;
  const medicoID = medico?.id;

  const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(
    medicoID,
    consultorioID
  );

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const actualizarTurnos = () => {
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setRefreshTrigger(0), 100);
  };

  // Turnos reservados para hoy
  const turnsToday = useMemo(() => {
    if (!turnos || turnos.length === 0) return 0;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    return turnos.filter(
      (turno) =>
        new Date(turno.fecha).toISOString().split('T')[0] === todayFormatted && turno.estado === 'reservado'
    ).length;
  }, [turnos]);

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

  const handleConsultorioSettings = () => setShowSettingsModal(true);
  const handleOpenCoberturasModal = () => setShowCoberturasModal(true);
  const handleConsultorioUpdatedFromSettings = (updatedData) => {
    console.log('Datos actualizados:', updatedData);
    setShowSettingsModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== ENCABEZADO PERSONALIZADO ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Info del médico */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Panel de Control</h1>
              <p className="text-gray-600 mt-1">Bienvenido , Doc. {medico?.nombre} {medico?.apellido}.</p>

              {medico && (
                <div className="mt-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {medico.nombre.charAt(0)}
                    {medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {medico.nombre} {medico.apellido}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaStethoscope className="mr-1 text-green-500" /> {medico.especialidad || 'Sin especialidad'}
                      </span>
                      <span className="flex items-center">
                        <FaIdCard className="mr-1 text-blue-500" /> Matrícula: {medico.matricula || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fecha actual */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-center">
              <p className="text-sm text-gray-600">Hoy es</p>
              <p className="font-bold text-blue-700 capitalize">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Mi Agenda */}
          <div
            onClick={() => setShowTurnosList(true)}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                <FaCalendarAlt className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Mi Agenda</h3>
            <p className="text-gray-600 text-sm mb-3">Visualiza y gestiona tus turnos diarios.</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{isLoadingTurnos ? '...' : turnsToday}</span>
              <span className="text-xs text-gray-500">hoy</span>
            </div>
          </div>

          {/* Ajustes del Consultorio */}
          <div
            onClick={handleConsultorioSettings}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg text-white">
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
            onClick={handleOpenCoberturasModal}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
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
        </div>

        {/* ===== LISTA DE TURNOS (Modal integrado) ===== */}
        {showTurnosList && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <TurnList
              profesionalId={medico?.id}
              consultorioId={consultorio?.id}
              onClose={() => setShowTurnosList(false)}
              openModalHabilitarTurnos={() => setShowModal(true)}
              refreshTrigger={refreshTrigger}
              handleActualizarTurnos={actualizarTurnos}
            />
          </div>
        )}

        {/* ===== MODALES ===== */}
        {showModal && (
          <GenerarTurnosModal
            medico={medicoID}
            consultorio={consultorioID}
            closeModalHabilitarTurnos={() => setShowModal(false)}
            actualizarTurnos={actualizarTurnos}
          />
        )}

        <ConsultorioSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          consultorio={consultorio}
          onConsultorioUpdated={handleConsultorioUpdatedFromSettings}
        />

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