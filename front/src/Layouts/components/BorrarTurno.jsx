
import { useState } from 'react';
import axios from 'axios';

const BorrarTurno = ( { idTurno, onClose, actualizarTurnos }) => {

    const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);

    async function handleBorrarTurnos ()  {

        if(!idTurno) {
            console.error('ID de turno no proporcionado');
            return;
        }

      try {
        const response = await axios.delete(`http://localhost:3006/api/borrarTurno/${idTurno}`);
        if (response.status === 200) {
            setTimeout(() => {
                actualizarTurnos()
                onClose();
                setShowModalConfirmacion(true)
            }, 1000);
         
          // Aquí podrías actualizar el estado o hacer algo más después de borrar el turno
        } else {
          alert('Error al borrar el turno');
        }
      } catch (error) {
        console.error('Error al borrar el turno:', error);
        alert('Ocurrió un error al intentar borrar el turno');
      }


    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
        

        {showModalConfirmacion ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[201]">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Turno Borrado</h2>
                <p className="mb-4">El turno ha sido borrado exitosamente.</p>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowModalConfirmacion(false)}
                >
                    Aceptar
                </button>
                </div>
            </div>
            ):
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Borrar Turno</h2>
            <p className="mb-4">¿Estás seguro de que deseas borrar este turno?</p>
            <div className="flex justify-end space-x-2">
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleBorrarTurnos}
            >
                Borrar
            </button>
            <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={onClose}
            >
                Cancelar
            </button>
            </div>
        </div>
            }
      
    </div>
  )
}

export default BorrarTurno
