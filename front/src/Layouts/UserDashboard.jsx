// src/components/MiCuenta.jsx (UserDashboard.jsx)
import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import useConsultorioById from '../../customHooks/useConsultorioxId';
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';
import { RingLoader } from 'react-spinners';

const UserDashboard = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Mejor manejo de datos del consultorio desde localStorage
  const storedConsultorio = JSON.parse(localStorage.getItem('consultorio') || 'null');
  const consultorioId = location.state?.consultorio?.id || storedConsultorio?.id;

  // ⚠️ NOTA: Estás usando hardcoded ID (2) - debería ser consultorioId
  const { consultorio: consultorioDataArray, isLoading, error } = useConsultorioById(consultorioId);
  const consultorio = consultorioDataArray ? consultorioDataArray[0] : null;

  // ✅ Guardar en localStorage si se cargó correctamente
  useEffect(() => {
    if (consultorio) {
      try {
        localStorage.setItem('consultorio', JSON.stringify(consultorio));
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
    }
  }, [consultorio]);

  // ✅ Manejo mejorado del logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('consultorio');
      // Llamar a la función onLogout si existe
      if (onLogout && typeof onLogout === 'function') {
        onLogout();
      }
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    } finally {
      // Siempre navegar al inicio
      navigate('/');
    }
  };

  // ✅ PRIMERO verificamos loading - Mostrar pantalla de carga primero
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <RingLoader color="#4F46E5" loading={isLoading} size={60} />
          <p className="text-gray-700 text-lg mt-4">Cargando información del consultorio...</p>
        </div>
      </div>
    );
  }

  // ✅ SEGUNDO verificamos error - Solo si ya terminó de cargar
  if (error) {
    // Limpiar localStorage en caso de error crítico
    if (error.message.includes('No autorizado') || error.message.includes('401')) {
      localStorage.removeItem('consultorio');
    }
    
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">
            Error al cargar datos del consultorio: {error.message}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // ✅ TERCERO verificamos si hay datos - Solo si ya terminó de cargar y no hay error
  if (!consultorio && !storedConsultorio) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">
            No se encontraron datos para el consultorio. Por favor, inicia sesión.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // ✅ Si todo está bien, mostramos el dashboard
  const consultorioToUse = consultorio || storedConsultorio;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-6 rounded-t-2xl shadow-md border-b border-gray-200 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            ¡Bienvenido!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-base border border-red-300 hover:border-red-500"
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt className="mr-2" />
            Cerrar Sesión
          </button>
        </header>

        {consultorioToUse?.tipo === 'propio' ? (
          <PanelConsultorioPropio consultorioData={consultorioToUse} onLogout={handleLogout} />
        ) : (
          <PanelCentroMedico consultorioData={consultorioToUse} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;