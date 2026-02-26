// src/components/cliente/BorrarTodosLosTurnosModal.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrashAlt, FaTimes, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const BorrarTodosLosTurnosModal = ({ idConsultorio, idProfesional, fecha, onClose, actualizarTurnos, resetearFecha }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Manejo de scroll y bloqueo de fondo
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleBorrarTodos = async () => {
    if (!idConsultorio || !idProfesional || !fecha) {
      toast.error('❌ Datos incompletos para procesar la solicitud');
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(`${API_URL}/api/borrarTodosLosTurnos`, {
        data: { IdConsultorio: idConsultorio, idProfesional, fecha },
      });

      toast.warning(
        <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
          <FaTrashAlt /> Vaciando Agenda...
        </div>
      );

      setTimeout(() => {
        actualizarTurnos();
        resetearFecha();
        onClose();
        setIsDeleting(false);
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      toast.error(`❌ ${error.response?.data?.message || 'Error al eliminar turnos'}`);
      setIsDeleting(false);
    } 
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6 font-sans">
      <ToastContainer position='bottom-right' autoClose={1000} theme="colored" />
      
      {/* Overlay con blur Premium */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
        onClick={!isDeleting ? onClose : null}
      ></div>

      {/* Contenedor del Modal */}
      <div 
        className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-red-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header de Alerta */}
        <div className="bg-red-600 text-white p-8 pb-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-lg">
              <FaTrashAlt size={30} className="text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              ¿Vaciar Agenda?
            </h3>
            <p className="text-red-100 font-bold text-[10px] uppercase tracking-[0.2em] italic">
              Acción Irreversible
            </p>
          </div>
          {/* Decoración circular de fondo */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        {/* Cuerpo del Mensaje */}
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-slate-500 font-medium leading-relaxed">
              Estás por eliminar <span className="text-slate-800 font-black italic">todos los horarios</span> programados para la fecha seleccionada.
            </p>
            
            <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[2rem] flex items-center justify-center gap-4 animate-pulse">
              <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
              <div className="text-left">
                <p className="text-red-400 font-black text-[9px] uppercase tracking-widest leading-none mb-1">Fecha de Limpieza</p>
                <p className="text-red-700 font-black text-lg tracking-tighter">
                  {new Date(fecha + "T12:00:00").toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Botonera Premium */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleBorrarTodos}
              disabled={isDeleting}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3
                ${isDeleting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200 active:scale-95'}`}
            >
              {isDeleting ? (
                <><FaSpinner className="animate-spin" /> PROCESANDO...</>
              ) : (
                <><FaTrashAlt /> CONFIRMAR ELIMINACIÓN</>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full py-5 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-800 transition-colors disabled:opacity-50"
            >
              Cancelar y volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrarTodosLosTurnosModal;