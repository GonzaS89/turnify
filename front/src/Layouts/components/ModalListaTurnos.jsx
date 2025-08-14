// ===== MODAL DE LISTA DE TURNOS =====
 const ModalListaTurnos = ({ turnos, onClose }) => {
    const today = new Date().toISOString().split('T')[0];
    const turnosHoy  = turnos?.filter(
        (turno) =>
          turno.fecha.split('T')[0] === today &&
          (turno.estado === 'reservado' || turno.estado === 'completado')
      ) || [];


      const formatearHora = (hora) => {
        if (!hora) return "";
        if (typeof hora === "string") return hora.slice(0, 5);
        if (hora instanceof Date) return hora.toTimeString().slice(0, 5);
        return hora;
      }

    
  
    const getStatusColor = (estado) => {
      switch (estado) {
        case 'reservado':
          return 'bg-blue-100 text-blue-800';
        case 'disponible':
          return 'bg-green-100 text-green-800';
        case 'completado':
          return 'bg-teal-100 text-teal-800';
        case 'cancelado':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
            <h3 className="text-2xl font-bold">Turnos de hoy - {new Date().toLocaleDateString('es-AR')}</h3>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
  
          {/* Lista */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {turnosHoy.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay turnos para hoy.</p>
            ) : (
              <ul className="space-y-3">
                {turnosHoy.map((turno) => (
                  <li
                    key={turno.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {turno.nombre_paciente} {turno.apellido_paciente}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatearHora(turno.hora)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(turno.estado)}`}
                      >
                        {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
  
          {/* Footer opcional */}
          <div className="p-4 bg-gray-100 text-center text-sm text-gray-500 border-t">
            Total: {turnosHoy.length} turnos
          </div>
        </div>
      </div>
    );
  };

  export default ModalListaTurnos