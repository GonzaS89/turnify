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
    async function handleRemoveCobertura(coberturaMedicaId,consultorioId) {
        
        if (!coberturaMedicaId) {
            alert('Error: ID de cobertura médica no disponible para eliminar.');
            return;
        }

        if (!consultorioId) {
            alert('Error: ID de consutorio no disponible para eliminar.');
            return;
        }
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta cobertura de tu consultorio?')) {
            return;
        }

        try {
            // ¡¡¡CAMBIO CLAVE AQUÍ!!!
            // La URL debe incluir el consultorioId y el endpoint es /api/consultorios/:consultorioId/coberturas/:coberturaMedicaId
            const response = await axios.delete(
                `http://localhost:3006/api/borrarCoberturaDeConsulotorio/${coberturaMedicaId}/${consultorioId}`
            );

            alert(response.data.message || 'Cobertura eliminada exitosamente.');
            // Una vez que la operación es exitosa en el backend, refetchActiveCoberturas()
            // recargará la lista, haciendo que la UI se actualice.
            refetch();

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
            refetch(); // Recarga los datos para actualizar la UI
            setSearchTerm(''); // Limpia la búsqueda

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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
            <div className={`
                bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg md:max-w-xl
                flex flex-col gap-6 relative
                max-h-[90vh] overflow-hidden
            `}>
                {/* Botón de cerrar en la esquina superior derecha */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                    aria-label="Cerrar modal de coberturas"
                >
                    <IoIosClose className="w-6 h-6" />
                </button>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 text-center mb-4 leading-tight">
                    Gestionar Coberturas Médicas
                </h2>

                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-4">
                    {overallLoading ? (
                        <p className="text-blue-600 text-base text-center font-medium animate-pulse py-4 bg-blue-50 rounded-xl shadow-inner border border-blue-100">Cargando coberturas...</p>
                    ) : overallError ? (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center text-sm shadow-md">
                            <p className="font-bold mb-1">¡Ups! Error al cargar las coberturas:</p>
                            <p>{overallError.message || "Por favor, inténtalo de nuevo más tarde."}</p>
                        </div>
                    ) : (
                        <>
                            {/* Sección: Coberturas Activas */}
                            <div className="pb-4 border-b border-gray-200 mb-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Coberturas Activas</h3>
                                {activeCoberturas && activeCoberturas.length > 0 ? (
                                    <ul className="flex flex-wrap gap-3">
                                        {activeCoberturas.map((cobertura) => (
                                            <li key={cobertura.id} className="
                                                flex items-center justify-between text-gray-800 bg-gray-100 rounded-full pl-4 pr-2 py-1 shadow-sm
                                                hover:bg-gray-200 transition-colors duration-200
                                            ">
                                                <span className="font-medium text-base">{cobertura.siglas}</span>
                                                <button
                                                    onClick={() => handleRemoveCobertura(cobertura.id, consultorioId)}
                                                    className="ml-2 text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full"
                                                    aria-label={`Eliminar ${cobertura.siglas}`}
                                                >
                                                    <IoIosClose className="w-5 h-5" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-center py-4 bg-gray-50 rounded-xl shadow-inner border border-gray-100">No se han configurado coberturas para este consultorio.</p>
                                )}
                            </div>

                            {/* Sección: Añadir Nueva Cobertura */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Añadir Nueva Cobertura</h3>
                                <p className="text-gray-600 mb-4 text-sm">Busca y añade obras sociales o prepagas a tu lista.</p>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar cobertura..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Resultados de la búsqueda */}
                                {searchTerm && (
                                    <div className="bg-gray-50 rounded-lg shadow-inner border border-gray-100 p-3 max-h-48 overflow-y-auto custom-scrollbar">
                                        {filteredAllCoberturas && filteredAllCoberturas.length > 0 ? (
                                            <ul className="space-y-2">
                                                {filteredAllCoberturas.map(cobertura => (
                                                    <li key={cobertura.id} className={`${coberturaIncluded(cobertura.id) ? 'pointer-events-none' : ''} flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150`}>
                                                        <span>{cobertura.siglas} - {cobertura.nombre}</span>
                                                        <button
                                                            onClick={() => handleAddCobertura(cobertura.id, consultorioId)}
                                                            className={`"ml-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600" ${coberturaIncluded(cobertura.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {coberturaIncluded(cobertura.id) ? 'Añadida' : 'Añadir'}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center">No se encontraron coberturas disponibles para añadir o ya están todas activas.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div> {/* Fin del div con scroll interno */}

                {/* Botón para cerrar el modal */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onClose}
                        className="py-3 px-8 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md"
                    >
                        Cerrar Gestión de Coberturas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GestionCoberturas;