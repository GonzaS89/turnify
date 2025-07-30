import React, { useEffect, useState } from 'react';
import useProfesionalxIdConsultorio from '../../../customHooks/useProfesionalxIdConsultorio';
import { FaRegEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const GestionProfesionales = ({ openModalTurnos, closeModalGestion, consultorio, enviarProfesionalID }) => {
  const consultorioId = consultorio?.id;
  const { profesional: profesionales, isLoading, error } = useProfesionalxIdConsultorio(consultorioId);
  const [orden, setOrden] = useState('nombre');
  const [direccion, setDireccion] = useState('asc');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'cards' : 'table');
    };
    handleResize();
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

  const handleBotonTurnos = (id) => {
    enviarProfesionalID(id);
    openModalTurnos();
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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Gestión de Profesionales
            </h2>
            <button onClick={closeModalGestion} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando profesionales...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Gestión de Profesionales</h2>
            <button onClick={closeModalGestion} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-medium">Error al cargar</p>
            <p className="text-gray-500 mt-2">{error.message || "Por favor, intenta nuevamente."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 xl:p-4 animate-fade-in">
      <div className="bg-white xlrounded-2xl shadow-2xl w-screen xl:max-w-4xl h-screen xl:max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Gestión de Profesionales
          </h2>
          <button
            onClick={closeModalGestion}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* Botón de agregar */}
          <div className="flex justify-center">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Profesional
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
              <select
                value={filtroEspecialidad}
                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las especialidades</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad} value={especialidad}>
                    {especialidad}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex bg-gray-100 rounded-lg overflow-hidden self-end">
              <button
                onClick={() => cambiarOrden('nombre')}
                className={`px-4 py-2 text-sm font-medium ${orden === 'nombre' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700'}`}
              >
                Nombre {getSortIcon('nombre')}
              </button>
              <button
                onClick={() => cambiarOrden('especialidad')}
                className={`px-4 py-2 text-sm font-medium ${orden === 'especialidad' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700'}`}
              >
                Especialidad {getSortIcon('especialidad')}
              </button>
            </div>
          </div>

          {/* Vista de tarjetas (mobile) */}
          {viewMode === 'cards' ? (
            <div className="grid gap-4">
              {profesionalesFiltradosYOrdenados.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-base">No se encontraron profesionales</p>
                  {filtroEspecialidad && (
                    <button
                      onClick={() => setFiltroEspecialidad('')}
                      className="text-blue-600 text-sm underline mt-2"
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>
              ) : (
                profesionalesFiltradosYOrdenados.map((profesional) => (
                  <div
                    key={profesional.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Info principal */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {profesional.apellido}, {profesional.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">{profesional.especialidad}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{profesional.email}</p>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleBotonTurnos(profesional.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <FaRegEye className="w-4 h-4" /> Ver turnos
                      </button>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrashAlt className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Vista de tabla (desktop) - se mantiene igual o puedes simplificarla */
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Especialidad</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Turnos</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profesionalesFiltradosYOrdenados.map((profesional) => (
                    <tr key={profesional.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-blue-100 rounded-full">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{profesional.apellido}, {profesional.nombre}</div>
                            <div className="text-xs text-gray-500">{profesional.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{profesional.especialidad}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleBotonTurnos(profesional.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <FaRegEye className="w-3 h-3" /> Ver
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors">
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pie de página */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
          <span>Mostrando {profesionalesFiltradosYOrdenados.length} profesional(es)</span>
          <button
            onClick={closeModalGestion}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionProfesionales;