import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const LoginAdmin = ({ closeLogin }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(''); // 👈 ¡FALTABA ESTA STATE!

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(''); // Limpiar errores anteriores

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        usuario: username,
        contraseña: password, // 👈 Asegúrate de que el backend espere "contraseña" (no "password")
      });

      const { perfil, token } = response.data;

      // ✅ Guardar datos en localStorage (¡solo el token es seguro!)
      localStorage.setItem('authToken', token);
      localStorage.setItem('perfil', JSON.stringify(perfil));
      // ❌ NO GUARDAR LA CONTRASEÑA EN LOCALSTORAGE — ES UN RIESGO DE SEGURIDAD GRAVE

      setTimeout(() => {
        setIsSubmitting(false);
        closeLogin?.();
      }, 1500);

    } catch (err) {
      console.error('Error en login:', err); // Para debugging en desarrollo
      setLoginError(
        err.response?.data?.message ||
        'Usuario o contraseña incorrectos. Por favor, intenta nuevamente.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-7">Verifica tu identidad</h2>

        {/* Mostrar mensaje de error */}
        {loginError && (
          <p className="text-red-600 text-sm mb-6 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
            {loginError}
          </p>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username} // 👈 ¡FALTABA EL VALUE!
          onChange={(e) => setUsername(e.target.value)} // 👈 ¡FALTABA EL onChange!
          className="w-full px-5 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password} // 👈 ¡FALTABA EL VALUE!
          onChange={(e) => setPassword(e.target.value)} // 👈 ¡FALTABA EL onChange!
          className="w-full px-5 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />

        <button
          type="submit"
          onClick={handleLogin} // 👈 Ya está bien
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
        </button>

        {/* Botón para cerrar el modal (opcional, buena UX) */}
        {/* <button
          type="button"
          // onClick={navigate('/')}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Cancelar
        </button> */}
      </div>
    </section>
  );
};

export default LoginAdmin;