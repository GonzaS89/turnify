// src/components/TurnListCentroMedico.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify';

// ICONOS
import {
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaArrowLeft,
  FaChevronDown,
  FaTrashAlt,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
import { BiLoaderCircle } from "react-icons/bi";

// HOOKS
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import useProfesionalxId from "../../customHooks/useProfesionalxId";

// LAYOUTS
import BorrarTurno from "../cliente/BorrarTurno";
import BorrarTodosLosTurnosModal from "../cliente/BorrarTodosLosTurnosModal";
import TurnoInterno from "../cliente/TurnoInterno";

const TurnListCentroMedico = ({ tipoConsultorio, enviarTurnoYOrden }) => {
  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showModalBorrarTurno, setShowModalBorrarTurno] = useState(false);
  const [IdTurnoSeleccionado, setIdTurnoSeleccionado] = useState(null);
  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] = useState(false);
  const [liberando, setLiberando] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  // ESTADOS DE UI - ORDEN ASCENDENTE POR DEFECTO (Menor a Mayor)
  const [ordenAsc, setOrdenAsc] = useState(true); 
  const [mesesAbiertos, setMesesAbiertos] = useState({});

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);

  const { turnos, isLoading } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);

  const medico = profesional?.[0];
  const nombreMedico = `${medico?.nombre || ""} ${medico?.apellido || ""}`.trim();

  // --- LÓGICA DE TURNOS ORIGINAL ---
  const turnosAgrupados = turnos.reduce((acc, turno) => {
    const fecha = new Date(turno.fecha);
    const clave = fecha.toISOString().split("T")[0];
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(turno);
    return acc;
  }, {});

  // --- AGRUPACIÓN POR MESES ---
  const fechasBase = Object.keys(turnosAgrupados);
  
  const agruparPorMes = (fechas) => {
    return fechas.reduce((acc, fecha) => {
      const fechaObj = new Date(fecha + "T12:00:00");
      const mesClave = fechaObj.toLocaleString("es-AR", { month: "long", year: "numeric" });
      if (!acc[mesClave]) acc[mesClave] = [];
      acc[mesClave].push(fecha);
      return acc;
    }, {});
  };

  const mesesMap = agruparPorMes(fechasBase);
  
  // Lista de meses ordenada según el estado global (Menor a Mayor por defecto)
  const listaMeses = Object.keys(mesesMap).sort((a, b) => {
    const dA = new Date(mesesMap[a][0]);
    const dB = new Date(mesesMap[b][0]);
    return ordenAsc ? dA - dB : dB - dA;
  });

  const toggleMes = (mes) => {
    setMesesAbiertos(prev => ({ ...prev, [mes]: !prev[mes] }));
  };

  // --- FUNCIÓN PARA AUTO-SCROLL AL SELECCIONAR FECHA ---
  const handleSelectFecha = (fecha, e) => {
    setFechaSeleccionada(fecha);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

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

  const handleModificarEstadoTurno = async (idTurno) => {
    setFinalizando(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/modificarestadoturno/${idTurno}`);
      setTimeout(() => {
        setFinalizando(false);
        handleActualizarTurnos();
      }, 1500);
    } catch (error) { console.error(error); setFinalizando(false); }
  };

  const handleLiberarTurno = async (idTurno) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cancelarturno/${idTurno}`);
      toast.success("Turno liberado");
      setTimeout(() => {
        handleActualizarTurnos();
        setLiberando(false);
      }, 1500);
    } catch (error) { console.error(error); }
  };

  const coberturaElegida = (value) => {
    if (value === "particular") return "Particular";
    const cobertura = coberturas?.find((c) => c.id == value);
    return cobertura ? cobertura.siglas : "Particular";
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[400]">
        <BiLoaderCircle className="animate-spin text-indigo-600 mb-4" size={50} />
        <p className="text-slate-800 font-black tracking-widest uppercase text-xs">Sincronizando Agenda...</p>
      </div>
    );
  }

  const turnosDeLaFecha = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col h-screen w-full overflow-hidden animate-fade-in font-sans">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-4 md:p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => navigate(-1)} className="p-2 md:p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-xl md:text-2xl" />
          </button>
          <div>
            <h2 className="text-lg md:text-3xl font-black tracking-tighter leading-none uppercase">Agenda</h2>
            <p className="text-indigo-400 font-bold uppercase text-[8px] md:text-xs tracking-[0.2em] mt-1 italic truncate">
              {tipoConsultorio === "propio" ? "Turnos del Centro" : `${medico?.titulo || ""} ${nombreMedico}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={handleActualizarTurnos} className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white">
            <TbRefresh size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={handleAgregarTurnoClick} className="flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] md:text-xs uppercase rounded-xl transition-all shadow-lg">
            <FaPlus /> <span className="hidden xs:block">Habilitar</span>
          </button>
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-2xl md:text-4xl font-light p-1 transition-colors">
            <FaTimes />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white border-b lg:border-r border-slate-200 flex flex-col overflow-hidden shadow-sm shrink-0">
          <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Listado de</h3>
            <p className="text-slate-800 font-black text-lg md:text-xl tracking-tight uppercase">Fechas</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-white">
            {listaMeses.length === 0 ? (
              <div className="text-center py-6 px-4 w-full">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sin turnos</p>
              </div>
            ) : (
              listaMeses.map((mes) => (
                <div key={mes} className="space-y-2 border-b border-slate-50 pb-4 last:border-0">
                  
                  {/* BOTÓN MES CON CONTADOR Y ORDENAMIENTO */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleMes(mes)}
                      className={`flex-1 flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        mesesAbiertos[mes] ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaChevronDown className={`text-[10px] transition-transform duration-300 ${mesesAbiertos[mes] ? "rotate-180" : "-rotate-90"}`} />
                        <span className="font-black uppercase text-[11px] tracking-widest">{mes}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${mesesAbiertos[mes] ? "bg-indigo-500 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
                        {mesesMap[mes].length} d
                      </span>
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); setOrdenAsc(!ordenAsc); }}
                      className={`p-3.5 rounded-2xl transition-all shadow-md active:scale-90 ${
                        ordenAsc ? "bg-indigo-600 text-white" : "bg-amber-500 text-white"
                      }`}
                      title={ordenAsc ? "Ver más recientes" : "Ver más antiguos"}
                    >
                      {ordenAsc ? <FaSortAmountUp size={16} /> : <FaSortAmountDown size={16} />}
                    </button>
                  </div>

                  {/* LISTADO DE DÍAS - SCROLL HORIZONTAL MOBILE */}
                  {mesesAbiertos[mes] && (
                    <div className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-x-hidden gap-3 pt-2 animate-fade-in pl-1 pb-3 lg:pb-0 custom-scrollbar scroll-smooth">
                      {mesesMap[mes]
                        .sort((a, b) => ordenAsc ? new Date(a) - new Date(b) : new Date(b) - new Date(a))
                        .map((fecha) => {
                          const turnosDia = turnosAgrupados[fecha];
                          const ocupados = turnosDia.filter((t) => t.estado === "reservado").length;
                          const disponibles = turnosDia.length - ocupados - turnosDia.filter((t) => t.estado === "finalizado").length;
                          const isSelected = fecha === fechaSeleccionada;

                          return (
                            <button
                              key={fecha}
                              onClick={(e) => handleSelectFecha(fecha, e)}
                              className={`shrink-0 w-[110px] lg:w-full p-4 rounded-xl border-2 transition-all flex flex-col lg:flex-row items-center lg:justify-between gap-2 lg:gap-0 ${
                                isSelected ? "border-indigo-600 bg-indigo-50/50 shadow-md scale-105 lg:scale-100" : "border-slate-50 bg-white hover:border-indigo-100"
                              }`}
                            >
                              <div className="text-center lg:text-left">
                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                                  {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "short" })}
                                </p>
                                <p className={`text-sm lg:text-base font-black tracking-tighter ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                                  {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                                </p>
                              </div>
                              <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${disponibles > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {disponibles} L
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16 custom-scrollbar">
          {fechaSeleccionada ? (
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-10 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">Agenda Detallada</span>
                  </div>
                  <h3 className="text-xl md:text-4xl font-black text-slate-800 tracking-tighter capitalize leading-tight">
                    {new Date(fechaSeleccionada + "T12:00:00").toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowModalBorrarTodosLosTurnos(true)}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <FaTrashAlt /> Vaciar Día
                </button>
              </div>

              <div className="space-y-4">
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
                      liberando={liberando}
                      finalizando={finalizando}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-8 animate-pulse p-4 text-center">
              <div className="bg-slate-100 p-16 rounded-[4rem] border-4 border-dashed border-slate-200">
                <FaCalendarAlt size={60} className="opacity-20 text-slate-400" />
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-black text-slate-400 tracking-tighter uppercase mb-2">Selecciona una fecha</p>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic opacity-60">Gestiona los horarios disponibles del mes</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALES */}
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

      <ToastContainer autoClose={1500} position="bottom-right" />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default TurnListCentroMedico;