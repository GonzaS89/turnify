import { useState, useEffect, useRef } from 'react';
import { FaUser, FaInfoCircle, FaCalendarAlt, FaIdCard, FaShieldAlt, FaPhone } from 'react-icons/fa';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';
import useAllCoberturas from '../../customHooks/useAllCoberturas';

const TurnList = ({ profesionalId, consultorioId, onClose }) => {
  const { turnos, isLoading, error } = useProfessionalConsultorioTurnos(profesionalId, consultorioId);
  const { coberturas, isLoading: isLoadingCoberturas, error: errorCoberturas } = useAllCoberturas();

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

  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const datesListRef = useRef(null);

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

  useEffect(() => {
    if (fechasOrdenadas.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(fechasOrdenadas[0]);
    }
  }, [fechasOrdenadas, fechaSeleccionada]);

  // useEffect modificado para el scroll al centro
  useEffect(() => {
    if (fechaSeleccionada && datesListRef.current) {
      requestAnimationFrame(() => {
        const selectedButton = datesListRef.current.querySelector(`[data-date="${fechaSeleccionada}"]`);
        if (selectedButton) {
          if (window.innerWidth < 640) { // Sigue aplicando solo en mobile
            selectedButton.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',    // ¡Cambiado a 'center'!
              block: 'nearest'
            });
          }
        }
      });
    }
  }, [fechaSeleccionada]);

  if (isLoading || isLoadingCoberturas) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 text-center text-gray-600 text-lg w-full max-w-2xl mx-auto">Cargando tu agenda...</div>
      </div>
    );
  }

  if (error || errorCoberturas) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 text-center text-red-600 text-lg font-medium w-full max-w-2xl mx-auto">Error al cargar turnos o coberturas: {error?.message || errorCoberturas?.message}. Por favor, intenta de nuevo.</div>
      </div>
    );
  }

  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-auto max-h-[95vh] flex flex-col border border-gray-200">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">Tu Agenda de Turnos</h3>
            <button
              onClick={onClose}
              className="text-3xl text-gray-500 hover:text-gray-700 font-light transition-transform transform hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg text-lg italic">
            ¡Parece que no tienes turnos agendados en este momento!
          </p>
        </div>
      </div>
    );
  }

  const turnosDeLaFechaSeleccionada = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-full sm:max-w-5xl mx-auto max-h-[95vh] flex flex-col border border-gray-200">
        <div className="flex justify-between items-center pb-3 sm:pb-4 mb-3 sm:mb-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl sm:text-3xl font-semibold text-gray-800">Tu Agenda de Turnos</h3>
          <button
            onClick={onClose}
            className="text-2xl sm:text-3xl text-gray-500 hover:text-gray-700 font-light transition-transform transform hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-grow overflow-hidden">

          {/* Columna/Sección Superior (Mobile) / Izquierda (Desktop): Lista de Fechas */}
          <div className="w-full sm:w-1/3 flex-shrink-0
                        sm:pr-4 sm:border-r border-gray-200
                        overflow-x-auto sm:overflow-x-hidden overflow-y-hidden sm:overflow-y-auto
                        pb-2 sm:pb-0 mb-4 sm:mb-0
                        custom-scrollbar-x sm:custom-scrollbar-y
                        whitespace-nowrap sm:whitespace-normal"
               ref={datesListRef}
          >
            <h4 className="sr-only sm:not-sr-only text-lg font-bold text-gray-700 mb-4 px-2">Fechas con Turnos</h4>
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 px-2">
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
                    className={`flex-shrink-0 min-w-[120px] sm:min-w-0 flex flex-col items-center sm:items-start p-2 sm:p-3 rounded-lg text-center sm:text-left
                                ${isSelected
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'}
                                transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    data-date={claveFecha}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full mb-1">
                      <span className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {new Date(claveFecha + 'T00:00:00').toLocaleDateString('es-AR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold mt-1 sm:mt-0
                                        ${isSelected
                                          ? (hayDisponibles ? 'bg-white text-blue-600' : 'bg-white text-red-600')
                                          : (hayDisponibles ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800')}`}>
                        {turnosDisponibles} disp.
                      </span>
                    </div>
                    {totalTurnos > 0 && (
                        <div className="flex space-x-0.5 sm:space-x-1 mt-1">
                            {turnosDelDia.sort((a, b) => (a.hora || '').localeCompare(b.hora || '')).map(turno => (
                                <div
                                    key={turno.id}
                                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${turno.estado === 'reservado' ? 'bg-red-400' : 'bg-green-400'}`}
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

          {/* Columna/Sección Inferior (Mobile) / Derecha (Desktop): Detalles de los Turnos */}
          <div className="w-full sm:w-2/3 pl-0 sm:pl-4 overflow-y-auto custom-scrollbar pt-4 sm:pt-0">
            <h4 className="text-lg font-bold text-gray-700 mb-4 px-2">
              Turnos para {fechaSeleccionada ? new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'ninguna fecha'}
            </h4>
            {turnosDeLaFechaSeleccionada.length === 0 ? (
              <p className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">No hay turnos para esta fecha.</p>
            ) : (
              <div className="space-y-4">
                {turnosDeLaFechaSeleccionada
                  .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                  .map((turno, index) => (
                    <div
                      key={turno.id}
                      className={`p-4 rounded-lg shadow-sm flex flex-col space-y-2
                                 ${turno.estado === 'reservado' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}
                                 transition-all duration-200 transform`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-lg font-bold text-gray-800 flex items-center">
                          <span className={`mr-2 text-xl font-extrabold ${turno.estado === 'reservado' ? 'text-red-500' : 'text-green-500'}`}>
                            #{index + 1}
                          </span>
                          <span className="text-base font-normal text-gray-600">
                             {turno.hora && `(${turno.hora})`}
                          </span>
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase
                                          ${turno.estado === 'reservado' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                          {turno.estado === 'reservado' ? 'Ocupado' : 'Disponible'}
                        </span>
                      </div>

                      {turno.DNI ? (
                        <div className="space-y-1 text-sm text-gray-700">
                          <p className="flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
                            <span className="font-medium truncate">{turno.apellido_paciente}, {turno.nombre_paciente}</span>
                          </p>
                          {turno.DNI && (
                            <p className="flex items-center">
                              <FaIdCard className="mr-2 text-gray-600" />
                              DNI: {turno.DNI}
                            </p>
                          )}
                          {turno.cobertura && (
                            <p className="flex items-start">
                              <FaShieldAlt className="mr-2 text-purple-600" />
                              Cobertura: <span className="font-semibold ml-1">{coberturaElegida(turno.cobertura)}</span>
                            </p>
                          )}
                          {turno.telefono && (
                            <p className="flex items-center">
                              <FaPhone className="mr-2 text-orange-600" />
                              Tel: {turno.telefono}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic flex items-center mt-2">
                          <FaInfoCircle className="mr-2 text-yellow-500" />
                          Este turno está disponible para agendar.
                        </p>
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