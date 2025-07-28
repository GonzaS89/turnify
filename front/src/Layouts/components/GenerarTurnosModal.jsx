import { useState } from "react";

const GenerarTurnosModal = ({ closeModalHabilitarTurnos, medico, consultorio, actualizarTurnos }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfTurns, setNumberOfTurns] = useState('');
  const [startTime, setStartTime] = useState(''); // Hora de inicio (ej: 08:30)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Duración del turno en minutos (puedes hacerla configurable después)
  const duracionTurno = 30;

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setNumberOfTurns('');
    setStartTime(''); // Resetear si cambia la fecha
  };

  const handleNumberOfTurnsChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setNumberOfTurns(value.toString());
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
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
    if (!startTime) {
      alert("Por favor, selecciona una hora de inicio.");
      return;
    }

    setIsSubmitting(true);

    console.log(startTime, 'startTime', duracionTurno); // Verificar el formato de la hora

    try {
      const response = await fetch('http://localhost:3006/api/habilitarturnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultorioId: consultorio,
          profesionalId: medico,
          fecha: selectedDate,
          cantidadTurnos: parseInt(numberOfTurns),
          horaInicio: startTime,        // Ej: "08:30"
          duracionTurno: duracionTurno, // En minutos
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al habilitar turnos');
      }

      const result = await response.json();

      // Mostrar toast de éxito
      setShowSuccessToast(true);

      // Cerrar modal y limpiar después de 2 segundos
      setTimeout(() => {
        closeModalHabilitarTurnos();
        actualizarTurnos();
        setSelectedDate('');
        setNumberOfTurns('');
        setStartTime('');
        setShowSuccessToast(false);
      }, 2000);
    } catch (apiError) {
      console.error('Error al habilitar turnos:', apiError);
      alert(`Error: ${apiError.message}`);
      setIsSubmitting(false);
    }
  };

  // Formatear la fecha seleccionada
  const formattedDate = selectedDate
    ? (() => {
        const [year, month, day] = selectedDate.split('-');
        const date = new Date(+year, +month - 1, +day);
        return isNaN(date.getTime())
          ? 'fecha inválida'
          : date.toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
      })()
    : '';

  return (
    <>
      {/* Modal principal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Habilitar Turnos</h3>
              <button
                onClick={() => {
                  closeModalHabilitarTurnos();
                  setSelectedDate('');
                  setNumberOfTurns('');
                  setStartTime('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">Selecciona la fecha, hora de inicio y cantidad de turnos.</p>

            <div className="mb-6">
              <label htmlFor="turn-date" className="block text-gray-700 font-semibold mb-2">
                Fecha:
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
              <>
                <div className="mb-6">
                  <label htmlFor="turn-time" className="block text-gray-700 font-semibold mb-2">
                    Hora de inicio:
                  </label>
                  <input
                    type="time"
                    id="turn-time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-gray-500 text-sm mt-1">Turnos de {duracionTurno} minutos</p>
                </div>

                <div className="mb-6">
                  <label htmlFor="num-turns" className="block text-gray-700 font-semibold mb-2">
                    Cantidad de turnos:
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
              </>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  closeModalHabilitarTurnos();
                  setSelectedDate('');
                  setNumberOfTurns('');
                  setStartTime('');
                }}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnableTurns}
                disabled={isSubmitting}
                className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
                  isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Habilitando...
                  </div>
                ) : (
                  'Habilitar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast de éxito */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[200]">
          Se agregaron {numberOfTurns} turnos para el{' '}
          <strong>{formattedDate}</strong> a partir de las <strong>{startTime}</strong>
        </div>
      )}
    </>
  );
};

export default GenerarTurnosModal;