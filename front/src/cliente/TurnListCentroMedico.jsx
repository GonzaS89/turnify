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
      
      {/* HEADER PREMIUM */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl hidden md:block shadow-lg">
              <FaCalendarAlt className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Agenda Profesional</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2 italic">
                {tipoConsultorio === "propio" ? "Turnos del Centro" : `${medico?.titulo || ""} ${nombreMedico}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleActualizarTurnos}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white"
            title="Sincronizar"
          >
            <TbRefresh size={22} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={handleAgregarTurnoClick}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg"
          >
            <FaPlus /> Habilitar
          </button>
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-4xl font-light p-2 transition-colors">
            <FaTimes />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* SIDEBAR DE FECHAS */}
        <aside className="lg:w-1/3 xl:w-1/4 bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Listado de</h3>
              <p className="text-slate-800 font-black text-xl tracking-tight uppercase">Fechas</p>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-black text-[10px]">
              {fechasOrdenadas.length} DÍAS
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {fechasOrdenadas.length === 0 ? (
              <div className="text-center py-10 px-4">
                <FaRegClock className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sin turnos generados</p>
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
                    className={`w-full p-5 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100" 
                        : "border-slate-50 bg-white hover:border-indigo-100"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "short" })}
                      </p>
                      <p className={`text-lg font-black tracking-tighter ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                        {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
                        disponibles > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {disponibles} Libres
                      </span>
                      <div className="flex gap-0.5">
                        {turnosDia.slice(0, 5).map((t, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${t.estado === 'disponible' ? 'bg-green-400' : 'bg-red-400'}`} />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CONTENEDOR DE TURNOS */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar">
          {fechaSeleccionada ? (
            <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
              {/* HEADER DE FECHA SELECCIONADA */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">Vista Detallada</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter capitalize leading-tight">
                    {new Date(fechaSeleccionada + "T12:00:00").toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowModalBorrarTodosLosTurnos(true)}
                  className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100"
                >
                  <FaTrashAlt /> Vaciar Día
                </button>
              </div>

              {/* LISTADO DE TURNOS */}
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
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-8 animate-pulse">
              <div className="bg-slate-100 p-16 rounded-[4rem] border-4 border-dashed border-slate-200">
                <FaCalendarAlt size={80} className="opacity-20 text-slate-400" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-3xl font-black text-slate-400 tracking-tighter uppercase leading-none">Selecciona una fecha</p>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Para visualizar la gestión de horarios</p>
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default TurnListCentroMedico;