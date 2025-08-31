import { useState, useEffect } from "react";
import useAllProvincias from "../../customHooks/useAllProvincias";
import useLocalidadesxIdProvincia from "../../customHooks/useLocalidadesxIdProvincia";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaHome,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaLock,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearConsultorioModal = ({ isOpen, onClose, codigoValidacion, onSuccess }) => {
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Particular");
  const [banco, setBanco] = useState("");
  const [cbu, setCbu] = useState("");
  const [alias, setAlias] = useState("");
  const [titular, setTitular] = useState("");
  const [seña, setSeña] = useState(false);
  const [importe, setImporte] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarRepetir, setMostrarRepetir] = useState(false);
  const [idProvinciaSelected, setIdProvinciaSelected] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);

  const {
    provincias,
    loading: loadingProvincias,
    error: errorProvincias,
  } = useAllProvincias();
  const {
    localidades,
    loading: loadingLocalidades,
    error: errorLocalidades,
  } = useLocalidadesxIdProvincia(idProvinciaSelected);

  const API_URL = import.meta.env.VITE_API_URL;

  // Resetear el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      // Limpiar campos
      setDireccion("");
      setLocalidad("");
      setTelefono("");
      setNombre("");
      setTipo("Particular");
      setBanco("");
      setCbu("");
      setAlias("");
      setTitular("");
      setSeña(false);
      setImporte("");
      setUsuario("");
      setContraseña("");
      setRepetirContraseña("");
      setIdProvinciaSelected("");
      setMostrarContraseña(false);
      setMostrarRepetir(false);
      setError("");
      setMensaje("");
    }
  }, [isOpen]);

  // Desactivar seña si es centro médico
  useEffect(() => {
    if (tipo === "centro médico") {
      setSeña(false);
    }
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreando(true);
    setError("");

    if (
      !direccion ||
      !localidad ||
      !usuario ||
      !contraseña ||
      !repetirContraseña
    ) {
      setError("Todos los campos marcados con * son obligatorios.");
      setCreando(false);
      return;
    }

    if (contraseña !== repetirContraseña) {
      setError("Las contraseñas no coinciden.");
      setCreando(false);
      return;
    }

    if (contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setCreando(false);
      return;
    }

    if (telefono && telefono.length !== 10) {
      setError("El teléfono debe tener 10 dígitos.");
      setCreando(false);
      return;
    }

    if (tipo === "Particular" && seña && (!importe || !banco || !cbu)) {
      setError("Si requiere seña, complete importe, banco y CBU/alias.");
      setCreando(false);
      return;
    }

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
        codigo: codigoValidacion,
      };

      const response = await axios.put(
        `${API_URL}/api/crearconsultorio/${codigoValidacion}`,
        nuevoConsultorio
      );

      toast.success("✅ ¡Consultorio creado exitosamente!");

      setCreando(false);
      onSuccess?.(response.data); // Callback de éxito
      onClose(); // Cierra el modal
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        "Error de conexión";
      setError(`❌ ${errorMessage}`);
      toast.error("Error al crear el consultorio");
      setCreando(false);
    }
  };

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[200]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el contenido cierre el modal
        >
          {/* Encabezado del modal */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Crear Establecimiento</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Cuerpo del modal */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
                <FaExclamationCircle />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {mensaje && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 text-green-700">
                <FaCheckCircle />
                <span className="text-sm font-medium">{mensaje}</span>
              </div>
            )}

            {/* Sección: Credenciales */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-indigo-500" /> Credenciales de Acceso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaUser size={16} />
                    </span>
                    <input
                      type="text"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="dr.perez o perez@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Activación
                  </label>
                  <input
                    type="text"
                    value={codigoValidacion}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Contraseñas con validación visual */}
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaLock size={16} />
                    </span>
                    <input
                      type={mostrarContraseña ? "text" : "password"}
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repetir Contraseña *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaLock size={16} />
                    </span>
                    <input
                      type={mostrarRepetir ? "text" : "password"}
                      value={repetirContraseña}
                      onChange={(e) => setRepetirContraseña(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Barra de progreso de contraseña */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        contraseña.length === 0
                          ? "w-0"
                          : contraseña.length < 6
                          ? "w-1/4 bg-red-500"
                          : repetirContraseña === ""
                          ? "w-1/2 bg-yellow-500"
                          : contraseña === repetirContraseña
                          ? "w-full bg-green-500"
                          : "w-full bg-red-600"
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
                    ) : repetirContraseña === "" ? (
                      <p className="text-yellow-600 flex items-center gap-1">
                        <FaInfoCircle /> Confirma la contraseña
                      </p>
                    ) : contraseña === repetirContraseña ? (
                      <p className="text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> ¡Contraseñas coinciden!
                      </p>
                    ) : (
                      <p className="text-red-600 flex items-center gap-1">
                        <FaExclamationCircle /> No coinciden
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Sección: Datos del Establecimiento */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBuilding className="text-indigo-500" /> Datos del Establecimiento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="Particular"
                        checked={tipo === "Particular"}
                        onChange={(e) => setTipo(e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          tipo === "Particular"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaHome className="inline mr-1" /> Particular
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="centro médico"
                        checked={tipo === "centro médico"}
                        onChange={(e) => setTipo(e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          tipo === "centro médico"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaBuilding className="inline mr-1" /> Centro Médico
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Consultorio Dra. Pérez"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono (10 dígitos)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) setTelefono(value);
                      }}
                      inputMode="numeric"
                      maxLength="10"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="3816917619"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia *
                  </label>
                  <select
                    value={idProvinciaSelected}
                    onChange={(e) => setIdProvinciaSelected(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>
                      Seleccionar provincia
                    </option>
                    {loadingProvincias && <option disabled>Cargando...</option>}
                    {errorProvincias && <option disabled>Error</option>}
                    {!loadingProvincias &&
                      !errorProvincias &&
                      provincias.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localidad *
                  </label>
                  <select
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                    disabled={!idProvinciaSelected}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar localidad</option>
                    {loadingLocalidades && <option disabled>Cargando...</option>}
                    {errorLocalidades && <option disabled>Error</option>}
                    {!loadingLocalidades &&
                      !errorLocalidades &&
                      localidades.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Sección: Seña (solo para particulares) */}
            {tipo === "Particular" && (
              <section>
                <div className="flex items-center mb-4">
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
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100 space-y-4">
                    <h4 className="font-semibold text-indigo-700 flex items-center gap-2">
                      <FaInfoCircle /> Datos de Pago de Seña
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Importe *
                        </label>
                        <input
                          type="number"
                          value={importe}
                          onChange={(e) => setImporte(e.target.value)}
                          className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="5000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Banco *
                        </label>
                        <input
                          type="text"
                          value={banco}
                          onChange={(e) => setBanco(e.target.value)}
                          className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="Banco Nación"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CBU o Alias *
                        </label>
                        <input
                          type="text"
                          value={cbu}
                          onChange={(e) => setCbu(e.target.value)}
                          className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ej: 2850590940091234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Titular
                        </label>
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
                disabled={creando}
                className={`w-full py-4 text-white font-semibold rounded-2xl shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
                  creando
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {creando ? (
                  <span className="inline-flex gap-2 items-center">
                    <FaSpinner className="animate-spin" /> Creando...
                  </span>
                ) : (
                  <span className="inline-flex gap-2 items-center">🚀 Crear Establecimiento</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toastify */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default CrearConsultorioModal;