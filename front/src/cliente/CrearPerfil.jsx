import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaLock,
  FaHome,
  FaBuilding,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearPerfil = ({ handleCrearConsultorio }) => {
  const { codigo: codigoValidacion } = useParams();
  const navigate = useNavigate();

  // Estados del formulario
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");
  const [tipo, setTipo] = useState("Particular");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarRepetir, setMostrarRepetir] = useState(false);
  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreando(true);
    setError("");

    // Validaciones
    if (!usuario || !contraseña || !repetirContraseña) {
      setError("Todos los campos son obligatorios.");
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

    try {
      const nuevoPerfil = {
        usuario,
        contraseña,
        tipo,
        codigo: codigoValidacion,
      };

      await axios.put(
        `${API_URL}/api/crearperfil/${codigoValidacion}`,
        nuevoPerfil
      );

      toast.success("✅ ¡Perfil creado! Redirigiendo...");

      setTimeout(() => {
        handleCrearConsultorio();
        navigate("/");
        setCreando(false);
      }, 1500);

      // Resetear formulario
      setUsuario("");
      setContraseña("");
      setRepetirContraseña("");
      setTipo("Particular");
      setMostrarContraseña(false);
      setMostrarRepetir(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        "Error de conexión";
      setError(`❌ ${errorMessage}`);
      toast.error("Error al crear el perfil");
      setCreando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Crear Perfil
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa tus datos básicos para comenzar
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          
          {/* Usuario */}
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
                placeholder="usuario o email"
              />
            </div>
          </div>

          {/* Contraseña */}
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
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
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

          {/* Repetir Contraseña */}
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
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
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

          {/* Tipo de cuenta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Cuenta *
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

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={creando}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 transition"
            >
              {creando ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Creando...
                </span>
              ) : (
                "Crear Perfil"
              )}
            </button>
          </div>
        </form>

        {/* Toastify */}
        <ToastContainer position="bottom-right" autoClose={1000} />
      </div>
    </div>
  );
};

export default CrearPerfil;