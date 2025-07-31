import axios from 'axios';
const BorrarTodosLosTurnosModal = ( { idConsultorio, idProfesional, fecha, onClose, actualizarTurnos, resetearFecha } ) => {

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
          onClose(); // Cierra el modal
      
          setTimeout(() => {
            actualizarTurnos()
            resetearFecha()
          }, 1000); // Espera 1 segundo antes de actualizar los turnos
         
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
                        onClick={()=> onClose()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </section>
    )
}

export default BorrarTodosLosTurnosModal
