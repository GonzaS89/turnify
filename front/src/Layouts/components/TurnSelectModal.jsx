import { useState } from "react";

// IMPORTACION DE CUSTOM HOOKS //

import useProfessionalConsultorioTurnos from "../../../customHooks/useProfessionalConsultorioTurnos";

// IMPORTACION DE ICONOS //

import { PiCalendarCheckBold, PiCalendarXBold } from "react-icons/pi";


const TurnSelectModal = ({ consultorio, idConsultorio, idProfesional, enviarTurnoYOrden }) => {

    // CARGA DE CUSTOM HOOKS

    const { turnos, isLoading: isLoadingTurnos, error: errorTurnos } = useProfessionalConsultorioTurnos(idProfesional, idConsultorio);

    // Para depuración, puedes ver los IDs en la consola
    console.log("ID Consultorio:", idConsultorio, "ID Profesional:", idProfesional);

    // DECLARACION DE ESTADOS
    // `fechaSeleccionada` almacenará la fecha elegida por el usuario en el selector.
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');

    // DECLARACION DE FUNCIONES

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        // `getMonth()` es 0-indexed (0 para enero, 11 para diciembre), por eso se suma 1.
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const turnosFiltrados =
        fechaSeleccionada ? turnos.filter(turno => turno.fecha === fechaSeleccionada)
            : turnos;

    const handleFechaChange = (event) => {
        setFechaSeleccionada(event.target.value);
        console.log("Fecha seleccionada:", event.target.value);
    };

    const fechasUnicas = [...new Set(turnos?.map(turno => turno.fecha))]
        // El filtro compara las cadenas de fecha 'YYYY-MM-DD'.
        // Esta comparación funciona correctamente para ordenar fechas cronológicamente.
        .filter(fecha => fecha >= getTodayDate())
        // Ordena las fechas de forma ascendente (la más antigua primero)
        .sort();

    const formatearFechaSQL = (fecha) => {

        const date = new Date(fecha);

 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-index
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Función que se ejecuta cuando el usuario selecciona un turno disponible.
     * Llama a la función `enviarTurnoYOrden` que se pasa como prop desde el componente padre.
     * @param {Object} turno - El objeto del turno seleccionado por el usuario.
     * @param {number} index - El índice del turno en la lista filtrada, usado para calcular la 'orden'.
     */
    const handleSelectTurno = (turno, index) => {
        // `index + 1` se usa para obtener un número de orden basado en 1, no en 0.
        enviarTurnoYOrden(turno, index + 1);
        // Importante: Este modal no se cierra aquí. Se espera que el componente padre
        // maneje el cierre de este modal o la superposición con otro (como `UserFormModal`).
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6">
            <div className={`bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full flex flex-col justify-center items-center gap-6 max-h-[90vh] lg:h-auto`}>
                {/* Sección de Información del Consultorio */}
                {consultorio && (
                    <div className="text-center pb-4 border-b border-gray-200">
                        <p className="text-xl sm:text-2xl font-extrabold text-blue-700">
                            {/* Muestra el nombre del consultorio o "Consultorio particular" */}
                            {consultorio.tipo === 'propio' ? 'Consultorio particular' : `Centro médico ${consultorio.nombre}`}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {consultorio.direccion || 'Dirección no disponible'}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {consultorio.localidad || 'Localidad no disponible'}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {consultorio.inicio} a {consultorio.cierre}Hs.
                        </p>
                    </div>
                )}

        

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2">Elegí una fecha</h2>

                {/* Manejo de estados de carga y error al obtener los turnos */}
                {isLoadingTurnos ? (
                    <p className="text-blue-600 text-base sm:text-lg text-center font-medium animate-pulse">Cargando turnos...</p>
                ) : errorTurnos ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm sm:text-base">
                        <p className="font-semibold">Error al cargar los turnos:</p>
                        <p>{errorTurnos.message}</p>
                    </div>
                ) : (
                    <>
                        {/* Selector de fechas */}
                        <div className="relative">
                            <select
                                name="fecha"
                                id="fecha-select"
                                onChange={handleFechaChange}
                                className="block w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer pr-10"
                                defaultValue="" // Asegura que la opción "Selecciona una fecha" sea la predeterminada al cargar el modal
                            >
                                <option value="" disabled>Selecciona una fecha disponible</option>
                                {/* Mapea solo las fechas únicas a partir de hoy, ya filtradas y ordenadas por `fechasUnicas` */}
                                {fechasUnicas?.map((fecha, index) => (
                                    <option key={index} value={fecha}>
                                        {formatearFechaSQL(fecha)}
                                    </option>
                                ))}
                            </select>
                            {/* Icono de flecha para el selector */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </>
                )}

                {/* Título que muestra la fecha seleccionada para los turnos */}
                {fechaSeleccionada && (
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-700 text-center mt-2 sm:mt-4 border-b pb-2">
                        Turnos para el {formatearFechaSQL(fechaSeleccionada)}
                    </h3>
                )}

                {/* Contenedor desplazable para la lista de turnos disponibles */}
                <div className="flex-grow overflow-y-auto max-h-[250px] sm:max-h-[350px] pr-2 w-full">
                    {fechaSeleccionada ? (
                        // Si hay una fecha seleccionada, muestra los turnos filtrados para esa fecha
                        turnosFiltrados.length > 0 ? (
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4  mt-4">
                                {turnosFiltrados.map((turno, index) => (
                                 
                                        <div key={turno.id} className="w-full flex justify-center">
                                        <button
                                            onClick={() => handleSelectTurno(turno, index)}
                                            // Clases de Tailwind para estilos condicionales basados en el estado del turno
                                            className={`flex flex-col justify-between items-center p-3 sm:p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out w-full
                                             ${turno.estado === 'disponible'
                                                    ? 'bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 cursor-pointer'
                                                    : 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                                                }`}
                                            // Deshabilita el botón si el turno no está disponible
                                            disabled={turno.estado !== 'disponible'}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                            {turno.estado === 'disponible' ? (
                                                
                                                <PiCalendarCheckBold className="text-5xl sm:text-6xl text-green-600 mb-1 sm:mb-2" />
                                            ) : (
                                                <PiCalendarXBold className="text-5xl sm:text-6xl text-gray-500 mb-1 sm:mb-2" />
                                            )} 
                                             <p className="text-base sm:text-lg font-bold">#{index + 1}</p>
                                            </div>
                                            {/* Icono condicional basado en el estado del turno */}
                                            
                                           
                                            {/* <p className={`text-xs sm:text-sm ${turno.estado === 'disponible' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                                                {turno.estado === 'disponible' ? 'Disponible' : 'Reservado'}
                                            </p> */}
                                        </button>
                                    </div>
                                    
                                    
                                ))}
                            </div>
                        ) : (
                            // Mensaje si no hay turnos disponibles para la fecha seleccionada
                            <p className="text-gray-600 text-base sm:text-lg text-center mt-6 sm:mt-8">
                                No hay turnos disponibles para esta fecha. ¡Intentá con otra!
                            </p>
                        )
                    ) : (
                        // Mensaje inicial para que el usuario seleccione una fecha
                        <p className="text-gray-600 text-base sm:text-lg text-center mt-6 sm:mt-8">
                            Por favor, selecciona una fecha para ver los turnos disponibles.
                        </p>
                    )}
                </div>

           
            

                {/* Botón para cerrar el modal */}
                <button
                    // Este botón no tiene una función `onClick` aquí, se asume que el componente padre
                    // que renderiza este modal le pasará una prop para manejar el cierre.
                    className="mt-4 sm:mt-6 w-full py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-base sm:text-lg"
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default TurnSelectModal;
