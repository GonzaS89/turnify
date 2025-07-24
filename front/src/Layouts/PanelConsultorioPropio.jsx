// src/components/PanelConsultorioPropio.jsx
import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaClock, FaCog, FaShieldAlt } from 'react-icons/fa';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import TurnList from './TurnList';
import ConsultorioSettingsModal from './components/ConsultorioSettingsModal';
import GestionCoberturas from './components/GestionCoberturas';

// Agrega 'onConsultorioDataRefreshed' como una prop
const PanelConsultorioPropio = ({ consultorioData: consultorio, loading }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCoberturasModal, setShowCoberturasModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfTurns, setNumberOfTurns] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTurnosList, setShowTurnosList] = useState(false);

  const { profesional, isLoading, error } = useProfesionalxIdConsultorio(consultorio.id);
  const medico = profesional ? profesional[0] : null;

  const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(
    medico?.id,
    consultorio?.id
  );

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

  // Calcula un valor simulado para "ingresos mensuales"
  const simulatedMonthlyIncome = useMemo(() => {
    const completedTurns = turnos ? turnos.filter(turno => turno.estado === 'completado').length : 0;
    const averagePrice = 2500;
    return (completedTurns * averagePrice).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  }, [turnos]);


  if (!consultorio) {
    return <p className="text-red-500 text-center py-4 font-medium">Error: Datos del consultorio no disponibles.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-700 text-center py-4">Cargando datos del médico...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">Error al cargar datos del médico: {error.message}</p>;
  }

  // --- Funciones para el Modal de Habilitar Turnos ---
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setNumberOfTurns('');
  };

  const handleNumberOfTurnsChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setNumberOfTurns(value.toString());
  };

  const handleEnableTurns = async () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha.");
      return;
    }
    if (!numberOfTurns || parseInt(numberOfTurns) <= 0) {
      alert("Por favor, ingresa un número válido de turnos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3006/api/habilitarturnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultorioId: consultorio?.id,
          profesionalId: medico?.id,
          fecha: selectedDate,
          cantidadTurnos: parseInt(numberOfTurns)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al habilitar turnos');
      }

      const result = await response.json();
      alert(result.message || `Se han habilitado ${numberOfTurns} turnos para el ${selectedDate}.`);

      setShowModal(false);
      setSelectedDate('');
      setNumberOfTurns('');
      // Si la habilitación de turnos también afecta los datos del consultorio,
      // podrías llamar a onConsultorioDataRefreshed aquí también.
    } catch (apiError) {
      console.error('Error al habilitar turnos:', apiError);
      alert(`Hubo un error al habilitar los turnos: ${apiError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    
    // Cierra el modal de ajustes después de que el padre haya procesado la actualización
    setShowSettingsModal(false);
  };


  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-green-100 animate-fadeIn">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">
        Panel de Control
      </h2>

      {medico && (
        <>
          <p className="text-gray-700 text-xl font-medium mb-2">
            Dr./Dra. {medico.nombre} {medico.apellido}
          </p>
          {medico.especialidad && (
            <p className="text-gray-500 text-lg">
              {medico.especialidad}
            </p>
          )}
          {medico.matricula && (
            <p className="text-gray-500 text-lg mb-6">
              Matrícula: {medico.matricula}
            </p>
          )}
        </>
      )}

      <p className="text-gray-600 mb-6 text-lg sm:text-xl">
        Gestión simplificada para tu consultorio.
      </p>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {/* Card: Mi Agenda */}
        <div
          className="bg-green-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-green-200"
          onClick={() => setShowTurnosList(true)}
        >
          <FaCalendarAlt className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Mi Agenda</h3>
          <p className="text-gray-600 text-sm">Visualiza y organiza tus turnos.</p>
          {isLoadingTurnos ? (
            <span className="text-green-700 text-lg mt-2">Cargando...</span>
          ) : errorTurnos ? (
            <span className="text-red-500 text-sm mt-2">Error</span>
          ) : (
            <span className="text-green-700 font-bold text-3xl mt-2">{turnsToday}</span>
          )}
          <p className="text-gray-500 text-sm mt-1">turnos agendados para hoy</p>
        </div>

        {/* Card: Habilitar Turnos */}
        <div
          className="bg-indigo-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-indigo-200"
          onClick={() => setShowModal(true)}
        >
          <FaClock className="text-indigo-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Habilitar Turnos</h3>
          <p className="text-gray-600 text-sm">Abre nuevos horarios para tus pacientes.</p>
          <span className="text-indigo-700 font-bold text-xl mt-2">Administrar</span>
          <p className="text-gray-500 text-sm mt-1">nuevos espacios de consulta</p>
        </div>

        {/* Card: Ajustes del Consultorio (para ajustes generales) */}
        <div
          className="bg-gray-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
          onClick={handleConsultorioSettings}
        >
          <FaCog className="text-gray-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Ajustes del Consultorio</h3>
          <p className="text-gray-600 text-sm">Gestiona la información y configuración de tu consultorio.</p>
          <span className="text-gray-700 font-bold text-xl mt-2">Configurar</span>
          <p className="text-gray-500 text-sm mt-1">tu consultorio</p>
        </div>

        {/* NUEVA CARD: Gestión de Coberturas */}
        <div
          className="bg-purple-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-purple-200"
          onClick={handleOpenCoberturasModal}
        >
          <FaShieldAlt className="text-purple-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Gestionar Coberturas</h3>
          <p className="text-gray-600 text-sm">Añade o edita las obras sociales y prepagas que recibes.</p>
          <span className="text-purple-700 font-bold text-xl mt-2">Administrar</span>
          <p className="text-gray-500 text-sm mt-1">tus convenios</p>
        </div>
      </div>

      {/* Renderizado condicional para TurnList */}
      {showTurnosList && (
        <div className="mt-8">
          <TurnList
            profesionalId={medico?.id}
            consultorioId={consultorio?.id}
            onClose={() => setShowTurnosList(false)}
          />
        </div>
      )}

      {/* Modal para Habilitar Turnos */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Habilitar Turnos para una Fecha</h3>
            <p className="text-gray-600 mb-4">Selecciona la fecha y la cantidad de turnos a habilitar.</p>

            <div className="mb-4">
              <label htmlFor="turn-date" className="block text-gray-700 font-semibold mb-2">
                Selecciona una fecha:
              </label>
              <input
                type="date"
                id="turn-date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {selectedDate && (
              <div className="mb-6">
                <label htmlFor="num-turns" className="block text-gray-700 font-semibold mb-2">
                  ¿Cuántos turnos quieres habilitar?
                </label>
                <input
                  type="number"
                  id="num-turns"
                  value={numberOfTurns}
                  onChange={handleNumberOfTurnsChange}
                  min="1"
                  placeholder="Ej: 10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDate('');
                  setNumberOfTurns('');
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnableTurns}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Habilitando...' : 'Habilitar'}
              </button>
            </div>
          </div>
        </div>
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
  );
};

export default PanelConsultorioPropio;