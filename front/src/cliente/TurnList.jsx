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
  FaClock,
  FaRegClock,
  FaChevronRight,
  FaChevronDown,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";

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
  const { consultorioId, profesionalId } = useParams();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModalBorrarTurno, setShowModalBorrarTurno] = useState(false);
  const [IdTurnoSeleccionado, setIdTurnoSeleccionado] = useState(null);
  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] = useState(false);
  const [liberandoIds, setLiberandoIds] = useState(new Set());
  const [finalizandoIds, setFinalizandoIds] = useState(new Set());
  const [mesesExpandidos, setMesesExpandidos] = useState(new Set());

  const datesListRef = useRef(null);

  // --- LÓGICA DE DATOS (Mantenida) ---
  const { turnos, isLoading } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);
  const { consultorio } = useConsultorioxId(consultorioId);
  const medico = profesional?.[0];
  const nombreMedico = `${medico?.nombre || ""} ${medico?.apellido || ""}`.trim();
  const consultorioObtenido = consultorio?.[0];

  useEffect(() => {
    const interval = setInterval(() => setRefreshTrigger((prev) => prev + 1), 300000);
    return () => clearInterval(interval);
  }, []);

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);

  // Helpers de formateo
  const parsearFechaLocal = (f) => { const [y, m, d] = f.split("-").map(Number); return new Date(y, m - 1, d); };
  const obtenerDiaDeLaSemanaCorto = (f) => parsearFechaLocal(f).toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");
  const obtenerMesCorto = (f) => parsearFechaLocal(f).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
  const formatearSoloDia = (f) => parsearFechaLocal(f).getDate().toString().padStart(2, "0");
  const formatearFechaLarga = (f) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const [y, m, d] = f.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return `${dias[date.getUTCDay()]} ${d}`;
  };
  const formatearMes = (f) => {
    const [y, m] = f.split("-");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${meses[parseInt(m) - 1]} ${y}`;
  };

  // Agrupación de turnos
  const turnosAgrupados = turnos.reduce((acc, t) => {
    const [date] = t.fecha.split("T");
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  const turnosPorMes = Object.keys(turnosAgrupados).reduce((acc, f) => {
    const mes = f.slice(0, 7);
    if (!acc[mes]) acc[mes] = [];
    acc[mes].push(f);
    return acc;
  }, {});

  const mesesOrdenados = Object.keys(turnosPorMes).sort((a, b) => new Date(b) - new Date(a));
  mesesOrdenados.forEach(m => turnosPorMes[m].sort((a, b) => new Date(b) - new Date(a)));

  const toggleMes = (mes) => {
    setMesesExpandidos(prev => {
      const nuevo = new Set();
      if (!prev.has(mes)) nuevo.add(mes);
      return nuevo;
    });
  };

  const handleAgregarTurnoClick = () => navigate(`/micuenta/generarturnos/${consultorioId}/${profesionalId}`);
  const tapButtonAsignar = (turno, idx) => {
    navigate(`/micuenta/formulario-usuario/${consultorioId}/${profesionalId}`);
    enviarTurnoYOrden(turno, idx + 1);
  };

  const handleBorrarTurno = (id) => { setIdTurnoSeleccionado(id); setShowModalBorrarTurno(true); };
  
  const handleModificarEstadoTurno = async (idTurno) => {
    setFinalizandoIds((prev) => new Set([...prev, idTurno]));
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/modificarestadoturno/${idTurno}`);
      setTimeout(() => {
        handleActualizarTurnos();
        setFinalizandoIds(prev => { const n = new Set(prev); n.delete(idTurno); return n; });
      }, 1500);
    } catch (e) { console.error(e); }
  };

  const handleLiberarTurno = async (idTurno) => {
    setLiberandoIds((prev) => new Set([...prev, idTurno]));
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cancelarturno/${idTurno}`);
      toast.success("Turno liberado");
      setTimeout(() => {
        handleActualizarTurnos();
        setLiberandoIds(prev => { const n = new Set(prev); n.delete(idTurno); return n; });
      }, 1500);
    } catch (e) { console.error(e); }
  };

  const coberturaElegida = (v) => {
    if (v === "particular") return "Particular";
    return coberturas?.find(c => c.id == v)?.siglas || "Particular";
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[500]">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          <BiLoaderCircle className="animate-spin text-indigo-600 mb-4" size={45} />
          <p className="text-slate-600 font-semibold">Sincronizando agenda...</p>
        </div>
      </div>
    );
  }

  const turnosDeLaFecha = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[40] p-0 md:p-6">
        <div className="bg-slate-50 w-full max-w-6xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
          
          {/* SIDEBAR: CALENDARIO Y MESES */}
          <div className="md:w-[380px] bg-slate-900 text-white flex flex-col shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <FaMapMarkerAlt size={12} />
                    <span className="text-xs uppercase font-medium truncate max-w-[200px]">
                      {consultorioObtenido?.direccion || "Consultorio"}
                    </span>
                  </div>
                </div>
                <button onClick={() => navigate("/micuenta")} className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
                  <FaTimes />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-lg font-bold">
                  {nombreMedico.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Profesional</p>
                  <p className="text-sm font-semibold truncate">{nombreMedico}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2">Historial de Turnos</p>
              
              {mesesOrdenados.map((mes) => {
                const isExpanded = mesesExpandidos.has(mes);
                return (
                  <div key={mes} className="mb-3">
                    <button
                      onClick={() => toggleMes(mes)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        isExpanded ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="font-semibold text-sm">{formatearMes(`${mes}-01`)}</span>
                      {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 grid grid-cols-1 gap-2 animate-fadeIn px-1">
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                          {turnosPorMes[mes].map((fecha) => {
                            const tDia = turnosAgrupados[fecha];
                            const disponibles = tDia.filter(t => t.estado === "disponible").length;
                            const isSelected = fecha === fechaSeleccionada;

                            return (
                              <button
                                key={fecha}
                                onClick={() => setFechaSeleccionada(fecha)}
                                className={`flex-shrink-0 md:w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                  isSelected 
                                    ? "bg-white border-white text-slate-900 shadow-md transform scale-[1.02]" 
                                    : "bg-transparent border-white/10 text-slate-400 hover:border-white/30"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-white/5"}`}>
                                    <span className="text-[9px] uppercase font-bold">{obtenerDiaDeLaSemanaCorto(fecha)}</span>
                                    <span className="text-sm font-bold leading-none">{formatearSoloDia(fecha)}</span>
                                  </div>
                                  <div className="text-left hidden md:block">
                                    <p className={`text-[10px] font-bold uppercase ${isSelected ? "text-indigo-500" : "text-slate-500"}`}>
                                      {obtenerMesCorto(fecha)}
                                    </p>
                                  </div>
                                </div>
                                {disponibles > 0 && (
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-black ${isSelected ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}>
                                    {disponibles} DISP.
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN CONTENT: LISTA DE TURNOS */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
            {/* Header Escritorio */}
            <div className="hidden md:flex items-center justify-between p-6 bg-white border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Panel de Atención</h3>
                <p className="text-sm text-slate-500">Gestiona las citas y disponibilidad</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAgregarTurnoClick}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
                >
                  <FaPlus size={12} /> Generar Turnos
                </button>
                <button onClick={() => navigate("/micuenta")} className="p-2.5 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
              {!fechaSeleccionada ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300">
                    <FaCalendarAlt size={40} />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-lg">Tu agenda te espera</h4>
                    <p className="text-slate-500 text-sm max-w-xs">Selecciona una fecha del panel izquierdo para ver y gestionar los turnos.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
                  {/* Banner de Fecha Seleccionada */}
                  <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <FaCalendarAlt size={24} />
                      </div>
                      <div>
                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Fecha Seleccionada</p>
                        <h2 className="text-xl font-bold">{formatearFechaLarga(fechaSeleccionada)}</h2>
                      </div>
                    </div>
                  </div>

                  {turnosDeLaFecha.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                      <FaRegClock className="mx-auto text-slate-300 mb-4" size={48} />
                      <p className="text-slate-600 font-bold">No hay turnos creados para este día</p>
                      <button onClick={handleAgregarTurnoClick} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">
                        + Crear nueva franja horaria
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* SECCIÓN DISPONIBLES */}
                      {turnosDeLaFecha.some(t => t.estado === "disponible") && (
                        <section>
                          <div className="flex items-center gap-3 mb-4 px-2">
                            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                            <h3 className="text-slate-800 font-extrabold uppercase tracking-tight text-sm">Cupos Disponibles</h3>
                          </div>
                          <div className="grid gap-3">
                            {turnosDeLaFecha
                              .filter(t => t.estado === "disponible")
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
                        </section>
                      )}

                      {/* SECCIÓN RESERVADOS */}
                      {turnosDeLaFecha.some(t => t.estado !== "disponible") && (
                        <section>
                          <div className="flex items-center gap-3 mb-4 px-2">
                            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                            <h3 className="text-slate-800 font-extrabold uppercase tracking-tight text-sm">Pacientes Agendados</h3>
                          </div>
                          <div className="grid gap-3">
                            {turnosDeLaFecha
                              .filter(t => t.estado !== "disponible")
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
                        </section>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer móvil / Volver */}
            <div className="p-4 bg-white border-t border-slate-200 md:hidden">
              <button
                onClick={() => navigate("/micuenta")}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm"
              >
                Volver al Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales (Mantenidos) */}
      {showModalBorrarTurno && (
        <BorrarTurno idTurno={IdTurnoSeleccionado} onClose={() => setShowModalBorrarTurno(false)} actualizarTurnos={handleActualizarTurnos} />
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

      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        .custom-scrollbar-light::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default TurnList;