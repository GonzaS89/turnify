// components/AsociarProfesionalAConsultorio.js

import { useEffect, useState } from 'react';
import CrearProfesionalModal from './CrearProfesionalModal';
import useAllProfesionals from '../../customHooks/useAllProfesionals';
import axios from 'axios';

const AsociarProfesionalAConsultorio = ({ onClose, consultorioID }) => {
  // ✅ Ahora incluimos `actualizarProfesionales`
  const { profesionales, isLoading, error: hookError, actualizarProfesionales } = useAllProfesionals();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState('');
  const [mensajeError, setMensajeError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

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
      const response = await axios.post('http://localhost:3006/api/unionprofesionalconsultorio', {
        profesionalID: selectedProfesional,
        consultorioID: consultorioID,
      });
  
      setMensaje(`✅ Profesional asociado correctamente al consultorio.`);
  

      // Cerrar automáticamente después de mostrar el mensaje
      setTimeout(() => {
        
        window.location.reload();
      }, 1000);
  
    } catch (err) {
      let errorMsg = 'Error desconocido';
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || err.response?.statusText || 'Error de red o servidor';
      } else {
        errorMsg = 'Error de conexión. Intente más tarde.';
      }
      setMensajeError(`❌ Error: ${errorMsg}`);
      console.error('Error al asociar profesional a consultorio:', err);
    }
  };

  // ✅ handleCreateSuccess ahora actualiza la lista
  const handleCreateSuccess = (nuevoProfesional) => {
    // 🔁 Forzar recarga de la lista de profesionales
    if (typeof actualizarProfesionales === 'function') {
      actualizarProfesionales();
    }

    // ✅ Opcional: seleccionar automáticamente el nuevo profesional
    if (nuevoProfesional?.id) {
      setSelectedProfesional(nuevoProfesional.id);
    }
  };

  return (
    <>
      {/* Modal principal */}
      <section
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Vincular Profesional a Consultorio
          </h2>

          {hookError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {hookError}
            </div>
          )}

          {mensajeError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {mensajeError}
            </div>
          )}
          {mensaje && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
              {mensaje}
            </div>
          )}

          {isLoading ? (
            <p className="text-gray-600 text-center py-4">Cargando profesionales...</p>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Profesional
                </label>
                <select
                  value={selectedProfesional}
                  onChange={(e) => setSelectedProfesional(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccionar profesional</option>
                  {profesionales?.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nombre} {prof.apellido} - {prof.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none"
                >
                  ➕ Agregar Nuevo
                </button>
                <button
                  type="button"
                  onClick={handleSelect}
                  disabled={!selectedProfesional || !!mensaje}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition focus:outline-none"
                >
                  Asociar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal de creación */}
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