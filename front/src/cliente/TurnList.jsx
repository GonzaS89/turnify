// src/components/TurnList.jsx
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

// ICONOS
import {
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaClock,
  FaUserMd,
  FaChevronRight,
  FaRegCalendarCheck,
  FaMapMarkerAlt,
  FaCircle,
  FaUserCircle,
} from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";

// HOOKS
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import useConsultorioxId from "../../customHooks/useConsultorioxId";

// LAYOUTS
import BorrarTurno from "./BorrarTurno";
import BorrarTodosLosTurnosModal from "./BorrarTodosLosTurnosModal";
import TurnoInterno from "./TurnoInterno";

const TurnList = ({ tipoConsultorio, enviarTurnoYOrden }) => {
  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModalBorrarTurno, setShowModalBorrarTurno] = useState(false);
  const [IdTurnoSeleccionado, setIdTurnoSeleccionado] = useState(null);
  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] =
    useState(false);
  const [liberandoIds, setLiberandoIds] = useState(new Set());
  const [finalizandoIds, setFinalizandoIds] = useState(new Set());
  const [mesesExpandidos, setMesesExpandidos] = useState(new Set());
 
  const datesListRef = useRef(null);

  // LÓGICA DE DATOS
  const { turnos, isLoading } = useProfessionalConsultorioTurnos(
    profesionalId,
    consultorioId,
    refreshTrigger,
  );
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);
  const { consultorio } = useConsultorioxId(consultorioId);

  const consultorioObtenido = consultorio?.[0];
  const medico = profesional?.[0];
  const nombreMedico =
    `${medico?.nombre || ""} ${medico?.apellido || ""}`.trim();

  // FORMATO DE FECHAS (Sincronizado con estilo memorizado)
  const formatearMes = (fechaStr) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const [year, month] = fechaStr.split("-").map(Number);
    return `${meses[month - 1]} ${year}`;
  };

  const formatearSoloDia = (fecha) => fecha.split("-")[2];
  const obtenerDiaDeLaSemanaCorto = (fecha) => {
    const [y, m, d] = fecha.split("-").map(Number);
    return new Date(y, m - 1, d)
      .toLocaleDateString("es-ES", { weekday: "short" })
      .replace(".", "");
  };

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);
  const handleAgregarTurnoClick = () =>
    navigate(`/micuenta/generarturnos/${consultorioId}/${profesionalId}`);

  // AGRUPACIÓN (Mismo proceso lógico)
  const turnosAgrupados = turnos.reduce((acc, t) => {
    const date = t.fecha.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  console.log(turnosAgrupados);

  const turnosPorMes = Object.keys(turnosAgrupados).reduce((acc, f) => {
    const mes = f.slice(0, 7);
    if (!acc[mes]) acc[mes] = [];
    acc[mes].push(f);
    return acc;
  }, {});

  const mesesOrdenados = Object.keys(turnosPorMes).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  const toggleMes = (mes) => {
    setMesesExpandidos((prev) => {
      const nuevo = new Set();
      if (!prev.has(mes)) nuevo.add(mes);
      return nuevo;
    });
  };

  const tapButtonAsignar = (turno, idx) => {
    navigate(`/micuenta/formulario-usuario/${consultorioId}/${profesionalId}`);
    enviarTurnoYOrden(turno, idx + 1);
  };

  const handleModificarEstadoTurno = async (idTurno) => {
    setFinalizandoIds((prev) => new Set([...prev, idTurno]));
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/modificarestadoturno/${idTurno}`,
      );
      setTimeout(() => {
        handleActualizarTurnos();
        setFinalizandoIds((prev) => {
          const n = new Set(prev);
          n.delete(idTurno);
          return n;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLiberarTurno = async (idTurno) => {
    setLiberandoIds((prev) => new Set([...prev, idTurno]));
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cancelarturno/${idTurno}`,
      );
      toast.success("Turno liberado");
      setTimeout(() => {
        handleActualizarTurnos();
        setLiberandoIds((prev) => {
          const n = new Set(prev);
          n.delete(idTurno);
          return n;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

    const handleBorrarTurno = (id) => {
    setIdTurnoSeleccionado(id);
    setShowModalBorrarTurno(true);
  };

  if (isLoading) return <LoadingModal />;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[500] animate-fade-in">
      <div className="bg-[#F8FAFC] w-full h-full xl:h-[90vh] xl:max-w-7xl xl:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/20">
        {/* PANEL IZQUIERDO: SELECTOR DE FECHAS (Estilo Sidebar memorizado) */}
        <aside className="lg:w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <FaCalendarAlt size={18} />
              </div>
              <button
                onClick={() => navigate("/micuenta")}
                className="lg:hidden text-slate-400 hover:text-slate-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
              Agenda
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
              <FaUserMd size={10} /> {medico?.apellido}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {mesesOrdenados.map((mes) => (
              <div key={mes} className="space-y-2">
                <button
                  onClick={() => toggleMes(mes)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                    mesesExpandidos.has(mes)
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-transparent text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {formatearMes(`${mes}-01`)}
                  <FaChevronRight
                    size={10}
                    className={`transform transition-transform ${mesesExpandidos.has(mes) ? "rotate-90" : ""}`}
                  />
                </button>

                {mesesExpandidos.has(mes) && (
                  <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 animate-fadeIn px-1">
                    {turnosPorMes[mes].map((fecha) => {
                      const isSelected = fecha === fechaSeleccionada;
                      const disponibles = turnosAgrupados[fecha].filter(
                        (t) => t.estado === "disponible",
                      ).length;

                      return (
                        <button
                          key={fecha}
                          onClick={() => setFechaSeleccionada(fecha)}
                          className={`flex flex-col lg:flex-row items-center gap-3 p-3 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                              : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          <div
                            className={`flex flex-col items-center justify-center min-w-[40px] ${isSelected ? "text-white" : "text-slate-400"}`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                              {obtenerDiaDeLaSemanaCorto(fecha)}
                            </span>
                            <span className="text-lg font-black leading-none">
                              {formatearSoloDia(fecha)}
                            </span>
                          </div>
                          <div className="hidden lg:block text-left overflow-hidden">
                            <p
                              className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-indigo-100" : "text-slate-400"}`}
                            >
                              Disponibles
                            </p>
                            <p className="text-xs font-black">
                              {disponibles} turnos
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleAgregarTurnoClick}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              + Habilitar Turnos
            </button>
          </div>
        </aside>

        {/* CONTENIDO DERECHO: LISTADO DE TURNOS (Estilo Dashboard memorizado) */}
        <main className="flex-1 flex flex-col h-full bg-[#f8fafc]">
          <header className="hidden lg:flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Planilla de Atención
              </h3>
              <p className="text-lg font-black text-slate-800">
                {fechaSeleccionada
                  ? new Date(fechaSeleccionada).toLocaleDateString("es-AR", {
                      dateStyle: "full",
                    })
                  : "Seleccione una fecha"}
              </p>
            </div>
            <button
              onClick={() => navigate("/micuenta")}
              className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            {!fechaSeleccionada ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem]">
                <FaRegCalendarCheck className="text-slate-200 mb-4" size={60} />
                <h4 className="text-xl font-black text-slate-400">
                  Seleccione un día para comenzar
                </h4>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
                {/* GRUPO DISPONIBLES */}
                {turnosAgrupados[fechaSeleccionada].filter(
                  (t) => t.estado === "disponible",
                ) && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FaCircle className="text-emerald-500 text-[10px]" />
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                        Turnos Disponibles
                      </h4>
                      <div className="flex-1 h-px bg-slate-100"></div>
                    </div>
                    <div className="grid gap-3">
                      {turnosAgrupados[fechaSeleccionada]
                        .filter((t) => t.estado === "disponible")
                        .sort((a, b) => a.hora.localeCompare(b.hora))
                        .map((t, i) => (
                          <TurnoInterno
                            key={t.id}
                            turno={t}
                            estado={t.estado}
                            duracion={t.duracion}
                            hora={t.hora}
                            tapButtonAsignar={tapButtonAsignar}
                            handleLiberarTurno={handleLiberarTurno}
                            finalizando={finalizandoIds.has(t.id)}
                          />
                        ))}
                    </div>
                  </section>
                )}

                {/* GRUPO RESERVADOS */}
                {turnosAgrupados[fechaSeleccionada].some(
                  (t) => t.estado !== "disponible",
                ) && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FaCircle className="text-indigo-500 text-[10px]" />
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                        Turnos Reservados
                      </h4>
                      <div className="flex-1 h-px bg-slate-100"></div>
                    </div>
                    <div className="grid gap-3 opacity-90">
                      {turnosAgrupados[fechaSeleccionada]
                        .filter((t) => t.estado !== "disponible")
                        .sort((a, b) => a.hora.localeCompare(b.hora))
                        .map((t, i) => (
                          <TurnoInterno
                            key={t.id}
                            turno={t}
                            estado={t.estado}
                            hora={t.hora}
                            paciente={t.paciente}
                            DNI={t.DNI}
                            cobertura={t.cobertura}
                            duracion={t.duracion}
                            telefono={t.telefono}
                            handleModificarEstadoTurno={
                              handleModificarEstadoTurno
                            }
                            handleLiberarTurno={handleLiberarTurno}
                            handleBorrarTurno={handleBorrarTurno}
                            liberando={liberandoIds.has(t.id)}
                          />
                        ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          <footer className="lg:hidden p-6 bg-white border-t border-slate-200">
            <button
              onClick={() => navigate("/micuenta")}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              Volver al Panel
            </button>
          </footer>
        </main>
      </div>

      {/* MODALES EXTERNOS */}
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
    </div>
  );
};

// COMPONENTES AUXILIARES DE UI
const LoadingModal = () => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[600]">
    <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
      <BiLoaderCircle className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
        Sincronizando Agenda
      </p>
    </div>
  </div>
);

export default TurnList;
