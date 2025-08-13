import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  FaInfoCircle,
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
import { useParams, useNavigate } from "react-router";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import BorrarTurno from "./components/BorrarTurno";
import BorrarTodosLosTurnosModal from "./components/BorrarTodosLosTurnosModal";
import TurnoInterno from "./components/TurnoInterno";
import useCoberturaxIdConsultorio from "../../customHooks/useCoberturaxIdConsultorio";
import useConsultorioxId from "../../customHooks/useConsultorioxId";

const TurnListCentroMedico = ({ tipoConsultorio, enviarTurnoYOrden }) => {
  const navigate = useNavigate();
  const { consultorioId } = useParams();
  const { profesionalId } = useParams();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModalBorrarTurno, setShowModalBorrarTurno] = useState(false);
  const [IdTurnoSeleccionado, setIdTurnoSeleccionado] = useState(null);
  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] = useState(false);

  const datesListRef = useRef(null);

  // Refresco automático cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);

  const { turnos, isLoading } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);
  const { consultorio } = useConsultorioxId(consultorioId);
  const { coberturas: coberturasConsultorio } = useCoberturaxIdConsultorio(consultorioId);

  const medico = profesional?.[0];
  const nombreMedico = `${medico?.nombre || ""} ${medico?.apellido || ""}`.trim();

  // Agrupar turnos por fecha
  const turnosAgrupados = turnos.reduce((acc, turno) => {
    const fecha = new Date(turno.fecha);
    const clave = fecha.toISOString().split("T")[0];
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(turno);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(turnosAgrupados).sort((a, b) => new Date(b) - new Date(a));

  // Scroll automático al centro en mobile
  useEffect(() => {
    if (fechaSeleccionada && datesListRef.current && window.innerWidth < 768) {
      requestAnimationFrame(() => {
        const button = datesListRef.current.querySelector(`[data-date="${fechaSeleccionada}"]`);
        if (button) {
          const container = datesListRef.current;
          const offset = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
          container.scrollTo({ left: offset, behavior: "smooth" });
        }
      });
    }
  }, [fechaSeleccionada]);

  const tapButtonAsignar = (turno, idx) => {
    navigate(`/micuenta/formulario-usuario/${consultorioId}/${profesionalId}`);
    enviarTurnoYOrden(turno, idx + 1);
  };

  const handleAgregarTurnoClick = () => {
    navigate(`/micuenta/generarturnos/${consultorioId}/${profesionalId}`);
  };

  const handleBorrarTurno = (id) => {
    setIdTurnoSeleccionado(id);
    setShowModalBorrarTurno(true);
  };

  const handleBorrarTodosLosTurnos = () => {
    setShowModalBorrarTodosLosTurnos(true);
  };

  const handleModificarEstadoTurno = async (idTurno) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/modificarestadoturno/${idTurno}`);
      handleActualizarTurnos();
    } catch (error) {
      console.error("Error al modificar estado del turno:", error);
    }
  };

  const handleLiberarTurno = async (idTurno) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cancelarturno/${idTurno}`);
      handleActualizarTurnos();
    } catch (error) {
      console.error("Error al liberar turno:", error);
    }
  };

  const coberturaElegida = (value) => {
    if (value === "particular") return "Particular";
    const cobertura = coberturas?.find((c) => c.id == value);
    return cobertura ? cobertura.siglas : "Particular";
  };

  // Previene scroll del fondo
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Estado vacío
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando tu agenda...</p>
        </div>
      </div>
    );
  }

  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaCalendarAlt /> Tu Agenda
            </h2>
            <button
              onClick={() => navigate(`/micuenta/gestionprofesionales/${consultorioId}`)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Cuerpo */}
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center">
                <FaCalendarAlt className="text-blue-500 w-10 h-10" />
              </div>
            </div>
            <p className="text-gray-700 text-lg font-medium">No tenés turnos agendados.</p>
            <p className="text-gray-500 text-sm">Habilitá tu agenda para recibir pacientes.</p>
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAgregarTurnoClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg"
              >
                <FaPlus /> Habilitar Turnos
              </button>
              <button
                   onClick={() => navigate(`/micuenta/gestionprofesionales/${consultorioId}`)}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
              >
                Volver a Mi Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const turnosDeLaFecha = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center xl:p-4 z-[200]"
         onClick={() => navigate(`/micuenta/gestionprofesionales/${consultorioId}`)}
      >
        <div
          className="bg-white xl:rounded-2xl shadow-2xl w-screen h-screen xl:max-w-[1400px] xl:max-h-[100dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-3">
              <FaCalendarAlt /> {tipoConsultorio === "propio" ? "Tu Agenda" : `Agenda de ${nombreMedico}`}
            </h2>
            <div className="flex items-center gap-2">
  <button
    onClick={handleActualizarTurnos}
    className="flex items-center gap-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-2xl text-sm transition"
    aria-label="Actualizar"
  >
    <TbRefresh size={16} />
    <span className="hidden sm:inline"> Actualizar</span>
  </button>

  <button
    onClick={handleAgregarTurnoClick}
    className="flex items-center gap-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition"
    aria-label="Agregar"
  >
    <FaPlus size={14} />
    <span className="hidden sm:inline"> Agregar</span>
  </button>

  <button
         onClick={() => navigate(`/micuenta/gestionprofesionales/${consultorioId}`)}
    className="text-white hover:bg-white/20 rounded-full p-1 transition"
    aria-label="Cerrar"
  >
    <FaTimes size={20} />
  </button>
