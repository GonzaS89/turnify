import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd } from 'react-icons/fa'; // Iconos para este panel
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos'; // Importa el hook para turnos

// --- Componente Modal Reutilizable (Idealmente, en un archivo separado como src/components/Modal.jsx) ---
const CustomModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null; // No renderiza nada si el modal no está abierto

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};
// --- Fin del Componente Modal Reutilizable ---

const PanelConsultorioPropio = ({ consultorioData: consultorio }) => {
  // Estados para el modal de Habilitar Turnos
  const [showEnableTurnsModal, setShowEnableTurnsModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfTurns, setNumberOfTurns] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nuevo estado para el modal de la Agenda
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  // Estado para controlar las secciones de fechas colapsables en la agenda
  const [openAgendaSections, setOpenAgendaSections] = useState({});

  const { profesional, isLoading, error } = useProfesionalxIdConsultorio(consultorio.id);
  const medico = profesional ? profesional[0] : null;

  // Hook para obtener los turnos del profesional y consultorio
  const { 
    turnos, 
    isLoading: isLoadingTurnos, 
    error: errorTurnos, 
    refetchTurnos // Para actualizar los turnos después de habilitarlos
  } = useProfessionalConsultorioTurnos(medico?.id, consultorio?.id);

  // Efecto para abrir la sección de hoy por defecto cuando el modal de agenda se abre y los turnos están cargados
  useEffect(() => {
    if (showAgendaModal && !isLoadingTurnos && turnos && medico?.id) {
      const todayString = new Date().toISOString().split('T')[0];
      setOpenAgendaSections(prev => ({ ...prev, [todayString]: true })); // Abre la sección de hoy
    }
    // Si el modal se cierra, resetea las secciones abiertas
    if (!showAgendaModal) {
      setOpenAgendaSections({});
    }
  }, [showAgendaModal, isLoadingTurnos, turnos, medico?.id]);

  // Manejo de carga y errores iniciales
  if (!consultorio) {
    return <p className="text-red-500 text-center py-4">Error: Datos del consultorio no disponibles.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-700 text-center py-4">Cargando datos del médico...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">Error al cargar datos del médico: {error.message}</p>;
  }

  // --- Funciones para el modal de Habilitar Turnos ---
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setNumberOfTurns('');
  };

  const handleNumberOfTurnsChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setNumberOfTurns(value.toString());
  };

  const handleEnableTurns = async () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha.");
      return;
    }
    if (!numberOfTurns || parseInt(numberOfTurns) <= 0) {
      alert("Por favor, ingresa un número válido de turnos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3006/api/habilitarturnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Considera añadir un encabezado de Autorización si tu API está protegida
          // 'Authorization': `Bearer ${tuTokenDeAuth}`
        },
        body: JSON.stringify({
          consultorioId: consultorio?.id,
          profesionalId: medico?.id,
          fecha: selectedDate, // Formato 'YYYY-MM-DD' esperado por Date input
          cantidadTurnos: parseInt(numberOfTurns)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al habilitar turnos');
      }

      const result = await response.json();
      alert(result.message || `Se han habilitado ${numberOfTurns} turnos para el ${selectedDate}.`);

      setShowEnableTurnsModal(false);
      setSelectedDate('');
      setNumberOfTurns('');
      
      // Refresca la lista de turnos en la agenda después de habilitar
      refetchTurnos(); 

    } catch (apiError) {
      console.error('Error al habilitar turnos:', apiError);
      alert(`Hubo un error al habilitar los turnos: ${apiError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helpers para la Agenda ---
  const formatearFechaSQL = (fecha) => {
    const date = new Date(fecha);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses son 0-index
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    // Crea una fecha arbitraria para usar toLocaleTimeString
    const date = new Date(`2000-01-01T${timeString}`); 
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Función para agrupar turnos por fecha
  const groupAppointmentsByDate = (appointments) => {
    const grouped = {};
    if (appointments && Array.isArray(appointments)) {
      appointments.forEach(appt => {
        // Asegúrate de que 'fecha' y 'hora' existan en tu objeto de turno
        // Y que 'fecha' sea en formato 'YYYY-MM-DD'
        const dateKey = appt.fecha; 
        if (dateKey) {
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(appt);
        }
      });
    }
    return grouped;
  };

  // Agrupamos los turnos y los ordenamos por fecha
  const groupedAppointments = groupAppointmentsByDate(turnos);
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
    return new Date(a) - new Date(b); // Ordena las fechas cronológicamente
  });

  // Función para alternar la visibilidad de una sección de fecha en la agenda
  const toggleSection = (dateKey) => {
    setOpenAgendaSections(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-green-100">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">
        Panel de Control
      </h2>

      {medico && (
        <>
          <p className="text-gray-700 text-xl font-medium mb-2">
            Dr./Dra. {medico.nombre} {medico.apellido}
          </p>
          {medico.especialidad && (
            <p className="text-gray-500 text-lg">
              {medico.especialidad}
            </p>
          )}
          {medico.matricula && (
            <p className="text-gray-500 text-lg mb-6">
              {medico.matricula}
            </p>
          )}
        </>
      )}

      <p className="text-gray-600 mb-6 text-lg sm:text-xl">
        Gestión simplificada para tu consultorio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Card: Mi Agenda - Abre el modal de Agenda */}
        <div
          className="bg-green-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => setShowAgendaModal(true)} // Abre el modal de la agenda
        >
          <FaCalendarAlt className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Mi Agenda</h3>
          <p className="text-gray-600 text-sm">Organiza tus turnos diarios.</p>
          <span className="text-green-700 font-bold text-2xl mt-2">
            {/* Muestra el número de turnos cargados */}
            {isLoadingTurnos ? '...' : (turnos ? turnos.length : '0')}
          </span>
          <p className="text-xs text-gray-500">turnos próximos</p>
        </div>

        {/* Card: Mis Pacientes */}
        <div className="bg-yellow-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaUserMd className="text-yellow-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Mis Pacientes</h3>
          <p className="text-gray-600 text-sm">Accede a tus fichas de pacientes.</p>
          <span className="text-yellow-700 font-bold text-2xl mt-2">87</span>
          <p className="text-xs text-gray-500">pacientes registrados</p>
        </div>
      </div>

      {/* Otras secciones específicas para consultorio propio */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowEnableTurnsModal(true)}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Habilitar Turnos
          </button>
          <button className="flex-1 bg-green-200 text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-300 transition-colors duration-200">
            Ver Historial
          </button>
        </div>
      </div>

      {/* Modal para Habilitar Turnos (Tu código existente) */}
      {showEnableTurnsModal && (
        <CustomModal 
          isOpen={showEnableTurnsModal} 
          onClose={() => setShowEnableTurnsModal(false)} 
          title="Habilitar Turnos para una Fecha"
        >
          <p className="text-gray-600 mb-4">Selecciona la fecha y la cantidad de turnos a habilitar.</p>

          <div className="mb-4">
            <label htmlFor="turn-date" className="block text-gray-700 font-semibold mb-2">
              Selecciona una fecha:
            </label>
            <input
              type="date"
              id="turn-date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]} // Establecer fecha mínima a hoy
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {selectedDate && ( // Mostrar este input solo si se ha seleccionado una fecha
            <div className="mb-6">
              <label htmlFor="num-turns" className="block text-gray-700 font-semibold mb-2">
                ¿Cuántos turnos quieres habilitar?
              </label>
              <input
                type="number"
                id="num-turns"
                value={numberOfTurns}
                onChange={handleNumberOfTurnsChange}
                min="1" // Mínimo 1 turno
                placeholder="Ej: 10"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowEnableTurnsModal(false);
                setSelectedDate('');
                setNumberOfTurns(''); // Limpiar al cancelar
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
              disabled={isSubmitting} // Deshabilitar mientras se envía
            >
              Cancelar
            </button>
            <button
              onClick={handleEnableTurns}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              disabled={isSubmitting} // Deshabilitar mientras se envía
            >
              {isSubmitting ? 'Habilitando...' : 'Habilitar'}
            </button>
          </div>
        </CustomModal>
      )}

      {/* Nuevo Modal para Mi Agenda */}
      <CustomModal
        isOpen={showAgendaModal}
        onClose={() => setShowAgendaModal(false)}
        title="Mi Agenda de Citas"
      >
        <div className="p-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Turnos Próximos</h3>
            <button
              // Puedes conectar este botón a un formulario/modal para añadir un nuevo turno
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Nuevo Turno
            </button>
          </div>

          {/* Manejo de estados de carga y error para los turnos */}
          {isLoadingTurnos ? (
            <p className="text-gray-600 text-center py-8">Cargando turnos de la agenda...</p>
          ) : errorTurnos ? (
            <p className="text-red-500 text-center py-8">Error al cargar turnos: {errorTurnos.message}</p>
          ) : sortedDates.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay turnos agendados en el futuro cercano.</p>
          ) : (
            <div className="space-y-4">
              {sortedDates.map(dateKey => (
                <div key={dateKey} className="border border-gray-200 rounded-lg shadow-sm">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() => toggleSection(dateKey)}
                  >
                    <h4 className="font-semibold text-lg text-gray-800">
                      {formatearFechaSQL(dateKey)} ({groupedAppointments[dateKey].length} turnos)
                    </h4>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-200 ${
                        openAgendaSections[dateKey] ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {/* Contenido de los turnos para la fecha, visible solo si la sección está abierta */}
                  {openAgendaSections[dateKey] && (
                    <ul className="divide-y divide-gray-100">
                      {groupedAppointments[dateKey].map(appointment => (
                        <li key={appointment.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-semibold text-gray-800 text-md">
                              {formatTimeForDisplay(appointment.hora)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.motivo} - Paciente:  {appointment.apellido_paciente}, {appointment.nombre_paciente || 'Paciente sin asignar'}
                            </p>
                            {appointment.consultorio && (
                              <p className="text-xs text-gray-500 mt-1">Consultorio: {appointment.consultorio.nombre}</p>
                            )}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full
                            ${appointment.estado === 'reservado' ? 'bg-green-100 text-green-800' :
                              appointment.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'}`
                          }>
                            {appointment.estado}
                          </span>
                          <div className="flex gap-2 ml-4">
                              <button className="text-blue-500 hover:text-blue-700" title="Ver Detalles">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                              </button>
                              <button className="text-red-500 hover:text-red-700" title="Cancelar Turno">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAgendaModal(false)}
            className="mt-6 bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto"
          >
            Cerrar Agenda
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default PanelConsultorioPropio;