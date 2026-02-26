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
  FaCircleNotch,
  FaShieldAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearPerfil = ({ handleCrearConsultorio }) => {
  const { codigo: codigoValidacion } = useParams();
  const navigate = useNavigate();

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

      await axios.put(`${API_URL}/api/crearperfil/${codigoValidacion}`, nuevoPerfil);

      toast.success("Perfil configurado con éxito");

      setTimeout(() => {
        handleCrearConsultorio();
        navigate("/");
        setCreando(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error de conexión";
      setError(errorMessage);
      toast.error("No se pudo crear el perfil");
      setCreando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        {/* Header Premium */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-100 mb-6">
            <FaShieldAlt size={30} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 italic">
            TURNATE<span className="text-indigo-600 not-italic">.</span>
          </h1>
          <p className="mt-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
            Configuración de Profesional
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Usuario */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Usuario o Email
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaUser size={14} />
                  </span>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-800 transition-all"
                    placeholder="Ej: dr.gonzalez"
                  />
                </div>
              </div>

              {/* Input Contraseña */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={mostrarContraseña ? "text" : "password"}
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-800 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarContraseña(!mostrarContraseña)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {mostrarContraseña ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={mostrarRepetir ? "text" : "password"}
                      value={repetirContraseña}
                      onChange={(e) => setRepetirContraseña(e.target.value)}
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-800 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarRepetir(!mostrarRepetir)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {mostrarRepetir ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selector de Tipo Premium */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  Modalidad de Trabajo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "Particular", icon: FaHome, label: "Particular" },
                    { id: "centro médico", icon: FaBuilding, label: "Centro Médico" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTipo(item.id)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all border-2
                        ${tipo === item.id 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de Acción */}
              <button
                type="submit"
                disabled={creando}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:transform-none transition-all uppercase tracking-widest text-sm"
              >
                {creando ? (
                  <span className="flex items-center justify-center gap-3">
                    <FaCircleNotch className="animate-spin" /> Creando Perfil...
                  </span>
                ) : (
                  "Finalizar Registro"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-tighter">
          Seguridad encriptada de extremo a extremo
        </p> */}
      </div>

      <ToastContainer 
        position="bottom-center" 
        autoClose={2000} 
        hideProgressBar 
        toastClassName="bg-slate-900 text-white font-bold rounded-2xl shadow-2xl"
      />
    </div>
  );
};

export default CrearPerfil;