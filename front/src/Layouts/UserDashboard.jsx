// src/components/MiCuenta.jsx (UserDashboard.jsx)
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaHome, FaExclamationCircle } from 'react-icons/fa';
import useConsultorioById from '../../customHooks/useConsultorioxId';
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';
import { RingLoader } from 'react-spinners';

const UserDashboard = ({ onLogout, enviarTurnoYOrden, enviarPass }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener consultorio desde localStorage
  const storedConsultorio = JSON.parse(localStorage.getItem('consultorio') || 'null');
  const consultorioId = storedConsultorio?.id;

  const { consultorio: consultorioDataArray, isLoading, error } = useConsultorioById(consultorioId);
  const consultorio = consultorioDataArray ? consultorioDataArray[0] : null;

  const password = localStorage.getItem('userPassword') || '';

  // Enviar password al padre (si es necesario)
  useEffect(() => {
    if (password && enviarPass) {
      enviarPass(password);
    }
  }, [password, enviarPass]);

  // Guardar consultorio en localStorage si se carga correctamente
  useEffect(() => {
    if (consultorio) {
      try {
        localStorage.setItem('consultorio', JSON.stringify(consultorio));
      } catch (err) {
        console.error('Error al guardar consultorio en localStorage:', err);
      }
    }
  }, [consultorio]);

  // Manejo de cierre de sesión
  const handleLogout = () => {
    try {
      localStorage.removeItem('consultorio');
      localStorage.removeItem('userPassword');
      if (onLogout && typeof onLogout === 'function') {
        onLogout();
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      navigate('/');
    }
  };

  // === Pantalla de carga ===
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-blue-100">
          <RingLoader color="#4F46E5" size={60} />
          <p className="text-gray-700 text-lg mt-6 font-medium">Cargando tu información...</p>
          <p className="text-gray-500 text-sm mt-2">Estamos preparando tu panel de control.</p>
        </div>
      </div>
    );
  }

  // === Manejo de errores ===
  if (error) {
    if (error.message.includes('No autorizado') || error.message.includes('401')) {
      localStorage.removeItem('consultorio');
      localStorage.removeItem('userPassword');
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-red-200">
          <FaExclamationCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-red-600 mb-4">{error.message || 'No se pudo cargar el consultorio.'}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
          >
            <FaHome /> Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // === Estado vacío (sin consultorio) ===
  if (!consultorio && !storedConsultorio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-gray-200">
          <FaExclamationCircle className="text-orange-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sin acceso</h2>
          <p className="text-gray-600 mb-4">No se encontró información de tu consultorio. Por favor, inicia sesión nuevamente.</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
          >
            <FaHome /> Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Usar el consultorio disponible
  const consultorioToUse = consultorio || storedConsultorio;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con gradiente */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-b-2xl shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            ¡Bienvenido, {consultorioToUse?.usuario || 'Usuario'}!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-700/90 hover:bg-red-700/50 rounded-xl text-white font-semibold transition backdrop-blur-sm border border-white/30"
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {consultorioToUse.tipo === 'Particular' ? (
          <PanelConsultorioPropio
            consultorioData={consultorioToUse}
            enviarTurnoYOrden={enviarTurnoYOrden}
          />
        ) : (
          <PanelCentroMedico
            consultorioData={consultorioToUse}
            password={password}
          />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;