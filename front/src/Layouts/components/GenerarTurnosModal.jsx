import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";

const GenerarTurnosModal = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duracionTurno, setDuracionTurno] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Previene el scroll del fondo
  document.body.style.overflow = 'hidden';

  const navigate = useNavigate();

  const {consultorioId} = useParams();
  const {profesionalId} = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  // Calcular cantidad de turnos basados en rango horario
  const calculatedTurns = useMemo(() => {
    if (!selectedDate || !startTime || !endTime || duracionTurno <= 0) {
      return 0;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (end <= start) {
      return 0; // Hora final inválida
    }

    const diffMs = end - start;
    const diffMins = diffMs / (1000 * 60);
    return Math.floor(diffMins / duracionTurno);
  }, [selectedDate, startTime, endTime, duracionTurno]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setStartTime('');
    setEndTime('');
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    // Opcional: limpiar endTime si startTime cambia
    if (endTime && new Date(`2000-01-01T${e.target.value}`) >= new Date(`2000-01-01T${endTime}`)) {
      setEndTime('');
    }
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleDuracionChange = (e) => {
    const value = parseInt(e.target.value) || 30;
    setDuracionTurno(value < 5 ? 5 : value);
  };

  const handleEnableTurns = async () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha.");
      return;
    }
    if (!startTime) {
      alert("Por favor, selecciona una hora de inicio.");
      return;
    }
    if (!endTime) {
      alert("Por favor, selecciona una hora de finalización.");
      return;
    }
    if (new Date(`2000-01-01T${endTime}`) <= new Date(`2000-01-01T${startTime}`)) {
      alert("La hora de finalización debe ser posterior a la hora de inicio.");
      return;
    }
    if (duracionTurno < 5) {
      alert("La duración mínima del turno es 5 minutos.");
      return;
    }
    if (calculatedTurns <= 0) {
      alert(`No se pueden generar turnos con una duración de ${duracionTurno} min en este rango horario.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/habilitarturnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultorioId,
          profesionalId,
          fecha: selectedDate,
          cantidadTurnos: calculatedTurns,
          horaInicio: startTime,
          duracion: duracionTurno
        }),

       
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al habilitar turnos');
      }

      navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`);

      const result = await response.json();

      setShowSuccessToast(true);

      setTimeout(() => {
        
        setDuracionTurno(30);
        setShowSuccessToast(false);
      }, 2000);
    } catch (apiError) {
      console.error('Error al habilitar turnos:', apiError);
      alert(`Error: ${apiError.message}`);
      setIsSubmitting(false);
    }
  };

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
      {/* Overlay del modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Habilitar Turnos</h3>
              <button
                  onClick={() => navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-2">Define el rango horario y duración. Los turnos se generarán automáticamente.</p>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
                  <label htmlFor="turn-start-time" className="block text-gray-700 font-semibold mb-2">
                    Hora de inicio:
                  </label>
                  <input
                    type="time"
                    id="turn-start-time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="turn-end-time" className="block text-gray-700 font-semibold mb-2">
                    Hora de finalización:
                  </label>
                  <input
                    type="time"
                    id="turn-end-time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    min={startTime || undefined}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {endTime && new Date(`2000-01-01T${endTime}`) <= new Date(`2000-01-01T${startTime}`) && (
                    <p className="text-red-500 text-sm mt-1">Debe ser posterior a la hora de inicio.</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Duración del turno (minutos):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDuracionTurno(prev => (prev < 10 ? 5 : prev - 5))}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={duracionTurno}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value) && value >= 5) {
                          setDuracionTurno(value);
                        } else if (e.target.value === '') {
                          setDuracionTurno(30); // valor temporal si borra
                        }
                      }}
                      min="5"
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="30"
                    />
                    <button
                      type="button"
                      onClick={() => setDuracionTurno(prev => prev + 5)}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Recomendado: 15, 30, 45 o 60 minutos</p>
                </div>

                {/* Mostrar cantidad calculada de turnos */}
                {calculatedTurns > 0 && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      Se generarán <strong>{calculatedTurns}</strong> turnos.
                    </p>
                    <p className="text-green-700 text-sm">
                      Desde <strong>{startTime}</strong> hasta <strong>{endTime}</strong>, cada {duracionTurno} min.
                    </p>
                  </div>
                )}

                {calculatedTurns === 0 && startTime && endTime && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      No se pueden generar turnos completos en este rango horario con duración de {duracionTurno} min.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() => navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`)}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleEnableTurns}
              disabled={isSubmitting || calculatedTurns <= 0}
              className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${isSubmitting || calculatedTurns <= 0
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
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
                `Habilitar ${calculatedTurns > 0 ? calculatedTurns : ''} turno${calculatedTurns !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast de éxito */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[201]">
          Se agregaron <strong>{calculatedTurns}</strong> turnos para el{' '}
          <strong>{formattedDate}</strong> de <strong>{startTime}</strong> a <strong>{endTime}</strong>,
          cada uno de <strong>{duracionTurno} min</strong>.
        </div>
      )}
    </>
  );
};

export default GenerarTurnosModal;