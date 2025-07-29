// src/components/TurnList.jsx
import { useState, useEffect, useRef } from 'react';
import { FaUser, FaInfoCircle, FaCalendarAlt, FaIdCard, FaShieldAlt, FaPhone, FaTimes, FaPlus } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import useAllCoberturas from '../../customHooks/useAllCoberturas';
import useProfesionalxId from '../../customHooks/useProfesionalxId';

const TurnList = ({ profesionalId, consultorioId, onClose, openModalHabilitarTurnos, refreshTrigger, tipoConsultorio }) => { // Añadido onAgregarTurno
  const [actualizarTurnos, setActualizarTurnos] = useState(refreshTrigger)
  const { turnos, isLoading, error } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, actualizarTurnos);
  const { coberturas, isLoading: isLoadingCoberturas, error: errorCoberturas } = useAllCoberturas();
  const { profesional, isLoading:isLoadingProfesionales, error: errorProfesionales} = useProfesionalxId(profesionalId)
  
  const coberturaElegida = (value) => {
    if (value === 'particular') {
      return 'Particular';
    }
    if (!isLoadingCoberturas && !errorCoberturas && coberturas) {
      const cobertura = coberturas.find(c => c.id == value);
      return cobertura ? cobertura.siglas : 'Particular';
    }
    return 'Cargando...';
  };

  const medico = profesional[0];

  const nombreMedico = `${medico?.nombre} ${medico?.apellido}`

  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const datesListRef = useRef(null);

  // Agrupar turnos por fecha
  const turnosAgrupados = turnos.reduce((acumulador, turno) => {
    const fechaTurno = new Date(turno.fecha);
    const año = fechaTurno.getFullYear();
    const mes = (fechaTurno.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaTurno.getDate().toString().padStart(2, '0');
    const claveFecha = `${año}-${mes}-${dia}`;
    if (!acumulador[claveFecha]) {
      acumulador[claveFecha] = [];
    }
    acumulador[claveFecha].push(turno);
    return acumulador;
  }, {});

  const fechasOrdenadas = Object.keys(turnosAgrupados).sort((a, b) => new Date(b) - new Date(a));

  // Establecer la primera fecha como seleccionada por defecto
  useEffect(() => {
    if (fechasOrdenadas.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(fechasOrdenadas[0]);
    }
  }, [fechasOrdenadas, fechaSeleccionada]);

  // Efecto para hacer scroll al centro en dispositivos móviles
  useEffect(() => {
    if (fechaSeleccionada && datesListRef.current) {
      requestAnimationFrame(() => {
        const selectedButton = datesListRef.current.querySelector(`[data-date="${fechaSeleccionada}"]`);
        if (selectedButton) {
          if (window.innerWidth < 640) { // Solo en mobile
            selectedButton.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest'
            });
          }
        }
      });
    }
  }, [fechaSeleccionada]);

  // Función para manejar el clic en "Agregar Turno"
  const handleAgregarTurnoClick = () => {
    openModalHabilitarTurnos()
  };

  const handleActualizarTurnos = () => {{
    setActualizarTurnos(1)
    setTimeout(() => {
      setActualizarTurnos(0)
    }, );
  }} 



  // Estados de carga y error
  if (isLoading || isLoadingCoberturas) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-700 text-xl">Cargando tu agenda...</p>
        </div>
      </div>
    );
  }

  if (error || errorCoberturas) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500">
            Error al cargar turnos o coberturas: {error?.message || errorCoberturas?.message}. 
            Por favor, intenta de nuevo.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Mensaje cuando no hay turnos
  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Tu Agenda de Turnos</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-600 text-lg mb-6">
              ¡Parece que no tienes turnos agendados en este momento!
            </p>
            {/* Botón para agregar turnos cuando no hay ninguno */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleAgregarTurnoClick}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Habilitar Turnos
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Volver al Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const turnosDeLaFechaSeleccionada = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">{tipoConsultorio === 'propio' ? 'Tu Agenda de Turnos' : `Agenda de turnos de Doc. ${nombreMedico}`}</h3>
          <div className="flex items-center space-x-2">
            
            {/* Botón Agregar Turno en el header */}
            <button
              onClick={handleActualizarTurnos}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              <TbRefresh className="mr-2" />
              <span className="hidden sm:inline">Buscar actualizaciones</span>
              <span className="sm:hidden">Actualizar</span>
            </button>
            <button
              onClick={handleAgregarTurnoClick}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              <FaPlus className="mr-2" />
              <span className="hidden sm:inline">Habilitar Turnos</span>
              <span className="sm:hidden">Agregar</span>
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden z-50">
          {/* Lista de Fechas - Sidebar */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-700">Fechas con Turnos</h4>
            </div>
            <div 
              className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto flex-grow custom-scrollbar"
              ref={datesListRef}
            >
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 p-2 min-w-max lg:min-w-0">
                {fechasOrdenadas.map((claveFecha) => {
                  const turnosDelDia = turnosAgrupados[claveFecha];
                  const turnosOcupados = turnosDelDia.filter(t => t.estado === 'reservado').length;
                  const totalTurnos = turnosDelDia.length;
                  const turnosDisponibles = totalTurnos - turnosOcupados;
                  const hayDisponibles = turnosDisponibles > 0;
                  const isSelected = claveFecha === fechaSeleccionada;
                  return (
                    <button
                      key={claveFecha}
                      onClick={() => setFechaSeleccionada(claveFecha)}
                      className={`flex-shrink-0 min-w-[140px] lg:min-w-0 flex flex-col items-center lg:items-start p-3 rounded-xl text-center lg:text-left transition-all duration-200 ${
                        isSelected 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                      }`}
                      data-date={claveFecha}
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full mb-2">
                        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {new Date(claveFecha + 'T00:00:00').toLocaleDateString('es-AR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold mt-1 lg:mt-0 ${
                          isSelected
                            ? (hayDisponibles ? 'bg-white text-blue-600' : 'bg-white text-red-600')
                            : (hayDisponibles ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                        }`}>
                          {turnosDisponibles} disp.
                        </span>
                      </div>
                      {totalTurnos > 0 && (
                        <div className="flex space-x-1">
                          {turnosDelDia
                            .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                            .map(turno => (
                              <div
                                key={turno.id}
                                className={`w-2 h-2 rounded-full ${
                                  turno.estado === 'reservado' ? 'bg-red-400' : 'bg-green-400'
                                }`}
                                title={`${turno.hora || 'Sin hora'} - ${turno.estado === 'reservado' ? 'Ocupado' : 'Disponible'}`}
                              ></div>
                            ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detalles de Turnos - Main Content */}
          <div className="w-full lg:w-2/3 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-6">
                Turnos para {fechaSeleccionada ? new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-AR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'ninguna fecha'}
              </h4>
              {turnosDeLaFechaSeleccionada.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FaInfoCircle className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 mb-6">No hay turnos para esta fecha.</p>
                  {/* Botón para agregar turnos cuando no hay en la fecha seleccionada */}
                  <button
                    onClick={handleAgregarTurnoClick}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center mx-auto"
                  >
                    <FaPlus className="mr-2" />
                    Agregar Turnos para esta fecha
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {turnosDeLaFechaSeleccionada
                    .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                    .map((turno, index) => (
                      <div
                        key={turno.id}
                        className={`p-5 rounded-xl border-l-4 transition-all duration-200 ${
                          turno.estado === 'reservado' 
                            ? 'bg-red-50 border-red-500' 
                            : 'bg-green-50 border-green-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <span className={`text-lg font-bold mr-2 ${
                              turno.estado === 'reservado' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              #{index + 1}
                            </span>
                            {turno.hora && (
                              <span className="text-gray-600 font-medium">
                                {turno.hora}
                              </span>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            turno.estado === 'reservado' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {turno.estado === 'reservado' ? 'Ocupado' : 'Disponible'}
                          </span>
                        </div>
                        {turno.DNI ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <FaUser className="mr-3 text-blue-500 flex-shrink-0" />
                              <span className="font-medium">
                                {turno.apellido_paciente}, {turno.nombre_paciente}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaIdCard className="mr-3 text-gray-600 flex-shrink-0" />
                              <span>DNI: {turno.DNI}</span>
                            </div>
                            {turno.cobertura && (
                              <div className="flex items-center">
                                <FaShieldAlt className="mr-3 text-purple-500 flex-shrink-0" />
                                <span>
                                  Cobertura: <span className="font-semibold">{coberturaElegida(turno.cobertura)}</span>
                                </span>
                              </div>
                            )}
                            {turno.telefono && (
                              <div className="flex items-center">
                                <FaPhone className="mr-3 text-orange-500 flex-shrink-0" />
                                <span>Tel: {turno.telefono}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <FaInfoCircle className="mr-2 text-yellow-500 flex-shrink-0" />
                            <span>Este turno está disponible para agendar.</span>
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
    </div>
  );
};

export default TurnList;