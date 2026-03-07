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
      }, 1000);
      
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Credenciales inválidas.');
      setIsSubmitting(false);
    }
  };

  return (
    // Se mantiene 'fixed inset-0' para el overlay, pero agregamos 'overflow-y-auto' 
    // por si el contenido excede la altura en pantallas muy pequeñas.
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="relative bg-white rounded-[2rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-8 sm:p-12 w-full max-w-md border border-slate-100 animate-fade-in-up my-auto">
        
        {/* Botón Cerrar */}
        <button
          onClick={closeLogin}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
          aria-label="Cerrar"
        >
          <FaTimes size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-indigo-100">
            <FaShieldAlt size={28} />
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 italic">
            TURNATE<span className="text-indigo-600 not-italic">.</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[10px]">
            Acceso Profesionales
          </p>
        </div>

        {/* Error Message */}
        {(loginError || fetchError) && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
            {loginError || fetchError?.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          {/* Input Usuario */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Usuario
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <FaUser size={16} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-lg text-slate-800 transition-all placeholder:text-slate-300"
                placeholder="Nombre de usuario"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <FaLock size={16} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-lg text-slate-800 transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <HiEye size={20} /> : <HiEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || profilesLoading}
            className={`w-full py-4 mt-2 rounded-2xl font-black text-sm uppercase tracking-[0.1em] text-white transition-all transform active:scale-[0.98] 
            ${isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-indigo-600"}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <FaCircleNotch className="animate-spin" />
                Validando...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <div className="text-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-600 font-black uppercase tracking-tighter hover:text-slate-900 transition-colors"
            >
              ¿No tenés cuenta? Registrate acá
            </a>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] opacity-50">
          © 2026 Turnate
        </div>
      </div>
    </div>
  );
};

export default Login;