import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaUserMd, FaDollarSign } from 'react-icons/fa'; // Agregamos FaDollarSign
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import TurnList from './TurnList';

const PanelConsultorioPropio = ({ consultorioData: consultorio }) => {
  const [showModal, setShowModal] = useState(false);
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

  // Calcula los turnos reservados para hoy utilizando useMemo para optimización
  const turnsToday = useMemo(() => {
    if (!turnos || turnos.length === 0) return 0;

    const today = new Date();
    // Formatea la fecha de hoy a 'YYYY-MM-DD' para compararla con `turno.fecha`
    const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    return turnos.filter(turno =>
      new Date(turno.fecha).toISOString().split('T')[0] === todayFormatted &&
      turno.estado === 'reservado'
    ).length;
  }, [turnos]);

  // Calcula un valor simulado para "ingresos del mes" (puedes reemplazarlo con datos reales)
  const simulatedMonthlyIncome = useMemo(() => {
    // En un caso real, esto vendría de una API o de datos más complejos
    // Por ahora, un valor fijo o una simulación simple.
    // Podría ser: turnos completados * precio promedio de consulta
    const completedTurns = turnos.filter(turno => turno.estado === 'completado').length; // Suponiendo un estado 'completado'
    const averagePrice = 2500; // Simulación: $2500 por consulta
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
      // Considera refetching de turnos aquí si el useProfessionalConsultorioTurnos no lo hace automáticamente
    } catch (apiError) {
      console.error('Error al habilitar turnos:', apiError);
      alert(`Hubo un error al habilitar los turnos: ${apiError.message}`);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Grid de Tarjetas (Mi Agenda, Mis Pacientes, Finanzas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"> {/* Cambiado a 3 columnas para Finanzas */}
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

        {/* Card: Mis Pacientes */}
        <div className="bg-blue-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-blue-200">
          <FaUserMd className="text-blue-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Mis Pacientes</h3>
          <p className="text-gray-600 text-sm">Accede y gestiona la información de tus pacientes.</p>
          <span className="text-blue-700 font-bold text-3xl mt-2">87</span> {/* Esto es un número fijo, puedes conectarlo a datos reales si existen */}
          <p className="text-gray-500 text-sm mt-1">pacientes registrados</p>
        </div>

        {/* Card: Finanzas */}
        <div
          className="bg-purple-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-purple-200"
          onClick={() => alert('¡Llevando a la sección de Finanzas! Aquí podrías ver reportes de ingresos, gastos, etc.')}
        >
          <FaDollarSign className="text-purple-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Finanzas</h3>
          <p className="text-gray-600 text-sm">Controla tus ingresos y facturación.</p>
          {isLoadingTurnos ? ( // Reutilizamos isLoadingTurnos, pero idealmente sería un isLoadingFinanzas
             <span className="text-purple-700 text-lg mt-2">Cargando...</span>
          ) : errorTurnos ? ( // Igual para el error
             <span className="text-red-500 text-sm mt-2">Error</span>
          ) : (
             <span className="text-purple-700 font-bold text-3xl mt-2">{simulatedMonthlyIncome}</span>
          )}
          <p className="text-gray-500 text-sm mt-1">ingresos estimados del mes</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Habilitar Turnos
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg">
            Ver Historial
          </button>
        </div>
      </div>

      {/* Modal para Habilitar Turnos */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-95 opacity-0 animate-scaleIn border border-gray-200">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800">Habilitar Nuevos Turnos</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDate('');
                  setNumberOfTurns('');
                }}
                className="text-3xl text-gray-500 hover:text-gray-700 font-light transition-transform transform hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-base">Selecciona la fecha y la cantidad de turnos disponibles.</p>

            <div className="mb-5">
              <label htmlFor="turn-date" className="block text-gray-700 font-semibold mb-2">
                Fecha del Turno:
              </label>
              <input
                type="date"
                id="turn-date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            {selectedDate && (
              <div className="mb-6">
                <label htmlFor="num-turns" className="block text-gray-700 font-semibold mb-2">
                  Cantidad de Turnos a Habilitar:
                </label>
                <input
                  type="number"
                  id="num-turns"
                  value={numberOfTurns}
                  onChange={handleNumberOfTurnsChange}
                  min="1"
                  placeholder="Ej: 10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDate('');
                  setNumberOfTurns('');
                }}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200 shadow-sm"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnableTurns}
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Habilitando...' : 'Habilitar Turnos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Componente TurnosList */}
      {showTurnosList && medico && consultorio && (
        <TurnList
          profesionalId={medico.id}
          consultorioId={consultorio.id}
          onClose={() => setShowTurnosList(false)}
        />
      )}
    </div>
  );
};

export default PanelConsultorioPropio;