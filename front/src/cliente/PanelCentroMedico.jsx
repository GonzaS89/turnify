// src/components/PanelCentroMedico.jsx
import { useState, useEffect } from 'react';
import { FaUserMd, FaShieldAlt, FaCalendarPlus } from 'react-icons/fa';

// CARGA DE LAYOUTS

import GestionProfesionales from '../cliente/GestionProfesionales';
import TurnListCentroMedico from '../cliente/TurnListCentroMedico';
import CardGestionProfesionales from '../cliente/cards/CardGestionProfesionales';
import CardGestionCoberturas from '../cliente/cards/CardGestionCoberturas';
import CrearCentroMedicoModal from '../cliente/CrearCentroMedicoModal';

// CARGA DE HOOKS

import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useObtenerConsultorioxIdPerfil from '../../customHooks/useObtenerConsultorioxIdPerfil';


const PanelCentroMedico = ( { perfilData: perfil, profesionalVinculado }) => {
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const perfilId = perfil?.id;

  const perfilTipo = perfil?.tipo;

  const { profesional: profesionales, isLoading, error } = useProfesionalxIdConsultorio(perfilId);
  const numProfesionales = profesionales?.length || 0;

  const { consultorios, isLoading:isLoadingConsultorio, error:errorConsultorio } = useObtenerConsultorioxIdPerfil(perfilId);

  const consultorioObtenido = consultorios[0] || null;

  const { nombre, tipo } = consultorioObtenido || {};

  const [showGestionMedicos, setShowGestionMedicos] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false);
  const [profesionalID, setProfesionalID] = useState(null);
  const [hayConsultorios, setHayConsultorios] = useState(false);

  useEffect(() => {
    setHayConsultorios(consultorios.length > 0 ? true : false);
  },[consultorios])

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          <span className='capitalize'>{tipo}</span> {nombre || "Centro Médico"}
        </h1>
        <p className="text-gray-600 text- lg:text-lg">Panel de Gestión</p>
        <p className="text-gray-500 text-sm mt-1">
          Hoy es: <span className="font-semibold text-blue-700 capitalize">{currentDate}</span>
        </p>
      </div>

      {hayConsultorios ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        
           {/* Gestionar Médicos */}
   
           <CardGestionProfesionales 
           seccion = {`/micuenta/gestionprofesionales/${perfilId}`}
           icon = {FaUserMd}
           titulo = {'Gestionar Médicos'}
           subtitulo = {'Administra tu equipo médico.'}
           numProfesionales = {numProfesionales}
           texto = {'médicos activos'} 
           />  
   
          <CardGestionCoberturas 
           seccion={`/micuenta/gestioncoberturas/${perfilId}`}
           titulo={'Coberturas Médicas'}
           icon = {FaShieldAlt}
           subtitulo={'Gestiona obras sociales y prepagas aceptadas.'}
           emoji = {'📋'}
           texto={'configurar'}
          />
           
         </div>
      ) : (
       <CrearCentroMedicoModal perfilId={perfilId} perfilTipo={perfilTipo} isOpen={true} />
      )}
     

      {/* ===== LISTADO DE TURNOS (Modal integrado) ===== */}
      {showModalTurnos && (
        <div className="bg-gray-50 rounded-xl shadow-inner p-6 mb-6 border border-gray-200">
          <TurnListCentroMedico
            profesionalId={profesionalID}
            consultorioId={perfilId}
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
          consultorio={perfil}
          enviarProfesionalID={recibirProfesionalID}
          profesionalVinculado={profesionalVinculado}
        />
      )}

     
    </div>
  );
};

export default PanelCentroMedico;