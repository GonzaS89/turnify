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
  FaUserMd,
} from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
import { BiLoaderCircle } from "react-icons/bi";
import { MdOutlineErrorOutline } from "react-icons/md";

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

  // 👇 FUNCIONES AUXILIARES COPIADAS DE TurnSelectModal

  const parsearFechaLocal = (fechaStr) => {
    const [año, mes, dia] = fechaStr.split("-").map(Number);
    return new Date(año, mes - 1, dia); // Mes es 0-indexado en JS
  };

  const obtenerDiaDeLaSemanaCorto = (fecha) =>
  parsearFechaLocal(fecha)
    .toLocaleDateString("es-ES", { weekday: "short" })
    .replace(".", "");

const obtenerMesCorto = (fecha) =>
  parsearFechaLocal(fecha)
    .toLocaleDateString("es-ES", { month: "short" })
    .replace(".", "");

const formatearSoloDia = (fecha) =>
  parsearFechaLocal(fecha).getDate().toString().padStart(2, "0");

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
    const [yearStr, monthStr] = fechaStr.split("-");
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    if (isNaN(year) || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      console.error("Fecha inválida:", fechaStr);
      return "Fecha inválida";
    }

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return `${meses[monthIndex]} ${year}`;
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
    const [datePart] = turno.fecha.split("T"); // "2025-09-05"
    if (!acc[datePart]) acc[datePart] = [];
    acc[datePart].push(turno);
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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[300]">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <BiLoaderCircle className="animate-spin mx-auto text-blue-600" size={28} />
          <p className="text-blue-700 text-sm mt-2 font-medium">Cargando tu agenda...</p>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[300]">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
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
      {/* Overlay oscuro — ESTILO UNIFICADO */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[40] xl:p-4 animate-fade-in">
        {/* Contenedor principal — ESTILO TurnSelectModal */}
        <div className="bg-white xl:rounded-2xl shadow-xl w-screen xl:max-w-7xl h-[100dvh] xl:h-[95vh] flex flex-col lg:flex-row lg:overflow-hidden overflow-auto border border-gray-100">

          {/* COLUMNA IZQUIERDA — Información del consultorio/médico */}
          <div className="lg:w-1/3 p-6 bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-6 relative">
              <div className="flex items-center gap-3 min-w-0">
                <FaCalendarAlt className="text-3xl text-white/90 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold capitalize leading-tight">
                    {tipoConsultorio === "propio" ? "Tu Agenda" : `Agenda de ${direccion}`}
                  </h2>
                  <p className="text-blue-100 opacity-90 text-sm md:text-base">{nombreMedico}</p>
                </div>
              </div>

              {/* Botón de cerrar móvil */}
              <button
                onClick={() => navigate("/micuenta")}
                className="absolute lg:hidden top-0 right-0 p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 z-10"
                aria-label="Cerrar y volver a mi cuenta"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Lista de meses */}
            <div className="mt-6 flex-1 flex flex-col h-[1000px] min-h-0">
              <p className="text-sm md:text-base text-white/90 mb-3 font-medium">Seleccioná un mes</p>

              <div
  ref={datesListRef}
  className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 custom-scrollbar"
>
                {mesesOrdenados.map((mes) => {
                  const expandido = mesesExpandidos.has(mes);
                  const nombreMes = formatearMes(`${mes}-01`);

                  return (
                    <div key={mes} className="mb-2">
                      {/* Botón de mes — estilo coherente */}
                      <button
                        onClick={() => toggleMes(mes)}
                        className={`
                          w-full text-left px-4 py-3 sm:px-5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
                          uppercase tracking-wide transition-all flex items-center justify-between
                          ${expandido
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white/10 text-white border border-white/30 hover:bg-white/20"
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
                  {/* Fechas del mes — solo si está expandido */}
{expandido && (
  <div className="mt-3 animate-fadeIn">
    <div
      className={`
        flex
        md:flex-col
        gap-2
        md:gap-3
        overflow-x-auto
        md:overflow-x-visible
        pb-2
        md:pb-0
        px-2
        scrollbar-hide
        whitespace-nowrap
      `}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {turnosPorMes[mes].map((fecha) => {
        const turnos = turnosAgrupados[fecha];
        const ocupados = turnos.filter((t) => t.estado === "reservado").length;
        const finalizados = turnos.filter((t) => t.estado === "finalizado").length;
        const disponibles = turnos.length - ocupados - finalizados;
        const isSelected = fecha === fechaSeleccionada;

        return (
          <button
            key={fecha}
            onClick={() => setFechaSeleccionada(fecha)}
            className={`
              flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
              border-2 flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px]
              ${isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white/10 text-white border-white/30 hover:border-blue-400 hover:bg-white/20 hover:text-blue-100'
              }
            `}
            aria-pressed={isSelected}
          >
            <span className="text-xs uppercase tracking-wide font-bold">
              {obtenerDiaDeLaSemanaCorto(fecha)}
            </span>
            <span className="text-lg font-bold mt-1">{formatearSoloDia(fecha)}</span>
            <span className="text-xs mt-0.5">{obtenerMesCorto(fecha)}</span>

            {/* Badge de disponibilidad */}
            {/* <span className={`
              absolute -top-2 -right-2 text-[0.6rem] px-1 py-0.5 rounded-full font-bold
              ${disponibles > 0 ? 'bg-green-500' : 'bg-red-500'} text-white
            `}>
              {disponibles}
            </span> */}
          </button>
        );
      })}
    </div>
  </div>
)}
                    </div>
                  );
                })}
                <div className="pb-8"></div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA — Detalles de turnos */}
          <div className="lg:w-2/3 flex flex-col h-full">
            {/* Encabezado secundario (solo desktop) */}
            <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Turnos del día</h3>
              <button
                onClick={() => navigate("/micuenta")}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
              {/* Selector de fecha — informativo */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <label className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" /> Fecha seleccionada
                </label>
                {fechaSeleccionada ? (
                  <p className="text-lg font-bold text-gray-800">{formatearFechaLarga(fechaSeleccionada)}</p>
                ) : (
                  <p className="text-gray-500 italic">Selecciona una fecha para ver turnos.</p>
                )}
              </div>

              {/* Lista de turnos */}
              <div className="space-y-4">
                {!fechaSeleccionada ? (
                  <div className="text-center py-8 bg-blue-50 rounded-xl border border-blue-200">
                    <FaInfoCircle className="mx-auto text-blue-500" size={36} />
                    <p className="mt-3 text-blue-700 font-medium text-sm">
                      Selecciona una fecha para ver los turnos disponibles.
                    </p>
                  </div>
                ) : turnosDeLaFecha.length === 0 ? (
                  <div className="text-center py-8 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                    <FaClock className="mx-auto text-gray-400" size={36} />
                    <p className="mt-3 text-gray-600 font-medium text-sm">
                      No hay turnos en esta fecha.
                    </p>
                    <button
                      onClick={handleAgregarTurnoClick}
                      className="mt-5 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 mx-auto text-sm"
                    >
                      <FaPlus /> Agregar Turnos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
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

            {/* PIE */}
            <div className="p-5 bg-white border-t border-gray-200">
              <button
                onClick={() => navigate("/micuenta")}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium text-sm"
              >
                ← Volver a Mi Cuenta
              </button>
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

      {/* Estilos personalizados */}
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default TurnList;