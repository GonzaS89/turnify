import { useState } from 'react';

const CrearProfesionalModal = ({ onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [matricula, setMatricula] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const especialidades = [
    "Médico General",
    "Cardiología",
    "Dermatología",
    "Ginecología",
    "Pediatría",
    "Neurología",
    "Oftalmología",
    "Oncología",
    "Traumatología",
    "Psiquiatría",
    "Endocrinología",
    "Gastroenterología",
    "Neumonología",
    "Urología",
    "Otorrinolaringología"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!nombre.trim() || !apellido.trim() || !especialidad || !matricula.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (matricula.length < 3) {
      setError('La matrícula debe tener al menos 3 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Simulamos una creación exitosa
      // Aquí llamarías a tu API: await axios.post('/api/profesionales', datos)
      const nuevoProfesional = {
        id: Date.now(), // temporal
        nombre,
        apellido,
        especialidad,
        matricula,
        createdAt: new Date().toISOString()
      };

      // Llamamos a la función de éxito (p. ej., actualizar lista)
      onCreate(nuevoProfesional);

      // Cerramos el modal
      onClose();
    } catch (err) {
      setError('Error al crear el profesional. Intente más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Cerrar al hacer clic fuera
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear Profesional</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
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

          {/* Apellido */}
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

          {/* Especialidad */}
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
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>

          {/* Matrícula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula *
            </label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="MAT-12345"
              disabled={loading}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
            >
              {loading ? 'Guardando...' : 'Crear Profesional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearProfesionalModal;