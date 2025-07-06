import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, onEdit, formData, coberturasOptions, selectedTurno, profesional, consultorio, ordenTurno }) => {
    if (!isOpen) return null;

    // Buscar el nombre completo de la cobertura médica usando el ID
    const selectedCobertura = coberturasOptions.find(
        option => option.id === formData.selectedOption
    );

    const formatearFechaSQL = (fecha) => {
        const date = new Date(fecha);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-6 border border-blue-100 transform scale-95 animate-scale-in">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 text-center mb-4 tracking-tight">
                    Confirma tu Reserva
                </h2>

                <p className="text-gray-600 text-center mb-4 text-md">
                    Por favor, revisa cuidadosamente los detalles antes de finalizar.
                </p>

                {/* Información del Turno y Profesional/Consultorio */}
                {selectedTurno && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-4 shadow-inner">
                        <p className="text-lg font-bold text-blue-700 mb-2">Detalles de la Cita:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-base">
                            <p><span className="font-semibold text-blue-600">Fecha:</span> {formatearFechaSQL(selectedTurno.fecha)}</p>
                            <p><span className="font-semibold text-blue-600">Orden:</span> {ordenTurno}° turno</p>
                            <p className="col-span-full"><span className="font-semibold text-blue-600">Con quién:</span> Dr/a {profesional ? `${profesional.nombre} ${profesional.apellido}` : 'No disponible'}</p>
                            <p className="col-span-full"><span className="font-semibold text-blue-600">Especialidad:</span> {profesional ? profesional.especialidad : 'No disponible'}</p>
                            <p className="col-span-full"><span className="font-semibold text-blue-600">Dónde:</span> {consultorio ? (consultorio.tipo === 'propio' ? 'Consultorio Particular' : `Centro médico ${consultorio.nombre}`) : 'No disponible'}</p>
                            <p className="col-span-full"><span className="font-semibold text-blue-600">Dirección:</span> {consultorio ? `${consultorio.direccion}, ${consultorio.localidad}` : 'No disponible'}</p>
                        </div>
                    </div>
                )}

                {/* Datos del Paciente */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 shadow-inner">
                    <p className="text-lg font-bold text-gray-800 mb-2">Tus Datos:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-base">
                        <p><span className="font-semibold text-gray-700">Nombre:</span> {formData.nombre}</p>
                        <p><span className="font-semibold text-gray-700">Apellido:</span> {formData.apellido}</p>
                        <p><span className="font-semibold text-gray-700">DNI:</span> {formData.dni}</p>
                        <p><span className="font-semibold text-gray-700">Teléfono:</span> {formData.telefono}</p>
                        <p className="col-span-full">
                            <span className="font-semibold text-gray-700">Cobertura Médica:</span>
                            {formData.selectedOption}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="py-3 px-7 bg-blue-50 border border-blue-400 text-blue-700 font-bold rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        Editar Datos
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="py-3 px-7 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-full hover:from-blue-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
