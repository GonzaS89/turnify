// src/components/ConsultorioInfo.jsx
import React from 'react';
import useProfessionalConsultorios from '../../../customHooks/useProfessionalConsultorios'; // Asegúrate que la ruta sea correcta

const ConsultorioInfo = ({ professionalId, enviarIdConsultorio, enviarIdProfesional }) => {
    const { consultorios, isLoading, error } = useProfessionalConsultorios(professionalId);

    const tapButton = (id) => {
        enviarIdConsultorio(id);
        enviarIdProfesional(professionalId); // Enviar también el ID del profesional
    }   

    // --- Estados de Carga y Error ---
    if (isLoading) {
        return (
            <div className="mt-4 border-t pt-4 border-gray-100 text-center">
                <p className="text-blue-500 text-sm animate-pulse">Cargando lugares de atención...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-4 border-t pt-4 border-gray-100 text-center">
                <p className="text-red-500 text-sm">Error al cargar lugares de atención. Intenta de nuevo.</p>
            </div>
        );
    }

    // --- Si no hay consultorios ---
    if (consultorios.length === 0) {
        return (
            <div className="mt-4 border-t pt-4 border-gray-100 text-center">
                <p className="text-gray-500 text-sm italic">Este profesional no tiene consultorios asociados.</p>
            </div>
        );
    }

    // --- Renderizado de Consultorios ---
    return (
        <div className="mt-4 border-t pt-4 border-gray-100 flex flex-col items-center">
            {/* <h4 className="font-semibold text-base text-gray-700 mb-4">
                {consultorios.length > 1 ? 'Lugares de Atención' : 'Lugar de Atención'}
            </h4> */}
            <div className="w-full space-y-3">
                    <h4 className='text-center font-bold'>Ver turnos</h4>
                 {/* Contenedor para espaciado entre consultorios */}
                {consultorios.map(consultorio => (
                    <button
                        key={consultorio.id}
                        className="
                            bg-gradient-to-br from-blue-500 to-blue-700 text-white
                            p-3 rounded-lg shadow-md
                            text-center transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                            flex flex-col items-center justify-center w-full
                        "
                        onClick={()=>tapButton(consultorio.id)}
                    >
                        {/* Tipo de consultorio */}
                        <p className="text-lg font-bold capitalize mb-1 leading-tight">
                            {consultorio.tipo === 'propio' ? 'Consultorio Particular' : `${consultorio.tipo} ${consultorio.nombre}`}
                        </p>
                       
                        <p className="text-sm">
                            {consultorio.direccion}, {consultorio.localidad}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ConsultorioInfo;