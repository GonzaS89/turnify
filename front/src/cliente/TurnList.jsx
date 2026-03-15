import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

// ICONOS
import { 
  FaCalendarAlt, FaTimes, FaPlus, FaArrowLeft, FaTrashAlt, 
  FaChevronDown, FaSortAmountDown, FaSortAmountUp 
} from "react-icons/fa";
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
  const [ordenAsc, setOrdenAsc] = useState(true);

  // --- LÓGICA DE FECHAS ORIGINAL ---
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

  const nombreMedico = `${profesional?.[0]?.nombre || ""} ${profesional?.[0]?.apellido || ""}`.trim();

  // AGRUPACIÓN ORIGINAL
  const turnosAgrupados = turnos.reduce((acc, turno) => {
    const [datePart] = turno.fecha.split("T");
    if (!acc[datePart]) acc[datePart] = [];
    acc[datePart].push(turno);
    return acc;
  }, {});

  const fechasBase = Object.keys(turnosAgrupados);

  // AGRUPACIÓN POR MESES
  const mesesMap = fechasBase.reduce((acc, fecha) => {
    const mesNombre = parsearFechaLocal(fecha).toLocaleString("es-ES", { month: "long", year: "numeric" }).toUpperCase();
    if (!acc[mesNombre]) acc[mesNombre] = [];
    acc[mesNombre].push(fecha);
    return acc;
  }, {});

  // --- FILTRO PARA OCULTAR MESES ANTERIORES AL ACTUAL ---
  const listaMeses = Object.keys(mesesMap)
    .sort((a, b) => {
      const dA = parsearFechaLocal(mesesMap[a][0]);
      const dB = parsearFechaLocal(mesesMap[b][0]);
      return ordenAsc ? dA - dB : dB - dA;
    })
    .filter((mesNombre) => {
      const hoy = new Date();
      // Creamos una fecha del primer día del mes actual para comparar meses/años
      const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      
      const fechaReferenciaGrupo = parsearFechaLocal(mesesMap[mesNombre][0]);
      const primerDiaMesGrupo = new Date(fechaReferenciaGrupo.getFullYear(), fechaReferenciaGrupo.getMonth(), 1);

      return primerDiaMesGrupo >= primerDiaMesActual;
    });

  // EFECTO PARA ABRIR EL MES ACTUAL POR DEFECTO
  useEffect(() => {
    if (listaMeses.length > 0 && Object.keys(mesesAbiertos).length === 0) {
      const mesActualKey = listaMeses[0]; 
      setMesesAbiertos({ [mesActualKey]: true });
    }
  }, [listaMeses]);

  const toggleMes = (mes) => {
    setMesesAbiertos(prev => ({ ...prev, [mes]: !prev[mes] }));
  };

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

  if (!isLoading && turnos.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <button onClick={() => navigate("/micuenta")} className="absolute top-6 left-6 p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
            <FaArrowLeft size={20} />
        </button>
        <div className="bg-slate-50 p-8 rounded-full mb-6">
          <FaCalendarAlt size={60} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase mb-2">Sin turnos configurados</h2>
        <p className="text-slate-500 mb-8 max-w-sm">No hay fechas ni turnos registrados en este consultorio.</p>
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

      {/* HEADER */}
      <header className="bg-slate-900 text-white p-4 md:px-12 flex items-center justify-between shadow-2xl z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/micuenta")} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Agenda</h2>
            <p className="text-indigo-400 font-bold uppercase text-[8px] tracking-[0.2em] italic truncate max-w-[150px] md:max-w-none">
                Dr. {nombreMedico}
            </p>
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

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-sm shrink-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <p className="text-slate-800 font-black text-xl uppercase tracking-tight">Calendario</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-white">
            {listaMeses.map((mes) => (
              <div key={mes} className="space-y-2 border-b border-slate-50 pb-4 last:border-0">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleMes(mes)}
                    className={`flex-1 flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                      mesesAbiertos[mes] ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaChevronDown className={`text-[10px] transition-transform duration-300 ${mesesAbiertos[mes] ? "rotate-180" : "-rotate-90"}`} />
                      <span className="font-black uppercase text-[10px] tracking-widest">{mes}</span>
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
                  >
                    {ordenAsc ? <FaSortAmountUp size={16} /> : <FaSortAmountDown size={16} />}
                  </button>
                </div>

                {mesesAbiertos[mes] && (
                  <div className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-x-hidden gap-3 pt-2 animate-fade-in pl-1 pb-3 lg:pb-0 custom-scrollbar scroll-smooth">
                    {mesesMap[mes]
                      .sort((a, b) => ordenAsc ? new Date(a) - new Date(b) : new Date(b) - new Date(a))
                      .map((f) => {
                        const turnosDia = turnosAgrupados[f];
                        const ocupados = turnosDia.filter((t) => t.estado === "reservado").length;
                        const disponibles = turnosDia.length - ocupados - turnosDia.filter((t) => t.estado === "finalizado").length;
                        const isSelected = f === fechaSeleccionada;

                        return (
                          <button
                            key={f}
                            onClick={(e) => handleSelectFecha(f, e)}
                            className={`shrink-0 w-[110px] lg:w-full p-4 rounded-xl border-2 transition-all flex flex-col lg:flex-row items-center lg:justify-between gap-2 lg:gap-0 ${
                              isSelected ? "border-indigo-600 bg-indigo-50/50 shadow-md scale-105 lg:scale-100" : "border-slate-50 bg-white hover:border-indigo-100"
                            }`}
                          >
                            <div className="text-center lg:text-left">
                              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{obtenerDiaDeLaSemanaCorto(f)}</p>
                              <p className={`text-sm lg:text-base font-black tracking-tighter ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                                {formatearSoloDia(f)} / {f.split("-")[1]}
                              </p>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase ${disponibles > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {disponibles} Libres
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16 custom-scrollbar bg-slate-50">
          {fechaSeleccionada ? (
            <div className="max-w-5xl mx-auto space-y-6 w-full animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest leading-none">Agenda Detallada</span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-800 capitalize tracking-tighter leading-tight">
                    {formatearFechaLarga(fechaSeleccionada)}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowModalBorrarTodosLosTurnos(true)} 
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border-2 border-red-100 active:scale-95"
                >
                  <FaTrashAlt /> <span className="hidden sm:inline">Vaciar Día</span>
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
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6 animate-pulse p-4 text-center">
              <div className="bg-slate-100 p-16 rounded-[4rem] border-4 border-dashed border-slate-200">
                <FaCalendarAlt size={60} className="opacity-20 text-slate-400" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-black text-slate-400 tracking-tighter uppercase mb-2">Selecciona una fecha</p>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic opacity-60">Gestiona los horarios disponibles del mes</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALES */}
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default TurnList;