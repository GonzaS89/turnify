import React, { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSubmit, coberturas }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        selectedOption: '', // Para la cobertura médica
    });

    // Las opciones ahora provienen directamente de la prop 'coberturas'
    const [options, setOptions] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true); // Controla el estado de carga de las coberturas
    const [errorOptions, setErrorOptions] = useState(null); // Controla errores al procesar coberturas

    useEffect(() => {
        if (isOpen) {
            if (coberturas) {
                if (Array.isArray(coberturas)) {
                    setOptions(coberturas);
                    setIsLoadingOptions(false);
                    setErrorOptions(null);
                } else {
                    console.error("La prop 'coberturas' no es un array:", coberturas);
                    setErrorOptions("Las opciones de cobertura no están en el formato correcto.");
                    setIsLoadingOptions(false);
                    setOptions([]); // Asegura que 'options' sea un array vacío
                }
            } else {
                // Si 'coberturas' es null/undefined al abrir el modal, puedes decidir si es un error
                // o si esperas que se cargue de alguna otra forma.
                // Por ahora, lo tratamos como "no cargado" o "sin datos disponibles".
                setIsLoadingOptions(false); // No hay carga activa si no hay prop
                setErrorOptions("No se proporcionaron opciones de cobertura.");
                setOptions([]);
            }
            // Resetear el formulario cada vez que se abre el modal
            setFormData({
                nombre: '',
                apellido: '',
                dni: '',
                telefono: '',
                selectedOption: '',
            });
        }
    }, [isOpen, coberturas]); // Depende de isOpen y coberturas

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Pasa los datos del formulario al componente padre
        // El reset del formulario y el cierre del modal se manejan en onSubmit del padre
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-6">
                    Formulario de Usuario
                </h2>

                {/* Se ha eliminado la sección que mostraba selectedTurno */}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* DNI */}
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                            DNI
                        </label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Select Field para Coberturas */}
                    <div>
                        <label htmlFor="selectedOption" className="block text-sm font-medium text-gray-700 mb-1">
                            Selecciona tu Cobertura Médica
                        </label>
                        {isLoadingOptions ? (
                            <p className="text-blue-600 text-base text-center font-medium animate-pulse">Cargando coberturas...</p>
                        ) : errorOptions ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
                                <p className="font-semibold">Error al cargar las coberturas:</p>
                                <p>{errorOptions}</p>
                                <p className="mt-2 text-xs">Por favor, intenta de nuevo más tarde o contacta al soporte.</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    id="selectedOption"
                                    name="selectedOption"
                                    value={formData.selectedOption}
                                    onChange={handleChange}
                                    className="block w-full p-3 border border-gray-300 rounded-lg text-base text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer pr-10"
                                    required
                                >
                                    <option value="" disabled>Elige una cobertura</option>
                                    <option value={'Particular'} >Particular</option>
                                    {Array.isArray(options) && options.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.siglas} - {option.cobertura}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Confirmar datos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
