import { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from "react-icons/fa"; // Importa el icono de check

const ConfirmationModal = ({ isOpen, onClose, onEdit, formData, coberturasOptions, selectedTurno, profesional, consultorio, ordenTurno }) => {
    // Estados internos para la lógica de la API y la UI
    const [isSubmitting, setIsSubmitting] = useState(false); // Indica si la reserva está en proceso
    const [submitError, setSubmitError] = useState(null); // Almacena mensajes de error de la API
    const [isSuccess, setIsSuccess] = useState(false); // Controla si la reserva fue exitosa
    const [confirmedTurnoId, setConfirmedTurnoId] = useState(null); // Guarda el ID del turno confirmado

    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) return null;

    // Función para formatear la fecha
    const formatearFechaSQL = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Función que realiza la llamada a la API para reservar el turno
    const reservarTurno = async () => {
        setIsSubmitting(true); // Activa el estado de carga
        setSubmitError(null); // Limpia cualquier error previo
        setIsSuccess(false); // Reinicia el estado de éxito

    
        const turnoId = selectedTurno?.turno_id; 


        try {
            const response = await axios.put(`http://localhost:3006/api/reservarturno/${turnoId}`, {
                nombre_paciente: formData.nombre,
                apellido_paciente: formData.apellido,
                DNI: formData.dni,
                cobertura: formData.selectedOption,
                telefono: formData.telefono,
                estado: 'reservado' // Estado fijo para la reserva
            });

            console.log('Turno actualizado:', response.data);
            setIsSuccess(true); // Marca la reserva como exitosa
            setConfirmedTurnoId(response.data.updatedId); 

            // Opcional: Cerrar el modal de éxito automáticamente después de unos segundos
            setTimeout(() => {
                onCloseAndReset(); // Llama a la función de cierre y reseteo
                onClose()
                window.location.reload(); // Recarga la página para reflejar los cambios
                window.scrollTo(0, 0); // Vuelve al inicio de la página
            }, 3000); // Cierra después de 3 segundos

        } catch (error) {
            console.error('Error al actualizar el turno:', error);
            const errorMessage = error.response && error.response.data && error.response.data.message
                                 ? error.response.data.message
                                 : 'Error al conectar con el servidor o actualizar el turno.';
            setSubmitError(errorMessage); // Muestra el error en este modal
        } finally {
            setIsSubmitting(false); // Desactiva el estado de carga
        }
    };

    // Función para cerrar el modal y resetear su estado interno
    const onCloseAndReset = () => {
        setIsSuccess(false); // Reinicia el estado de éxito
        setConfirmedTurnoId(null); // Limpia el ID del turno confirmado
        setSubmitError(null); // Limpia cualquier error
        
        // onClose(); // La prop onClose del padre se llama a través de turnoReservado
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50 backdrop-blur-md p-2 sm:p-4 animate-fade-in"> {/* Ajuste de padding */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-4 sm:gap-6 border border-blue-100 transform scale-95 animate-scale-in
                          max-h-[90vh] overflow-y-auto"> {/* Altura máxima y scroll */}
                {isSuccess ? (
                    // Contenido para el estado de éxito
                    <div className="text-center py-4"> {/* Ajuste de padding */}
                        <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mb-3 mx-auto" /> {/* Tamaño de icono */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-800 text-center mb-3 tracking-tight"> {/* Tamaño de fuente */}
                            ¡Reserva Confirmada!
                        </h2>
                        <div className="text-center text-green-700 text-base sm:text-lg mb-4"> {/* Tamaño de fuente */}
                            <p className="mb-2">Tu turno ha sido reservado exitosamente.</p>
                            <p className="mt-4">Recibirás una confirmación por Whatsapp.</p>
                        </div>
                        <button
                            type="button"
                            onClick={onCloseAndReset} // Cierra el modal y resetea el estado interno
                            className="py-2 px-5 bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold rounded-full hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base" 
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    // Contenido para el estado de confirmación inicial
                    <>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-center mb-3 tracking-tight"> {/* Tamaño de fuente */}
                            Confirma tu Reserva
                        </h2>

                        <p className="text-gray-600 text-center mb-3 text-sm sm:text-base"> {/* Tamaño de fuente */}
                            Por favor, revisa cuidadosamente los detalles antes de finalizar.
                        </p>

                        {/* Información del Turno y Profesional/Consultorio */}
                        {selectedTurno && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-3 shadow-inner"> {/* Ajuste de padding */}
                                <p className="text-base sm:text-lg font-bold text-blue-700 mb-2">Detalles de la Cita:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-gray-700 text-sm sm:text-base"> {/* Ajuste de gap y tamaño de fuente */}
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
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 shadow-inner"> {/* Ajuste de padding */}
                            <p className="text-base sm:text-lg font-bold text-gray-800 mb-2">Tus Datos:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-gray-700 text-sm sm:text-base"> {/* Ajuste de gap y tamaño de fuente */}
                                <p><span className="font-semibold text-gray-700">Nombre:</span> {formData?.nombre || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-700">Apellido:</span> {formData?.apellido || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-700">DNI:</span> {formData?.dni || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-700">Teléfono:</span> {formData?.telefono || 'N/A'}</p>
                                <p className="col-span-full">
                                    <span className="font-semibold text-gray-700">Cobertura Médica:</span>
                                    {formData?.selectedOption || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Mensaje de error de envío */}
                        {submitError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-xs sm:text-sm mt-3"> {/* Ajuste de padding y tamaño de fuente */}
                                <p>{submitError}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4"> {/* Ajuste de gap y margen */}
                            <button
                                type="button"
                                onClick={onEdit}
                                className="py-2 px-5 bg-blue-50 border border-blue-400 text-blue-700 font-bold rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-base" 
                                disabled={isSubmitting}
                            >
                                Editar Datos
                            </button>
                            <button
                                type="button"
                                onClick={reservarTurno} 
                                className="py-2 px-5 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold rounded-full hover:from-blue-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConfirmationModal;
