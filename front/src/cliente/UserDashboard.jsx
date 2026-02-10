// src/components/MiCuenta.jsx (UserDashboard.jsx)
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaPowerOff, FaHome, FaExclamationCircle, FaUser } from 'react-icons/fa';
import useAllPerfiles from '../../customHooks/useAllPerfiles';
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';
import { RingLoader } from 'react-spinners';

const UserDashboard = ({ onLogout, enviarTurnoYOrden, enviarPass }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  // Obtener consultorio desde localStorage
  const recuperarPerfil = JSON.parse(localStorage.getItem('perfil') || 'null');
  const perfilId = recuperarPerfil?.id;

  const { perfiles, isLoading: isLoadingPerfiles, error: errorPerfiles } = useAllPerfiles();

  const perfilFiltrado = perfiles.filter((f) => f.id === perfilId);

  const perfil = perfilFiltrado[0];
  
  const { tipo } = perfil || {};

  const password = localStorage.getItem('userPassword') || '';

  // Enviar password al padre (si es necesario)
  useEffect(() => {
    if (password && enviarPass) {
      enviarPass(password);
    }
  }, [password, enviarPass]);

  // Guardar consultorio en localStorage si se carga correctamente
  useEffect(() => {
    if (perfil) {
      try {
        localStorage.setItem('perfil', JSON.stringify(perfil));
      } catch (err) {
        console.error('Error al guardar consultorio en localStorage:', err);
      }
    }
  }, [perfil]);

  // Manejo de cierre de sesión
  const handleLogout = () => {
    setCerrandoSesion(true);
    
    try {
      setTimeout(() => {
        navigate('/');
        setCerrandoSesion(false);
        localStorage.removeItem('perfil');
        localStorage.removeItem('userPassword');
        if (onLogout && typeof onLogout === 'function') {
          onLogout();
        }
      }, 1500);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const [medicoID, setMedicoID] = useState(null);

  const recibirMedicoID = data => {
    setMedicoID(data);
  };

  // === Pantalla de carga ===
  if (isLoadingPerfiles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center border border-blue-100">
          <RingLoader color="#4F46E5" size={60} />
          <p className="text-gray-800 text-lg mt-6 font-bold">Cargando tu información...</p>
          <p className="text-gray-500 text-sm mt-2">Estamos preparando tu panel de control.</p>
        </div>
      </div>
    );
  }

  // === Manejo de errores ===
  if (errorPerfiles) {
    if (errorPerfiles.message.includes('No autorizado') || errorPerfiles.message.includes('401')) {
      localStorage.removeItem('perfil');
      localStorage.removeItem('userPassword');
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center border border-red-200">
          <FaExclamationCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-red-600 mb-4">{errorPerfiles.message || 'No se pudo cargar el consultorio.'}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            <FaHome /> Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // === Estado vacío (sin consultorio) ===
  if (!perfil && !recuperarPerfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center border border-gray-200">
          <FaExclamationCircle className="text-orange-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Sin acceso</h2>
          <p className="text-gray-600 mb-4">No se encontró información de tu consultorio. Por favor, inicia sesión nuevamente.</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            <FaHome /> Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Usar el consultorio disponible
  const perfilEnUso = perfil;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimalista */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              <FaUser size={20} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Bienvenido,</p>
              <h1 className="font-bold text-lg">{perfilEnUso?.usuario || 'Usuario'}</h1>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
            aria-label="Cerrar sesión"
          >
            {cerrandoSesion ? (
              <span className="inline-flex gap-2 items-center">
                <FaSpinner className="animate-spin" size={14} /> Cerrando...
              </span>
            ) : (
              <span className="inline-flex gap-2 items-center">
                <FaPowerOff size={14} /> Salir
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tipo === 'Particular' ? (
          <PanelConsultorioPropio
            perfilData={perfilEnUso}
            enviarTurnoYOrden={enviarTurnoYOrden}
            enviarMedicoID={recibirMedicoID}
          />
        ) : (
          <PanelCentroMedico
            perfilData={perfilEnUso}
            password={password}
            profesionalVinculado={medicoID}
          />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;