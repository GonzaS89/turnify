import { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSubmit, coberturas }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        selectedOption: '', // Para la cobertura médica
    });

    const [options, setOptions] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [errorOptions, setErrorOptions] = useState(null);

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
                    setOptions([]);
                }
            } else {
                setIsLoadingOptions(false);
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
    }, [isOpen, coberturas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
            <div className={`
                bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg 
                flex flex-col gap-6 relative
            `}>
                {/* Close Button at the Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                    aria-label="Cerrar modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2 leading-tight">
                    Confirmá tus Datos
                </h2>
                <p className="text-gray-600 text-center mb-4 text-base sm:text-lg">
                    Por favor, completá tu información para confirmar la reserva de tu turno.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                            required
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 mb-2">
                            Apellido
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                            required
                        />
                    </div>

                    {/* DNI */}
                    <div>
                        <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-2">
                            DNI
                        </label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                            required
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="block w-full p-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                            required
                        />
                    </div>

                    {/* Select Field para Coberturas */}
                    <div>
                        <label htmlFor="selectedOption" className="block text-sm font-semibold text-gray-700 mb-2">
                            Selecciona tu Cobertura Médica
                        </label>
                        {isLoadingOptions ? (
                            <p className="text-blue-600 text-base text-center font-medium animate-pulse py-4 bg-blue-50 rounded-xl shadow-inner border border-blue-100">Cargando coberturas...</p>
                        ) : errorOptions ? (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center text-sm shadow-md">
                                <p className="font-bold mb-1">¡Ups! Error al cargar las coberturas:</p>
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
                                    className="block w-full p-3 border border-gray-300 rounded-xl text-base text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer pr-10 shadow-sm hover:border-gray-400"
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
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
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