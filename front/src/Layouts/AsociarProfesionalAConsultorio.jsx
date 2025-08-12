import { useEffect, useState } from 'react';
import CrearProfesionalModal from './CrearProfesionalModal';
import useAllProfesionals from '../../customHooks/useAllProfesionals';
import axios from 'axios';
import { FaUserMd, FaLink, FaPlusCircle, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AsociarProfesionalAConsultorio = ({ onClose, consultorioID }) => {
  const { profesionales, isLoading, error: hookError, actualizarProfesionales } = useAllProfesionals();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState('');
  const [mensajeError, setMensajeError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSelect = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensaje(null);

    if (!selectedProfesional) {
      setMensajeError('Debe seleccionar un profesional.');
      return;
    }
    if (!consultorioID) {
      setMensajeError('No se especificó el consultorio.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/unionprofesionalconsultorio`, {
        profesionalID: selectedProfesional,
        consultorioID: consultorioID,
      });

      setMensaje('✅ Profesional asociado correctamente al consultorio.');
      toast.success('Vinculación exitosa');

      // Recargar después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.statusText || 'Error de conexión';
      setMensajeError(`❌ ${errorMsg}`);
      toast.error('Error al asociar profesional');
      console.error('Error al asociar profesional:', err);
    }
  };

  const handleCreateSuccess = () => {
    if (typeof actualizarProfesionales === 'function') {
      actualizarProfesionales();
    }
    toast.success('Nuevo profesional creado y listo para vincular');
  };

  return (
    <>
      {/* Fondo oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 hover:scale-[1.01]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaLink className="text-2xl" />
                <h2 className="text-2xl font-bold">Vincular Profesional</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="p-6 space-y-6">
            {/* Mensajes */}
            {hookError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                <FaExclamationCircle className="mt-1 flex-shrink-0" />
                <span className="text-sm">{hookError}</span>
              </div>
            )}

            {mensajeError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                <FaExclamationCircle className="mt-1 flex-shrink-0" />
                <span className="text-sm">{mensajeError}</span>
              </div>
            )}

            {mensaje && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-700">
                <FaCheckCircle className="mt-1 flex-shrink-0" />
                <span className="text-sm">{mensaje}</span>
              </div>
            )}

            {/* Cargando */}
            {isLoading ? (
              <div className="py-10 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-gray-500 text-sm">Cargando profesionales...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selector de profesional */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserMd className="text-purple-500" /> Seleccionar Profesional *
                  </label>
                  <select
                    value={selectedProfesional}
                    onChange={(e) => setSelectedProfesional(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition"
                  >
                    <option value="">Seleccionar profesional</option>
                    {profesionales?.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nombre} {prof.apellido} • {prof.especialidad} • MP: {prof.matricula}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 focus:outline-none"
                  >
                    <FaPlusCircle /> Nuevo Profesional
                  </button>

                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={!selectedProfesional || !!mensaje}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition transform hover:scale-105 disabled:transform-none focus:outline-none"
                  >
                    Vincular
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de creación (reutilizado con estilo consistente) */}
      {showCreateModal && (
        <CrearProfesionalModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default AsociarProfesionalAConsultorio;