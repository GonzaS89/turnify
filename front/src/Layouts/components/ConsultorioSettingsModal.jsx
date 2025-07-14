import React from 'react';
import useCoberturaxIdConsultorio from '../../../customHooks/useCoberturaxIdConsultorio';
import useAllCoberturas from '../../../customHooks/useAllCoberturas';
import { IoIosClose } from "react-icons/io";
 
const ConsultorioSettingsModal = ({ isOpen, onClose, consultorio }) => {
  if (!isOpen) return null;

  console.log('Consultorio Settings Modal Rendered', consultorio);

  const { coberturas: allCoberturas, isLoading:isLoadingCoberturas, error:errorCoberturas } = useAllCoberturas();
  console.log('Todas las Coberturas:', allCoberturas);
  // Aseguramos que consultorio.id exista antes de llamar al hook
  const { coberturas: coberturasxId, isLoading, error } = useCoberturaxIdConsultorio(consultorio?.id);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      <div className={`
        bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg md:max-w-xl
        flex flex-col gap-6 relative
        max-h-[90vh] overflow-hidden // Asegura que el modal no se extienda más allá de la pantalla y oculta cualquier desbordamiento.
      `}>
        {/* Botón de cerrar en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
          aria-label="Cerrar modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 text-center mb-4 leading-tight">
          Ajustes del Consultorio
        </h2>

        {/* Contenedor principal para la información y las coberturas con scroll */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Este div maneja el scroll interno */}
          {consultorio ? (
            <div className="space-y-6 text-gray-700"> {/* Increased space-y for better separation */}
              {/* Sección de Información General del Consultorio */}
              <div className="border-b pb-4 border-gray-200"> {/* Separador visual */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Datos Generales</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg">Nombre del Consultorio:</p>
                    <p className="text-xl">{consultorio.nombre || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Tipo:</p>
                    <p className="text-xl">{consultorio.tipo === 'propio' ? 'Consultorio Particular' : `Centro Médico: ${consultorio.nombre}`}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Dirección:</p>
                    <p className="text-xl">{consultorio.direccion || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Localidad:</p>
                    <p className="text-xl">{consultorio.localidad || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Horario de Atención:</p>
                    <p className="text-xl">{consultorio.hora_inicio || 'N/A'} - {consultorio.hora_cierre || 'N/A'} Hs.</p>
                  </div>
                  {/* Otros campos de ajustes aquí si son necesarios */}
                </div>
              </div>


       
            </div>
          ) : (
            <p className="text-red-500 text-center">No se pudieron cargar los datos del consultorio.</p>
          )}
        </div> {/* Fin del div con scroll interno */}

        {/* Botón de cerrar ajustes */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="py-3 px-8 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md"
          >
            Cerrar Ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultorioSettingsModal;