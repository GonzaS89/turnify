
import { FaCalendarCheck, FaUserMd, FaClinicMedical, FaUsers, FaPlusSquare, FaCalendarPlus } from 'react-icons/fa';

const PanelCentroMedico = ({ consultorioData: consultorio }) => { // Recibe consultorioData
  // Get current date for display
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!consultorio) {
    return <p className="text-red-500 text-center py-4">Error: Datos del consultorio no disponibles.</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">
        ¡Bienvenido, {consultorio.nombre || "Centro Médico"}! {/* Usa consultorioData.nombre */}
      </h1>
      <p className="text-gray-600 mb-2 text-lg sm:text-xl">
        Panel de Gestión del Centro Médico
      </p>
      <p className="text-gray-500 mb-8 text-base sm:text-lg">
        Hoy es: <span className="font-semibold capitalize">{currentDate}</span>
      </p>

      {/* Quick Access / Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Today's Appointments */}
        <div className="bg-blue-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaCalendarCheck className="text-blue-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Turnos de Hoy</h3>
          <p className="text-gray-600 text-sm">Ver la agenda del día.</p>
          <span className="text-blue-700 font-bold text-2xl mt-2">12</span> {/* Placeholder */}
          <p className="text-xs text-gray-500">turnos pendientes</p>
        </div>

        {/* Manage Doctors */}
        <div className="bg-purple-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaUserMd className="text-purple-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Gestionar Médicos</h3>
          <p className="text-gray-600 text-sm">Administra tu equipo médico.</p>
          <span className="text-purple-700 font-bold text-2xl mt-2">5</span> {/* Placeholder */}
          <p className="text-xs text-gray-500">médicos activos</p>
        </div>

        {/* Patient Management */}
        <div className="bg-teal-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaUsers className="text-teal-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Base de Pacientes</h3>
          <p className="text-gray-600 text-sm">Accede a los datos de tus pacientes.</p>
          <span className="text-teal-700 font-bold text-2xl mt-2">345</span> {/* Placeholder */}
          <p className="text-xs text-gray-500">pacientes registrados</p>
        </div>

        {/* Add Appointment Button */}
        <div className="bg-green-50 p-5 rounded-xl shadow-md flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <FaCalendarPlus className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-gray-800 text-lg">Agregar Turno</h3>
          <p className="text-gray-600 text-sm">Registra un nuevo turno.</p>
          <span className="text-green-700 font-bold text-2xl mt-2">+</span>
          <p className="text-xs text-gray-500">crear nuevo</p>
        </div>
      </div>

      {/* Upcoming Appointments (or Daily Schedule) */}
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Turnos Pendientes
        </h2>
        <div className="bg-gray-100 p-5 rounded-lg border border-gray-200">
          {false ? (
            <p className="text-gray-700 text-center py-4">No hay turnos programados para hoy.</p>
          ) : (
            <ul className="space-y-3">
              <li className="p-3 bg-white rounded-md shadow-sm border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-blue-700">Paciente: Juan Pérez</p>
                  <p className="text-sm text-gray-600">Dr. García - 10:00 AM</p>
                </div>
                <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors">Ver Detalles</button>
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-blue-700">Paciente: María López</p>
                  <p className="text-sm text-gray-600">Dra. Fernández - 11:30 AM</p>
                </div>
                <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors">Ver Detalles</button>
              </li>
            </ul>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Ver Agenda Completa
            </button>
            <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
              <FaCalendarPlus className="text-xl" />
              <span>Agregar Turno</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clinic Settings / Account Management */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Configuración del Consultorio
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2">
            <FaClinicMedical className="text-xl" />
            <span>Datos del Consultorio</span>
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2">
            <FaUserMd className="text-xl" />
            <span>Administrar Personal</span>
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2">
            <FaPlusSquare className="text-xl" />
            <span>Agregar Especialidad</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelCentroMedico;