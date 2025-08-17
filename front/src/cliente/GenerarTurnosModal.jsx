import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { FaCalendarAlt, FaClock, FaStopwatch, FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const GenerarTurnosModal = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duracionTurno, setDuracionTurno] = useState(30);
  const [generando, setGenerando] = useState(false);

  const navigate = useNavigate();
  const { consultorioId } = useParams();
  const { profesionalId } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  // Calcular cantidad de turnos
  const calculatedTurns = useMemo(() => {
    if (!selectedDate || !startTime || !endTime || duracionTurno <= 0) return 0;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (end <= start) return 0;

    const diffMins = (end - start) / (1000 * 60);
    return Math.floor(diffMins / duracionTurno);
  }, [selectedDate, startTime, endTime, duracionTurno]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setStartTime('');
    setEndTime('');
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
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

  const formatearFechaSQL = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };


  const handleEnableTurns = async () => {
    if (!selectedDate) return toast.warn("Selecciona una fecha.");
    if (!startTime) return toast.warn("Selecciona una hora de inicio.");
    if (!endTime) return toast.warn("Selecciona una hora de finalización.");
    if (new Date(`2000-01-01T${endTime}`) <= new Date(`2000-01-01T${startTime}`)) {
      return toast.error("La hora de finalización debe ser posterior a la de inicio.");
    }
    if (duracionTurno < 5) return toast.error("La duración mínima es 5 minutos.");
    if (calculatedTurns <= 0) return toast.warn("No se pueden generar turnos con estos parámetros.");

    setGenerando(true);

    try {
      const response = await fetch(`${API_URL}/api/habilitarturnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultorioId,
          profesionalId,
          fecha:  selectedDate,// Asegura que sea solo YYYY-MM-DD
          cantidadTurnos: calculatedTurns,
          horaInicio: startTime,
          duracion: duracionTurno
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al habilitar turnos');
      }

      const result = await response.json();

      // Éxito
     
     

      toast.success(
        <div className="text-sm">
          ✅ <strong>{calculatedTurns} turnos</strong> generados para el{' '}
          <strong>{formatearFechaSQL(selectedDate)}</strong>, de{' '}
          <strong>{startTime}</strong> a <strong>{endTime}</strong>, cada{' '}
          <strong>{duracionTurno} min</strong>.
        </div>,
        { autoClose: 1000, position:"bottom-right" }
      );

      // Redirigir tras éxito
      setTimeout(() => {
        navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`);
        
      }, 1500);

    } catch (err) {
      toast.error(`❌ Error: ${err.message}`);
      console.error('Error al habilitar turnos:', err);
    } 
  };

  // Formato de fecha legible
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
        onClick={() => navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-screen max-w-md h-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-2xl" />
                <h3 className="text-2xl font-bold">Habilitar Turnos</h3>
              </div>
              <button
                onClick={() => navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-blue-100 mt-2 text-sm opacity-90">
              Define fecha, horario y duración. Los turnos se generarán automáticamente.
            </p>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
            {/* Fecha */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" /> Fecha *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
              />
            </div>

            {selectedDate && (
              <>
                {/* Hora de inicio */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-green-500" /> Hora de inicio *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Hora de finalización */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-orange-500" /> Hora de finalización *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    min={startTime || undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {endTime && new Date(`2000-01-01T${endTime}`) <= new Date(`2000-01-01T${startTime}`) && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationCircle /> Debe ser posterior a la hora de inicio.
                    </p>
                  )}
                </div>

                {/* Duración del turno */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaStopwatch className="text-purple-500" /> Duración (minutos) *
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setDuracionTurno(prev => Math.max(5, prev - 5))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={duracionTurno}
                      onChange={handleDuracionChange}
                      min="5"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setDuracionTurno(prev => prev + 5)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Recomendado: 15, 30, 45 o 60 minutos</p>
                </div>

                {/* Resumen de turnos */}
                {calculatedTurns > 0 ? (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-green-600" />
                      <span className="font-semibold text-green-800">Turnos generados</span>
                    </div>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Se crearán <strong>{calculatedTurns} turnos</strong> el <strong>{formattedDate}</strong>, desde las{' '}
                      <strong>{startTime}</strong> hasta las <strong>{endTime}</strong>, cada <strong>{duracionTurno} minutos</strong>.
                    </p>
                  </div>
                ) : calculatedTurns === 0 && startTime && endTime ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-800 text-sm flex items-center gap-1">
                      <FaExclamationCircle /> No se pueden generar turnos completos con esta duración.
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Footer con botones */}
          <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`)}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEnableTurns}
              disabled={generando || calculatedTurns <= 0}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                generando || calculatedTurns <= 0
                  ? 'bg-gray-400'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
              }`}
            >
              {generando ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Habilitando ...
                </div>
              ) : (
                `Habilitar ${calculatedTurns} turno${calculatedTurns !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerarTurnosModal;