// src/components/PanelConsultorioPropio.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AsociarProfesionalAPerfil from "./AsociarProfesionalAPerfil";
import CrearConsultorioModal from "../cliente/CrearConsultorioModal";

// CARGA DE ICONOS
import {
  FaCalendarAlt,
  FaCog,
  FaShieldAlt,
  FaStethoscope,
  FaIdCard,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaShareAlt
} from "react-icons/fa";

// CARGA DE HOOKS
import useObtenerProfesionalxIdPerfil from "../../customHooks/useObtenerProfesionalxIdPerfil";
import useObtenerConsultorioxIdPerfil from "../../customHooks/useObtenerConsultorioxIdPerfil";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";

// CARGA DE LAYOUTS
import ModalListaTurnos from "../cliente/ModalListaTurnos";
import { FaHouseMedical } from "react-icons/fa6";

const PanelConsultorioPropio = ({ perfilData: perfil, enviarMedicoID }) => {
  const navigate = useNavigate();
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] =
    useState(false);
  const [showModalListaTurnos, setShowModalListaTurnos] = useState(false);
  const [showModalCrearConsultorio, setShowModalCrearConsultorio] =
    useState(false);
  const [refreshProfesionales, setRefreshProfesionales] = useState(null);

  const perfilID = perfil?.id;
  const perfilTipo = perfil.tipo;

  // Obtener consultorios y profesionales
  const {
    consultorios: consultoriosObtenidos,
    isLoading: isLoadingConsultoriosxIdPerfil,
    error: errorConsultoriosxIdPerfil,
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


  // Estado persistente: recuperar selección desde localStorage
  const storedSelection =
    typeof window !== "undefined"
      ? localStorage.getItem("consultorioSeleccionadoId")
      : null;

  const [ConsultorioSelecID, setConsultorioSelecID] = useState(storedSelection);

  // Sincronizar: solo seleccionar el primero si no hay selección guardada
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

  const noHayConsultorioAsociados =
    !consultoriosObtenidos || consultoriosObtenidos.length === 0;
  const noHayProfesionalesAsociados =
    !profesionalesObtenidos || profesionalesObtenidos.length === 0;

  // Turnos del consultorio seleccionado
  const {
    turnos,
    isLoading: isLoadingTurnos,
    error: errorTurnos,
  } = useProfessionalConsultorioTurnos(medicoID, ConsultorioSelecID);

  const refrescarListaProfesionales = () => {
    setRefreshProfesionales((prev) => prev + 1);
  };

  // Mostrar modal si no hay profesional
  useEffect(() => {
    if (profesionalesObtenidos?.[0] === undefined) {
      setShowModalAsociarProfesional(true);
    } else {
      setShowModalAsociarProfesional(false);
    }
    enviarMedicoID(medicoID);
  }, [profesionalesObtenidos, medicoID]);

  // Turnos para hoy
  const turnsToday = (estado) => {
    if (!turnos || turnos.length === 0) return 0;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return turnos.filter(
      (turno) =>
        new Date(turno.fecha).toISOString().split("T")[0] === todayFormatted &&
        turno.estado === estado
    ).length;
  };

  // Fecha formateada
  const todayFormatted = new Date()
    .toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  // Cargando
  if (isLoadingProfesionalesxIdPerfil) return <LoadingCard />;

  // Error
  if (errorProfesionalesxIdPerfil || !perfil) {
    return (
      <ErrorCard
        title="Error"
        message={
          errorProfesionalesxIdPerfil?.message ||
          "No se pudo cargar la información del consultorio."
        }
      />
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== ENCABEZADO ===== */}
        <header className="bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 text-white rounded-3xl shadow-2xl p-8 mb-8 transform transition-all hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Info del médico */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {consultoriosObtenidos?.length > 1
                  ? "Gestión de consultorios"
                  : "Gestión de consultorio"}
              </h1>

              {medico ? (
                <div className="mt-6 flex items-center space-x-5">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/30">
                    {medico.nombre.charAt(0)}
                    {medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold leading-tight">
                      {medico.nombre} {medico.apellido}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-100">
                      <span className="flex items-center gap-1.5">
                        <FaStethoscope size={14} /> {medico.especialidad}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaIdCard size={14} /> Matrícula: {medico.matricula}
                      </span>
                    </div>
                    {consultoriosObtenidos.length > 0 && (
                      <div className="my-2 p-2">
                        <p className="mb-2 text-gray-50 font-medium">Enlace público de turnos</p>
                        <a
                          href={`https://turnate.site/turnos/${medicoSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={async (e) => {
                            e.preventDefault(); // Evita abrir el enlace directamente
                            const url = `https://turnate.site/turnos/${medicoSlug}`;
                            const text = "¡Reservá tu turno desde este enlace!";

                            if (navigator.share) {
                              try {
                                await navigator.share({
                                  title: "Turnate",
                                  text,
                                  url,
                                });
                                console.log("Compartido exitosamente");
                              } catch (err) {
                                console.error("Error al compartir:", err);
                              }
                            } else {
                              // Fallback: copiar al portapapeles
                              navigator.clipboard.writeText(url);
                              alert("Enlace copiado al portapapeles");
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-900 font-semibold rounded-lg shadow-md hover:bg-gray-200 hover:scale-95 transition-colors duration-1000 ease-in"
                        >
                          <FaShareAlt />
                          Compartir enlace
                        </a>
                      </div>
                    )}



                  </div>
                </div>
              ) : (
                <p className="text-blue-100 mt-4 text-lg italic">
                  Aún no tienes un profesional asociado.
                </p>
              )}

              {/* Lista de consultorios */}

            </div>

            <div>
              {consultoriosObtenidos?.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wide opacity-90">
                    {consultoriosObtenidos.length > 1
                      ? "Tus consultorios"
                      : "Tu consultorio"}
                  </h3>
                  {consultoriosObtenidos.map((consultorio) => {
                    const isSelected = ConsultorioSelecID === consultorio.id;

                    return (
                      <button
                        key={consultorio.id}
                        type="button"
                        onClick={() => {
                          // Solo cambia si es distinto, pero no permite deseleccionar
                          if (ConsultorioSelecID !== consultorio.id) {
                            setConsultorioSelecID(consultorio.id);
                            localStorage.setItem(
                              "consultorioSeleccionadoId",
                              consultorio.id
                            );
                          }
                        }}
                        className={`
    w-full p-4 rounded-xl text-sm font-medium text-left transition-all
    flex items-center gap-3 group
    ${ConsultorioSelecID === consultorio.id
                            ? "bg-gray-800/70 text-blue-100 hover:bg-gray-700 border border-gray-600/50"
                            : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg shadow-blue-500/25"
                          }
    backdrop-blur-sm
    hover:shadow-xl hover:shadow-gray-900/10
    transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
  `}
                      >
                        <div
                          className={`
      flex-shrink-0 flex items-center justify-center
      w-9 h-9 rounded-full text-white
      ${ConsultorioSelecID === consultorio.id
                              ? "bg-white/20"
                              : "bg-blue-500 group-hover:scale-110"
                            }
      transition-transform duration-200
    `}
                        >
                          <FaHouseMedical size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm leading-tight">
                            <span className="font-bold">
                              {consultorio.nombre}
                            </span>
                          </p>
                          <p className="text-xs opacity-90 truncate">
                            {consultorio.direccion}, {consultorio.localidad}
                          </p>
                        </div>

                        {ConsultorioSelecID === consultorio.id && (
                          <span className="ml-2 flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white text-blue-700 rounded-full shadow-sm text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Botón crear/agregar consultorio */}
              <button
                onClick={() => setShowModalCrearConsultorio(true)}
                className="mt-4 w-full px-6 py-3.5 
                    bg-gradient-to-r from-blue-600 to-blue-700 
                    hover:from-blue-700 hover:to-blue-800 
                    text-white text-sm font-semibold 
                    rounded-xl shadow-lg 
                    backdrop-blur-sm 
                    border border-blue-500/30
                    transition-all duration-200 
                    transform hover:scale-102 hover:shadow-2xl 
                    focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
                    active:scale-99"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaPlus size={14} />
                  {consultoriosObtenidos?.length > 0
                    ? "Agregar otro consultorio"
                    : "Crear Consultorio"}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* ===== TARJETAS DE ACCESO RÁPIDO ===== */}
        {consultoriosObtenidos?.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ActionCard
              title="Mi Agenda"
              description="Gestiona tus turnos diarios y pacientes."
              icon={FaCalendarAlt}
              gradient="from-emerald-500 to-teal-600"
              onClick={() => {
                if (ConsultorioSelecID && medicoID) {
                  navigate(
                    `/micuenta/panelturnos/${ConsultorioSelecID}/${medicoID}`
                  );
                } else {
                  alert(
                    "Primero debes seleccionar un consultorio y profesional."
                  );
                }
              }}
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {isLoadingTurnos ? "..." : turnsToday("reservado")}
                  </span>
                  <span className="text-sm text-white/90 flex items-center gap-1">
                    ver <FaChevronRight size={12} />
                  </span>
                </div>
              }
            />

            <ActionCard
              title="Configuración"
              description="Personaliza horarios, consultorio y más."
              icon={FaCog}
              gradient="from-slate-500 to-slate-700"
              onClick={() =>
                navigate(
                  `/micuenta/datosconsultorio/${ConsultorioSelecID}/${perfilID}`
                )
              }
              footer={
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-slate-700/50 px-3 py-1 rounded-full">
                  <FaCheckCircle size={12} /> Editar
                </span>
              }
            />

            <ActionCard
              title="Coberturas"
              description="Administra obras sociales y prepagas."
              icon={FaShieldAlt}
              gradient="from-blue-500 to-indigo-600"
              onClick={() =>
                navigate(`/micuenta/gestioncoberturas/${ConsultorioSelecID}`)
              }
              footer={
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600/50 px-3 py-1 rounded-full">
                  <FaChevronRight size={12} /> Gestionar
                </span>
              }
            />
          </section>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No creaste ningún consultorio aún.</p>
          </div>
        )}

        {/* Modal: Crear consultorio */}
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

        {/* ===== ESTADÍSTICAS DEL DÍA ===== */}
        {medico && !noHayConsultorioAsociados && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Resumen del día
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <StatCard
                label="Turnos Hoy"
                value={turnsToday("reservado")}
                icon={FaCalendarAlt}
                color="text-blue-600"
              />
              <StatCard
                label="Disponibles"
                value={turnsToday("disponible")}
                icon={FaClock}
                color="text-yellow-600"
              />
              <StatCard
                label="Completados"
                value={turnsToday("finalizado")}
                icon={FaCheckCircle}
                color="text-teal-600"
              />
              <StatCard
                label="Ver lista"
                value={turnsToday("reservado")}
                icon={FaCalendarAlt}
                color="text-indigo-600"
                onClick={() => setShowModalListaTurnos(true)}
                clickable
              />
            </div>
          </div>
        )}

        {/* Modal: Asociar profesional */}
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

        {/* Modal: Lista de turnos */}
        {showModalListaTurnos && (
          <ModalListaTurnos
            turnos={turnos}
            onClose={() => setShowModalListaTurnos(false)}
          />
        )}
      </div>
    </div>
  );
};

// ===== COMPONENTES AUXILIARES =====

const ActionCard = ({
  title,
  description,
  icon: Icon,
  gradient,
  onClick,
  footer,
}) => (
  <div
    onClick={onClick}
    className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:border-blue-200"
  >
    <div className="flex items-start justify-between mb-5">
      <div
        className={`p-3 bg-gradient-to-br ${gradient} rounded-xl text-white shadow-lg group-hover:shadow-xl transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
    <div className="mt-2">{footer}</div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, onClick, clickable }) => (
  <div
    onClick={clickable ? onClick : undefined}
    className={`flex flex-col items-center p-4 bg-gray-50 rounded-xl transition-all duration-200 ${clickable
      ? "cursor-pointer hover:bg-blue-50 hover:scale-105 hover:shadow-md"
      : "hover:bg-gray-100"
      }`}
  >
    <Icon className={`w-5 h-5 ${color} mb-2`} />
    <span className="text-2xl font-bold text-gray-800">{value}</span>
    <span
      className={`text-xs font-medium mt-1 ${clickable ? "text-indigo-600" : "text-gray-500"
        }`}
    >
      {label}
    </span>
  </div>
);

const LoadingCard = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-blue-100">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 border-b-transparent mx-auto mb-5"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Cargando panel...
      </h2>
      <p className="text-gray-500">Preparando tu consultorio virtual.</p>
    </div>
  </div>
);

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-red-200">
      <div className="text-red-500 text-6xl mb-5">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
    </div>
  </div>
);

export default PanelConsultorioPropio;
