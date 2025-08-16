import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const BorrarTurno = ({ idTurno, onClose, actualizarTurnos }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Previene scroll del fondo
  document.body.style.overflow = 'hidden';

  const handleBorrarTurno = async () => {
    setIsDeleting(true);
    if (!idTurno) {
      toast.error('❌ ID de turno no válido');
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/api/borrarTurno/${idTurno}`);

      toast.info(
        <div className="flex items-center gap-2 text-sm">
          <FaTrashAlt /> Borrando turno
        </div>,
        { autoClose: 1000 }
      );

      if (response.status === 200) {
        

        // Actualizar lista y cerrar
        setTimeout(() => {
          actualizarTurnos();
          onClose();
        }, 1500);
      } else {
        toast.error('❌ Error al eliminar el turno');
      }
    } catch (error) {
      console.error('Error al borrar turno:', error);
      toast.error(
        `❌ ${error.response?.data?.message || 'Error al eliminar el turno'}`
      );
    } finally {
      setIsDeleting(false);
     
    }
  };

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con icono */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <FaTrashAlt size={20} />
              </div>
              <h3 className="text-2xl font-bold">Eliminar Turno</h3>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-white hover:bg-white/20 rounded-full p-1 transition disabled:opacity-50"
              aria-label="Cerrar"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>

          {/* Cuerpo */}
          <div className="p-6 space-y-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              ¿Estás seguro de que deseas eliminar este turno? Esta acción no se puede deshacer.
            </p>

            {/* Advertencia visual */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                El turno será eliminado permanentemente.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium disabled:opacity-70"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleBorrarTurno}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <FaTrashAlt /> Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BorrarTurno;