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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
            <div className={`
                bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg lg:max-w-4xl // Ajuste: Usamos 'lg' para que la doble columna aparezca en pantallas más grandes
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

                            {/* Sección: Añadir Nueva Cobertura - Diseño de Dos Columnas */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Añadir Nueva Cobertura</h3>
                                <p className="text-gray-600 mb-4 text-sm">Busca y añade obras sociales o prepagas a tu lista.</p>

                                {/* Contenedor que se convierte en flex-row solo en 'lg' y más grandes */}
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Columna Izquierda: Input de Búsqueda */}
                                    <div className="lg:w-1/3 flex-shrink-0"> {/* Ocupa 1/3 del ancho en pantallas 'lg' y más grandes */}
                                        <label htmlFor="search-cobertura" className="sr-only">Buscar cobertura</label>
                                        <input
                                            type="text"
                                            id="search-cobertura"
                                            placeholder="Buscar por nombre o siglas..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        />
                                    </div>

                                    {/* Columna Derecha: Resultados de la Búsqueda */}
                                    <div className="lg:w-2/3 flex-grow"> {/* Ocupa 2/3 del ancho restante en pantallas 'lg' y más grandes */}
                                        {searchTerm ? ( // Mostrar resultados solo si hay un término de búsqueda
                                            <div className="bg-gray-50 rounded-lg shadow-inner border border-gray-100 p-3 max-h-48 overflow-y-auto custom-scrollbar">
                                                {availableCoberturasToAdd && availableCoberturasToAdd.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {availableCoberturasToAdd.map(cobertura => (
                                                            <li key={cobertura.id} className="flex items-center justify-between p-2 rounded-md hover:bg-blue-50 cursor-pointer transition-colors duration-150 border border-transparent hover:border-blue-200">
                                                                <span className="font-medium text-gray-800 text-base">{cobertura.siglas} - {cobertura.nombre}</span>
                                                                <button
                                                                    onClick={() => handleAddCobertura(cobertura.id, consultorioId)}
                                                                    className={`ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                                    aria-label={`Añadir ${cobertura.siglas} a mi consultorio`}
                                                                >
                                                                    Añadir
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500 text-sm text-center py-4">No se encontraron coberturas para "{searchTerm}" o ya están todas añadidas.</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg shadow-inner border border-gray-100">Ingresa un término de búsqueda para ver las coberturas disponibles.</p>
                                        )}
                                    </div>
                                </div>
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