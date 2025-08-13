import { useState, useEffect } from 'react';
import useAllProvincias from '../../customHooks/useAllProvincias';
import useLocalidadesxIdProvincia from '../../customHooks/useLocalidadesxIdProvincia';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaBuilding, FaHome, FaMapMarkerAlt, FaPhone, FaUser, FaLock, FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrearConsultorio = ( { handleCrearConsultorio }) => {
  const { codigo: codigoValidacion } = useParams();
  const navigate = useNavigate();

  // Estados del formulario
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
  const [repetirContraseña, setRepetirContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarRepetir, setMostrarRepetir] = useState(false);
  const [idProvinciaSelected, setIdProvinciaSelected] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const { provincias, loading: loadingProvincias, error: errorProvincias } = useAllProvincias();
  const { localidades, loading: loadingLocalidades, error: errorLocalidades } = useLocalidadesxIdProvincia(idProvinciaSelected);

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
      setError('Todos los campos marcados con * son obligatorios.');
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
        contraseña,
        seña,
        importe: seña ? parseFloat(importe) : null,
        banco: seña ? banco : null,
        cbu: seña ? cbu : null,
        alias: seña ? alias : null,
        titular: seña ? titular : null,
        codigo: codigoValidacion
      };

      const response = await axios.put(`${API_URL}/api/crearconsultorio/${codigoValidacion}`, nuevoConsultorio);
      const data = response.data;

      setMensaje(`✅ ${data.nombre || 'Consultorio'} fue creado con éxito.`);
      toast.success('✅ ¡Consultorio creado! Redirigiendo...');
      
      setTimeout(() => {
        handleCrearConsultorio();
        navigate('/')
      }, 1500);

      // Resetear formulario
      setDireccion('');
      setLocalidad('');
      setTelefono('');
      setNombre('');
      setTipo('');
      setUsuario('');
      setContraseña('');
      setRepetirContraseña('');
      setSeña(false);
      setImporte('');
      setBanco('');
      setCbu('');
      setAlias('');
      setTitular('');
      setIdProvinciaSelected('');
      setMostrarContraseña(false);
      setMostrarRepetir(false);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.statusText || 'Error de conexión';
      setError(`❌ ${errorMessage}`);
      toast.error('Error al crear el consultorio');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Crear Establecimiento
          </h1>
          <p className="mt-2 text-lg text-gray-600">Completa los datos para activar tu consultorio o centro médico</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 shadow-sm">
            <FaExclamationCircle className="flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {mensaje && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 text-green-700 shadow-sm">
            <FaCheckCircle className="flex-shrink-0" />
            <span className="text-sm font-medium">{mensaje}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Sección: Credenciales */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <FaUser className="text-indigo-500" /> Credenciales de Acceso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FaUser size={16} />
                  </span>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="dr.perez o perez@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código de Activación</label>
                <input
                  type="text"
                  value={codigoValidacion}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Validación visual de contraseñas */}
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        <FaLock size={16} />
      </span>
      <input
        type={mostrarContraseña ? 'text' : 'password'}
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={() => setMostrarContraseña(!mostrarContraseña)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600"
      >
        {mostrarContraseña ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Repetir Contraseña *</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        <FaLock size={16} />
      </span>
      <input
        type={mostrarRepetir ? 'text' : 'password'}
        value={repetirContraseña}
        onChange={(e) => setRepetirContraseña(e.target.value)}
        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={() => setMostrarRepetir(!mostrarRepetir)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600"
      >
        {mostrarRepetir ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>

  {/* Indicador de validación en tiempo real */}
  <div className="mt-3">
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${
          contraseña.length === 0
            ? 'w-0'
            : contraseña.length < 6
            ? 'w-1/4 bg-red-500'
            : repetirContraseña === ''
            ? 'w-1/2 bg-yellow-500'
            : contraseña === repetirContraseña
            ? 'w-full bg-green-500'
            : 'w-full bg-red-600'
        }`}
      ></div>
    </div>

    <div className="text-xs space-y-1">
      {contraseña.length === 0 ? (
        <p className="text-gray-400 flex items-center gap-1">
          <FaInfoCircle /> Ingresa una contraseña
        </p>
      ) : contraseña.length < 6 ? (
        <p className="text-red-600 flex items-center gap-1">
          <FaExclamationCircle /> Mínimo 6 caracteres
        </p>
      ) : repetirContraseña === '' ? (
        <p className="text-yellow-600 flex items-center gap-1">
          <FaInfoCircle /> Confirma la contraseña
        </p>
      ) : contraseña === repetirContraseña ? (
        <p className="text-green-600 flex items-center gap-1">
          <FaCheckCircle /> ¡Contraseñas coinciden!
        </p>
      ) : (
        <p className="text-red-600 flex items-center gap-1">
          <FaExclamationCircle /> Las contraseñas no coinciden
        </p>
      )}
    </div>
  </div>
</div>
          </section>

          {/* Sección: Datos del Establecimiento */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <FaBuilding className="text-indigo-500" /> Datos del Establecimiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <div className="flex gap-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="Particular"
                      checked={tipo === 'Particular'}
                      onChange={(e) => setTipo(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      tipo === 'Particular'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <FaHome className="inline mr-1" /> Particular
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="centro médico"
                      checked={tipo === 'centro médico'}
                      onChange={(e) => setTipo(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      tipo === 'centro médico'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <FaBuilding className="inline mr-1" /> Centro Médico
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre (opcional)</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Consultorio Dra. Pérez"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FaMapMarkerAlt />
                  </span>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Av. Libertador 1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FaPhone />
                  </span>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="11 1234-5678"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provincia *</label>
                <select
                  value={idProvinciaSelected}
                  onChange={(e) => setIdProvinciaSelected(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Seleccionar provincia</option>
                  {loadingProvincias && <option disabled>Cargando...</option>}
                  {errorProvincias && <option disabled>Error</option>}
                  {!loadingProvincias && !errorProvincias && provincias.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localidad *</label>
                <select
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  disabled={!idProvinciaSelected}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white disabled:bg-gray-100"
                >
                  <option value="">Seleccionar localidad</option>
                  {loadingLocalidades && <option disabled>Cargando...</option>}
                  {errorLocalidades && <option disabled>Error</option>}
                  {!loadingLocalidades && !errorLocalidades && localidades.map((l) => (
                    <option key={l.id} value={l.id}>{l.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Sección: Seña (condicional) */}
          {tipo === 'particular' && (
            <section>
              <div className="flex items-center mb-5">
                <input
                  type="checkbox"
                  id="seña"
                  checked={seña}
                  onChange={(e) => setSeña(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="seña" className="ml-3 text-lg font-medium text-gray-800">
                  ¿Requiere seña para reservar?
                </label>
              </div>

              {seña && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 space-y-5">
                  <h3 className="font-bold text-indigo-700 flex items-center gap-2">
                    <FaInfoCircle /> Datos de Pago de Seña
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Importe *</label>
                      <input
                        type="number"
                        value={importe}
                        onChange={(e) => setImporte(e.target.value)}
                        className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Banco *</label>
                      <input
                        type="text"
                        value={banco}
                        onChange={(e) => setBanco(e.target.value)}
                        className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="Banco Nación"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CBU o Alias *</label>
                      <input
                        type="text"
                        value={cbu}
                        onChange={(e) => setCbu(e.target.value)}
                        className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ej: 2850590940091234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Titular</label>
                      <input
                        type="text"
                        value={titular}
                        onChange={(e) => setTitular(e.target.value)}
                        className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105 transition duration-200"
            >
              🚀 Crear Establecimiento
            </button>
          </div>
        </form>
      </div>

      {/* Toastify */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default CrearConsultorio;