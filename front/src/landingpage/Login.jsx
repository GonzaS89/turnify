import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAllConsultorios from "../../customHooks/useAllConsultorios";
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaTimes } from 'react-icons/fa';

const Login = ({ closeLogin }) => {
  const { consultorios, isLoading, error: fetchError } = useAllConsultorios();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mensaje =
    "Hola, quiero crear mi cuenta en Turnate. ¿Pueden ayudarme?";
  const whatsappLink = `https://wa.me/5493815588504?text=${encodeURIComponent(
    mensaje
  )}`;

 

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

      const { consultorio, token } = response.data;

      // ✅ Guardar datos necesarios en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('consultorio', JSON.stringify(consultorio));

      navigate('/micuenta');
      closeLogin?.();
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
      <div
        className="
        relative
        max-h-[95vh]
        bg-white
        rounded-2xl
        shadow-2xl
        p-8
        w-full
        max-w-md
        border
        border-gray-100
        transform
        transition-all
        duration-300
        ease-out
        animate-fade-in-up
      "
      >
        {/* Botón de cerrar */}
        <button
          onClick={closeLogin}
          className="
            absolute
            top-4
            right-4
            p-2
            rounded-full
            bg-gray-100
            hover:bg-gray-200
            transition-all
            duration-200
            text-gray-500
            hover:text-gray-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            z-10
          "
          aria-label="Cerrar"
          title="Cerrar"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <div
            className="
            w-16
            h-16
            bg-gradient-to-br
            from-blue-500
            to-indigo-600
            rounded-2xl
            flex
            items-center
            justify-center
            mx-auto
            mb-4
            text-white
            text-2xl
            shadow-lg
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2
            className="
            text-2xl
            font-bold
            text-gray-900
            mb-2
          "
          >
            Bienvenido a <span className="text-indigo-600 uppercase font-principal font-extralight">Turnate</span>
          </h2>
          <p
            className="
            text-gray-600
            text-sm
          "
          >
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo de usuario */}
          <div>
            <label
              htmlFor="username"
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Usuario
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  pl-3
                  flex
                  items-center
                  pointer-events-none
                  text-gray-400
                "
              >
                <FaUser className="h-5 w-5" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  block
                  w-full
                  pl-10
                  pr-3
                  py-3
                  border
                  border-gray-200
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:border-indigo-500
                  placeholder-gray-400
                  text-gray-800
                  transition-all
                  duration-200
                "
                placeholder="Ingresa tu usuario"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div>
            <label
              htmlFor="password"
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Contraseña
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  pl-3
                  flex
                  items-center
                  pointer-events-none
                  text-gray-400
                "
              >
                <FaLock className="h-5 w-5" />
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  block
                  w-full
                  pl-10
                  pr-10
                  py-3
                  border
                  border-gray-200
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:border-indigo-500
                  placeholder-gray-400
                  text-gray-800
                  transition-all
                  duration-200
                "
                placeholder="Ingresa tu contraseña"
                required
                disabled={isSubmitting}
              />

              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="
                  absolute
                  inset-y-0
                  right-0
                  pr-3
                  flex
                  items-center
                  text-gray-400
                  hover:text-gray-600
                  focus:outline-none
                  transition-colors
                  duration-200
                "
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <HiEye className="h-5 w-5" />
                ) : (
                  <HiEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mensajes de estado */}
          {(isLoading || fetchError || loginError) && (
            <div className="p-3 rounded-lg text-sm flex items-center gap-2">
              {isLoading && (
                <>
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-600">Cargando datos...</span>
                </>
              )}

              {fetchError && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-500">Error: {fetchError.message}</span>
                </>
              )}

              {loginError && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-500">{loginError}</span>
                </>
              )}
            </div>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`
              w-full
              py-3
              px-4
              rounded-lg
              font-semibold
              text-white
              transition-all
              duration-300
              transform
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
              disabled:opacity-70
              disabled:cursor-not-allowed
              ${
                isSubmitting
                  ? "bg-indigo-400"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] hover:shadow-lg"
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ingresando...</span>
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          {/* Botón de registro */}
          <div className="text-center mt-4">
            <a
              href={whatsappLink}
              onClick={() => navigate('/registro')}
              className="
                text-sm
                text-indigo-600
                font-medium
                hover:text-indigo-800
                transition-colors
                duration-200
                underline
                hover:no-underline
              "
            >
              ¿No tenés cuenta? Crea tu cuenta aquí
            </a>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Turnate
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;