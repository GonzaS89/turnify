import React, { useState } from 'react';
import { FaCalendarAlt, FaUserMd } from 'react-icons/fa'; // Iconos para este panel
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';

const PanelConsultorioPropio = ({ consultorioData: consultorio }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(''); // Para guardar la fecha seleccionada
  const [numberOfTurns, setNumberOfTurns] = useState(''); // Para guardar la cantidad de turnos
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para indicador de carga

  const { profesional, isLoading, error } = useProfesionalxIdConsultorio(consultorio.id);
  const medico = profesional ? profesional[0] : null;


  if (!consultorio) {
    return <p className="text-red-500 text-center py-4">Error: Datos del consultorio no disponibles.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-700 text-center py-4">Cargando datos del médico...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">Error al cargar datos del médico: {error.message}</p>;
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setNumberOfTurns(''); // Opcional: reiniciar la cantidad de turnos si la fecha cambia
  };

  const handleNumberOfTurnsChange = (e) => {
    // Asegurarse de que solo se ingresen números positivos
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setNumberOfTurns(value.toString()); // Guardar como string para el valor del input
  };

  const handleEnableTurns = async () => { // Hacemos la función asíncrona para usar fetch
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha.");
      return;
    }
    if (!numberOfTurns || parseInt(numberOfTurns) <= 0) {
      alert("Por favor, ingresa un número válido de turnos.");
      return;
    }

    setIsSubmitting(true); // Activar estado de carga

    try {

      // Asumiendo que tu endpoint de API es algo como /api/turns/enable
      const response = await fetch('http://localhost:3006/api/habilitarturnos', { // Ajusta la URL según tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Podrías necesitar un encabezado de Autorización aquí si tu API está protegida
          // 'Authorization': `Bearer ${tuTokenDeAuth}`
        },
        body: JSON.stringify({
          consultorioId: consultorio?.id,
          profesionalId: medico?.id, // Usar medico.id para el profesional
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

      // Reiniciar estado y cerrar modal al éxito
      setShowModal(false);
      setSelectedDate('');
      setNumberOfTurns('');
    } catch (apiError) {
      console.error('Error al habilitar turnos:', apiError);
      alert(`Hubo un error al habilitar los turnos: ${apiError.message}`);
    } finally {
      setIsSubmitting(false); // Desactivar estado de carga
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-green-100">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">
        Panel de Control 
      </h2>

      {medico && (
        <p className="text-gray-700 text-xl font-medium mb-2">
          Dr./Dra. {medico.nombre} {medico.apellido}
        </p>
      )}
      {medico && medico.especialidad && (
        <p className="text-gray-500 text-lg">
          {medico.especialidad}
        </p>
      )}
      {medico && medico.matricula && (
        <p className="text-gray-500 text-lg mb-6">
          {medico.matricula}
        </p>
      )}

      <p className="text-gray-600 mb-6 text-lg sm:text-xl">
        Gestión simplificada para tu consultorio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Card: Mi Agenda */}
        <div className="bg-green-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaCalendarAlt className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Mi Agenda</h3>
          <p className="text-gray-600 text-sm">Organiza tus turnos diarios.</p>
          <span className="text-green-700 font-bold text-2xl mt-2">Próx. 5</span>
          <p className="text-xs text-gray-500">turnos en las 24hs</p>
        </div>

        {/* Card: Mis Pacientes */}
        <div className="bg-yellow-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaUserMd className="text-yellow-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Mis Pacientes</h3>
          <p className="text-gray-600 text-sm">Accede a tus fichas de pacientes.</p>
          <span className="text-yellow-700 font-bold text-2xl mt-2">87</span>
          <p className="text-xs text-gray-500">pacientes registrados</p>
        </div>
      </div>

      {/* Otras secciones específicas para consultorio propio */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Habilitar Turnos
          </button>
          <button className="flex-1 bg-green-200 text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-300 transition-colors duration-200">
            Ver Historial
          </button>
        </div>
      </div>

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
                min={new Date().toISOString().split('T')[0]} // Establecer fecha mínima a hoy
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {selectedDate && ( // Mostrar este input solo si se ha seleccionado una fecha
              <div className="mb-6">
                <label htmlFor="num-turns" className="block text-gray-700 font-semibold mb-2">
                  ¿Cuántos turnos quieres habilitar?
                </label>
                <input
                  type="number"
                  id="num-turns"
                  value={numberOfTurns}
                  onChange={handleNumberOfTurnsChange}
                  min="1" // Mínimo 1 turno
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
                  setNumberOfTurns(''); // Limpiar al cancelar
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
                disabled={isSubmitting} // Deshabilitar mientras se envía
              >
                Cancelar
              </button>
              <button
                onClick={handleEnableTurns}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                disabled={isSubmitting} // Deshabilitar mientras se envía
              >
                {isSubmitting ? 'Habilitando...' : 'Habilitar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelConsultorioPropio;