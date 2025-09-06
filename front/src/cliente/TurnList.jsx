import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

// ICONOS
import {
  FaInfoCircle,
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";

// HOOKS
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import useCoberturaxIdConsultorio from "../../customHooks/useCoberturaxIdConsultorio";
import useConsultorioxId from "../../customHooks/useConsultorioxId";

// LAYOUTS
import BorrarTurno from "./BorrarTurno";
import BorrarTodosLosTurnosModal from "./BorrarTodosLosTurnosModal";
import TurnoInterno from "./TurnoInterno";

const TurnList = ({ tipoConsultorio, enviarTurnoYOrden }) => {
  const navigate = useNavigate();
  const { consultorioId } = useParams();
  const { profesionalId } = useParams();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModalBorrarTurno, setShowModalBorrarTurno] = useState(false);
  const [IdTurnoSeleccionado, setIdTurnoSeleccionado] = useState(null);
  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] = useState(false);
  const [liberandoIds, setLiberandoIds] = useState(new Set());
  const [finalizandoIds, setFinalizandoIds] = useState(new Set());

  // Formatear fecha corta (ej: "lun 5 may")
  const formatearFechaCorta = (fechaStr) => {
    const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const [datePart] = fechaStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const diaSemana = date.getUTCDay();
    return `${dias[diaSemana]} ${day} ${meses[month - 1]}`;
  };

  // Formatear fecha larga (ej: "Lunes 5")
  const formatearFechaLarga = (fechaStr) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const [datePart] = fechaStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const diaSemana = date.getUTCDay();
    return `${dias[diaSemana]} ${day}`;
  };

  // Formatear mes (ej: "Abril 2025")
  const formatearMes = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const opciones = { year: "numeric", month: "long" };
    return fecha.toLocaleDateString("es-AR", opciones).replace(/^\w/, (c) => c.toUpperCase());
  };

  const datesListRef = useRef(null);

  // Refresco automático cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);

  const { turnos, isLoading } = useProfessionalConsultorioTurnos(
    profesionalId,
    consultorioId,
    refreshTrigger
  );
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);
  const { consultorio } = useConsultorioxId(consultorioId);

  const consultorioObtenido = consultorio?.[0];
  const { nombre, direccion } = consultorioObtenido || {};

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

  // Agrupar por mes
  const turnosPorMes = Object.keys(turnosAgrupados).reduce((acc, fecha) => {
    const mes = fecha.slice(0, 7); // "YYYY-MM"
    if (!acc[mes]) acc[mes] = [];
    acc[mes].push(fecha);
    return acc;
  }, {});

  // Ordenar meses de más reciente a más antiguo
  const mesesOrdenados = Object.keys(turnosPorMes).sort((a, b) => new Date(b) - new Date(a));

  // Ordenar fechas dentro de cada mes (más reciente primero)
  mesesOrdenados.forEach((mes) => {
    turnosPorMes[mes].sort((a, b) => new Date(b) - new Date(a));
  });

  // Solo mostrar fechas al hacer clic en el mes. Por defecto, NINGUNO está expandido.
  const [mesesExpandidos, setMesesExpandidos] = useState(new Set());

  const toggleMes = (mes) => {
    setMesesExpandidos((prev) => {
      const nuevo = new Set();
      if (!prev.has(mes)) {
        nuevo.add(mes); // Solo este mes
      }
      return nuevo;
    });
  };

  // 👇 Scroll automático al mes expandido en mobile
  useEffect(() => {
    if (mesesExpandidos.size > 0 && datesListRef.current) {
      const firstExpandedButton = datesListRef.current.querySelector(".bg-blue-600");
      if (firstExpandedButton) {
        firstExpandedButton.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [mesesExpandidos]);

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
    setFinalizandoIds((prev) => new Set([...prev, idTurno]));
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/modificarestadoturno/${idTurno}`);
      setTimeout(() => {
        handleActualizarTurnos();
        setFinalizandoIds((prev) => {
          const next = new Set(prev);
          next.delete(idTurno);
          return next;
        });
      }, 1500);
    } catch (error) {
      console.error("Error al modificar estado del turno:", error);
    }
  };

  const handleLiberarTurno = async (idTurno) => {
    setLiberandoIds((prev) => new Set([...prev, idTurno]));
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cancelarturno/${idTurno}`);
      toast.success("Turno liberado");
      setTimeout(() => {
        handleActualizarTurnos();
        setLiberandoIds((prev) => {
          const next = new Set(prev);
          next.delete(idTurno);
          return next;
        });
      }, 1500);
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

  // Estado de carga
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

  // Estado vacío
  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaCalendarAlt /> Tu Agenda
            </h2>
            <button
              onClick={() => navigate("/micuenta")}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>
          </div>
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
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <FaPlus /> Habilitar Turnos
              </button>
              <button
                onClick={() => navigate("/micuenta")}
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
      {/* Overlay oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center xl:p-4 z-[200]"
        onClick={() => navigate("/micuenta")}
      >
        <div
          className="bg-white xl:rounded-3xl shadow-2xl w-screen h-[100dvh] xl:max-w-[1400px] xl:max-h-[90dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado — estilo coherente con TurnSelectModal */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaCalendarAlt />
              {tipoConsultorio === "propio" ? "Tu Agenda" : `Agenda de consultorio de ${direccion}`}
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
                onClick={() => navigate("/micuenta")}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Contenido principal — estilo TurnSelectModal */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar de fechas — estilo vertical mobile-first */}
            <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white">
                <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                  Seleccioná un mes
                </h4>
              </div>

              {/* 👇 LISTA DE MESES — ESTILO APLICADO */}
              <div
                ref={datesListRef}
                className="flex flex-col overflow-y-auto px-4 py-3 gap-4 custom-scrollbar"
                style={{ maxHeight: "calc(100dvh - 180px)" }}
              >
                {mesesOrdenados.map((mes) => {
                  const expandido = mesesExpandidos.has(mes);
                  const nombreMes = formatearMes(`${mes}-01`);

                  return (
                    <div key={mes} className="mb-2">
                      {/* Botón de mes — estilo TurnSelectModal */}
                      <button
                        onClick={() => toggleMes(mes)}
                        className={`
                          w-full text-left px-4 py-3 sm:px-5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
                          uppercase tracking-wide transition-all flex items-center justify-between
                          ${expandido
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                          }
                        `}
                      >
                        {nombreMes}
                        <span
                          className={`transform transition-transform duration-300 ${
                            expandido ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {/* Fechas del mes — solo si está expandido */}
                      {expandido && (
                        <div className="flex flex-col gap-3 mt-3 animate-fadeIn">
                          {turnosPorMes[mes].map((fecha) => {
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
                                className={`w-full p-4 rounded-xl text-left transition-all ${
                                  isSelected
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                <div className="font-semibold">{formatearFechaCorta(fecha)}</div>
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
                      )}
                    </div>
                  );
                })}
                <div className="pb-8"></div>
              </div>
            </div>

            {/* Detalles de turnos — estilo TurnSelectModal */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {fechaSeleccionada
                    ? formatearFechaLarga(fechaSeleccionada)
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
                <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-200">
                  <FaInfoCircle className="mx-auto text-blue-500" size={36} />
                  <p className="mt-3 text-blue-700 font-medium text-sm">
                    Selecciona una fecha para ver los turnos disponibles.
                  </p>
                </div>
              ) : turnosDeLaFecha.length === 0 ? (
                <div className="text-center py-12 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                  <FaClock className="mx-auto text-gray-400" size={36} />
                  <p className="mt-3 text-gray-600 font-medium text-sm">
                    No hay turnos disponibles en esta fecha.
                  </p>
                  <button
                    onClick={handleAgregarTurnoClick}
                    className="mt-5 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 mx-auto text-sm"
                  >
                    <FaPlus /> Agregar Turnos
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {turnosDeLaFecha
                    .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""))
                    .map((turno, idx) => (
                      <TurnoInterno
                        key={turno.id}
                        turno={turno}
                        id={turno.id}
                        idx={idx}
                        estado={turno.estado}
                        hora={turno.hora}
                        paciente={`${turno.apellido_paciente}, ${turno.nombre_paciente}`}
                        DNI={turno.DNI}
                        cobertura={turno.cobertura}
                        duracion={turno.duracion}
                        telefono={turno.telefono}
                        tapButtonAsignar={tapButtonAsignar}
                        handleBorrarTurno={handleBorrarTurno}
                        handleModificarEstadoTurno={handleModificarEstadoTurno}
                        handleLiberarTurno={handleLiberarTurno}
                        coberturaElegida={coberturaElegida}
                        liberando={liberandoIds.has(turno.id)}
                        finalizando={finalizandoIds.has(turno.id)}
                      />
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

      {/* Estilo de animación opcional */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
      `}</style>
    </>
  );
};

export default TurnList;