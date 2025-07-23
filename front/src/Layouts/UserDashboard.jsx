// src/components/MiCuenta.jsx (UserDashboard.jsx)
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { FaSignOutAlt } from 'react-icons/fa'; // Importamos el icono para cerrar sesión
import useConsultorioById from '../../customHooks/useConsultorioxId';
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';

// Se añade 'onLogout' como una prop esperada
const UserDashboard = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para la navegación programática

  // 1. Obtención del ID del consultorio
  // Considera almacenar el consultorioId en localStorage o un contexto de autenticación
  // para persistencia y para evitar depender únicamente de location.state.
  const consultorioId = location.state?.consultorio?.id;

  // 2. Uso del custom hook para obtener los datos del consultorio
  const { consultorio: consultorioDataArray, loading, error } = useConsultorioById(consultorioId);
  const consultorio = consultorioDataArray ? consultorioDataArray[0] : null;

  // console.log('Datos del consultorio:', consultorio); // Para depuración

  // 3. Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Cargando información del consultorio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">
            Error al cargar datos del consultorio: {error.message}
          </p>
          <button
            onClick={() => navigate('/')} // Usa navigate para ir al inicio
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Si no hay consultorio después de cargar (y sin error), significa que el ID no era válido o no se encontró
  if (!consultorio) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">
            No se encontraron datos para el consultorio. Por favor, inicia sesión.
          </p>
          <button
            onClick={() => navigate('/')} // Usa navigate para ir al inicio
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // 4. Valores derivados para el renderizado
  const consultorioName = consultorio?.nombre || 'tu consultorio'; // Nombre del consultorio para el saludo

  // 5. Estructura Principal del JSX
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* --- Header del Dashboard --- */}
        <header className="flex justify-between items-center bg-white p-6 rounded-t-2xl shadow-md border-b border-gray-200 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            ¡Bienvenido!
          </h1>
      
            <button
              onClick={onLogout}
              className="flex items-center text-red-500 hover:text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-base border border-red-300 hover:border-red-500"
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt className="mr-2" />
              Cerrar Sesión
            </button>
        
        </header>
        {/* --- Fin del Header --- */}

        {/* Renderizado condicional del panel principal basado en el tipo de consultorio */}
        {consultorio?.tipo === 'propio' ? (
          <PanelConsultorioPropio consultorioData={consultorio} onLogout={onLogout} />
        ) : (
          <PanelCentroMedico consultorioData={consultorio} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;