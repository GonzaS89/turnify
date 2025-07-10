// src/components/MiCuenta.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PanelConsultorioPropio from './PanelConsultorioPropio'; // Importa el panel del consultorio propio
import PanelCentroMedico from './PanelCentroMedico';       // Importa el panel del centro médico

const UserDashboard = () => {
  const location = useLocation();
  const consultorio = location.state?.consultorio;

  // Manejo de casos donde no hay datos
  if (!consultorio) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">
            Acceso no autorizado o datos no disponibles. Por favor, inicia sesión.
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
      <div className="max-w-6xl mx-auto"> {/* Elimina bg-white, shadow-xl, etc. de aquí */}
        {consultorio.tipo === 'propio' ? (
          <PanelConsultorioPropio consultorioData={consultorio} />
        ) : (
          <PanelCentroMedico consultorioData={consultorio} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;