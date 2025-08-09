import { useState, useEffect } from 'react';
import useAllProvincias from '../../customHooks/useAllProvincias';
import useLocalidadesxIdProvincia from '../../customHooks/useLocalidadesxIdProvincia';
import { useNavigate } from 'react-router-dom';

import axios from 'axios'

const CrearConsultorio = () => {
  const [direccion, setDireccion] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [banco, setBanco] = useState('');
  const [cbu, setCbu] = useState('');
  const [alias, setAlias] = useState('');
  const [titular, setTitular] = useState('');
  const [seña, setSeña] = useState(false);
  const [importe, setImporte] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [codigo, setCodigo] = useState('');
  const [repetirContraseña, setRepetirContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarRepetir, setMostrarRepetir] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [idProvinciaSelected, setIdProvinciaSelected] = useState('');

  const { provincias, loading: loadingProvincias, error: errorProvincias } = useAllProvincias();
  const { localidades, loading: loadingLocalidades, error: errorLocalidades } = useLocalidadesxIdProvincia(idProvinciaSelected);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Desactivar seña si es centro médico
  useEffect(() => {
    if (tipo === 'centro médico') {
      setSeña(false);
    }
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!direccion || !localidad || !usuario || !contraseña || !repetirContraseña) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (contraseña !== repetirContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (tipo === 'particular' && seña && (!importe || !banco || !cbu)) {
      setError('Si requiere seña, complete importe, banco y CBU/alias.');
      return;
    }

    setError('');
    setMensaje('');

    try {
  const nuevoConsultorio = {
    direccion,
    localidad,
    provincia: idProvinciaSelected,
    telefono,
    tipo,
    nombre,
    usuario,
    contraseña, // Enviar sin hash (el backend debe hacerlo)
    seña,
    importe: seña ? parseFloat(importe) : null,
    banco: seña ? banco : null,
    cbu: seña ? cbu : null,
    alias: seña ? alias : null,
    titular: seña ? titular : null,
    codigo
  };

  const response = await axios.put(`${API_URL}/api/crearconsultorio/${codigo}`, nuevoConsultorio);



  // Si llega aquí, es porque el status es 2xx
  const data = response.data;
  setMensaje(`✅ ${data.nombre || 'Consultorio'} fue creado con éxito.`);
  
  setTimeout(() => {
    navigate('/')
  }, 1000);
  
  // Resetear formulario
  setDireccion('');
  setLocalidad('');
  setTelefono('');
  setTipo('');
  setUsuario('');
  setContraseña('');
  setRepetirContraseña('');
  setMostrarContraseña(false);
  setMostrarRepetir(false);
  setSeña(false);
  setImporte('');
  setBanco('');
  setCbu('');
  setAlias('');
  setTitular('');
  setNombre('');
  setCodigo('')

} catch (err) {
  // Aquí manejas tanto errores de red como respuestas 4xx/5xx
  if (axios.isAxiosError(err)) {
    const errorMessage = err.response?.data?.message || err.response?.statusText || 'Error desconocido';
    setError(`❌ Error: ${errorMessage}`);
  } else {
    setError('❌ Error de conexión. Intente más tarde.');
  }
  console.error('Error al crear consultorio:', err);
}
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Establecimiento</h2>

      {error && <div className="mb-4 p-3 text-red-700 bg-red-100 rounded text-sm">{error}</div>}
      {mensaje && <div className="mb-4 p-3 text-green-700 bg-green-100 rounded text-sm">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario (email o nombre de usuario) *</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="ej: dr.perez o perez@gmail.com"
          />
        </div>

        {/* Contraseña con ojo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña *</label>
          <div className="mt-1 flex">
            <input
              type={mostrarContraseña ? 'text' : 'password'}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              className="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-300 focus:outline-none"
            >
              {mostrarContraseña ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Repetir Contraseña con ojo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Repetir Contraseña *</label>
          <div className="mt-1 flex">
            <input
              type={mostrarRepetir ? 'text' : 'password'}
              value={repetirContraseña}
              onChange={(e) => setRepetirContraseña(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setMostrarRepetir(!mostrarRepetir)}
              className="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-300 focus:outline-none"
            >
              {mostrarRepetir ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Establecimiento *</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccioná un tipo</option>
            <option value="Particular">Consultorio Particular</option>
            <option value="Centro Médico">Centro Médico</option>
          </select>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección *</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Av. Libertador 1000"
          />
        </div>

        {/* Provincia */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Provincia *</label>
          <select
            value={idProvinciaSelected}
            onChange={(e) => setIdProvinciaSelected(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccionar provincia</option>
            {loadingProvincias && <option disabled>Cargando provincias...</option>}
            {errorProvincias && <option disabled>Error al cargar provincias</option>}
            {!loadingProvincias && !errorProvincias && provincias.map((provincia) => (
              <option key={provincia.id} value={provincia.id}>
                {provincia.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Localidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Localidad *</label>
          <select
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Seleccionar localidad</option>
            {loadingLocalidades && <option disabled>Cargando localidades...</option>}
            {errorLocalidades && <option disabled>Error al cargar localidades</option>}
            {!loadingLocalidades && !errorLocalidades && localidades.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Teléfono de contacto"
          />
        </div>
        {/* Codigo de activacion */}

        <div>
          <label className="block text-sm font-medium text-gray-700">Código de activación de cuenta</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Código de activación brindado el administrador"
          />
        </div>

        {/* Seña */}
        {tipo === 'particular' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="seña"
              checked={seña}
              onChange={(e) => setSeña(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="seña" className="ml-2 text-sm text-gray-700">
              ¿Requiere seña para reservar turno?
            </label>
          </div>
        )}

        {tipo === 'particular' && seña && (
          <div className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
            <h3 className="font-medium text-gray-800">Datos para Seña</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Importe de la seña *</label>
              <input
                type="number"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Banco *</label>
              <input
                type="text"
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Banco Nación"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CBU o Alias *</label>
              <input
                type="text"
                value={cbu}
                onChange={(e) => setCbu(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="2850590940091234567890 o JUAN.PEREZ.CBU"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Titular de la cuenta</label>
              <input
                type="text"
                value={titular}
                onChange={(e) => setTitular(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Juan Pérez"
              />
            </div>
          </div>
        )}

        {/* Nota centro médico */}
        {tipo === 'centro_medico' && (
          <p className="text-sm text-gray-500 italic">
            Nota: Los centros médicos generalmente no requieren seña directa al consultorio.
          </p>
        )}

        {/* Botón */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Crear Establecimiento
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearConsultorio;