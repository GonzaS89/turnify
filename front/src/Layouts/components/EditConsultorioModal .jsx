// src/components/modals/EditConsultorioModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado: npm install axios
import useAllProvincias from '../../../customHooks/useAllProvincias';
import useLocalidadesxIdProvincia from '../../../customHooks/useLocalidadesxIdProvincia';

const serverLocal = 'http://localhost:3006'; // Tu URL local del backend
const serverExterno = 'https://api.tu-dominio.com'; // Tu URL externa del backend (¡Asegúrate de cambiarla!)
const API_BASE_URL = window.location.hostname === 'localhost' ? serverLocal : serverExterno;


const EditConsultorioModal = ({ isOpen, onClose, consultorio }) => { // Renombrado onSave a onUpdateSuccess para mayor claridad
  // Estado para controlar la provincia seleccionada que dispara el hook de localidades
  const [idProvinciaSelected, setIdProvinciaSelected] = useState('');

  // Hooks para cargar provincias y localidades
  const { provincias, loading: loadingProvincias, error: errorProvincias } = useAllProvincias();
  const { localidades, loading: loadingLocalidades, error: errorLocalidades } = useLocalidadesxIdProvincia(idProvinciaSelected);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    provincia_id: '', // Usamos provincia_id para consistencia con la DB
    localidad_id: '', // Usamos localidad_id para consistencia con la DB
    direccion: '',
    telefono: '', // Asegúrate de que el consultorio prop también tenga 'telefono'
    hora_inicio: '',
    hora_cierre: '',
  });

  const [loading, setLoading] = useState(false); // Estado para indicar si la petición está en curso
  const [errorSubmit, setErrorSubmit] = useState(null); // Estado para manejar errores específicos de la petición de envío


  // useEffect para inicializar formData y idProvinciaSelected cuando el modal se abre o el consultorio cambia
  useEffect(() => {
    if (consultorio) {
      setFormData({
        nombre: consultorio.nombre || '',
        tipo: consultorio.tipo || 'propio',
        provincia_id: consultorio.provincia_id || '', // Pre-rellena con el ID de provincia del consultorio
        localidad_id: consultorio.localidad_id || '', // Pre-rellena con el ID de localidad del consultorio
        direccion: consultorio.direccion || '',
        telefono: consultorio.telefono || '', // Asegúrate de tener este campo en tu consultorio
        hora_inicio: consultorio.hora_inicio || '',
        hora_cierre: consultorio.hora_cierre || '',
      });
      // Importante: también inicializa idProvinciaSelected para que las localidades se carguen al abrir
      setIdProvinciaSelected(consultorio.provincia_id || '');
      setErrorSubmit(null); // Limpiar errores al abrir el modal
    }
  }, [consultorio]); // Se ejecuta cada vez que el objeto 'consultorio' cambia

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Lógica para actualizar idProvinciaSelected y resetear localidad_id
    if (name === 'provincia_id') {
      setIdProvinciaSelected(value); // Esto hará que useLocalidadesxIdProvincia recargue
      setFormData((prevData) => ({
        ...prevData,
        localidad_id: '', // Resetea la localidad al cambiar la provincia
      }));
    }
  };

  const modificarDatos = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setLoading(true); // Activa el estado de carga
    setErrorSubmit(null); // Limpia cualquier error anterior

    console.log('Datos del formulario antes de enviar:', formData);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/modificardatosconsultorio/${consultorio.id}`, {
        nombre: formData.nombre,
        tipo: formData.tipo,
        provincia_id: formData.provincia_id, // Usar provincia_id
        localidad_id: formData.localidad_id, // Usar localidad_id
        direccion: formData.direccion,
        telefono: formData.telefono,
        hora_inicio: formData.hora_inicio,
        hora_cierre: formData.hora_cierre,
      });

      console.log('Datos actualizados:', response.data);
      // Llama a la función onUpdateSuccess pasada por prop para notificar al padre
  

      // Cierra el modal y recarga la página solo si la operación fue exitosa
      onClose();
      // Considera no recargar la página completa si puedes actualizar el estado en el padre.
      // window.location.reload(); // Solo si es absolutamente necesario
      // window.scrollTo(0, 0);

    } catch (error) {
      console.error('Error al actualizar los datos del consultorio:', error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error al conectar con el servidor o actualizar los datos del consultorio.';
      setErrorSubmit(errorMessage); // Muestra el error en este modal
    } finally {
      setLoading(false); // Desactiva el estado de carga
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
          {errorSubmit && <p className="text-center text-red-600 font-semibold">{errorSubmit}</p>} {/* Usar errorSubmit */}

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
            <label htmlFor="provincia_id" className="block text-gray-700 text-lg font-semibold mb-1">Provincia:</label>
            <select
              id="provincia_id"
              name="provincia_id" // ¡CORREGIDO! Este debe ser el nombre del campo en formData
              value={formData.provincia_id} // Usamos provincia_id
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
            <label htmlFor="localidad_id" className="block text-gray-700 text-lg font-semibold mb-1">Localidad:</label>
            <select
              id="localidad_id" // ¡CORREGIDO! Este debe ser el ID único del elemento
              name="localidad_id" // ¡CORREGIDO! Este debe ser el nombre del campo en formData
              value={formData.localidad_id} // Usamos localidad_id
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || loadingLocalidades || !idProvinciaSelected} // Deshabilita si no hay provincia seleccionada
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