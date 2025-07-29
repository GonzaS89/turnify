import React, { useState, useEffect } from 'react';
import useCoberturaxIdConsultorio from '../../../customHooks/useCoberturaxIdConsultorio';
import useAllCoberturas from '../../../customHooks/useAllCoberturas';
import { IoIosClose } from "react-icons/io";
import axios from 'axios';

const GestionCoberturas = ({ isOpen, onClose, consultorioId }) => {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');

    const { coberturas: activeCoberturas, isLoading, error, refetch} = useCoberturaxIdConsultorio(consultorioId);
    const { coberturas: allCoberturas, isLoading: isLoadingAllCoberturas, error: errorAllCoberturas } = useAllCoberturas();

    const coberturaIncluded = id => activeCoberturas?.some(cobertura => cobertura.id === id);

    // Filtrar las coberturas activas y las disponibles para añadir según el término de búsqueda
    const filteredAllCoberturas = allCoberturas?.filter(cobertura =>
        cobertura.siglas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cobertura.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Las coberturas disponibles para añadir son aquellas que resultan de la búsqueda
    // y que NO están ya incluidas en las coberturas activas del consultorio.
    const activeCoverageIds = new Set(activeCoberturas?.map(c => c.id));
    const availableCoberturasToAdd = filteredAllCoberturas?.filter(c => !activeCoverageIds.has(c.id));

    const overallLoading = isLoading || isLoadingAllCoberturas;
    const overallError = error || errorAllCoberturas;

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    // --- Función para eliminar una cobertura ---
    async function handleRemoveCobertura(coberturaMedicaId, consultorioId) {
        if (!coberturaMedicaId || !consultorioId) {
            alert('Error: IDs de cobertura médica o consultorio no disponibles para eliminar.');
            return;
        }

        if (!window.confirm('¿Estás seguro de que quieres eliminar esta cobertura de tu consultorio?')) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:3006/api/borrarCoberturaDeConsulotorio/${coberturaMedicaId}/${consultorioId}`
            );

            alert(response.data.message || 'Cobertura eliminada exitosamente.');
            refetch(); // Recargar la lista de coberturas activas
        } catch (apiError) {
            console.error('Error al realizar la petición DELETE:', apiError);
            let errorMessage = 'Hubo un error al eliminar la cobertura.';
            if (apiError.response && apiError.response.data && apiError.response.data.message) {
                errorMessage = apiError.response.data.message;
            } else if (apiError.message) {
                errorMessage = `Error de red o servidor: ${apiError.message}`;
            }
            alert(errorMessage);
        }
    }

    // --- Función para añadir una cobertura ---
    async function handleAddCobertura(coberturaMedicaId, consultorioId) {
        if (!consultorioId) {
            alert('Error: ID de consultorio no disponible para añadir la cobertura.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3006/api/agregarCoberturaAlConsultorio/${coberturaMedicaId}/${consultorioId}`,
            );

            alert(response.data.message || 'Cobertura añadida exitosamente.');
            refetch(); // Recargar los datos para actualizar la UI
            setSearchTerm(''); // Limpiar la búsqueda para que el usuario vea la lista actualizada
        } catch (apiError) {
            console.error('Error al realizar la petición POST:', apiError);
            let errorMessage = 'Hubo un error al añadir la cobertura.';
            if (apiError.response && apiError.response.data && apiError.response.data.message) {
                errorMessage = apiError.response.data.message;
            } else if (apiError.message) {
                errorMessage = `Error de red o servidor: ${apiError.message}`;
            }
            alert(errorMessage);
        }
    }

    return (

            <>

              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col gap-5 max-h-[90vh] overflow-hidden animate-fade-up">
                  
      
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600 rounded-full text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Gestionar Coberturas Médicas</h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      aria-label="Cerrar modal"
                    >
                      <IoIosClose className="w-6 h-6" />
                    </button>
                  </div>
          
                  {/* Contenido principal con scroll */}
                  <div className="flex-grow overflow-y-auto px-6 pb-6 custom-scrollbar">
                    {overallLoading ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-gray-600 font-medium">Cargando coberturas...</p>
                      </div>
                    ) : overallError ? (
                      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="font-bold">Error al cargar las coberturas</p>
                        <p className="text-sm mt-1">{overallError.message || "Por favor, inténtalo más tarde."}</p>
                      </div>
                    ) : (
                      <>
                        {/* Coberturas Activas */}
                        <section className="mb-8">
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Coberturas Activas
                          </h3>
                          {activeCoberturas && activeCoberturas.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {activeCoberturas.map((cobertura) => (
                                <li
                                  key={cobertura.id}
                                  className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:bg-blue-100 transition-colors duration-200"
                                >
                                  <span className="font-semibold text-blue-800 text-sm">{cobertura.siglas}</span>
                                  <button
                                    onClick={() => handleRemoveCobertura(cobertura.id, consultorioId)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors duration-200"
                                    aria-label={`Eliminar ${cobertura.siglas}`}
                                  >
                                    <IoIosClose className="w-5 h-5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                              <p className="text-gray-500 text-sm">No hay coberturas activas en este consultorio.</p>
                            </div>
                          )}
                        </section>
          
                        {/* Añadir Nueva Cobertura */}
                        <section>
                          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Añadir Nueva Cobertura
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">Busca y añade obras sociales o prepagas a tu lista.</p>
          
                          <div className="flex flex-col lg:flex-row gap-5">
                            {/* Input de búsqueda */}
                            <div className="lg:w-1/3">
                              <input
                                type="text"
                                placeholder="Buscar por nombre o sigla..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                              />
                            </div>
          
                            {/* Resultados */}
                            <div className="lg:w-2/3">
                              {searchTerm ? (
                                <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto p-2">
                                  {availableCoberturasToAdd && availableCoberturasToAdd.length > 0 ? (
                                    <ul className="space-y-2">
                                      {availableCoberturasToAdd.map((cobertura) => (
                                        <li
                                          key={cobertura.id}
                                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100"
                                        >
                                          <div>
                                            <p className="font-medium text-gray-800">{cobertura.siglas}</p>
                                            <p className="text-xs text-gray-500">{cobertura.nombre}</p>
                                          </div>
                                          <button
                                            onClick={() => handleAddCobertura(cobertura.id, consultorioId)}
                                            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                          >
                                            Añadir
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-gray-500 text-sm text-center py-4">No se encontraron coberturas para "{searchTerm}".</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                  Comienza a escribir para buscar una cobertura.
                                </p>
                              )}
                            </div>
                          </div>
                        </section>
                      </>
                    )}
                  </div>
          
                  {/* Pie de página con botón */}
                  <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
          

        
            </>
          );
    
};

export default GestionCoberturas;