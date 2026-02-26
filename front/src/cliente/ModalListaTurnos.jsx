// src/components/ModalListaTurnos.jsx
import { FaTimes, FaUser, FaClock, FaCircle } from "react-icons/fa";

const ModalListaTurnos = ({ turnos, onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const turnosHoy = turnos?.filter(
    (turno) =>
      turno.fecha.split('T')[0] === today &&
      (turno.estado === 'reservado' || turno.estado === 'completado')
  ) || [];

  const formatearHora = (hora) => {
    if (!hora) return "";
    if (typeof hora === "string") return hora.slice(0, 5);
    if (hora instanceof Date) return hora.toTimeString().slice(0, 5);
    return hora;
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'reservado':
        return 'text-blue-600 bg-blue-50';
      case 'completado':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay Sólido sin Blur */}
      <div 
        className="absolute inset-0 bg-gray-900/70 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Contenedor del Modal Compacto */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header Sencillo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Turnos de hoy</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString('es-AR')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Cuerpo de la Lista */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {turnosHoy.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm font-medium">No hay actividad para el día de hoy.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {turnosHoy.map((turno) => (
                <div
                  key={turno.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                      <FaUser size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        {turno.nombre_paciente} {turno.apellido_paciente}
                      </p>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <FaClock size={12} className="text-blue-500" />
                        <span>{formatearHora(turno.hora)} hs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] font-bold uppercase ${getStatusBadge(turno.estado)}`}>
                    <FaCircle size={6} />
                    {turno.estado}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Minimalista */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <span>{turnosHoy.length} Pacientes agendados</span>
          <button 
            onClick={onClose}
            className="text-blue-600 hover:underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalListaTurnos;