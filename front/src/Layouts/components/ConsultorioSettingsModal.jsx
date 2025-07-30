import React, { useState } from 'react';
import { FaBuilding, FaUserShield, FaEdit, FaKey, FaTimes } from 'react-icons/fa';
import EditConsultorioModal from '../components/EditConsultorioModal ';
import EditCredentialsModal from '../components/EditCredentialsModal';

const ConsultorioSettingsModal = ({ isOpen, onClose, consultorio }) => {
  const [isEditConsultorioModalOpen, setIsEditConsultorioModalOpen] = useState(false);
  const [isEditCredentialsModalOpen, setIsEditCredentialsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenEditConsultorioModal = () => setIsEditConsultorioModalOpen(true);
  const handleCloseEditConsultorioModal = () => setIsEditConsultorioModalOpen(false);
  const handleSaveEditedConsultorio = (updatedData) => {
    console.log('Datos del consultorio actualizados:', updatedData);
    setIsEditConsultorioModalOpen(false);
  };

  const handleOpenEditCredentialsModal = () => setIsEditCredentialsModalOpen(true);
  const handleCloseEditCredentialsModal = () => setIsEditCredentialsModalOpen(false);
  const handleSaveEditedCredentials = (updatedCredentials) => {
    console.log('Credenciales actualizadas:', updatedCredentials);
    setIsEditCredentialsModalOpen(false);
  };

  return (
    <>
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 xlp-4 transition-all duration-300">
        <div className="bg-white xl:rounded-2xl shadow-2xl w-full xl:max-w-4xl h-screen xl:max-h-[90vh] flex flex-col overflow-hidden animate-fade-up">
          
          {/* Encabezado con gradiente */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-full text-white">
                <FaUserShield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Ajustes del Consultorio</h2>
                <p className="text-gray-600 text-sm">Gestiona la información de tu consultorio y tus credenciales</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Cerrar modal"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-grow overflow-y-auto px-6 pb-6 custom-scrollbar">
            {consultorio ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- Sección: Datos del Consultorio --- */}
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaBuilding className="text-blue-500 mr-2 w-5 h-5" />
                    Información del Consultorio
                  </h3>
                  <div className="space-y-4 bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <DetailItem label="Nombre" value={consultorio.nombre || 'No especificado'} />
                    <DetailItem 
                      label="Tipo" 
                      value={
                        consultorio.tipo === 'propio' 
                          ? 'Consultorio Particular' 
                          : `Centro Médico: ${consultorio.nombre}`
                      } 
                    />
                    <DetailItem label="Dirección" value={consultorio.direccion || 'No especificado'} />
                    <DetailItem label="Localidad" value={consultorio.localidad || 'No especificado'} />
                    <DetailItem label="Provincia" value={consultorio.provincia || 'No especificado'} />
                   
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleOpenEditConsultorioModal}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <FaEdit /> Editar Datos
                    </button>
                  </div>
                </section>

                {/* --- Sección: Cuenta de Usuario --- */}
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaUserShield className="text-purple-500 mr-2 w-5 h-5" />
                    Credenciales de Acceso
                  </h3>
                  <div className="space-y-4 bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <DetailItem label="Usuario" value={consultorio.usuario || 'No especificado'} />
                    <DetailItem label="Contraseña" value="••••••••" hint="Oculta por seguridad" />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleOpenEditCredentialsModal}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <FaKey /> Cambiar Credenciales
                    </button>
                  </div>
                </section>

              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="font-bold">Error al cargar los datos</p>
                <p className="text-sm mt-1">No se pudieron obtener los datos del consultorio. Intenta más tarde.</p>
              </div>
            )}
          </div>

          {/* Pie del modal */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modales secundarios */}
      <EditConsultorioModal
        isOpen={isEditConsultorioModalOpen}
        onClose={handleCloseEditConsultorioModal}
        consultorio={consultorio}
        onSave={handleSaveEditedConsultorio}
      />

      <EditCredentialsModal
        consultorioId={consultorio?.id}
        isOpen={isEditCredentialsModalOpen}
        onClose={handleCloseEditCredentialsModal}
        currentUsername={consultorio?.usuario}
        onSave={handleSaveEditedCredentials}
      />
    </>
  );
};

// Componente auxiliar para mostrar pares label/valor
const DetailItem = ({ label, value, hint }) => (
  <div>
    <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
    <p className="text-base font-medium text-gray-900">{value}</p>
    {hint && <p className="text-xs text-gray-500 italic mt-1">{hint}</p>}
  </div>
);

export default ConsultorioSettingsModal;