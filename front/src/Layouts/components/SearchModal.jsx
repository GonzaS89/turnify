import React, { useState, useEffect } from 'react';
import { FaUserDoctor } from "react-icons/fa6";


const SearchModal = ({ showModal, onClose, profesionales, isLoading, error, enviarIds }) => {
    const [specialty, setSpecialty] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // Cambiado de 'date' a 'searchQuery'
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [message, setMessage] = useState("");

    // Efecto para filtrar doctores cuando cambian la especialidad o la consulta de búsqueda
    useEffect(() => {
        if (profesionales && profesionales.length > 0) {
            let currentFilteredDoctors = profesionales;

            if (specialty) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.especialidad === specialty);
            }

            // Nuevo filtro por nombre/apellido
            if (searchQuery) {
                const lowerCaseQuery = searchQuery.toLowerCase();
                currentFilteredDoctors = currentFilteredDoctors.filter(doc =>
                    doc.nombre.toLowerCase().includes(lowerCaseQuery) ||
                    doc.apellido.toLowerCase().includes(lowerCaseQuery)
                );
            }
            
            setFilteredDoctors(currentFilteredDoctors);
        } else if (!isLoading && !error) {
            setFilteredDoctors([]);
        }
    }, [specialty, searchQuery, profesionales, isLoading, error]); // Dependencias actualizadas

    const handleSearch = (e) => {
        e.preventDefault();
        setMessage("Búsqueda actualizada.");
        setTimeout(() => setMessage(''), 2000);
    };

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

                {/* Formulario de búsqueda dentro del modal */}
                <form
                    onSubmit={handleSearch}
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
                            htmlFor="searchQuery" // Cambiado de 'date' a 'searchQuery'
                            className="block text-base font-semibold text-gray-700 mb-2"
                        >
                            Nombre o Apellido
                        </label>
                        <input
                            type="text" // Cambiado de 'date' a 'text'
                            id="searchQuery" // Cambiado de 'date' a 'searchQuery'
                            className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
                            placeholder="Ej: Juan Pérez" // Nuevo placeholder
                            value={searchQuery} // Cambiado de 'date' a 'searchQuery'
                            onChange={(e) => setSearchQuery(e.target.value)} // Cambiado de 'setDate' a 'setSearchQuery'
                        />
                    </div>
                    <button
                        type="submit"
                        className="
                            w-full md:w-auto px-10 py-3
                            bg-blue-600 text-white rounded-xl font-bold text-lg
                            hover:bg-blue-700 transition-all duration-300 transform hover:scale-105
                            shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300
                        "
                    >
                        Aplicar Filtros
                    </button>
                </form>

                {/* Mensaje de estado de búsqueda dentro del modal */}
                {message && (
                    <div
                        className={`p-4 mb-8 rounded-lg text-white text-center font-semibold transition-all duration-300 ease-in-out transform scale-100 opacity-100 ${
                            message.includes("actualizada")
                                ? "bg-blue-500 shadow-md animate-fade-in"
                                : "bg-red-500 shadow-md animate-fade-in"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Loading, Error, or No Doctors Found messages dentro del modal */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors?.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className="
                                        bg-white rounded-2xl shadow-xl py-4 px-6 border border-gray-100
                                        transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-300
                                        group flex flex-col justify-between h-full cursor-pointer
                                    "
                                >
                                    <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center gap-4 text-center sm:text-left">
                                        <FaUserDoctor className='text-5xl'/>
                                        <div>
                                            <h3 className="text-2xl lg:text-base font-bold text-gray-900 leading-tight">
                                                Dr. {doctor.apellido}, {doctor.nombre}
                                            </h3>
                                            <p className="text-blue-600 font-semibold text-lg lg:text-sm mt-1">
                                                {doctor.especialidad}
                                            </p>
                                        </div>
                                    </div>

                                    {/* <p className="text-gray-700 mb-6 text-base leading-relaxed flex-grow">
                                        {doctor.bio}
                                    </p> */}
                                    {/* <ConsultorioInfo
                                        professionalId={doctor.id}
                                        enviarIds = {enviarIds}
                                    /> */}
                                    <button onClick={()=> enviarIds(doctor.id)}>Ver turnos</button>
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