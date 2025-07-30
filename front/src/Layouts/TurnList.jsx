// src/components/TurnList.jsx
import { useState, useEffect, useRef } from 'react';
import { FaUser, FaInfoCircle, FaCalendarAlt, FaIdCard, FaShieldAlt, FaPhone, FaTimes, FaPlus } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import useAllCoberturas from '../../customHooks/useAllCoberturas';
import useProfesionalxId from '../../customHooks/useProfesionalxId';

const TurnList = ({ profesionalId, consultorioId, onClose, openModalHabilitarTurnos, refreshTrigger, tipoConsultorio, handleActualizarTurnos }) => {
  const [actualizarTurnos, setActualizarTurnos] = useState(refreshTrigger);
  const { turnos, isLoading, error } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas, isLoading: isLoadingCoberturas, error: errorCoberturas } = useAllCoberturas();
  const { profesional, isLoading: isLoadingProfesionales, error: errorProfesionales } = useProfesionalxId(profesionalId);

  const coberturaElegida = (value) => {
    if (value === 'particular') return 'Particular';
    if (!isLoadingCoberturas && !errorCoberturas && coberturas) {
      const cobertura = coberturas.find(c => c.id == value);
      return cobertura ? cobertura.siglas : 'Particular';
    }
    return 'Cargando...';
  };

  const medico = profesional[0];
  const nombreMedico = `${medico?.nombre} ${medico?.apellido}`;
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

  const formatearHora = ( hora ) => {
    if (!hora) return '';
    const [horaParte, minutoParte] = hora.split(':');
    const horaFormateada = `${horaParte.padStart(2, '0')}:${minutoParte.padStart(2, '0')}`;
    return horaFormateada;
  }

  // Establecer fecha por defecto
  useEffect(() => {
    if (fechasOrdenadas.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(fechasOrdenadas[0]);
    }
  }, [fechasOrdenadas, fechaSeleccionada]);

  // Scroll al centro en mobile
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

  const handleAgregarTurnoClick = () => {
    openModalHabilitarTurnos();
  };


  if (isLoading || isLoadingCoberturas) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center xl:p-6 z-[150]">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-xs">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-700 text-lg">Cargando tu agenda...</p>
        </div>
      </div>
    );
  }

  if (error || errorCoberturas) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-[150]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500 text-sm">
            {error?.message || errorCoberturas?.message}
          </p>
          <button
            onClick={onClose}
            className="mt-5 px-5 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-[150]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Tu Agenda</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
              <FaCalendarAlt className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-600 text-sm mb-6">No tenés turnos agendados aún.</p>
            <button
              onClick={handleAgregarTurnoClick}
              className="w-full px-5 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm mb-3"
            >
              <FaPlus /> Habilitar Turnos
            </button>
            <button
              onClick={onClose}
              className="w-full px-5 py-3 bg-blue-500 text-white rounded-lg font-semibold text-sm"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const turnosDeLaFecha = turnosAgrupados[fechaSeleccionada] || [];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center xl:p-4 z-[60]">
      <div className="bg-white xl:rounded-2xl shadow-2xl w-screen xl:max-w-6xl max-h-[100vh] xl:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
            {tipoConsultorio === 'propio' ? 'Tu Agenda' : `Agenda de ${nombreMedico}`}
          </h3>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleActualizarTurnos}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm transition"
            >
              <TbRefresh size={18} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button
              onClick={handleAgregarTurnoClick}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm transition"
            >
              <FaPlus size={16} />
              <span className="hidden sm:inline">Agregar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          {/* Fechas - Sidebar */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Fechas</h4>
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
                    className={`min-w-36 lg:min-w-0 p-4 rounded-xl text-left transition-all duration-200 text-sm ${isSelected
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                      }`}
                  >
                    <div className="font-semibold text-sm">
                      {(() => {
                        const [year, month, day] = fecha.split('-').map(Number);
                        const date = new Date(year, month - 1, day); // Mes es 0-indexed
                        return date.toLocaleDateString('es-AR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                        });
                      })()}
                    </div>
                    <div
                      className={`text-xs font-bold mt-1 px-2 py-1 rounded-full inline-block ${isSelected
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
                            className={`w-3 h-3 rounded-full ${t.estado === 'reservado' ? 'bg-red-400' : 'bg-green-400'
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

          {/* Detalles */}
          <div className="w-full lg:w-2/3 overflow-y-auto p-5 sm:p-6">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
  {fechaSeleccionada ? (
    (() => {
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
  ) : (
    'Seleccioná una fecha'
  )}
</h4>

            {turnosDeLaFecha.length === 0 ? (
              <div className="text-center py-10">
                <FaInfoCircle className="text-yellow-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 mb-5">No hay turnos para este día.</p>
                <button
                  onClick={handleAgregarTurnoClick}
                  className="px-5 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto text-sm"
                >
                  <FaPlus /> Agregar Turnos
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {turnosDeLaFecha
                  .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                  .map((turno, idx) => (
                    <div
                      key={turno.id}
                      className={`p-5 rounded-xl border-l-4 transition-all ${turno.estado === 'reservado'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-green-50 border-green-500'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-lg ${turno.estado === 'reservado' ? 'text-red-600' : 'text-green-600'
                              }`}
                          >
                            #{idx + 1}
                          </span>
                          {turno.hora && <span className="text-gray-600 font-medium">{formatearHora(turno.hora)}</span>}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${turno.estado === 'reservado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                            }`}
                        >
                          {turno.estado === 'reservado' ? 'Ocupado' : 'Disponible'}
                        </span>
                      </div>

                      {turno.DNI ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-3">
                            <FaUser className="text-blue-500" />
                            <span className="font-medium">
                              {turno.apellido_paciente}, {turno.nombre_paciente}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaIdCard className="text-gray-600" />
                            <span>DNI: {turno.DNI}</span>
                          </div>
                          {turno.cobertura && (
                            <div className="flex items-center gap-3">
                              <FaShieldAlt className="text-purple-500" />
                              <span>
                                Cobertura: <strong>{coberturaElegida(turno.cobertura)}</strong>
                              </span>
                            </div>
                          )}
                          {turno.telefono && (
                            <div className="flex items-center gap-3">
                              <FaPhone className="text-orange-500" />
                              <span>Tel: {turno.telefono}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <FaInfoCircle />
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
    </div>
  );
};

export default TurnList;