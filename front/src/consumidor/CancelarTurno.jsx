// src/pages/CancelarTurnoPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import useObtenerTurnoxID from '../../customHooks/useObtenerTurnoxID';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import useProfesionalxId from '../../customHooks/useProfesionalxId';
import 'react-toastify/dist/ReactToastify.css';

export default function CancelarTurno() {
  const { turnoId } = useParams();
  const idParseada = parseInt(turnoId, 10);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const { turno, loading: loadingTurno, error, mensaje: mensajeTurno } = useObtenerTurnoxID(idParseada);
  const turnoObtenido = turno ? turno[0] : null;

 const { profesional, isLoading: loadingProfesional, error: errorProfesional } = useProfesionalxId(turnoObtenido?.profesionalID);


 const prof = profesional[0];

 const { slug } = prof || { slug: 'profesional' };

  // Validación del ID
  useEffect(() => {
    if (!turnoId) {
      setMensaje({ tipo: 'error', texto: 'ID de turno no válido.' });
    }
  }, [turnoId]);

  // Verificar si se puede cancelar
  const puedeCancelar = () => {
    // Verificar datos básicos
    if (!turnoObtenido?.fecha || !turnoObtenido?.hora || !turnoObtenido?.estado) return false;

    // Condición 1: El estado debe ser "reservado"
    if (turnoObtenido.estado !== 'reservado') return false;

    // Condición 2: Debe haber más de 24 horas de anticipación
    const [hours, minutes] = turnoObtenido.hora.split(':').map(Number);
    const turnoDateTime = new Date(turnoObtenido.fecha);
    turnoDateTime.setHours(hours, minutes, 0, 0);

    const ahora = new Date();
    const diferenciaMs = turnoDateTime - ahora;
    const horasRestantes = diferenciaMs / (1000 * 60 * 60);

    return horasRestantes > 12;
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const cancelacionPermitida = puedeCancelar();


  const handleCancelar = async () => {
    if (!turnoId || loading || loadingTurno || !cancelacionPermitida) return;
  
    setLoading(true);
    try {
      // Solo ejecutamos el PUT, axios lanza error si falla
      await axios.put(`${API_URL}/api/cancelarturno/${idParseada}`);
  
      // Si llega aquí, fue exitoso
      toast.success('✅ ¡Tu turno ha sido cancelado con éxito!', {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setMensaje({ tipo: 'exito', texto: '¡Tu turno ha sido cancelado con éxito!' });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      // Manejamos el error
      const mensajeError =
        err.response?.data?.message ||
        err.message ||
        'No se pudo cancelar el turno.';
  
      toast.error(`❌ Error: ${mensajeError}`, {
        position: 'top-right',
        autoClose: 6000,
        hideProgressBar: false,
      });
      setMensaje({ tipo: 'error', texto: mensajeError });
    } finally {
      setLoading(false); // Aseguramos que se detenga el loading
    }
  };

  const handleVolver = () => {
    navigate(`/turnos/${slug}`);
  };

  const formatearFechaSQL = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatearHora = (hora) => {
    if (!hora) return 'N/A';
    const [horaParte, minutoParte] = hora.split(':');
    const horaFormateada = `${horaParte.padStart(2, '0')}:${minutoParte.padStart(2, '0')}`;
    return horaFormateada;
  };

  // Si el ID no es válido
  if (!turnoId) {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-3" />
            <p className="text-red-600 font-medium">ID de turno no válido.</p>
          </div>
        </div>
      </>
    );
  }

  // Mientras se carga el turno
  if (loadingTurno) {
    return (
      <>
        <ToastContainer />
        <div className="h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-spin">
                <FaExclamationTriangle className="text-red-600 text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Cargando turno...</h1>
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </>
    );
  }

  // Si hubo error al cargar el turno o no existe
  if (error || !turnoObtenido) {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">
              {mensajeTurno || 'No se pudo cargar el turno. Intenta más tarde.'}
            </p>
            <button
              onClick={handleVolver}
              className="px-6 py-2 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    );
  }

  // Estado combinado de carga
  const isLoading = loading || loadingTurno;

  return (
    <>
      {/* Contenedor de Toastify */}
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 transform transition-all hover:shadow-3xl duration-300">
          
          {/* Icono de advertencia */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Cancelar Turno</h1>

          {/* Subtítulo */}
          <p className="text-gray-600 leading-relaxed mb-6 px-2">
            ¿Estás seguro de que deseas cancelar tu turno? Esta acción no se puede deshacer.
          </p>

          {/* Detalles del Turno */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              📅 Detalles del Turno
            </h3>
            <div className="space-y-2 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Paciente</span>
                <span className="text-gray-800">{turnoObtenido?.paciente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">DNI</span>
                <span className="text-gray-800">{turnoObtenido?.dni}</span>
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
                <span className="text-gray-800">{turnoObtenido?.especialidad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Profesional</span>
                <span className="text-gray-800">{turnoObtenido?.profesional}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Estado</span>
                <span
                  className={`font-semibold ${
                    turnoObtenido?.estado === 'reservado'
                      ? 'text-green-600'
                      : turnoObtenido?.estado === 'confirmado'
                      ? 'text-blue-600'
                      : turnoObtenido?.estado === 'cancelado'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {turnoObtenido?.estado}
                </span>
              </div>
            </div>
          </div>

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

          {/* Mensaje si el estado no es "reservado" */}
          {turnoObtenido.estado && turnoObtenido.estado !== 'reservado' && !mensaje.texto && (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-2xl text-sm mb-6 flex items-center gap-2">
              <FaTimesCircle className="text-gray-500" />
              <span>
                No se puede cancelar porque el estado del turno es <strong>"{turnoObtenido.estado}"</strong>.
              </span>
            </div>
          )}

          {/* Mensaje si no se puede cancelar por tiempo */}
          {!cancelacionPermitida &&
            turnoObtenido.estado === 'reservado' &&
            !mensaje.texto &&
            mensaje.tipo !== 'exito' && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-2xl text-sm mb-6 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" />
                <span>
                  La cancelación solo está permitida con más de 24 horas de anticipación.
                </span>
              </div>
            )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleVolver}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 disabled:opacity-60 transition-all duration-200 shadow-sm font-medium"
            >
              <FaArrowLeft /> Volver
            </button>

            <button
              onClick={handleCancelar}
              disabled={isLoading || mensaje.tipo === 'exito' || !cancelacionPermitida}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium shadow-sm transition-all duration-200 ${
                isLoading || mensaje.tipo === 'exito' || !cancelacionPermitida
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  {loading ? 'Cancelando...' : 'Cargando...'}
                </>
              ) : !cancelacionPermitida ? (
                turnoObtenido.estado !== 'reservado' ? (
                  `Estado: ${turnoObtenido.estado}`
                ) : (
                  'No permitido'
                )
              ) : (
                'Sí, Cancelar Turno'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}