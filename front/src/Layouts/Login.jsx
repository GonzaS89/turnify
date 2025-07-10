import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useAllConsultorios from "../../customHooks/useAllConsultorios";

const Login = ({ closeLogin }) => {
  const { consultorios, isLoading, error: fetchError } = useAllConsultorios(); 
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');


  useEffect(() => {
    setLoginError('');
  }, [username, password]);

  const handleLogin = (e) => {
    e.preventDefault(); 

    setLoginError(''); 

    if (isLoading) {
      setLoginError("Cargando datos de consultorios, por favor espera...");
      return;
    }

    if (fetchError) {
      setLoginError(`Error al cargar datos: ${fetchError.message || 'Error desconocido'}`);
      return;
    }

    // Ensure consultorios is an array and not empty
    if (!consultorios || consultorios.length === 0) {
      setLoginError("No hay consultorios registrados para verificar credenciales.");
      return;
    }

    const consultorio = consultorios.find(
      (c) => c.usuario === username && c.contrasena === password
    );

    if (consultorio) {
 
      console.log("Login exitoso para:", consultorio.nombre || consultorio.usuario);
  


      navigate("/micuenta", { state: { consultorio } }); 
      closeLogin();
    } else {

      setLoginError("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50 backdrop-blur-md p-4 sm:p-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center text-center gap-5 sm:gap-6 border border-blue-100 relative overflow-hidden">
          {/* Subtle gradient overlay for extra detail */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.8) 0%, transparent 70%)' }}></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at bottom right, rgba(173,216,230,0.8) 0%, transparent 70%)' }}></div>

          {/* Back Button */}
          <button
            onClick={() => closeLogin()} // Function to close the login modal
            className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
            aria-label="Go back"
            title="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3 leading-tight tracking-tight">
            Login
          </h2>
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            Ingresa las credenciales de tu cuenta para acceder a TurniFy.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            {/* Username Input with Label */}
            <div>
              <label htmlFor="username" className="sr-only">Usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Usuario"
                value={username} // Controlled component
                onChange={(e) => setUsername(e.target.value)} // Update state on change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
                aria-label="Ingresa tu usuario"
                required // Make input required
              />
            </div>

            {/* Password Input with Label */}
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password} // Controlled component
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800"
                aria-label="Ingresa tu contraseña"
                required // Make input required
              />
            </div>

            {/* Loading/Error Feedback */}
            {isLoading && (
              <p className="text-blue-600 text-sm animate-pulse">Cargando datos...</p>
            )}
            {fetchError && (
              <p className="text-red-500 text-sm">Error: {fetchError.message}</p>
            )}
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <button
              type="submit" // Important: set type to submit for form handling
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading} // Disable button while loading
            >
              Login
            </button>
          </form>

          {/* Optional: Add a "Forgot Password?" link */}
          <a href="#" className="text-sm text-blue-600 hover:underline mt-4">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;