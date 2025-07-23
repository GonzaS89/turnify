import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
import { FaUserDoctor } from "react-icons/fa6";


const SearchModal = ({ showModal, onClose, profesionales, isLoading, error, enviarIds }) => {
    const [specialty, setSpecialty] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    
    // Crea una referencia para la primera card del doctor
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
                        behavior: 'smooth', // Desplazamiento suave
                        block: 'start'      // Alinea el inicio del elemento con el inicio del área visible
                    });
                }, 100); // Pequeño retraso para asegurar que el elemento esté en el DOM
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
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                    Encuentra a tu Especialista
                </h2>

                <form
                    className="
                        flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8
                        bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-inner mb-12
                        border border-gray-100
                    "
                >
                    <div className="flex flex-col items-start w-full md:w-1/2">
                        <label
                            htmlFor="specialty"
                            className="text-base font-semibold text-gray-700 mb-2"
                        >
                            Especialidad
                        </label>
                        <select
                            id="specialty"
                            name="specialty"
                            className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
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
                    <div className="flex flex-col items-start w-full md:w-1/2">
                        <label
                            htmlFor="searchQuery"
                            className="block text-base font-semibold text-gray-700 mb-2"
                        >
                            Nombre o Apellido
                        </label>
                        <input
                            type="text"
                            id="searchQuery"
                            className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
                            placeholder="Ej: Juan Pérez"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* <button
                        type="submit"
                        className="
                            w-full md:w-auto px-10 py-3
                            bg-blue-600 text-white rounded-xl font-bold text-lg
                            hover:bg-blue-700 transition-all duration-300 transform hover:scale-105
                            shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300
                        "
                    >
                        Aplicar Filtros
                    </button> */}
                </form>

                {isLoading && (
                    <p className="text-center text-blue-600 text-xl py-16 bg-white rounded-xl shadow-lg border border-blue-100 animate-pulse">
                        Cargando profesionales...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-600 text-xl py-16 bg-white rounded-xl shadow-lg border border-red-100">
                        Error:{" "}
                        {error.message ||
                            "No se pudo cargar la información de los profesionales."}
                    </p>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredDoctors?.length > 0 ? (
                            filteredDoctors.map((doctor, index) => (
                                <div
                                key={doctor.id}
                                // Asigna la ref solo a la primera card
                                ref={index === 0 ? firstDoctorRef : null}
                                className="
                                    bg-white rounded-3xl shadow-xl py-8 px-8 border border-gray-100
                                    transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400
                                    group flex flex-col justify-between h-full cursor-pointer
                                    relative overflow-hidden
                                "
                                >
                                    {/* Efecto de brillo de fondo */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-150"></div>
                                    
                                    <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center gap-6 text-center sm:text-left">
                                        {/* Ícono con múltiples efectos */}
                                        <div className="
                                            bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 
                                            p-5 rounded-2xl shadow-xl
                                            transform transition-all duration-300
                                            group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl
                                            flex items-center justify-center
                                            relative
                                        ">
                                            {/* Efecto de aura */}
                                            <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                                            <FaUserDoctor className='text-4xl text-white relative z-10'/>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                                {doctor.apellido}, {doctor.nombre}
                                            </h3>
                                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 font-extrabold text-lg mt-2 tracking-wide">
                                                {doctor.especialidad}
                                            </p>
                                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-700 font-extrabold text-sm mt-2 tracking-wide">
                                                {doctor.matricula}
                                            </p>

                                        </div>
                                    </div>           
                                    <button
                                        onClick={() => enviarIds(doctor.id)}
                                        className="
                                            mt-6 w-full py-4 px-6 rounded-2xl
                                            bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800
                                            text-white font-black text-lg tracking-wide
                                            shadow-2xl hover:shadow-3xl
                                            hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900
                                            hover:scale-[1.05] hover:-translate-y-2
                                            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
                                            transition-all duration-300 ease-out
                                            flex items-center justify-center gap-3
                                            border-2 border-transparent hover:border-white/30
                                            relative overflow-hidden
                                        "
                                    >
                                        {/* Efecto de brillo móvil */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                                        
                                        <span className="relative z-10 tracking-wider">Ver turnos</span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-6 w-6 relative z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-125" 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                                No se encontraron médicos con los criterios de búsqueda. Por
                                favor, intenta con otra especialidad o nombre.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;