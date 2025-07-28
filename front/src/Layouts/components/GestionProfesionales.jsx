import React, { useEffect, useState } from 'react';
import useProfesionalxIdConsultorio from '../../../customHooks/useProfesionalxIdConsultorio';
import { FaRegEye } from "react-icons/fa";

const GestionProfesionales = ({ openModalTurnos, closeModalGestion, consultorio, enviarProfesionalID }) => {
  const consultorioId = consultorio?.id;
  const { profesional: profesionales, isLoading, error } = useProfesionalxIdConsultorio(consultorioId);
  const [orden, setOrden] = useState('nombre');
  const [direccion, setDireccion] = useState('asc');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Detect screen size for auto-layout (optional)
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'cards' : 'table');
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const especialidades = [...new Set(profesionales?.map(p => p.especialidad) || [])];

  const profesionalesFiltradosYOrdenados = profesionales
    ? profesionales
        .filter(profesional => 
          filtroEspecialidad === '' || profesional.especialidad === filtroEspecialidad
        )
        .sort((a, b) => {
          let comparison = 0;
          if (orden === 'nombre') {
            const nombreA = `${a.apellido}, ${a.nombre}`.toLowerCase();
            const nombreB = `${b.apellido}, ${b.nombre}`.toLowerCase();
            comparison = nombreA.localeCompare(nombreB);
          } else if (orden === 'especialidad') {
            comparison = a.especialidad.localeCompare(b.especialidad);
          }
          return direccion === 'asc' ? comparison : -comparison;
        })
    : [];

  const handleBotonTurnos = (value) => {
    openModalTurnos();
    enviarProfesionalID(value);
  };

  const cambiarOrden = (nuevoOrden) => {
    if (orden === nuevoOrden) {
      setDireccion(direccion === 'asc' ? 'desc' : 'asc');
    } else {
      setOrden(nuevoOrden);
      setDireccion('asc');
    }
  };

  const getSortIcon = (columna) => {
    if (orden !== columna) return null;
    return direccion === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:p-4">
        <div className="bg-white rounded-none xl:rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden">
          <div className="bg-blue-600 text-white lg:p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Gestión de Profesionales
            </h2>
            <button onClick={closeModalGestion} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 flex items-center justify-center min-h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              Gestión de Profesionales
            </h2>
            <button onClick={closeModalGestion} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 text-center">
            <div className="text-red-500 mb-2">
              <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-sm">Error al cargar</p>
            <p className="text-gray-500 text-xs mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 2xl:p-2">
      <div className="bg-white 2xl:rounded-xl shadow-2xl w-full 2xl:max-w-4xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Gestión de Profesionales
          </h2>
          <button onClick={closeModalGestion} className="text-white hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-grow space-y-4">
          {/* Controls */}
          <div className="flex flex-col gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Profesional
            </button>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filtroEspecialidad}
                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Todas las especialidades</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad} value={especialidad}>
                    {especialidad}
                  </option>
                ))}
              </select>

              <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => cambiarOrden('nombre')}
                  className={`px-3 py-1 text-xs sm:text-sm font-medium ${
                    orden === 'nombre'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Nombre {getSortIcon('nombre')}
                </button>
                <button
                  onClick={() => cambiarOrden('especialidad')}
                  className={`px-3 py-1 text-xs sm:text-sm font-medium ${
                    orden === 'especialidad'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Especialidad {getSortIcon('especialidad')}
                </button>
              </div>
            </div>
          </div>

          {/* Table or Cards */}
          {viewMode === 'table' ? (
            /* Desktop Table View */
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700">Nombre</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700">Especialidad</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700">Turnos</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profesionalesFiltradosYOrdenados.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-gray-500 text-sm">
                        No se encontraron profesionales
                        {filtroEspecialidad && (
                          <button
                            onClick={() => setFiltroEspecialidad('')}
                            className="block mx-auto mt-1 text-blue-600 text-xs"
                          >
                            Limpiar filtros
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    profesionalesFiltradosYOrdenados.map((profesional) => (
                      <tr key={profesional.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-1.5 mr-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {profesional.apellido}, {profesional.nombre}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[150px]">{profesional.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-700 text-sm">{profesional.especialidad}</td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleBotonTurnos(profesional.id)}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800"
                          >
                            <FaRegEye className="w-3 h-3 mr-1" />
                            Ver
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex space-x-1">
                            <button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Mobile Card View */
            <div className="space-y-3">
              {profesionalesFiltradosYOrdenados.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <p>No se encontraron profesionales</p>
                  {filtroEspecialidad && (
                    <button
                      onClick={() => setFiltroEspecialidad('')}
                      className="text-blue-600 mt-1"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                profesionalesFiltradosYOrdenados.map((profesional) => (
                  <div
                    key={profesional.id}
                    className="border border-gray-200 rounded-lg p-3 bg-white flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex-1 flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {profesional.apellido}, {profesional.nombre}
                        </div>
                        <div className="text-xs text-gray-500">{profesional.email}</div>
                        <div className="text-xs text-gray-600 mt-1">{profesional.especialidad}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleBotonTurnos(profesional.id)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg"
                      >
                        <FaRegEye className="w-3 h-3" />
                        Turnos
                      </button>
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <span className="text-gray-600">
            Mostrando {profesionalesFiltradosYOrdenados.length} de {profesionales?.length || 0}
          </span>
          <button
            onClick={closeModalGestion}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1.5 px-5 rounded-lg w-full sm:w-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionProfesionales;