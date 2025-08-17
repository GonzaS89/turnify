import { useState } from "react";
import axios from "axios";
import useAllEspecialidades from "../../customHooks/useAllEspecialidades";
import {
  FaTimes,
  FaUserMd,
  FaStethoscope,
  FaIdCard,
  FaGraduationCap,
  FaPhone,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const CrearProfesionalModal = ({ onClose, onCreate, consultorioID, consultorio }) => {

  const navigate = useNavigate()

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [matricula, setMatricula] = useState("");
  const [titulo, setTitulo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensajeError, setMensajeError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [creando, setCreando] = useState(false);

  console.log(consultorio)

  const {
    especialidades,
    isLoading: loading,
    error: hookError,
  } = useAllEspecialidades();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensaje(null);
    setCreando(true);

    // Validaciones
    if (!nombre.trim()) return setMensajeError("El nombre es obligatorio.");
    if (!apellido.trim()) return setMensajeError("El apellido es obligatorio.");
    if (!especialidad)
      return setMensajeError("Debe seleccionar una especialidad.");
    if (!matricula.trim())
      return setMensajeError("La matrícula es obligatoria.");
    if (matricula.trim().length < 3)
      return setMensajeError("La matrícula debe tener al menos 3 caracteres.");

    const telefonoLimpio = telefono.replace(/\D/g, "");
    if (telefonoLimpio.length !== 10) {
      return setMensajeError("El teléfono debe tener exactamente 10 dígitos.");
    }

    try {
      const nuevoProfesional = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        especialidad: especialidad || "",
        titulo: titulo || "",
        matricula: matricula.trim(),
        telefono: telefonoLimpio,
        consultorioID,
      };

      const response = await axios.post(
        `${API_URL}/api/crear-y-vincular-profesional`,
        nuevoProfesional
      );
      const data = response.data;

      // Reset
      setNombre("");
      setApellido("");
      setMatricula("");
      setEspecialidad("");
      setTitulo("");
      setTelefono("");

      toast.success("✅ ¡Profesional creado con éxito");

      setTimeout(() => {
        onClose();
        onCreate?.();
        setCreando(false);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.statusText ||
        "Error desconocido";
      setMensajeError(`❌ ${errorMsg}`);
      toast.error("Error al crear el profesional");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal responsivo */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-h-[100dvh] lg:max-h-[90dvh] max-w-4xl flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen decorativa (solo en pantallas grandes) */}
        {/* <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-12 relative">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FaUserMd size={80} className="mb-6 opacity-90" />
            <h3 className="text-3xl font-bold mb-4">Bienvenido</h3>
            <p className="text-lg opacity-90">
              Registra a un nuevo profesional en tu consultorio y comienza a gestionar turnos.
            </p>
          </div>
        </div> */}

        {/* Formulario (siempre visible) */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUserMd className="text-2xl" />
              <h2 className="text-2xl font-bold">Crear Profesional</h2>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Cerrar modal"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {hookError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  No se pudieron cargar las especialidades. Intenta más tarde.
                </span>
              </div>
            )}

            {mensajeError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{mensajeError}</span>
              </div>
            )}

            {mensaje && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-700">
                <FaCheckCircle className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{mensaje}</span>
              </div>
            )}

            {loading ? (
              <div className="py-10 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-gray-500 text-sm">
                  Cargando especialidades...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre y Apellido en fila (solo en desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaStethoscope className="text-blue-500" /> Nombre *
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaStethoscope className="text-blue-500" /> Apellido *
                    </label>
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                {/* Título */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaGraduationCap className="text-indigo-500" /> Título
                  </label>
                  <select
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  >
                    <option value="">Elegí un título</option>
                    <option value="doctor">Doctor</option>
                    <option value="doctora">Doctora</option>
                    <option value="licenciado">Licenciado</option>
                    <option value="licenciada">Licenciada</option>
                  </select>
                </div>

                {/* Especialidad */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaStethoscope className="text-purple-500" /> Especialidad
                    Médica *
                  </label>
                  <select
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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

                {/* Matrícula */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaIdCard className="text-green-500" /> Matrícula *
                  </label>
                  <input
                    type="number"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="12345"
                    maxLength="5
                    "
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-green-500" /> Teléfono (10 dígitos)
                    *
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setTelefono(value);
                    }}
                    placeholder="3816969546"
                    maxLength="10"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition
                      ${
                        telefono && telefono.replace(/\D/g, "").length !== 10
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {telefono && telefono.replace(/\D/g, "").length !== 10 && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <FaExclamationCircle /> Debe tener exactamente 10 dígitos
                    </p>
                  )}
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={telefono.replace(/\D/g, "").length !== 10}
                  >
                    {creando ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                        <span>Creando ...</span>
                      </div>
                    ) : (
                      "Crea profesional"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={1000} />
    </div>
  );
};

export default CrearProfesionalModal;
