// src/pages/CancelarTurnoPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CancelarTurno() {
  const { turnoId } = useParams(); // Obtiene el ID desde la URL: /cancelar-turno/:turnoId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Simulación: aquí cargarías datos del turno (opcional)
  useEffect(() => {
    if (!turnoId) {
      setMensaje({ tipo: 'error', texto: 'ID de turno no válido.' });
    }
  }, [turnoId]);

  const handleCancelar = async () => {
    if (!turnoId) return;

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
        setMensaje({ tipo: 'exito', texto: '✅ ¡Turno cancelado con éxito!' });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'No se pudo cancelar el turno.');
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: `❌ ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
          <span>❌</span>
          Cancelar Turno
        </h1>

        <p className="text-gray-700 mb-6">
          ¿Estás seguro de que deseas cancelar tu turno? Esta acción no se puede deshacer.
        </p>

        {turnoId && (
          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-mono text-sm mb-6 break-all">
            Código de turno: <strong>{turnoId}</strong>
          </div>
        )}

        {mensaje.texto && (
          <div
            className={`p-3 rounded-lg text-sm mb-6 ${
              mensaje.tipo === 'exito'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleVolver}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Volver
            </button>
            <button
              onClick={handleCancelar}
              disabled={loading}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              Sí, Cancelar Turno
            </button>
          </div>
        )}
      </div>
    </div>
  );
}