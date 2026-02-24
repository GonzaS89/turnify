// src/components/PanelConsultorioPropio.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AsociarProfesionalAPerfil from "./AsociarProfesionalAPerfil";
import CrearConsultorioModal from "../cliente/CrearConsultorioModal";

import {
  FaCalendarAlt, FaCog, FaShieldAlt, FaStethoscope, FaIdCard,
  FaChevronRight, FaClock, FaCheckCircle, FaPlus, FaShareAlt,
  FaMapMarkerAlt, FaUserMd
} from "react-icons/fa";

import useObtenerProfesionalxIdPerfil from "../../customHooks/useObtenerProfesionalxIdPerfil";
import useObtenerConsultorioxIdPerfil from "../../customHooks/useObtenerConsultorioxIdPerfil";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";

import ModalListaTurnos from "../cliente/ModalListaTurnos";
import { FaHouseMedical } from "react-icons/fa6";

const PanelConsultorioPropio = ({ perfilData: perfil, enviarMedicoID }) => {
  const navigate = useNavigate();
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] = useState(false);
  const [showModalListaTurnos, setShowModalListaTurnos] = useState(false);
  const [showModalCrearConsultorio, setShowModalCrearConsultorio] = useState(false);
  const [refreshProfesionales, setRefreshProfesionales] = useState(null);

  const perfilID = perfil?.id;
  const perfilTipo = perfil.tipo;

  const {
    consultorios: consultoriosObtenidos,
    isLoading: isLoadingConsultoriosxIdPerfil,
    fetchConsultorio,
  } = useObtenerConsultorioxIdPerfil(perfilID);

  const {
    profesional: profesionalesObtenidos,
    isLoading: isLoadingProfesionalesxIdPerfil,
    error: errorProfesionalesxIdPerfil,
    fetchProfesional,
  } = useObtenerProfesionalxIdPerfil(perfilID);

  const medico = profesionalesObtenidos?.[0] || null;
  const medicoID = medico?.id;
  const medicoSlug = medico?.slug;

  const storedSelection = typeof window !== "undefined" ? localStorage.getItem("consultorioSeleccionadoId") : null;
  const [ConsultorioSelecID, setConsultorioSelecID] = useState(storedSelection);

  useEffect(() => {
    if (consultoriosObtenidos && consultoriosObtenidos.length > 0) {
      const primerId = consultoriosObtenidos[0].id;
      if (!ConsultorioSelecID) {
        setConsultorioSelecID(primerId);
        localStorage.setItem("consultorioSeleccionadoId", primerId);
      }
    } else {
      setConsultorioSelecID(null);
      localStorage.removeItem("consultorioSeleccionadoId");
    }
  }, [consultoriosObtenidos]);

  const noHayConsultorioAsociados = !consultoriosObtenidos || consultoriosObtenidos.length === 0;
  const noHayProfesionalesAsociados = !profesionalesObtenidos || profesionalesObtenidos.length === 0;

  const { turnos, isLoading: isLoadingTurnos } = useProfessionalConsultorioTurnos(medicoID, ConsultorioSelecID);

  const refrescarListaProfesionales = () => setRefreshProfesionales((prev) => prev + 1);

  useEffect(() => {
    if (profesionalesObtenidos?.[0] === undefined) {
      setShowModalAsociarProfesional(true);
    } else {
      setShowModalAsociarProfesional(false);
    }
    enviarMedicoID(medicoID);
  }, [profesionalesObtenidos, medicoID]);

  const turnsToday = (estado) => {
    if (!turnos || turnos.length === 0) return 0;
    const todayFormatted = new Date().toISOString().split("T")[0];
    return turnos.filter(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === todayFormatted && turno.estado === estado
    ).length;
  };

  if (isLoadingProfesionalesxIdPerfil) return <LoadingCard />;
  if (errorProfesionalesxIdPerfil || !perfil) return <ErrorCard title="Error" message="No se pudo cargar la información." />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* SECCIÓN SUPERIOR: Perfil & Selector de Consultorio */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            
            {/* Info del Profesional */}
            <div className="flex-1">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-100">
                    {medico ? `${medico.nombre[0]}${medico.apellido[0]}` : <FaUserMd />}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    Hola, {medico ? `Dr. ${medico.nombre}` : "Bienvenido"}
                  </h1>
                  <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                    <FaStethoscope className="text-indigo-500" /> {medico?.especialidad || "Profesional de la salud"}
                  </p>
                </div>
              </div>

              {medico && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button 
                    onClick={async () => {
                      const url = `https://turnate.site/turnos/${medicoSlug}`;
                      if (navigator.share) {
                        try { await navigator.share({ title: "Turnate", url }); } catch (err) {}
                      } else {
                        navigator.clipboard.writeText(url);
                        alert("Enlace copiado");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                  >
                    <FaShareAlt size={12} /> Compartir Perfil Público
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-bold border border-slate-200">
                    <FaIdCard size={12} className="text-slate-400" /> Mat: {medico?.matricula}
                  </div>
                </div>
              )}
            </div>

            {/* Selector de Consultorios Horizontal/Grid */}
            <div className="lg:w-1/3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mis Sedes</span>
                <button onClick={() => setShowModalCrearConsultorio(true)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  <FaPlus size={10} /> Nueva sede
                </button>
              </div>
              <div className="space-y-2">
                {consultoriosObtenidos?.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setConsultorioSelecID(c.id);
                      localStorage.setItem("consultorioSeleccionadoId", c.id);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      ConsultorioSelecID === c.id 
                      ? "bg-white border-indigo-600 ring-4 ring-indigo-50 shadow-md" 
                      : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${ConsultorioSelecID === c.id ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                      <FaHouseMedical size={14} />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className={`text-sm font-bold truncate ${ConsultorioSelecID === c.id ? "text-slate-900" : "text-slate-600"}`}>{c.nombre}</p>
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <FaMapMarkerAlt size={8}/> {c.direccion}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        {/* DASHBOARD GRID */}
        {consultoriosObtenidos?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* ACCIONES PRINCIPALES (Left) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ActionCard
                  title="Mi Agenda"
                  description="Gestión de turnos y pacientes"
                  icon={FaCalendarAlt}
                  color="indigo"
                  onClick={() => navigate(`/micuenta/panelturnos/${ConsultorioSelecID}/${medicoID}`)}
                  footer={<span className="text-xs font-bold uppercase text-indigo-600">Ir a turnos</span>}
                />
                <ActionCard
                  title="Configuración"
                  description="Horarios y datos técnicos"
                  icon={FaCog}
                  color="slate"
                  onClick={() => navigate(`/micuenta/datosconsultorio/${ConsultorioSelecID}/${perfilID}`)}
                  footer={<span className="text-xs font-bold uppercase text-slate-600">Modificar</span>}
                />
                <ActionCard
                  title="Coberturas"
                  description="Obras sociales y prepagas"
                  icon={FaShieldAlt}
                  color="blue"
                  onClick={() => navigate(`/micuenta/gestioncoberturas/${ConsultorioSelecID}`)}
                  footer={<span className="text-xs font-bold uppercase text-blue-600">Administrar</span>}
                />
              </div>

              {/* RESUMEN DEL DÍA (Right) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
                  Actividad de Hoy
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MiniStat label="Reservados" value={turnsToday("reservado")} color="indigo" />
                  <MiniStat label="Libres" value={turnsToday("disponible")} color="emerald" />
                  <MiniStat label="Finalizados" value={turnsToday("finalizado")} color="slate" />
                  <button 
                    onClick={() => setShowModalListaTurnos(true)}
                    className="flex flex-col items-center justify-center p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    <FaChevronRight className="mb-1" />
                    <span className="text-xs font-bold">Ver Lista</span>
                  </button>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHouseMedical size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No hay sedes registradas</h3>
            <p className="text-slate-500 mb-6">Para comenzar a dar turnos, crea tu primer consultorio.</p>
            <button onClick={() => setShowModalCrearConsultorio(true)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
              Crear mi primer consultorio
            </button>
          </div>
        )}
      </main>

      {/* MODALES */}
      {showModalCrearConsultorio && (
        <CrearConsultorioModal
          isOpen={true}
          onClose={() => setShowModalCrearConsultorio(false)}
          perfilID={perfilID}
          profesionalID={medicoID}
          perfilTipo={perfilTipo}
          actualizarConsultorio={fetchConsultorio}
        />
      )}

      {noHayProfesionalesAsociados && (
        <AsociarProfesionalAPerfil
          perfilID={perfilID}
          perfil={perfil}
          onClose={() => setShowModalAsociarProfesional(false)}
          refrescarListaProfesionales={refrescarListaProfesionales}
          profesionalVinculado={!!medicoID}
          actualizarProfesionales={fetchProfesional}
        />
      )}

      {showModalListaTurnos && (
        <ModalListaTurnos turnos={turnos} onClose={() => setShowModalListaTurnos(false)} />
      )}
    </div>
  );
};

// COMPONENTES DE UI LOCALES
const ActionCard = ({ title, description, icon: Icon, color, onClick, footer }) => {
  const colors = {
    indigo: "bg-indigo-600 shadow-indigo-100 text-white",
    slate: "bg-slate-800 shadow-slate-100 text-white",
    blue: "bg-blue-500 shadow-blue-100 text-white",
  };
  return (
    <div 
      onClick={onClick}
      className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
    >
      <div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 font-medium leading-snug">{description}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        {footer}
        <FaChevronRight size={10} className="text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, color }) => {
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    slate: "text-slate-600 bg-slate-50",
  };
  return (
    <div className={`p-4 rounded-2xl ${colorMap[color]} text-center`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
};

const LoadingCard = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="font-bold text-slate-600 tracking-tight">Sincronizando panel...</p>
  </div>
);

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-red-100">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">⚠️</div>
      <h2 className="text-xl font-black text-slate-800">{title}</h2>
      <p className="text-slate-500 text-sm mt-2">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;