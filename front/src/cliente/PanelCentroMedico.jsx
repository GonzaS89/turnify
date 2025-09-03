// src/components/PanelCentroMedico.jsx
import { useState, useEffect } from 'react';
import { FaUserMd, FaShieldAlt, FaCalendarPlus, FaBuilding, FaInfoCircle } from 'react-icons/fa';

// Componentes
import GestionProfesionales from '../cliente/GestionProfesionales';
import TurnListCentroMedico from '../cliente/TurnListCentroMedico';
import CardGestionProfesionales from '../cliente/cards/CardGestionProfesionales';
import CardGestionCoberturas from '../cliente/cards/CardGestionCoberturas';
import CrearCentroMedicoModal from '../cliente/CrearCentroMedicoModal';

// Hooks personalizados
import useProfesionalxIdConsultorio from '../../customHooks/useProfesionalxIdConsultorio';
import useObtenerConsultorioxIdPerfil from '../../customHooks/useObtenerConsultorioxIdPerfil';

const PanelCentroMedico = ({ perfilData: perfil, profesionalVinculado }) => {
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const perfilId = perfil?.id;
  const perfilTipo = perfil?.tipo;




  const { consultorios, isLoading: isLoadingConsultorio, error: errorConsultorio, fetchConsultorio } = useObtenerConsultorioxIdPerfil(perfilId);
  const consultorioObtenido = consultorios[0] || null;

  const { nombre, tipo, id: consultorioID } = consultorioObtenido || {};

  const { profesional: profesionales, isLoading: isLoadingProfesionales, error: errorProfesionales } = useProfesionalxIdConsultorio(consultorioID);

  const numProfesionales = profesionales?.length || 0;

  const [showGestionMedicos, setShowGestionMedicos] = useState(false);
  const [showModalTurnos, setShowModalTurnos] = useState(false);
  const [profesionalID, setProfesionalID] = useState(null);
  const [hayConsultorios, setHayConsultorios] = useState(consultorios.length > 0);

  useEffect(() => {
    setHayConsultorios(consultorios.length > 0);
  }, [consultorios]);

  const recibirProfesionalID = (id) => {
    setProfesionalID(id);
    setShowModalTurnos(true);
  };

  const actualizarTurnos = () => {
    // Puedes agregar lógica de refresco si es necesario
  };

  // Manejo de errores
  if (isLoadingConsultorio) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando información del centro médico...</p>
      </div>
    );
  }

  if (errorConsultorio) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mx-auto max-w-4xl">
        <div className="flex items-center">
          <FaInfoCircle className="text-red-500 mr-2" />
          <p className="text-red-700"><strong>Error:</strong> {errorConsultorio}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 max-w-7xl mx-auto transition-all duration-300">
      
      {/* ===== ENCABEZADO ===== */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full mb-3">
          <FaBuilding className="text-blue-600" />
          <span className="text-blue-800 font-medium text-sm">{tipo || 'Centro Médico'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight">
          {nombre || "Sin nombre"}
        </h1>
        <p className="text-gray-600 text-lg mt-2">Panel de Gestión Administrativa</p>
        <p className="text-gray-500 text-sm mt-1">
          Hoy es: <span className="font-semibold text-blue-700 capitalize">{currentDate}</span>
        </p>
      </header>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      {!hayConsultorios ? (
        // Modal de creación de centro médico si no existe
        <CrearCentroMedicoModal
          perfilId={perfilId}
          perfilTipo={perfilTipo}
          isOpen={true}
          onSuccess={() => {
            setHayConsultorios(true);
            fetchConsultorio(); // Refresca los datos
          }}
          actualizarConsultorios={fetchConsultorio}
        />
      ) : (
        <>
          {/* Tarjetas de Acción */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <CardGestionProfesionales
              seccion={`/micuenta/gestionprofesionales/${consultorioID}`}
              icon={FaUserMd}
              titulo="Gestionar Médicos"
              subtitulo="Administra tu equipo médico y especialidades."
              numProfesionales={numProfesionales}
              texto="médicos activos"
              isLoading={isLoadingProfesionales}
              onClick={() => setShowGestionMedicos(true)}
            />

            <CardGestionCoberturas
              seccion={`/micuenta/gestioncoberturas/${consultorioID}`}
              titulo="Coberturas Médicas"
              icon={FaShieldAlt}
              subtitulo="Gestiona obras sociales y prepagas aceptadas."
              emoji="📋"
              texto="configurar"
            />
          </section>

          {/* ===== LISTADO DE TURNOS (Modal integrado) ===== */}
          {showModalTurnos && (
            <div className="bg-gray-50 rounded-xl shadow-inner p-6 mb-6 border border-gray-200 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Turnos del Médico</h2>
                <button
                  onClick={() => setShowModalTurnos(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>
              <TurnListCentroMedico
                profesionalId={profesionalID}
                consultorioId={consultorioID}
                onClose={() => setShowModalTurnos(false)}
                openModalHabilitarTurnos={() => {}} // Ajusta según tu flujo
                tipoConsultorio="centro"
                actualizarTurnos={actualizarTurnos}
              />
            </div>
          )}

          {/* ===== GESTIÓN DE PROFESIONALES (Full View) ===== */}
          {showGestionMedicos && (
            <div className="animate-slide-down">
              <GestionProfesionales
                openModalTurnos={() => setShowModalTurnos(true)}
                closeModalGestion={() => setShowGestionMedicos(false)}
                consultorioTipo={tipo}
                enviarProfesionalID={recibirProfesionalID}
                profesionalVinculado={profesionalVinculado}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PanelCentroMedico;