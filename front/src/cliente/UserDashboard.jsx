// src/components/MiCuenta.jsx (UserDashboard.jsx)
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaPowerOff, FaHome, FaExclamationCircle, FaUserCircle, FaUserShield } from 'react-icons/fa';
import useAllPerfiles from '../../customHooks/useAllPerfiles';
import PanelConsultorioPropio from './PanelConsultorioPropio';
import PanelCentroMedico from './PanelCentroMedico';
import { RingLoader } from 'react-spinners';

const UserDashboard = ({ onLogout, enviarTurnoYOrden, enviarPass }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const recuperarPerfil = JSON.parse(localStorage.getItem('perfil') || 'null');
  const perfilId = recuperarPerfil?.id;

  const { perfiles, isLoading: isLoadingPerfiles, error: errorPerfiles } = useAllPerfiles();

  const perfilFiltrado = perfiles.filter((f) => f.id === perfilId);
  const perfil = perfilFiltrado[0];
  const { tipo } = perfil || {};
  const password = localStorage.getItem('userPassword') || '';

  useEffect(() => {
    if (password && enviarPass) enviarPass(password);
  }, [password, enviarPass]);

  useEffect(() => {
    if (perfil) {
      try {
        localStorage.setItem('perfil', JSON.stringify(perfil));
      } catch (err) {
        console.error('Error al guardar consultorio:', err);
      }
    }
  }, [perfil]);

  const handleLogout = () => {
    setCerrandoSesion(true);
    setTimeout(() => {
      localStorage.removeItem('perfil');
      localStorage.removeItem('userPassword');
      if (onLogout) onLogout();
      navigate('/');
      setCerrandoSesion(false);
    }, 1500);
  };

  const [medicoID, setMedicoID] = useState(null);
  const recibirMedicoID = data => setMedicoID(data);

  // === PANTALLA DE CARGA ESTILIZADA ===
  if (isLoadingPerfiles) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 z-[400]">
        <div className="flex flex-col items-center">
          <RingLoader color="#4F46E5" size={80} />
          <p className="text-slate-800 text-2xl font-black mt-8 tracking-tighter uppercase">Preparando tu Panel</p>
          <p className="text-indigo-600 font-bold text-sm tracking-widest mt-2 animate-pulse">AUTENTICANDO CREDENCIALES</p>
        </div>
      </div>
    );
  }

  // === MANEJO DE ERRORES / SIN ACCESO ===
  if (errorPerfiles || (!perfil && !recuperarPerfil)) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-6 z-[400]">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-12 text-center max-w-xl w-full">
          <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <FaExclamationCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Acceso Interrumpido</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            {errorPerfiles?.message || 'No se encontró una sesión activa. Por favor, vuelve a ingresar al sistema.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase hover:bg-indigo-600 transition-all shadow-xl"
          >
            VOLVER AL LOGIN
          </button>
        </div>
      </div>
    );
  }

  const perfilEnUso = perfil;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      
      {/* HEADER DE ALTO IMPACTO */}
      <header className="bg-slate-900 text-white p-6 md:px-12 shadow-2xl z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20">
              {tipo === 'Particular' ? <FaUserCircle className="text-3xl" /> : <FaUserShield className="text-3xl" />}
            </div>
            <div>
              <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-1">Panel de Control</p>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-none">
                ¡Hola, {perfilEnUso?.usuario}!
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              disabled={cerrandoSesion}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-lg
                ${cerrandoSesion 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-red-500/20'}`}
            >
              {cerrandoSesion ? (
                <><FaSpinner className="animate-spin" /> SALIENDO...</>
              ) : (
                <><FaPowerOff /> CERRAR SESIÓN</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 animate-slide-up">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
          {/* Aquí se inyectan los paneles con el estilo que ya traen */}
          <div className="p-2 md:p-6">
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
          </div>
        </div>

        {/* FOOTER DE ESTADO SUTIL */}
        <footer className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
            Sistema de Gestión de Turnos • Turnate Pro
          </p>
        </footer>
      </main>
    </div>
  );
};

export default UserDashboard;