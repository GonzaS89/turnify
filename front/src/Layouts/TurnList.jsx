// TurnList.jsx
import React, { useState } from 'react';
import { FaClock, FaUser, FaInfoCircle, FaCalendarAlt, FaChevronDown, FaChevronUp, FaIdCard, FaShieldAlt, FaPhone } from 'react-icons/fa';
import useProfessionalConsultorioTurnos from '../../customHooks/useProfessionalConsultorioTurnos';

const TurnList = ({ profesionalId, consultorioId, onClose }) => {
  const { turnos, isLoading, error } = useProfessionalConsultorioTurnos(profesionalId, consultorioId);

  const [fechasExpandidas, setFechasExpandidas] = useState({});

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">Cargando tu agenda...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 text-lg font-medium">Error al cargar turnos: {error.message}. Por favor, intenta de nuevo.</div>
    );
  }

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

  // Ordenar fechas en orden DESCENDENTE (las más nuevas primero)
  const fechasOrdenadas = Object.keys(turnosAgrupados).sort((a, b) => new Date(b) - new Date(a));

  const alternarExpansion = (claveFecha) => {
    setFechasExpandidas(prev => ({
      ...prev,
      [claveFecha]: !prev[claveFecha]
    }));
  };

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

        {/* Contenido desplazable de los turnos */}
        <div className="overflow-y-auto flex-grow pr-1 custom-scrollbar"> {/* Agregado pr-1 y custom-scrollbar para mejor UX */}
          {turnos.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg text-lg italic">
              ¡Parece que no tienes turnos agendados en este momento!
            </p>
          ) : (
            <div className="space-y-5">
              {fechasOrdenadas.map((claveFecha) => (
                <div key={claveFecha} className="border border-gray-100 rounded-xl shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
                  {/* Encabezado de la fecha */}
                  <div
                    className="flex justify-between items-center p-4 sm:p-5 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                    onClick={() => alternarExpansion(claveFecha)}
                    role="button"
                    aria-expanded={!!fechasExpandidas[claveFecha]}
                    aria-controls={`lista-turnos-${claveFecha}`}
                  >
                    <h4 className="text-lg sm:text-xl font-medium text-gray-800 flex items-center">
                      <FaCalendarAlt className="mr-3 text-blue-600 text-xl sm:text-2xl" />
                      {new Date(claveFecha + 'T00:00:00').toLocaleDateString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h4>
                    <button
                      className="p-2 rounded-full text-gray-500 hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-transform transform duration-200"
                    >
                      {fechasExpandidas[claveFecha] ? (
                        <FaChevronUp className="text-lg" />
                      ) : (
                        <FaChevronDown className="text-lg" />
                      )}
                    </button>
                  </div>

                  {/* Lista de turnos por fecha */}
                  {fechasExpandidas[claveFecha] && (
                    <div
                      id={`lista-turnos-${claveFecha}`}
                      className="space-y-3 p-4 sm:p-5 pt-0 border-t border-gray-100 animate-slideDown overflow-hidden"
                    >
                      {turnosAgrupados[claveFecha]
                        .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                        .map((turno, indice) => (
                          <div
                            key={turno.id}
                            className={`${turno.estado === 'reservado' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} p-4 rounded-lg shadow-sm flex items-start space-x-4 transition-all duration-200 transform hover:scale-[1.01]`}
                          >
                            <FaClock className={`text-xl ${turno.estado === 'reservado' ? 'text-red-500' : 'text-green-500'} mt-0.5 flex-shrink-0`} />
                            <div className="flex-1">
                              <p className="text-base font-medium text-gray-800 flex items-center">
                                Turno N°{indice + 1}
                                {turno.hora && <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md text-xs font-normal">{turno.hora}</span>}
                                {turno.estado && (
                                  <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${turno.estado === 'reservado' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                                    {turno.estado === 'reservado' ? 'Ocupado' : 'Disponible'}
                                  </span>
                                )}
                              </p>
                              {/* Información del paciente */}
                              {turno.DNI ? (
                                <div className="space-y-1 mt-2 text-sm text-gray-700">
                                  <p className="flex items-center">
                                    <FaUser className="mr-2 text-blue-500" />
                                    <span className="font-medium">{turno.apellido_paciente}, {turno.nombre_paciente}</span>
                                  </p>
                                  {turno.DNI && (
                                    <p className="flex items-center">
                                      <FaIdCard className="mr-2 text-gray-600" />
                                      {turno.DNI}
                                    </p>
                                  )}
                                  {turno.cobertura && (
                                    <p className="flex items-start">
                                      <FaShieldAlt className="mr-2 text-purple-600" />
                                      <span className="font-semibold ml-1">{turno.cobertura}</span>
                                    </p>
                                  )}
                                  {turno.telefono && (
                                    <p className="flex items-center">
                                      <FaPhone className="mr-2 text-orange-600" />
                                      {turno.telefono}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic mt-2 flex items-center">
                                  <FaInfoCircle className="mr-2 text-yellow-500" />
                                  Turno disponible para agendar.
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnList;