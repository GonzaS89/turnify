// src/components/MiCuenta.jsx (UserDashboard.jsx)
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import useConsultorioById from '../../customHooks/useConsultorioxId'; // Importa tu custom hook
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';

const UserDashboard = () => {
  const location = useLocation();

  // Obtén el ID del consultorio.
  // Idealmente, este ID debería persistir en localStorage o un contexto de autenticación
  // después del login, para que no se pierda al recargar.
  // Por ahora, lo tomamos de location.state como fallback.
  const consultorioId = location.state?.consultorio?.id;

  console.log('Consultorio ID:', consultorioId);


  // Usa tu custom hook para obtener los datos del consultorio
  const { consultorio: consul, loading, error } = useConsultorioById(consultorioId);

  const consultorio = consul[0]

  console.log('Datos del consultorio:', consultorio);




  // Manejo de estados de carga y error
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
          <Link to="/">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Volver al Inicio
            </button>
          </Link>
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
          <Link to="/">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Volver al Inicio
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Lógica de renderizado condicional
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 mt-[150px]">
      <div className="max-w-6xl mx-auto">
        {consultorio?.tipo === 'propio' ? (
          <PanelConsultorioPropio consultorioData={consultorio} />
        ) : (
          <PanelCentroMedico consultorioData={consultorio} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
