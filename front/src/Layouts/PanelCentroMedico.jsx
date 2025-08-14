// src/components/PanelCentroMedico.jsx
import { useState } from 'react';
import { FaUserMd, FaShieldAlt, FaCalendarPlus } from 'react-icons/fa';
import GestionProfesionales from './components/GestionProfesionales';
import TurnList from './TurnList';
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router';

const PanelCentroMedico = ( { consultorioData: consultorio }) => {
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const consultorioId = consultorio?.id;

  const navigate = useNavigate();

  const { profesional: profesionales, isLoading, error } = useProfesionalxIdConsultorio(consultorioId);
  const numProfesionales = profesionales?.length || 0;

  const [showGestionMedicos, setShowGestionMedicos] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false);
  const [profesionalID, setProfesionalID] = useState(null);

  const recibirProfesionalID = (value) => {
    setProfesionalID(value);
  };

  const actualizarTurnos = () => {
    // Puedes agregar lógica de refresco si es necesario
  };


  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 max-w-7xl mx-auto">
      
      {/* ===== ENCABEZADO ===== */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          <span className='capitalize'>{consultorio?.tipo}</span> {consultorio?.nombre || "Centro Médico"}
        </h1>
        <p className="text-gray-600 text-lg">Panel de Gestión</p>
        <p className="text-gray-500 text-sm mt-1">
          Hoy es: <span className="font-semibold text-blue-700 capitalize">{currentDate}</span>
        </p>
      </div>

      {/* ===== KPIs / ACCESO RÁPIDO ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Gestionar Médicos */}
        <div
          onClick={() => navigate(`/micuenta/gestionprofesionales/${consultorioId}`)}
          className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white group-hover:from-purple-600 group-hover:to-purple-700 transition">
              <FaUserMd className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Gestionar Médicos</h3>
          <p className="text-gray-600 text-sm mb-3">Administra tu equipo médico.</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">
              <CountUp end={numProfesionales} duration={1.5} />
            </span>
            <span className="text-xs text-gray-500">médicos activos</span>
          </div>
        </div>

        {/* Coberturas Médicas */}
        <div
          onClick={()=> navigate(`/micuenta/gestioncoberturas/${consultorioId}`)}
          className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white group-hover:from-blue-600 group-hover:to-indigo-700 transition">
              <FaShieldAlt className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Coberturas Médicas</h3>
          <p className="text-gray-600 text-sm mb-3">Gestiona obras sociales y prepagas aceptadas.</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">📋</span>
            <span className="text-xs text-gray-500">configurar</span>
          </div>
        </div>
      </div>

      {/* ===== LISTADO DE TURNOS (Modal integrado) ===== */}
      {showModalTurnos && (
        <div className="bg-gray-50 rounded-xl shadow-inner p-6 mb-6 border border-gray-200">
          <TurnList
            profesionalId={profesionalID}
            consultorioId={consultorioId}
            onClose={() => setShowModalTurnos(false)}
            openModalHabilitarTurnos={() => setShowModal(true)}
            tipoConsultorio="centro"
            actualizarTurnos={actualizarTurnos}
          />
        </div>
      )}

    

      {showGestionMedicos && (
        <GestionProfesionales
          openModalTurnos={() => setShowModalTurnos(true)}
          closeModalGestion={() => setShowGestionMedicos(false)}
          consultorio={consultorio}
          enviarProfesionalID={recibirProfesionalID}
        />
      )}

     
    </div>
  );
};

export default PanelCentroMedico;