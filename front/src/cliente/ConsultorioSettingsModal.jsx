import { useState, useEffect } from 'react';
import { FaBuilding, FaUserShield, FaTimes, FaEye, FaEyeSlash, FaCircleNotch, FaExclamationTriangle } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';
import useConsultorioxId from '../../customHooks/useConsultorioxId';

const ConsultorioSettingsModal = ({ password }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { consultorioId } = useParams();
  const navigate = useNavigate();

  const { consultorio: consul, isLoading, error } = useConsultorioxId(consultorioId);
  const consultorio = consul?.[0]; // Accede al primer elemento seguro

  // Bloquear scroll al montar
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || 'auto';
    };
  }, []);

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center xl:p-4 z-[200]"
        onClick={() => navigate('/micuenta')}
      >
        <div
          className="bg-white xl:rounded-2xl shadow-2xl w-screen xl:max-w-7xl h-[100dvh] xl:max-h-[90dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl">
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
                onClick={() => navigate('/micuenta')}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {isLoading ? (
              // Estado de carga
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FaCircleNotch className="animate-spin text-blue-500 mb-4" size={40} />
                <h4 className="text-lg font-medium text-gray-700">Cargando datos del consultorio...</h4>
                <p className="text-gray-500 text-sm">Por favor, espera un momento.</p>
              </div>
            ) : error ? (
              // Estado de error
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                <FaExclamationTriangle className="text-red-500 mx-auto mb-3" size={24} />
                <p className="text-red-700 font-medium">Error al cargar los datos</p>
                <p className="text-red-600 text-sm mt-1">
                  {error.message || 'No se pudieron obtener los datos del consultorio.'}
                </p>
              </div>
            ) : consultorio ? (
              // Contenido principal
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del Consultorio */}
                <section>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-blue-500" /> Información del Consultorio
                  </h4>
                  <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <DetailItem label="Nombre" value={consultorio.nombre || 'No especificado'} />
                    <DetailItem
                      label="Tipo"
                      value={
                        consultorio.tipo === 'Particular'
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

                {/* Credenciales de Acceso */}
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
                          onClick={() => setIsPasswordVisible((prev) => !prev)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none transition"
                          aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {isPasswordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 italic mt-1">Oculta por seguridad</p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              // Caso inesperado: sin error ni datos
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <p className="text-yellow-700 font-medium">No se encontró información del consultorio.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <button
              onClick={() => navigate('/micuenta')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
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