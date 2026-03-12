import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useProfessionalConsultorios from "../../customHooks/useProfessionalConsultorios";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import Turno from "./Turno";
import {
  FaUserMd,
  FaCalendarAlt,
  FaHospital,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";

const TurnSelectModal = ({ enviarTurnoYOrden, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { profesionalSlug } = useParams();

  const initialConsultorioId = location.state?.initialConsultorioId || null;

  const [paso, setPaso] = useState(initialConsultorioId ? 1 : 0);
  const [profesionalId, setProfesionalId] = useState(null);
  const [consultorioSelec, setConsultorioSelec] = useState(initialConsultorioId);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    const fetchProfesionalId = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profesionales/${profesionalSlug}`);
        const prof = Array.isArray(res.data) ? res.data[0] : res.data;
        if (prof?.id) setProfesionalId(prof.id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfesionalId();
  }, [profesionalSlug, API_URL]);

  const { profesional, isLoading: isLoadingProfesional } = useProfesionalxId(profesionalId || 0);
  const { consultorios, isLoading: isLoadingConsultorios } = useProfessionalConsultorios(profesionalId || 0);

  // EFECTO PARA MANEJAR LA SELECCIÓN AUTOMÁTICA (POR STATE O POR UNICO CONSULTORIO)
  useEffect(() => {
    if (!isLoadingConsultorios && Array.isArray(consultorios) && consultorios.length > 0) {
      // Caso 1: Viene de un Centro Médico (initialId existe)
      if (initialConsultorioId) {
        setConsultorioSelec(initialConsultorioId);
        setPaso(1);
      } 
      // Caso 2: Hay un solo consultorio disponible para este profesional
      else if (consultorios.length === 1) {
        setConsultorioSelec(consultorios[0].id);
        setPaso(1); // Saltamos al calendario automáticamente
      }
      // Caso 3: No hay initialId y hay varios, seleccionamos el primero pero nos quedamos en paso 0
      else {
        setConsultorioSelec(consultorios[0].id);
      }
    }
  }, [consultorios, isLoadingConsultorios, initialConsultorioId]);

  const { turnos, isLoading: isLoadingTurnos } = useProfessionalConsultorioTurnos(profesionalId || 0, consultorioSelec || 0);

  const medico = useMemo(() => {
    return profesional && Array.isArray(profesional) && profesional.length > 0 ? profesional[0] : null;
  }, [profesional]);

  const sedeInfo = useMemo(() => {
    return consultorios?.find((c) => c.id === consultorioSelec);
  }, [consultorios, consultorioSelec]);

  const todayDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const fechasUnicas = useMemo(() => {
    if (!turnos || !Array.isArray(turnos)) return [];
    return [...new Set(turnos.filter((t) => t.estado === "disponible").map((t) => t.fecha))]
      .filter((fecha) => fecha >= todayDate)
      .sort();
  }, [turnos, todayDate]);

  const turnosFiltrados = useMemo(() => {
    return fechaSeleccionada ? turnos?.filter((t) => t.fecha === fechaSeleccionada) || [] : [];
  }, [turnos, fechaSeleccionada]);

  const titulo = useMemo(() => {
    if (!medico) return "";
    const map = { doctor: "Dr.", doctora: "Dra.", licenciado: "Lic.", licenciada: "Lcda." };
    return map[medico?.titulo] || "";
  }, [medico]);

  const formatearSoloDia = (fecha) => new Date(fecha).getDate().toString().padStart(2, "0");
  const obtenerDiaDeLaSemanaCorto = (fecha) => new Date(fecha).toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");

  const handleSelectTurno = (turno, index) => {
    navigate(`/formulario-usuario/${consultorioSelec}/${profesionalId}`);
    enviarTurnoYOrden(turno, index + 1);
    onClose?.();
  };

  const irAtras = () => {
    if (paso === 2) {
      setPaso(1);
    } 
    // Si hay un solo consultorio, "Atrás" siempre saca al usuario del modal
    else if (paso === 1 && (initialConsultorioId || consultorios?.length === 1)) {
      navigate("/buscarprofesionales");
    } else if (paso > 0) {
      setPaso(paso - 1);
    } else {
      navigate("/buscarprofesionales");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col h-screen w-full overflow-hidden animate-fade-in">
      <header className="bg-slate-900 text-white p-4 md:p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={irAtras} className="p-2 md:p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-xl md:text-2xl" />
          </button>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden md:flex bg-indigo-600/20 p-3 rounded-2xl">
              <FaUserMd className="text-3xl text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-3xl font-black capitalize leading-tight">
                {isLoadingProfesional ? (
                  <span className="opacity-50 italic font-medium">Cargando profesional...</span>
                ) : (
                  `${titulo} ${medico?.nombre || ""} ${medico?.apellido || ""}`
                )}
              </h2>
              <p className="text-slate-400 text-xs md:text-base font-bold uppercase tracking-wider">
                {isLoadingProfesional ? "---" : medico?.especialidad || "Especialidad"}
              </p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/buscarprofesionales")} className="text-slate-400 hover:text-white text-3xl md:text-4xl font-light p-2">
          <FaTimes />
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        <div className="lg:hidden flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex justify-center gap-3 mb-2">
            {[0, 1, 2].map((n) => (
              <div key={n} className={`h-1.5 rounded-full transition-all duration-300 ${paso === n ? "bg-indigo-600 w-10" : "bg-slate-200 w-4"}`}></div>
            ))}
          </div>

          {paso > 0 && sedeInfo && (
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4 animate-fade-in">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
                <FaHospital />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">consultorio</p>
                <p className="text-slate-700 font-bold text-sm leading-tight">{sedeInfo.direccion}</p>
                <p className="text-slate-700 font-bold text-sm leading-tight">{sedeInfo.localidad}</p>
              </div>
              {/* Solo mostramos botón cambiar si hay más de uno y no vino con ID fijo */}
              {!initialConsultorioId && consultorios?.length > 1 && (
                <button onClick={() => setPaso(0)} className="text-[10px] font-black text-indigo-600 underline uppercase">Cambiar</button>
              )}
            </div>
          )}

          {paso === 0 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight border-b border-slate-100 pb-2">1. Selecciona la consultorio</h3>
              {isLoadingConsultorios ? (
                <BiLoaderCircle className="animate-spin text-indigo-600 text-4xl mx-auto mt-10" />
              ) : (
                <div className="space-y-3">
                  {consultorios?.map((cons) => (
                    <div
                      key={cons.id}
                      onClick={() => {
                        setConsultorioSelec(cons.id);
                        setPaso(1);
                      }}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        cons.id === consultorioSelec ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${cons.id === consultorioSelec ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"}`}>
                        <FaHospital className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-bold text-sm leading-tight">{cons.direccion}</p>
                        <p className="text-indigo-600 uppercase font-black text-[10px] mt-1 tracking-widest">{cons.localidad}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {paso === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">2. Elige el Día</h3>
                {!initialConsultorioId && consultorios?.length > 1 && (
                  <button onClick={() => setPaso(0)} className="text-indigo-600 text-xs font-bold underline uppercase">Cambiar consultorio</button>
                )}
              </div>
              {isLoadingTurnos ? (
                <BiLoaderCircle className="animate-spin text-indigo-600 text-4xl mx-auto mt-10" />
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {fechasUnicas.length > 0 ? (
                    fechasUnicas.map((fecha, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFechaSeleccionada(fecha);
                          setPaso(2);
                        }}
                        className={`p-3 rounded-xl font-black border-2 transition-all ${
                          fecha === fechaSeleccionada ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="text-[9px] uppercase block mb-1 opacity-70">{obtenerDiaDeLaSemanaCorto(fecha)}</span>
                        <span className="text-lg">{formatearSoloDia(fecha)}</span>
                      </button>
                    ))
                  ) : (
                    <p className="col-span-4 text-center py-10 text-slate-400 font-medium italic">No hay días disponibles.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">3. Horarios Disponibles</h3>
                <button onClick={() => setPaso(1)} className="text-indigo-600 text-xs font-bold underline uppercase">Cambiar Fecha</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {turnosFiltrados.map((turno, index) => (
                  <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="hidden lg:block lg:w-1/3 xl:w-1/4 bg-white border-r border-slate-200 p-8 overflow-y-auto">
          <h3 className="text-slate-800 text-xl font-black mb-8 border-b pb-4 uppercase tracking-tighter">Sedes de Atención</h3>
          <div className="space-y-4">
            {isLoadingConsultorios ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              consultorios?.map((cons) => (
                <div
                  key={cons.id}
                  onClick={() => (!initialConsultorioId && consultorios.length > 1) && setConsultorioSelec(cons.id)}
                  className={`flex items-center gap-4 p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                    cons.id === consultorioSelec ? "border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]" : "border-slate-100 bg-white hover:border-slate-200"
                  } ${(initialConsultorioId && cons.id !== initialConsultorioId) || consultorios.length === 1 ? "opacity-40 grayscale pointer-events-none" : ""}`}
                >
                  <div className={`p-4 rounded-xl ${cons.id === consultorioSelec ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"}`}>
                    <FaHospital className="text-2xl" />
                  </div>
                  <div>
                    <p className={`font-bold text-sm md:text-base leading-tight ${cons.id === consultorioSelec ? "text-indigo-900" : "text-slate-700"}`}>
                      {cons.direccion}
                    </p>
                    <p className="text-indigo-700 uppercase font-black text-xs mt-1 tracking-widest">{cons.localidad}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="hidden lg:block flex-1 overflow-y-auto p-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-12">
            <label className="text-slate-800 text-xl font-black mb-8 flex items-center gap-3 border-b border-slate-50 pb-4">
              <FaCalendarAlt className="text-indigo-600" /> Seleccionar Fecha
            </label>
            {isLoadingTurnos ? (
              <BiLoaderCircle className="animate-spin text-indigo-600 text-4xl mx-auto" />
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                {fechasUnicas.map((fecha, index) => (
                  <button
                    key={index}
                    onClick={() => setFechaSeleccionada(fecha)}
                    className={`flex-shrink-0 px-8 py-7 rounded-[2.2rem] font-bold transition-all border-2 flex flex-col items-center min-w-[100px] ${
                      fecha === fechaSeleccionada ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-70">{obtenerDiaDeLaSemanaCorto(fecha)}</span>
                    <span className="text-3xl font-black">{formatearSoloDia(fecha)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {fechaSeleccionada && (
            <div className="grid lg:grid-cols-6 xl:grid-cols-8 gap-5 animate-slide-up">
              {turnosFiltrados.map((turno, index) => (
                <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TurnSelectModal;