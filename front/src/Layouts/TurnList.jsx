// src/components/TurnList.jsx
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { FaUser, FaInfoCircle, FaCalendarAlt, FaIdCard, FaShieldAlt, FaPhone, FaTimes, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import useAllCoberturas from '../../customHooks/useAllCoberturas';
import useProfesionalxId from '../../customHooks/useProfesionalxId';
import BorrarTurno from './components/BorrarTurno';
import BorrarTodosLosTurnosModal from './components/BorrarTodosLosTurnosModal';

const TurnList = ({ 
  profesionalId, 
  consultorioId, 
  onClose, 
  openModalHabilitarTurnos, 
  refreshTrigger, 
  tipoConsultorio, 
  handleActualizarTurnos 
}) => {
  const { turnos, isLoading, error } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas, isLoading: isLoadingCoberturas, error: errorCoberturas } = useAllCoberturas();
  const { profesional, isLoading: isLoadingProfesionales, error: errorProfesionales } = useProfesionalxId(profesionalId);

  const [showModalBorrarTurno, setShowModalBorrarTurno] = useState(false);
  const [IdTurnoSeleccionado, setIdTurnoSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const datesListRef = useRef(null);

  // Agrupar turnos por fecha
  const turnosAgrupados = turnos.reduce((acc, turno) => {
    const fecha = new Date(turno.fecha);
    const clave = fecha.toISOString().split('T')[0];
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(turno);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(turnosAgrupados).sort((a, b) => new Date(b) - new Date(a));

  // Seleccionar la primera fecha por defecto
  // useEffect(() => {
  //   if (fechasOrdenadas.length > 0 && !fechaSeleccionada) {
  //     setFechaSeleccionada(fechasOrdenadas[0]);
  //   }
  // }, [fechasOrdenadas, fechaSeleccionada]);

  // Scroll automático al centro en mobile
  useEffect(() => {
    if (fechaSeleccionada && datesListRef.current && window.innerWidth < 768) {
      requestAnimationFrame(() => {
        const button = datesListRef.current.querySelector(`[data-date="${fechaSeleccionada}"]`);
        if (button) {
          const container = datesListRef.current;
          const offset = button.offsetLeft - (container.offsetWidth / 2) + (button.offsetWidth / 2);
          container.scrollTo({ left: offset, behavior: 'smooth' });
        }
      });
    }
  }, [fechaSeleccionada]);

  const handleBorrarTurno = (id) => {
    setIdTurnoSeleccionado(id);
    setShowModalBorrarTurno(true);
  };

  const coberturaElegida = (value) => {
    if (value === 'particular') return 'Particular';
    if (!isLoadingCoberturas && !errorCoberturas && coberturas) {
      const cobertura = coberturas.find(c => c.id == value);
      return cobertura ? cobertura.siglas : 'Particular';
    }
    return 'Cargando...';
  };

  const medico = profesional?.[0];
  const nombreMedico = `${medico?.nombre || ''} ${medico?.apellido || ''}`.trim();

  const formatearHora = (hora) => {
    if (!hora) return '';
    const [horaParte, minutoParte] = hora.split(':');
    return `${horaParte.padStart(2, '0')}:${minutoParte.padStart(2, '0')}`;
  };

  const handleAgregarTurnoClick = () => {
    openModalHabilitarTurnos();
  };

  const overallLoading = isLoading || isLoadingCoberturas;
  const overallError = error || errorCoberturas;

  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] = useState(false);

  const handleBorrarTodosLosTurnos = () => {
    setShowModalBorrarTodosLosTurnos(true);
    console.log('clickeado borrar todos los turnos', consultorioId, profesionalId, fechaSeleccionada);
  }

 const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Ejecutar al montar
    handleResize();

    // Escuchar cambios en el tamaño
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModificarEstadoTurno = async (idTurno) => {


    try {
      const response = await axios.put(`http://localhost:3006/api/modificarestadoturno/${idTurno}`);
      if (response.status === 200) {
        console.log('Estado del turno actualizado correctamente:', response.data);
        handleActualizarTurnos();
      } else {
        console.error('Error al actualizar el estado del turno:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error al actualizar el estado del turno:', error);
      alert('Error al actualizar el estado del turno. Por favor, intenta nuevamente más tarde.');
    }
  };

  if (overallLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaCalendarAlt className="w-5 h-5 text-blue-500" />
              Tu Agenda
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando tu agenda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (overallError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Tu Agenda</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FaTimes className="w-5 h-5 text-blue-500" />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-medium">Error al cargar</p>
            <p className="text-gray-500 mt-2">{overallError.message || "Intenta nuevamente más tarde."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[200] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaCalendarAlt className="w-5 h-5 text-blue-500" />
              Tu Agenda
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-gray-400 w-8 h-8" />
            </div>
            <p className="text-gray-600 mb-6">No tenés turnos agendados aún.</p>
            <div className="space-y-3">
              <button
                onClick={handleAgregarTurnoClick}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FaPlus /> Habilitar Turnos
              </button>
              <button
                onClick={onClose}
                className="w-full px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const turnosDeLaFecha = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[150] xl:p-4 animate-fade-in">
      <div className="bg-white xl:rounded-2xl shadow-2xl w-screen xl:max-w-6xl h-screen xl:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-500" />
            {tipoConsultorio === 'propio' ? 'Tu Agenda' : `Agenda de ${nombreMedico}`}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleActualizarTurnos}
              className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-opacity-30 rounded-lg text-sm transition text-white font-medium"
              aria-label="Actualizar turnos"
            >
              <TbRefresh className="w-4 h-4" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button
              onClick={handleAgregarTurnoClick}
              className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition text-white"
              aria-label="Agregar turnos"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-200 p-1.5 rounded-full hover:bg-white hover:bg-opacity-20 transition"
              aria-label="Cerrar"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          {/* Sidebar de fechas */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">Fechas Disponibles</h4>
            </div>
            <div
              ref={datesListRef}
              className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto px-4 py-3 gap-3 custom-scrollbar"
            >
              {fechasOrdenadas.map((fecha) => {
                const turnos = turnosAgrupados[fecha];
                const ocupados = turnos.filter(t => t.estado === 'reservado').length;
                const disponibles = turnos.length - ocupados;
                const isSelected = fecha === fechaSeleccionada;

                return (
                  <button
                    key={fecha}
                    data-date={fecha}
                    onClick={() => setFechaSeleccionada(fecha)}
                    className={`min-w-36 lg:min-w-0 p-4 rounded-xl text-left transition-all duration-200 text-sm ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="font-semibold">
                      {(() => {
                        const [year, month, day] = fecha.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return isNaN(date.getTime())
                          ? 'Fecha inválida'
                          : date.toLocaleDateString('es-AR', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                            });
                      })()}
                    </div>
                    <div
                      className={`text-xs font-bold mt-1 px-2 py-1 rounded-full inline-block ${
                        isSelected
                          ? 'bg-white text-blue-600'
                          : disponibles > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {disponibles} disp.
                    </div>
                    {turnos.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {turnos.map((t) => (
                          <div
                            key={t.id}
                            className={`w-3 h-3 rounded-full ${
                              t.estado === 'reservado' ? 'bg-red-400' : 
                              t.estado === 'disponible' ? 'bg-green-400' : 'bg-blue-400'}
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalles de turnos */}
          <div className="w-full lg:w-2/3 overflow-y-auto p-6 relative">
          <div className='flex items-center justify-between mb-4'>
          <h4 className="text-xl font-semibold text-gray-800">
  {fechaSeleccionada
    ? (() => {
        const [year, month, day] = fechaSeleccionada.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return isNaN(date.getTime())
          ? 'Fecha inválida'
          : date.toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
      })()
    : 'Seleccioná una fecha en el panel izquierdo'}
</h4>
            <button 
              className='bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm'
              onClick={()=> handleBorrarTodosLosTurnos()}
              >{isSmallScreen ? <FaTrashAlt className='w-4 h-4' /> : 'Borrar Todos los Turnos'}
              </button>
          </div>
            

          {!fechaSeleccionada ? (
  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
    <FaInfoCircle className="text-blue-400 text-4xl mx-auto mb-4" />
    <p className="text-gray-600 mb-4 text-lg">Seleccioná una fecha para ver los turnos.</p>
  </div>
) : turnosDeLaFecha.length === 0 ? (
  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
    <FaInfoCircle className="text-yellow-400 text-4xl mx-auto mb-4" />
    <p className="text-gray-500 mb-5">No hay turnos para este día.</p>
    <button
      onClick={handleAgregarTurnoClick}
      className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 mx-auto text-sm"
    >
      <FaPlus /> Agregar Turnos
    </button>
  </div>
) : 
  // Renderizar turnos...

             (
              <div className="space-y-4">
                {turnosDeLaFecha
                  .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                  .map((turno, idx) => (
                    <div
                      key={turno.id}
                      className={`p-5 rounded-xl border-l-4 transition-all ${
                        turno.estado === 'reservado'
                          ? 'bg-red-50 border-red-500' :
                        turno.estado === 'disponible' ? 'bg-green-50 border-green-500'  
                          : 'bg-blue-100 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-lg ${
                              turno.estado === 'reservado' ? 'text-red-600' : 
                              turno.estado === 'disponible' ? 'text-green-600' : 'text-blue-600'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          {turno.hora && (
                            <span className="text-gray-700 font-medium">{formatearHora(turno.hora)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                              turno.estado === 'reservado'
                                ? 'bg-red-100 text-red-800' :
                              turno.estado === 'disponible'
                              ? 'bg-green-100 text-green-800' : 
                              'bg-white text-blue-800'
                            }`}
                          >
                            {turno.estado === 'reservado' ? 'Ocupado' : 
                            turno.estado === 'disponible' ? 'Disponible' : 'Finalizado'}
                          </span>
                          {turno.estado === 'disponible' && (
                            <button
                              onClick={() => handleBorrarTurno(turno.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              aria-label="Eliminar turno"
                            >
                              <FaTrashAlt className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {turno.estado === 'reservado' && (
                          <button className='px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-semibold rounded-lg  text-xs lg:text-sm hover:from-blue-800 hover:to-cyan-600 duration-200 ease-in-out transition-all'
                
                            onClick={() => 
                              handleModificarEstadoTurno(turno.id)
                            }>
                            Marcar como finalizado
                          </button>  
                        )}
                      </div>

                      {turno.DNI ? (
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center gap-3">
                            <FaUser className="text-blue-500 w-4 h-4" />
                            <span className="font-medium">
                              {turno.apellido_paciente}, {turno.nombre_paciente}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaIdCard className="text-gray-600 w-4 h-4" />
                            <span className='font-medium'>{turno.DNI}</span>
                          </div>
                          {turno.cobertura && (
                            <div className="flex items-center gap-3">
                              <FaShieldAlt className="text-purple-500 w-4 h-4" />
                              <span>
                                <span className='font-medium'>{coberturaElegida(turno.cobertura)}</span>
                              </span>
                            </div>
                          )}
                          {turno.telefono && (
                            <div className="flex items-center gap-3">
                              <FaPhone className="text-orange-500 w-4 h-4" />
                              <span className='font-medium'>{turno.telefono}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <FaInfoCircle className="w-4 h-4" />
                          <span className="text-sm">Este turno está disponible para agendar.</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para borrar turno */}
      {showModalBorrarTurno && (
        <BorrarTurno
          idTurno={IdTurnoSeleccionado}
          onClose={() => setShowModalBorrarTurno(false)}
          actualizarTurnos={handleActualizarTurnos}
        />
      )}

      {/* Modal para borrar todos los turnos */}
      {showModalBorrarTodosLosTurnos && (
        <BorrarTodosLosTurnosModal
          idConsultorio={consultorioId}
          idProfesional={profesionalId}
          fecha={fechaSeleccionada}
          onClose={() => setShowModalBorrarTodosLosTurnos(false)}
          actualizarTurnos={handleActualizarTurnos}
          resetearFecha={() => setFechaSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default TurnList;