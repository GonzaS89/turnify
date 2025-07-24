import React, { useState, useEffect, useRef } from 'react';
import { FaUserDoctor } from "react-icons/fa6";

const SearchModal = ({ showModal, onClose, profesionales, isLoading, error, enviarIds }) => {
    const [specialty, setSpecialty] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const firstDoctorRef = useRef(null);

    // Función auxiliar para normalizar cadenas (quitar acentos)
    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    // Efecto para filtrar doctores y hacer scroll
    useEffect(() => {
        if (profesionales && profesionales.length > 0) {
            let currentFilteredDoctors = profesionales;
            if (specialty) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.especialidad === specialty);
            }
            if (searchQuery) {
                const normalizedQuery = normalizeString(searchQuery);
                currentFilteredDoctors = currentFilteredDoctors.filter(doc =>
                    normalizeString(doc.nombre).includes(normalizedQuery) ||
                    normalizeString(doc.apellido).includes(normalizedQuery)
                );
            }
            setFilteredDoctors(currentFilteredDoctors);
            // *** Lógica para el scroll a la primera coincidencia ***
            if (currentFilteredDoctors.length > 0 && firstDoctorRef.current) {
                // Usamos setTimeout para asegurar que el DOM se haya actualizado después del renderizado
                setTimeout(() => {
                    firstDoctorRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        } else if (!isLoading && !error) {
            setFilteredDoctors([]);
        }
    }, [specialty, searchQuery, profesionales, isLoading, error]);

    if (!showModal) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 min-w-full lg:max-w-6xl max-h-[90vh] overflow-y-auto relative animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold z-10"
                >
                    &times;
                </button>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                        Encuentra a tu Especialista
                    </h2>
                </div>

                <form className="bg-gray-50 p-4 md:p-6 rounded-2xl shadow-inner mb-8 border border-gray-100 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <div className="flex flex-col">
                        <label htmlFor="specialty" className="text-sm font-semibold text-gray-700 mb-1">
                            Especialidad
                        </label>
                        <select
                            id="specialty"
                            name="specialty"
                            className="p-2 md:p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                        >
                            <option value="">Todas las especialidades</option>
                            {[...new Set(profesionales?.map((doc) => doc.especialidad))]
                                .sort()
                                .map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="searchQuery" className="block text-sm font-semibold text-gray-700 mb-1">
                            Nombre o Apellido
                        </label>
                        <input
                            type="text"
                            id="searchQuery"
                            className="p-2 md:p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
                            placeholder="Ej: Juan Pérez"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* <button
                        type="submit"
                        className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-xl font-bold text-base md:text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap"
                    >
                        Aplicar Filtros
                    </button> */}
                </form>

                <div className="mt-6">
                    {isLoading && (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-blue-600 text-xl">Cargando profesionales...</span>
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-red-600 text-xl py-16 bg-white rounded-xl shadow-lg border border-red-100">
                            Error:{" "}
                            {error.message ||
                                "No se pudo cargar la información de los profesionales."}
                        </p>
                    )}

                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDoctors?.length > 0 ? (
                                filteredDoctors.map((doctor, index) => (
                                    <div
                                        key={doctor.id}
                                        ref={index === 0 ? firstDoctorRef : null}
                                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-blue-300 flex flex-col h-full"
                                    >
                                        <div className="flex items-start space-x-4 mb-4">
                                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FaUserDoctor className='text-2xl text-white' />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {doctor.apellido}, {doctor.nombre}
                                                </h3>
                                                <p className="text-blue-600 font-semibold text-sm mt-1">
                                                    {doctor.especialidad}
                                                </p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Mat: {doctor.matricula}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => enviarIds(doctor.id)}
                                            className="mt-auto w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center"
                                        >
                                            Ver turnos
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center">
                                    <p className="text-gray-600 text-lg">
                                        No se encontraron médicos con los criterios de búsqueda. Por favor, intenta con otra especialidad o nombre.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
