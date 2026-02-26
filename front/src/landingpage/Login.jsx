import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAllPerfiles from "../../customHooks/useAllPerfiles";
import axios from 'axios';
import { FaUser, FaLock, FaTimes, FaCircleNotch, FaShieldAlt } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Login = ({ closeLogin }) => {
  const { isLoading: profilesLoading, error: fetchError } = useAllPerfiles();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mensaje = "Hola, quiero crear mi cuenta en Turnate. ¿Pueden ayudarme?";
  const whatsappLink = `https://wa.me/5493815588504?text=${encodeURIComponent(mensaje)}`;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoginError('');
  }, [username, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        usuario: username,
        contraseña: password,
      });

      const { perfil, token } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('perfil', JSON.stringify(perfil));

      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/micuenta');
        closeLogin?.();
      }, 1500);
      
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Credenciales inválidas.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-10 sm:p-14 w-full max-w-lg border border-slate-100 animate-fade-in-up">
        
        {/* Botón de cerrar Premium */}
        <button
          onClick={closeLogin}
          className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
          aria-label="Cerrar"
        >
          <FaTimes size={20} />
        </button>

        {/* Header con Identidad de Marca */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-indigo-100">
            <FaShieldAlt size={36} />
          </div>

          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 italic">
            TURNATE<span className="text-indigo-600 not-italic">.</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            Acceso Profesionales
          </p>
        </div>

        {/* Mensajes de Error con Fuente Grande */}
        {(loginError || fetchError) && (
          <div className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-base font-bold flex items-center gap-3 animate-shake">
            <span className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />
            {loginError || fetchError?.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          {/* Input Usuario */}
          <div>
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
              Usuario
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <FaUser size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-xl text-slate-800 transition-all placeholder:text-slate-300"
                placeholder="Nombre de usuario"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <FaLock size={20} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-xl text-slate-800 transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
              >
                {showPassword ? <HiEye size={24} /> : <HiEyeOff size={24} />}
              </button>
            </div>
          </div>

          {/* Botón de Ingreso Potente */}
          <button
            type="submit"
            disabled={isSubmitting || profilesLoading}
            className={`
              w-full py-6 rounded-[1.5rem] font-black text-lg uppercase tracking-[0.2em] text-white shadow-2xl transition-all duration-300 transform active:scale-95
              ${isSubmitting 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-slate-900 hover:bg-indigo-600 hover:scale-[1.02] shadow-slate-200"}
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-4">
                <FaCircleNotch className="animate-spin" />
                <span>Validando...</span>
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          {/* Registro con estilo limpio */}
          <div className="text-center mt-6">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 font-black uppercase tracking-tighter hover:text-slate-900 transition-colors"
            >
              ¿No tenés cuenta? Registrate acá
            </a>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-50 text-center text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] opacity-50">
          © 2026 Turnate • Executive Professional
        </div>
      </div>
    </div>
  );
};

export default Login;