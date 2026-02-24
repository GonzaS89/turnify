// src/components/MiCuenta.jsx (UserDashboard.jsx)
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaPowerOff, FaHome, FaExclamationCircle, FaUserCircle, FaBriefcaseMedical } from 'react-icons/fa';
import useAllPerfiles from '../../customHooks/useAllPerfiles';
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';
import { RingLoader } from 'react-spinners';

const UserDashboard = ({ onLogout, enviarTurnoYOrden, enviarPass }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  // Recuperar perfil de localStorage
  const recuperarPerfil = JSON.parse(localStorage.getItem('perfil') || 'null');
  const perfilId = recuperarPerfil?.id;

  const { perfiles, isLoading: isLoadingPerfiles, error: errorPerfiles } = useAllPerfiles();

  const perfilFiltrado = perfiles.filter((f) => f.id === perfilId);
  const perfil = perfilFiltrado[0];
  const { tipo } = perfil || {};
  const password = localStorage.getItem('userPassword') || '';

  // Sincronización de password
  useEffect(() => {
    if (password && enviarPass) {
      enviarPass(password);
    }
  }, [password, enviarPass]);

  // Persistencia de perfil
  useEffect(() => {
    if (perfil) {
      try {
        localStorage.setItem('perfil', JSON.stringify(perfil));
      } catch (err) {
        console.error('Error al guardar en localStorage:', err);
      }
    }
  }, [perfil]);

  const handleLogout = () => {
    setCerrandoSesion(true);
    setTimeout(() => {
      navigate('/');
      localStorage.removeItem('perfil');
      localStorage.removeItem('userPassword');
      if (onLogout && typeof onLogout === 'function') {
        onLogout();
      }
      setCerrandoSesion(false);
    }, 1500);
  };

  const [medicoID, setMedicoID] = useState(null);
  const recibirMedicoID = data => setMedicoID(data);

  // === UI: CARGANDO ===
  if (isLoadingPerfiles) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-12 text-center max-w-sm w-full border border-slate-100">
          <div className="flex justify-center mb-6">
            <RingLoader color="#4F46E5" size={60} />
          </div>
          <p className="text-slate-800 text-xl font-black tracking-tight">Cargando información</p>
          <p className="text-slate-400 text-sm mt-2 font-medium">Sincronizando perfiles...</p>
        </div>
      </div>
    );
  }

  // === UI: ERROR ===
  if (errorPerfiles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 text-center max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaExclamationCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Error de conexión</h2>
          <p className="text-slate-500 mb-8 font-medium">{errorPerfiles?.message || 'Error al obtener datos.'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
          >
            <FaHome /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  const perfilEnUso = perfil || recuperarPerfil;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <FaUserCircle size={22} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sesión activa</p>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                {perfilEnUso?.usuario || 'Mi Cuenta'}
              </h2>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={cerrandoSesion}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
              cerrandoSesion 
              ? "bg-slate-50 text-slate-300 border-slate-100" 
              : "bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            {cerrandoSesion ? (
              <><FaSpinner className="animate-spin" /> Saliendo...</>
            ) : (
              <><FaPowerOff size={14} /> Cerrar Sesión</>
            )}
          </button>
        </div>
      </nav>

      {/* --- CABECERA --- */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100">
            <FaBriefcaseMedical size={10} />
            {tipo === 'Particular' ? 'Perfil Profesional' : 'Centro Médico'}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter sm:text-5xl">
            ¡Bienvenido, {perfilEnUso?.usuario || 'Usuario'}!
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-lg max-w-2xl leading-relaxed">
            Administra tus agendas, sedes y pacientes con la mejor tecnología de gestión.
          </p>
        </div>
      </header>

      {/* --- CONTENIDO --- */}
      <main className="max-w-7xl mx-auto py-6">
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

      <footer className="max-w-7xl mx-auto px-6 py-10 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          Turnate • Gestión Profesional de Salud
        </p>
      </footer>
    </div>
  );
};

export default UserDashboard;