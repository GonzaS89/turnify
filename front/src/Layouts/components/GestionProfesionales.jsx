import React, { useEffect, useState } from 'react';
import useProfesionalxIdConsultorio from '../../../customHooks/useProfesionalxIdConsultorio';
import { FaRegEye } from "react-icons/fa";


const GestionProfesionales = ({ openModalTurnos ,closeModalGestion, consultorio, enviarProfesionalID }) => {
  const consultorioId = consultorio?.id;
  const { profesional: profesionales, isLoading, error } = useProfesionalxIdConsultorio(consultorioId);
  
  const [orden, setOrden] = useState('nombre'); // 'nombre' o 'especialidad'
  const [direccion, setDireccion] = useState('asc'); // 'asc' o 'desc'
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
   

  // Obtener especialidades únicas para el filtro
  const especialidades = [...new Set(profesionales?.map(p => p.especialidad) || [])];

  // Ordenar y filtrar profesionales
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

    const handleBotonTurnos = value => {
        openModalTurnos();
        enviarProfesionalID(value);
     
    }


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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
          <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Gestión de Profesionales
            </h2>
            <button
              onClick={closeModalGestion}
              className="text-white hover:text-gray-200 focus:outline-none transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando profesionales...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
          <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Gestión de Profesionales
            </h2>
            <button
              onClick={closeModalGestion}
              className="text-white hover:text-gray-200 focus:outline-none transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Error al cargar los profesionales</p>
              <p className="text-gray-600 mt-2">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full lg:h-[95vh] max-w-4xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Gestión de Profesionales
          </h2>
          <button
            onClick={closeModalGestion}
            className="text-white hover:text-gray-200 focus:outline-none transition duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Controles de filtro y ordenamiento */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Botón Agregar Profesional */}
            <div className="flex-grow">
              <button
              
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center shadow-md w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Profesional
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Filtro por especialidad */}
              <select
                value={filtroEspecialidad}
                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las especialidades</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad} value={especialidad}>
                    {especialidad}
                  </option>
                ))}
              </select>

              {/* Ordenamiento */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => cambiarOrden('nombre')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
                    orden === 'nombre'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Nombre {getSortIcon('nombre')}
                </button>
                <button
                  onClick={() => cambiarOrden('especialidad')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
                    orden === 'especialidad'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Especialidad {getSortIcon('especialidad')}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de profesionales */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Nombre</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Especialidad</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Turnos</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profesionalesFiltradosYOrdenados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>No se encontraron profesionales</p>
                        {filtroEspecialidad && (
                          <button
                            onClick={() => setFiltroEspecialidad('')}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            Limpiar filtros
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  profesionalesFiltradosYOrdenados.map((profesional) => (
                    <tr key={profesional.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {profesional.apellido}, {profesional.nombre}
                            </div>
                            <div className="text-sm text-gray-500">{profesional.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{profesional.especialidad}</td>
                      <td className="py-4 px-4">
                        <button 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        onClick={()=> handleBotonTurnos(profesional.id)}>
                         <FaRegEye />
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {profesionalesFiltradosYOrdenados.length} de {profesionales?.length || 0} profesionales
          </div>
          <button
            onClick={closeModalGestion}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 ease-in-out"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionProfesionales;