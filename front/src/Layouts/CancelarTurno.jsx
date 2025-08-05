// src/pages/CancelarTurnoPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import useObtenerTurnoxID from '../../customHooks/useObtenerTurnoxID';

export default function CancelarTurno() {

  const { turnoId } = useParams();
  if (!turnoId) {
    return <div className="text-red-500">ID de turno no válido.</div>;
  }
  const idParseada = parseInt(turnoId, 10);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const { turno, loading: loadingTurno, error, mensaje: mensajeTurno } = useObtenerTurnoxID(idParseada);

  const turnoObtenido = turno ? turno[0] : null;

  console.log(turnoObtenido);

  useEffect(() => {
    if (!turnoId) {
      setMensaje({ tipo: 'error', texto: 'ID de turno no válido.' });
    }
  }, [turnoId]);

  const handleCancelar = async () => {
    if (!turnoId || loading) return;

    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch(`/api/cancelar-turno/${turnoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMensaje({ tipo: 'exito', texto: '¡Tu turno ha sido cancelado con éxito!' });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'No se pudo cancelar el turno.');
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  const formatearFechaSQL = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    }


    const formatearHora = ( hora ) => {
        if (!hora) return '';
        const [horaParte, minutoParte] = hora.split(':');
        const horaFormateada = `${horaParte.padStart(2, '0')}:${minutoParte.padStart(2, '0')}`;
        return horaFormateada;
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 transform transition-all hover:shadow-3xl duration-300">
        
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
          Cancelar Turno
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-600 leading-relaxed mb-6 px-2">
          ¿Estás seguro de que deseas cancelar tu turno? Esta acción no se puede deshacer.
        </p>

        {/* Detalles del Turno */}
{turnoId && (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6 shadow-sm">
    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
      📅 Detalles del Turno
    </h3>
    <div className="space-y-2 text-left text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Paciente</span>
        <span className="text-gray-800 font-semibold">{turnoObtenido?.apellido_paciente}, {turnoObtenido?.nombre_paciente}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Fecha</span>
        <span className="text-gray-800">{formatearFechaSQL(turnoObtenido?.fecha)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Hora</span>
        <span className="text-gray-800">{formatearHora(turnoObtenido?.hora)} hrs</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Especialidad</span>
        <span className="text-indigo-700 font-semibold">Cardiología</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Profesional</span>
        <span className="text-gray-800">Dr. Martín Pérez</span>
      </div>
      <div className="pt-2 mt-2 border-t border-gray-200">
        <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Código de turno</span>
        <div className="font-mono font-bold text-red-600 mt-1 break-all">{turnoId}</div>
      </div>
    </div>
  </div>
)}

        {/* Mensaje de éxito o error */}
        {mensaje.texto && (
          <div
            className={`flex items-center justify-center gap-2 p-4 rounded-2xl text-sm mb-6 transition-all duration-300 ${
              mensaje.tipo === 'exito'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {mensaje.tipo === 'exito' ? (
              <FaCheckCircle className="text-green-500 text-lg" />
            ) : (
              <FaTimesCircle className="text-red-500 text-lg" />
            )}
            <span>{mensaje.texto}</span>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleVolver}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 disabled:opacity-60 transition-all duration-200 shadow-sm font-medium"
          >
            <FaArrowLeft /> Volver
          </button>

          <button
            onClick={handleCancelar}
            disabled={loading || mensaje.tipo === 'exito'}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium shadow-sm transition-all duration-200 ${
              loading || mensaje.tipo === 'exito'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Cancelando...
              </>
            ) : (
              'Sí, Cancelar Turno'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}