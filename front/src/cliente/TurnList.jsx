// src/components/TurnList.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

// ICONOS
import { FaCalendarAlt, FaTimes, FaPlus, FaArrowLeft, FaTrashAlt, FaChevronLeft } from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
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
  const [showModalBorrarTodosLosTurnos, setShowModalBorrarTodosLosTurnos] = useState(false);
  const [liberandoIds, setLiberandoIds] = useState(new Set());
  const [finalizandoIds, setFinalizandoIds] = useState(new Set());
  const [mesesAbiertos, setMesesAbiertos] = useState({});

  // FUNCIONES DE FORMATEO
  const parsearFechaLocal = (fechaStr) => {
    const [año, mes, dia] = fechaStr.split("-").map(Number);
    return new Date(año, mes - 1, dia);
  };

  const obtenerDiaDeLaSemanaCorto = (fecha) =>
    parsearFechaLocal(fecha).toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");

  const formatearSoloDia = (fecha) =>
    parsearFechaLocal(fecha).getDate().toString().padStart(2, "0");

  const formatearFechaLarga = (fechaStr) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const [datePart] = fechaStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return `${dias[date.getUTCDay()]} ${day} de ${meses[month - 1]}`;
  };

  useEffect(() => {
    const interval = setInterval(() => setRefreshTrigger((prev) => prev + 1), 300000);
    return () => clearInterval(interval);
  }, []);

  const handleActualizarTurnos = () => setRefreshTrigger((prev) => prev + 1);

  const { turnos, isLoading } = useProfessionalConsultorioTurnos(profesionalId, consultorioId, refreshTrigger);
  const { coberturas } = useAllCoberturas();
  const { profesional } = useProfesionalxId(profesionalId);
  const { consultorio } = useConsultorioxId(consultorioId);

  const { direccion } = consultorio?.[0] || {};
  const nombreMedico = `${profesional?.[0]?.nombre || ""} ${profesional?.[0]?.apellido || ""}`.trim();

  const turnosAgrupados = turnos.reduce((acc, turno) => {
    const [datePart] = turno.fecha.split("T");
    if (!acc[datePart]) acc[datePart] = [];
    acc[datePart].push(turno);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(turnosAgrupados).sort((a, b) => new Date(a) - new Date(b));

  const mesesAgrupados = fechasOrdenadas.reduce((acc, fecha) => {
    const mesNombre = parsearFechaLocal(fecha).toLocaleString("es-ES", { month: "long", year: "numeric" }).toUpperCase();
    if (!acc[mesNombre]) acc[mesNombre] = [];
    acc[mesNombre].push(fecha);
    return acc;
  }, {});

  const tapButtonAsignar = (turno, idx) => {
    navigate(`/micuenta/formulario-usuario/${consultorioId}/${profesionalId}`);
    enviarTurnoYOrden(turno, idx + 1);
  };

  const handleBorrarTurno = (id) => {
    setIdTurnoSeleccionado(id);
    setShowModalBorrarTurno(true);
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
    } catch (error) { console.error(error); }
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

  // ESTADO: NO HAY TURNOS
  if (!isLoading && turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <button onClick={() => navigate("/micuenta")} className="absolute top-6 left-6 p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
            <FaArrowLeft size={20} />
        </button>
        <div className="bg-slate-50 p-8 rounded-full mb-6">
          <FaCalendarAlt size={60} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase mb-2">Sin turnos configurados</h2>
        <p className="text-slate-500 mb-8 max-w-sm">No hay fechas ni turnos registrados en este consultorio. Empieza habilitando nuevos horarios para tus pacientes.</p>
        <button 
          onClick={() => navigate(`/micuenta/generarturnos/${consultorioId}/${profesionalId}`)}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
        >
          <FaPlus /> Habilitar Turnos
        </button>
      </div>
    );
  }

  const turnosDeLaFecha = turnosAgrupados[fechaSeleccionada] || [];

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col h-screen w-full overflow-hidden animate-fade-in font-sans text-slate-900">
      <ToastContainer position="bottom-right" autoClose={1500} theme="colored" />

      {/* HEADER CON FLECHA DE REGRESO */}
      <header className="bg-slate-900 text-white p-4 md:px-12 flex items-center justify-between shadow-2xl z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/micuenta")} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h2 className="text-xl font-black uppercase">Agenda</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleActualizarTurnos} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
            <TbRefresh size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => navigate(`/micuenta/generarturnos/${consultorioId}/${profesionalId}`)} 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase rounded-xl shadow-lg"
          >
            <FaPlus /> <span className="hidden md:inline">Habilitar</span>
          </button>
          <button onClick={() => navigate("/micuenta")} className="text-slate-400 hover:text-white text-2xl p-2 transition-colors">
            <FaTimes />
          </button>
        </div>
      </header>

      {/* LAYOUT RESPONSIVO */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* ASIDE */}
        <aside className={`${fechaSeleccionada ? "hidden lg:flex" : "flex"} lg:w-1/3 xl:w-1/4 bg-white border-r border-slate-200 flex flex-col overflow-hidden`}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <p className="text-slate-800 font-black text-xl uppercase tracking-tight">Meses</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {Object.entries(mesesAgrupados).map(([mes, fechas]) => (
              <div key={mes} className="border border-slate-100 rounded-[1.5rem] overflow-hidden">
                <button onClick={() => setMesesAbiertos(prev => ({ ...prev, [mes]: !prev[mes] }))} className="w-full p-4 bg-slate-50 flex items-center justify-between text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                  {mes} <span>{mesesAbiertos[mes] ? "−" : "+"}</span>
                </button>
                {mesesAbiertos[mes] && (
                  <div className="p-3 space-y-2 bg-white">
                    {fechas.map((f) => (
                      <button key={f} onClick={() => setFechaSeleccionada(f)} className="w-full p-4 rounded-xl border border-slate-100 text-left hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                        <p className="text-xs font-black text-slate-400 uppercase">{obtenerDiaDeLaSemanaCorto(f)}</p>
                        <p className="text-lg font-black text-slate-800">{formatearSoloDia(f)} / {f.split("-")[1]}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className={`${fechaSeleccionada ? "flex" : "hidden lg:flex"} flex-1 flex-col overflow-y-auto p-4 md:p-16 custom-scrollbar`}>
          {fechaSeleccionada ? (
            <div className="max-w-5xl mx-auto space-y-6 w-full animate-fade-in">
              {/* Botón Volver Mobile */}
              <button onClick={() => setFechaSeleccionada(null)} className="lg:hidden flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-2">
                <FaChevronLeft /> Volver al calendario
              </button>

              <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black text-slate-800 capitalize tracking-tighter">{formatearFechaLarga(fechaSeleccionada)}</h3>
                <button 
                  onClick={() => setShowModalBorrarTodosLosTurnos(true)} 
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border-2 border-red-100"
                >
                  <FaTrashAlt /> <span className="hidden md:inline">Vaciar Día</span>
                </button>
              </div>

              <div className="space-y-3 pb-20">
                {turnosDeLaFecha
                  .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""))
                  .map((turno, idx) => (
                    <TurnoInterno 
                      key={turno.id} turno={turno} id={turno.id} idx={idx} estado={turno.estado} 
                      hora={turno.hora} paciente={`${turno.apellido_paciente}, ${turno.nombre_paciente}`} 
                      DNI={turno.DNI} cobertura={turno.cobertura} duracion={turno.duracion} 
                      telefono={turno.telefono} tapButtonAsignar={tapButtonAsignar} 
                      handleBorrarTurno={handleBorrarTurno} handleModificarEstadoTurno={handleModificarEstadoTurno} 
                      handleLiberarTurno={handleLiberarTurno} coberturaElegida={coberturaElegida} 
                      liberando={liberandoIds.has(turno.id)} finalizando={finalizandoIds.has(turno.id)}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 animate-pulse">
              <FaCalendarAlt size={60} className="mb-4 opacity-20" />
              <p className="text-xl font-black uppercase">Selecciona una fecha</p>
            </div>
          )}
        </main>
      </div>

      {showModalBorrarTurno && (
        <BorrarTurno idTurno={IdTurnoSeleccionado} onClose={() => setShowModalBorrarTurno(false)} actualizarTurnos={handleActualizarTurnos} />
      )}
      
      {showModalBorrarTodosLosTurnos && (
        <BorrarTodosLosTurnosModal 
          idConsultorio={consultorioId} idProfesional={profesionalId} fecha={fechaSeleccionada} 
          onClose={() => setShowModalBorrarTodosLosTurnos(false)} actualizarTurnos={handleActualizarTurnos} 
          resetearFecha={() => setFechaSeleccionada(null)} 
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default TurnList;