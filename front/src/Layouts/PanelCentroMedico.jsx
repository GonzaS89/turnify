import { useState } from 'react';
import { FaUserMd, FaClinicMedical, FaUsers, FaPlusSquare, FaCalendarPlus } from 'react-icons/fa';
import GestionProfesionales from './components/GestionProfesionales';
import GenerarTurnosModal from './components/GenerarTurnosModal';
import TurnList from './TurnList';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import GestionCoberturas from './components/GestionCoberturas';
import CountUp from 'react-countup';
import { FaShieldAlt } from 'react-icons/fa';
import Coberturas from './cards/Coberturas';

const PanelCentroMedico = ({ consultorioData: consultorio }) => {
  // Fecha actual formateada
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const consultorioID = consultorio?.id;
  const { profesional: profesionales, isLoading, error } = useProfesionalxIdConsultorio(consultorioID);
  const numProfesionales = profesionales?.length || 0;

  const [showGestionMedicos, setShowGestionMedicos] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false);
  const [showCoberturasModal, setShowCoberturasModal] = useState(false);
  const [profesionalID, setProfesionalID] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const recibirProfesionalID = (value) => {
    setProfesionalID(value);
  };

  const actualizarTurnos = () => {
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setRefreshTrigger(0), 100);
  };

  const handleOpenCoberturasModal = () => {
    setShowCoberturasModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-5 sm:p-8 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
          ¡Bienvenido, {consultorio?.nombre || "Centro Médico"}!
        </h1>
        <p className="text-gray-600 text-lg">Panel de Gestión del Centro Médico</p>
        <p className="text-gray-500 text-sm mt-1">
          Hoy es: <span className="font-semibold text-blue-700 capitalize">{currentDate}</span>
        </p>
      </div>

      {/* Sección de KPIs / Acceso Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Gestionar Médicos */}
        <div
          onClick={() => setShowGestionMedicos(true)}
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <FaUserMd className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Gestionar Médicos</h3>
          <p className="text-gray-600 text-sm mb-3">Administra tu equipo médico.</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">
              <CountUp end={numProfesionales} duration={1.5} />
            </span>
            <span className="text-xs text-gray-500">activos</span>
          </div>
        </div>

        {/* Base de Pacientes */}
        <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 opacity-80">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg text-white">
              <FaUsers className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Base de Pacientes</h3>
          <p className="text-gray-600 text-sm mb-3">Accede a los datos de tus pacientes.</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-teal-600">345</span>
            <span className="text-xs text-gray-500">registrados</span>
          </div>
        </div>

  

        {/* Coberturas Médicas */}
        <div
          onClick={handleOpenCoberturasModal}
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
              <FaShieldAlt className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Coberturas Médicas</h3>
          <p className="text-gray-600 text-sm mb-3">Gestiona obras sociales y prepagas.</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">📋</span>
            <span className="text-xs text-gray-500">configurar</span>
          </div>
        </div>
      </div>

      {/* Listado de Turnos */}
      {showModalTurnos && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <TurnList
            profesionalId={profesionalID}
            consultorioId={consultorioID}
            onClose={() => setShowModalTurnos(false)}
            openModalHabilitarTurnos={() => setShowModal(true)}
            refreshTrigger={refreshTrigger}
            tipoConsultorio={consultorio.tipo}
            handleActualizarTurnos={actualizarTurnos}
          />
        </div>
      )}

      {/* Modales (mantenidos fuera del flujo principal) */}
      {showModal && (
        <GenerarTurnosModal
          medico={profesionalID}
          consultorio={consultorioID}
          closeModalHabilitarTurnos={() => setShowModal(false)}
          actualizarTurnos={actualizarTurnos}
        />
      )}

      {showGestionMedicos && (
        <GestionProfesionales
          openModalTurnos={() => setShowModalTurnos(true)}
          closeModalGestion={() => setShowGestionMedicos(false)}
          consultorio={consultorio}
          enviarProfesionalID={recibirProfesionalID}
        />
      )}

      {/* Modal de Coberturas */}
      <GestionCoberturas
        isOpen={showCoberturasModal}
        onClose={() => setShowCoberturasModal(false)}
        consultorioId={consultorio?.id}
      />
    </div>
  );
};

export default PanelCentroMedico;