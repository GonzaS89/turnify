// src/components/BorrarTurno.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrashAlt, FaTimes, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const BorrarTurno = ({ idTurno, onClose, actualizarTurnos }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Manejo de scroll y bloqueo de fondo
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleBorrarTurno = async () => {
    if (!idTurno) {
      toast.error('❌ ID de turno no válido');
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.delete(`${API_URL}/api/borrarTurno/${idTurno}`);

      if (response.status === 200) {
        toast.warning(
          <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <FaTrashAlt /> Eliminando horario...
          </div>
        );

        // Actualizar lista y cerrar tras el delay visual
        setTimeout(() => {
          actualizarTurnos();
          onClose();
          setIsDeleting(false);
        }, 1500);
      } else {
        toast.error('❌ Error al eliminar el turno');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error al borrar turno:', error);
      toast.error(
        `❌ ${error.response?.data?.message || 'Error al eliminar el turno'}`
      );
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
        {/* Header de Alerta Individual */}
        <div className="bg-red-600 text-white p-8 pb-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-lg">
              <FaTrashAlt size={30} className="text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              ¿Eliminar Horario?
            </h3>
            <p className="text-red-100 font-bold text-[10px] uppercase tracking-[0.2em] italic">
              Esta acción es permanente
            </p>
          </div>
          {/* Decoración circular de fondo */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        {/* Cuerpo del Mensaje */}
        <div className="p-8 md:p-10 space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-slate-500 font-medium leading-relaxed">
              ¿Estás seguro de que deseas eliminar este turno? El espacio quedará vacío y no podrá recuperarse.
            </p>
            
            <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[2rem] flex items-center justify-center gap-4">
              <FaExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
              <div className="text-left">
                <p className="text-red-400 font-black text-[9px] uppercase tracking-widest leading-none mb-1">ID de Referencia</p>
                <p className="text-red-700 font-black text-lg tracking-tighter">
                  #{idTurno}
                </p>
              </div>
            </div>
          </div>

          {/* Botonera Premium */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleBorrarTurno}
              disabled={isDeleting}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3
                ${isDeleting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200 active:scale-95'}`}
            >
              {isDeleting ? (
                <><FaSpinner className="animate-spin" /> BORRANDO...</>
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
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrarTurno;