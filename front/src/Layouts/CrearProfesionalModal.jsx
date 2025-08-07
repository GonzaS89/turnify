import { useState } from 'react';
import axios from 'axios'; // ← Importar axios
import useAllEspecialidades from '../../customHooks/useAllEspecialidades';
import { FaTimes } from 'react-icons/fa';

const CrearProfesionalModal = ( { onClose, onCreate}) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [matricula, setMatricula] = useState('');
  const [titulo, setTitulo] = useState('');
  const [mensajeError, setMensajeError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // Usamos SOLO el loading y error del custom hook
  const { especialidades, isLoading: loading, error: hookError } = useAllEspecialidades();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensaje(null);
  
    if (!nombre.trim()) return setMensajeError('El nombre es obligatorio.');
    if (!apellido.trim()) return setMensajeError('El apellido es obligatorio.');
    if (!especialidad) return setMensajeError('Debe seleccionar una especialidad.');
    if (!matricula.trim()) return setMensajeError('La matrícula es obligatoria.');
    if (matricula.trim().length < 3) return setMensajeError('La matrícula debe tener al menos 3 caracteres.');
  
    try {
      const nuevoProfesional = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        especialidad,
        titulo,
        matricula: matricula.trim(),
      };
  
      const response = await axios.post('http://localhost:3006/api/crearprofesional', nuevoProfesional);
      const data = response.data;
  
      setMensaje(`✅ ${data.nombre || 'El profesional'} fue creado con éxito.`);
  
      // Limpiar formulario
      setNombre("");
      setApellido("");
      setMatricula("");
      setEspecialidad("");
      setTitulo("");
  
      // Cerrar después de mostrar el mensaje
      setTimeout(() => {
        onClose();
        onCreate(); // si onCreate es para notificar al padre
      }, 1500);
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || err.response?.statusText || 'Error desconocido';
        setMensajeError(`❌ Error: ${errorMsg}`);
      } else {
        setMensajeError('❌ Error de conexión. Intente más tarde.');
      }
      console.error('Error al crear profesional:', err);
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
     
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear Profesional</h2>
          <button onClick={onClose}>
          <FaTimes className='text-2xl'/>
          </button>
        </div>

        {/* Mensaje de error del hook (carga de especialidades) */}
        {hookError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            No se pudieron cargar las especialidades. Intente más tarde.
          </div>
        )}

        {/* Mensaje de éxito o error */}
        {mensajeError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {mensajeError}
          </div>
        )}
        {mensaje && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
            {mensaje}
          </div>
        )}

        {/* Formulario o carga */}
        {loading ? (
          <div className="py-8 text-center">
            <p className="text-gray-600">Cargando especialidades...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Juan"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Pérez"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <select
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
              >
                <option value="">Elegí un título</option>
                <option value="doctor">Doctor</option>
                <option value="doctora">Doctora</option>
                <option value="licenciado">Licenciado</option>
                <option value="licenciada">Licenciada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad Médica *
              </label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
              >
                <option value="">Seleccionar especialidad</option>
                {Array.isArray(especialidades) &&
                  especialidades.map((esp) => (
                    <option key={esp.id} value={esp.nombre}>
                      {esp.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula *
              </label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="12345"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
              >
                {loading ? 'Creando...' : 'Crear Profesional'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CrearProfesionalModal;