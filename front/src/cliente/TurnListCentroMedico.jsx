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
  FaRegClock,
  FaCheckCircle
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

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);

  const { turnos, isLoading } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);

  const medico = profesional?.[0];
  const nombreMedico = `${medico?.nombre || ""} ${medico?.apellido || ""}`.trim();

  const turnosAgrupados = turnos.reduce((acc, turno) => {
    const fecha = new Date(turno.fecha);
    const clave = fecha.toISOString().split("T")[0];
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(turno);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(turnosAgrupados).sort((a, b) => new Date(b) - new Date(a));

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
      
      {/* HEADER PREMIUM - RESPONSIVE */}
      <header className="bg-slate-900 text-white p-4 md:p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => navigate(-1)} className="p-2 md:p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-xl md:text-2xl" />
          </button>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="bg-indigo-600 p-3 md:p-4 rounded-2xl hidden sm:block shadow-lg">
              <FaCalendarAlt className="text-2xl md:text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-3xl font-black tracking-tighter leading-none uppercase">Agenda</h2>
              <p className="text-indigo-400 font-bold uppercase text-[8px] md:text-xs tracking-[0.2em] mt-1 md:mt-2 italic truncate max-w-[120px] md:max-w-none">
                {tipoConsultorio === "propio" ? "Turnos del Centro" : `${medico?.titulo || ""} ${nombreMedico}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={handleActualizarTurnos}
            className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white"
            title="Sincronizar"
          >
            <TbRefresh size={20} className={isLoading ? "animate-spin" : ""} />
          </button>

          {/* BOTÓN HABILITAR VISIBLE EN MOBILE */}
          <button 
            onClick={handleAgregarTurnoClick}
            className="flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] md:text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg active:scale-95"
          >
            <FaPlus /> <span className="hidden xs:block">Habilitar</span>
          </button>

          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-2xl md:text-4xl font-light p-1 md:p-2 transition-colors">
            <FaTimes />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* SIDEBAR DE FECHAS - ADAPTADO CON SCROLL HORIZONTAL EN MOBILE */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white border-b lg:border-r border-slate-200 flex flex-col overflow-hidden shadow-sm shrink-0">
          <div className="p-4 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1">Listado de</h3>
              <p className="text-slate-800 font-black text-lg md:text-xl tracking-tight uppercase">Fechas</p>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-2 py-0.5 md:px-3 md:py-1 rounded-lg font-black text-[9px] md:text-[10px]">
              {fechasOrdenadas.length} DÍAS
            </div>
          </div>

          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto p-4 md:p-6 gap-3 custom-scrollbar">
            {fechasOrdenadas.length === 0 ? (
              <div className="text-center py-6 px-4 w-full">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sin turnos</p>
              </div>
            ) : (
              fechasOrdenadas.map((fecha) => {
                const turnosDia = turnosAgrupados[fecha];
                const ocupados = turnosDia.filter((t) => t.estado === "reservado").length;
                const disponibles = turnosDia.length - ocupados - turnosDia.filter((t) => t.estado === "finalizado").length;
                const isSelected = fecha === fechaSeleccionada;

                return (
                  <button
                    key={fecha}
                    onClick={() => setFechaSeleccionada(fecha)}
                    className={`shrink-0 lg:w-full p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border-2 transition-all flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0 ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100" 
                        : "border-slate-50 bg-white hover:border-indigo-100"
                    }`}
                  >
                    <div className="text-center lg:text-left">
                      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "short" })}
                      </p>
                      <p className={`text-sm md:text-lg font-black tracking-tighter ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                        {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-center lg:items-end gap-1">
                      <span className={`text-[8px] md:text-[9px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg uppercase ${
                        disponibles > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {disponibles} Libres
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CONTENEDOR DE TURNOS - RESPONSIVE */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16 custom-scrollbar">
          {fechaSeleccionada ? (
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-fade-in">
              {/* HEADER DE FECHA SELECCIONADA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-indigo-600 font-black uppercase text-[8px] md:text-[10px] tracking-widest">Agenda Detallada</span>
                  </div>
                  <h3 className="text-xl md:text-4xl font-black text-slate-800 tracking-tighter capitalize leading-tight">
                    {new Date(fechaSeleccionada + "T12:00:00").toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowModalBorrarTodosLosTurnos(true)}
                  className="px-4 py-3 md:px-6 md:py-4 bg-red-50 text-red-600 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100 active:scale-95"
                >
                  <FaTrashAlt /> <span className="sm:inline">Vaciar Día</span>
                </button>
              </div>

              {/* LISTADO DE TURNOS */}
              <div className="space-y-3 md:space-y-4">
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
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6 md:space-y-8 animate-pulse p-4">
              <div className="bg-slate-100 p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border-2 md:border-4 border-dashed border-slate-200">
                <FaCalendarAlt size={50} className="opacity-20 text-slate-400" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl md:text-3xl font-black text-slate-400 tracking-tighter uppercase leading-none">Selecciona una fecha</p>
                <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest italic">Gestiona los horarios disponibles</p>
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