</div>
          </div>

          {/* Contenido principal */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar de fechas */}
            <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-800 text-lg">Fechas</h4>
              </div>
              <div
                ref={datesListRef}
                className="flex md:flex-col overflow-x-auto md:overflow-y-auto px-4 py-3 gap-3 custom-scrollbar"
              >
                {fechasOrdenadas.map((fecha) => {
                  const turnos = turnosAgrupados[fecha];
                  const ocupados = turnos.filter((t) => t.estado === "reservado").length;
                  const finalizados = turnos.filter((t) => t.estado === "finalizado").length;
                  const disponibles = turnos.length - ocupados - finalizados;
                  const isSelected = fecha === fechaSeleccionada;

                  return (
                    <button
                      key={fecha}
                      data-date={fecha}
                      onClick={() => setFechaSeleccionada(fecha)}
                      className={`min-w-36 md:min-w-0 p-4 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <div className="font-semibold">
                        {new Date(fecha).toLocaleDateString("es-AR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div
                        className={`text-xs font-bold mt-1 px-2 py-1 rounded-full inline-block ${
                          isSelected
                            ? "bg-white text-blue-600"
                            : disponibles > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {disponibles} disp.
                      </div>
                      {turnos.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {turnos.map((t) => (
                            <div
                              key={t.id}
                              className={`w-3 h-3 rounded-full ${
                                t.estado === "reservado"
                                  ? "bg-red-400"
                                  : t.estado === "disponible"
                                  ? "bg-green-400"
                                  : "bg-blue-400"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalles de turnos */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {fechaSeleccionada
                    ? new Date(fechaSeleccionada).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Seleccioná una fecha"}
                </h3>
                {fechaSeleccionada && (
                  <button
                    onClick={handleBorrarTodosLosTurnos}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-1"
                  >
                    <FaTrashAlt size={14} /> Borrar todos
                  </button>
                )}
              </div>

              {!fechaSeleccionada ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <FaInfoCircle className="text-blue-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Seleccioná una fecha para ver los turnos.</p>
                </div>
              ) : turnosDeLaFecha.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <FaInfoCircle className="text-yellow-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500 mb-5">No hay turnos para este día.</p>
                  <button
                    onClick={handleAgregarTurnoClick}
                    className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 mx-auto text-sm"
                  >
                    <FaPlus /> Agregar Turnos
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {turnosDeLaFecha
                    .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""))
                    .map((turno, idx) => (
                     <TurnoInterno key={turno.id} turno={turno} id={turno.id} idx={idx} estado={turno.estado} hora={turno.hora} paciente={`${turno.apellido_paciente}, ${turno.nombre_paciente}`} DNI={turno.DNI} cobertura={turno.cobertura} duracion={turno.duracion} telefono={turno.telefono} tapButtonAsignar={tapButtonAsignar} handleBorrarTurno={handleBorrarTurno} handleModificarEstadoTurno={handleModificarEstadoTurno} handleLiberarTurno={handleLiberarTurno} coberturaElegida={coberturaElegida}/>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showModalBorrarTurno && (
        <BorrarTurno
          idTurno={IdTurnoSeleccionado}
          onClose={() => setShowModalBorrarTurno(false)}
          actualizarTurnos={handleActualizarTurnos}
        />
      )}
      {showModalBorrarTodosLosTurnos && (
        <BorrarTodosLosTurnosModal
          idConsultorio={consultorioId}
          idProfesional={profesionalId}
          fecha={fechaSeleccionada}
          onClose={() => setShowModalBorrarTodosLosTurnos(false)}
          actualizarTurnos={handleActualizarTurnos}
          resetearFecha={() => setFechaSeleccionada(null)}
        />
      )}
    </>
  );
};

export default TurnListCentroMedico;