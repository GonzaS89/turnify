// src/components/modals/EditConsultorioModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAllProvincias from '../../../customHooks/useAllProvincias';
import useLocalidadesxIdProvincia from '../../../customHooks/useLocalidadesxIdProvincia';

const serverLocal = 'http://localhost:3006';
const serverExterno = 'https://api.tu-dominio.com';
const API_BASE_URL = window.location.hostname === 'localhost' ? serverLocal : serverExterno;

const EditConsultorioModal = ({ isOpen, onClose, consultorio, onUpdateSuccess }) => {
  const [idProvinciaSelected, setIdProvinciaSelected] = useState('');
  const { provincias, loading: loadingProvincias, error: errorProvincias } = useAllProvincias();
  const { localidades, loading: loadingLocalidades, error: errorLocalidades } = useLocalidadesxIdProvincia(idProvinciaSelected);


  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    provincia: '',
    localidad: '',
    direccion: '',
    telefono: '',
    hora_inicio: '',
    hora_cierre: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(null);

  useEffect(() => {
    if (consultorio) {
      setFormData({
        nombre: consultorio.nombre || '',
        tipo: consultorio.tipo || 'propio',
        provincia: consultorio.provincia || '',
        localidad: consultorio.localidad || '',
        direccion: consultorio.direccion || '',
        telefono: consultorio.telefono || '',
        hora_inicio: consultorio.hora_inicio || '',
        hora_cierre: consultorio.hora_cierre || '',
      });
      setIdProvinciaSelected(consultorio.provincia || '');
      setErrorSubmit(null);
    }
  }, [consultorio]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'provincia') {
      setIdProvinciaSelected(value);
      setFormData((prevData) => ({
        ...prevData,
        localidad: '',
      }));
    }
  };

  const modificarDatos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorSubmit(null);

    const dataToSend = {
      nombre: formData.nombre,
      tipo: formData.tipo,
      provincia: formData.provincia ? parseInt(formData.provincia, 10) : null,
      localidad: formData.localidad ? parseInt(formData.localidad, 10) : null,
      direccion: formData.direccion,
      telefono: formData.telefono,
      hora_inicio: formData.hora_inicio,
      hora_cierre: formData.hora_cierre,
    };


    try {
      const response = await axios.put(`${API_BASE_URL}/api/modificardatosconsultorio/${consultorio.id}`,{

        ...dataToSend,
      });

      console.log('Datos actualizados:', response.data);
      
      // Llama a la función onUpdateSuccess con los datos actualizados
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data);
      }

      // Cierra el modal, sin recargar la página
      onClose();

    } catch (error) {
      console.error('Error al actualizar los datos del consultorio:', error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error al conectar con el servidor o actualizar los datos del consultorio.';
      setErrorSubmit(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg md:max-w-xl flex flex-col gap-6 relative max-h-[90vh] overflow-hidden">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
          aria-label="Cerrar modal de edición"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 text-center mb-4 leading-tight">
          Editar Datos del Consultorio
        </h2>

        <form onSubmit={modificarDatos} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {loading && <p className="text-center text-blue-600">Guardando cambios...</p>}
          {errorSubmit && <p className="text-center text-red-600 font-semibold">{errorSubmit}</p>}

          {loadingProvincias && <p className="text-center text-gray-500">Cargando provincias...</p>}
          {errorProvincias && <p className="text-center text-red-500">Error al cargar provincias: {errorProvincias.message}</p>}
          {loadingLocalidades && idProvinciaSelected && <p className="text-center text-gray-500">Cargando localidades...</p>}
          {errorLocalidades && idProvinciaSelected && <p className="text-center text-red-500">Error al cargar localidades: {errorLocalidades.message}</p>}

          <div>
            <label htmlFor="nombre" className="block text-gray-700 text-lg font-semibold mb-1">Nombre del Consultorio:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="tipo" className="block text-gray-700 text-lg font-semibold mb-1">Tipo:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="propio">Consultorio Particular</option>
              <option value="centro_medico">Centro Médico</option>
            </select>
          </div>

          <div>
            <label htmlFor="provincia" className="block text-gray-700 text-lg font-semibold mb-1">Provincia:</label>
            <select
              id="provincia"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || loadingProvincias}
            >
              <option value="">Selecciona una provincia</option>
              {provincias?.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="localidad" className="block text-gray-700 text-lg font-semibold mb-1">Localidad:</label>
            <select
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || loadingLocalidades || !idProvinciaSelected}
            >
              <option value="">Selecciona una localidad</option>
              {localidades?.map((localidad) => (
                <option key={localidad.id} value={localidad.id}>
                  {localidad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="direccion" className="block text-gray-700 text-lg font-semibold mb-1">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-gray-700 text-lg font-semibold mb-1">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hora_inicio" className="block text-gray-700 text-lg font-semibold mb-1">Hora de Inicio:</label>
              <input
                type="time"
                id="hora_inicio"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="hora_cierre" className="block text-gray-700 text-lg font-semibold mb-1">Hora de Cierre:</label>
              <input
                type="time"
                id="hora_cierre"
                name="hora_cierre"
                value={formData.hora_cierre}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="py-3 px-8 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-md mr-4"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-8 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 shadow-md"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConsultorioModal;