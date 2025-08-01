import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
const BorrarTodosLosTurnosModal = ({ idConsultorio, idProfesional, fecha, onClose, actualizarTurnos, resetearFecha }) => {


  const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);

  useEffect(() => {
    showModalConfirmacion && setTimeout(() => {
      setShowModalConfirmacion(false);
      onClose(); // Cierra el modal
    }
      , 2000);
  }, [showModalConfirmacion])

  async function borrarTodosLosTurnos() {
    try {
      const response = await axios.delete('http://localhost:3006/api/borrarTodosLosTurnos', {
        data: {
          IdConsultorio: idConsultorio,
          idProfesional,
          fecha
        }
      });

      console.log("Éxito:", response.data.message);

      setShowModalConfirmacion(true)

      setTimeout(() => {
        setShowModalConfirmacion(false)
      }, 2000);

      setTimeout(() => {
        actualizarTurnos()
        resetearFecha()
      }, 2000); // Espera 1 segundo antes de actualizar los turnos

      // Actualiza el estado, refresca turnos, etc.
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un estado de error (4xx, 5xx)
        console.error('Error del servidor:', error.response.data);
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        console.error('No hubo respuesta del servidor:', error.request);
      } else {
        // Otro error (ej: configuración)
        console.error('Error:', error.message);
      }
    }
  }




  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[300]">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Borrar Todos los Turnos</h2>
        <p className="mb-4">¿Estás seguro de que deseas borrar todos los turnos?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() =>
              borrarTodosLosTurnos()

            }
          >
            Borrar Todos
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => onClose()}
          >
            Cancelar
          </button>
        </div>
      </div>
      {showModalConfirmacion && (
        <section className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[400]'>
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 max-w-md w-full mx-auto transform transition-all hover:shadow-xl duration-300">
            <div className="flex items-center mb-4">
              {/* Ícono de verificación con react-icons */}
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IoCheckmarkCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="ml-3 text-2xl font-bold text-gray-800">Turnos Borrados</h2>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Todos los turnos han sido eliminados exitosamente.
            </p>
          </div>
        </section>


      )}

    </section>

  )


}

export default BorrarTodosLosTurnosModal
