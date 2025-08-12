import { useState } from 'react';
import { FaBuilding, FaUserShield, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import EditCredentialsModal from '../components/EditCredentialsModal';

const ConsultorioSettingsModal = ({ isOpen, onClose, consultorio, password }) => {
  const [isEditCredentialsModalOpen, setIsEditCredentialsModalOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!isOpen) return null;

  // Previene scroll del fondo
  document.body.style.overflow = 'hidden';

  const handleCloseEditCredentialsModal = () => setIsEditCredentialsModalOpen(false);
  const handleSaveEditedCredentials = (updatedCredentials) => {
    console.log('Credenciales actualizadas:', updatedCredentials);
    setIsEditCredentialsModalOpen(false);
  };

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-all hover:scale-[1.01]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaUserShield className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Ajustes del Consultorio</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    Gestiona la información y credenciales de acceso.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {consultorio ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- Información del Consultorio --- */}
                <section>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-blue-500" /> Información del Consultorio
                  </h4>
                  <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <DetailItem label="Nombre" value={consultorio.nombre || 'No especificado'} />
                    <DetailItem
                      label="Tipo"
                      value={
                        consultorio.tipo === 'particular'
                          ? 'Consultorio Particular'
                          : `Centro Médico: ${consultorio.nombre}`
                      }
                    />
                    <DetailItem label="Dirección" value={consultorio.direccion || 'No especificado'} />
                    <DetailItem label="Localidad" value={consultorio.localidad || 'No especificado'} />
                    <DetailItem label="Provincia" value={consultorio.provincia || 'No especificado'} />
                    <DetailItem label="Teléfono" value={consultorio.telefono || 'No especificado'} />
                  </div>
                </section>

                {/* --- Credenciales de Acceso --- */}
                <section>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUserShield className="text-purple-500" /> Credenciales de Acceso
                  </h4>
                  <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <DetailItem label="Usuario" value={consultorio.usuario || 'No especificado'} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Contraseña</p>
                      <div className="flex items-center gap-3">
                        <p className="text-base font-medium text-gray-900 truncate">
                          {isPasswordVisible ? password : '••••••••••••'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible(prev => !prev)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none transition"
                          aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {isPasswordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 italic mt-1">Oculta por seguridad</p>
                    </div>
                  </div>

                  {/* Botón para abrir modal de edición */}
                  {/* <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setIsEditCredentialsModalOpen(true)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-5 py-2.5 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                    >
                      Cambiar Contraseña
                    </button>
                  </div> */}
                </section>
              </div>
            ) : (
              // Error de carga
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                <FaTimesCircle className="text-red-500 mx-auto mb-3" size={24} />
                <p className="text-red-700 font-medium">Error al cargar los datos</p>
                <p className="text-red-600 text-sm mt-1">No se pudieron obtener los datos del consultorio.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal secundario */}
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
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
    <p className="text-base font-medium text-gray-900">{value}</p>
  </div>
);

export default ConsultorioSettingsModal;