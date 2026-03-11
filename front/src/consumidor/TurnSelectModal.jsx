import { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";
import useProfessionalConsultorios from "../../customHooks/useProfessionalConsultorios";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import Turno from "./Turno";
import { useParams, useNavigate } from "react-router-dom";
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
  const { profesionalSlug } = useParams();
  
  const [paso, setPaso] = useState(0);
  const [profesionalId, setProfesionalId] = useState(null);

  useEffect(() => {
    const fetchProfesionalId = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profesionales/${profesionalSlug}`);
        const prof = Array.isArray(res.data) ? res.data[0] : res.data;
        if (prof?.id) setProfesionalId(prof.id);
      } catch (err) { console.error(err); }
    };
    fetchProfesionalId();
  }, [profesionalSlug]);



  const { profesional, isLoading: isLoadingProfesional } = useProfesionalxId(profesionalId || 0);
  const { consultorios, isLoading: isLoadingConsultorios } = useProfessionalConsultorios(profesionalId || 0);
  const [consultorioSelec, setConsultorioSelec] = useState(null);

  console.log(consultorios)

  

  useEffect(() => {
    if (!isLoadingConsultorios && Array.isArray(consultorios) && consultorios.length > 0) {
      setConsultorioSelec(consultorios[0].id);
    }
  }, [consultorios, isLoadingConsultorios]);

  const { turnos, isLoading: isLoadingTurnos } = useProfessionalConsultorioTurnos(profesionalId || 0, consultorioSelec || 0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const medico = useMemo(() => {
    return profesional && Array.isArray(profesional) && profesional.length > 0 ? profesional[0] : null;
  }, [profesional]);

  const todayDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const fechasUnicas = useMemo(() => {
    if (!turnos || !Array.isArray(turnos)) return [];
    return [...new Set(turnos.filter(t => t.estado === "disponible").map(t => t.fecha))]
      .filter(fecha => fecha >= todayDate)
      .sort();
  }, [turnos, todayDate]);

  const turnosFiltrados = useMemo(() => {
    return fechaSeleccionada ? (turnos?.filter(t => t.fecha === fechaSeleccionada) || []) : [];
  }, [turnos, fechaSeleccionada]);

  const titulo = useMemo(() => {
    const map = { doctor: "Dr.", doctora: "Dra.", licenciado: "Lic.", licenciada: "Lcda." };
    return map[medico?.titulo] || "";
  }, [medico?.titulo]);

  const formatearSoloDia = fecha => new Date(fecha).getDate().toString().padStart(2, "0");
  const obtenerDiaDeLaSemanaCorto = fecha => new Date(fecha).toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");

  const handleSelectTurno = (turno, index) => {
    navigate(`/formulario-usuario/${consultorioSelec}/${profesionalId}`);
    enviarTurnoYOrden(turno, index + 1);
    onClose?.();
  };

  const irAtras = () => {
    if (paso > 0) setPaso(paso - 1);
    else navigate("/buscarprofesionales");
  };

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col h-screen w-full overflow-hidden animate-fade-in">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={irAtras} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <FaUserMd className="text-4xl text-indigo-400 hidden md:block" />
            <div>
              <h2 className="text-2xl md:text-3xl font-black capitalize">
                {isLoadingProfesional ? "Cargando..." : `${titulo} ${medico?.nombre} ${medico?.apellido}`}
              </h2>
              <p className="text-slate-400 text-sm md:text-base">{medico?.especialidad}</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/buscarprofesionales")} className="text-slate-400 hover:text-white text-4xl font-light">
          <FaTimes />
        </button>
      </header>

      {/* CONTENEDOR RESPONSIVO */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50">
        
        {/* --- VISTA MÓVIL (WIZARD) --- */}
        <div className="lg:hidden flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex justify-center gap-2">
                {[0, 1, 2].map(n => <div key={n} className={`h-2 rounded-full ${paso >= n ? 'bg-indigo-600 w-8' : 'bg-slate-200 w-2'}`}></div>)}
            </div>

            {paso === 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-xl">1. Sede de Atención</h3>
                    {consultorios?.map((cons) => (
                        <div key={cons.id} onClick={() => { setConsultorioSelec(cons.id); setPaso(1); }} className={`flex items-center gap-4 p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${cons.id === consultorioSelec ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-100 bg-white"}`}>
                            <FaHospital className={`text-2xl ${cons.id === consultorioSelec ? "text-indigo-600" : "text-slate-400"}`} />
                            <div>
                                {/* <p className="font-bold">{cons.nombre || "Sede"}</p> */}
                                <p className="text-slate-600 text-sm">{cons.direccion}</p>
                                <p className="text-indigo-800 uppercase font-bold text-sm">{cons.localidad}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {paso === 1 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-xl">2. Selecciona Fecha</h3>
                    {isLoadingTurnos ? <BiLoaderCircle className="animate-spin text-indigo-600 text-4xl mx-auto" /> : (
                        <div className="grid grid-cols-4 gap-2">
                            {fechasUnicas.map((fecha, index) => (
                                <button key={index} onClick={() => { setFechaSeleccionada(fecha); setPaso(2); }} className={`p-4 rounded-2xl font-black border-2 ${fecha === fechaSeleccionada ? 'bg-indigo-600 text-white' : 'bg-white border-slate-100'}`}>
                                    <span className="text-[9px] uppercase block">{obtenerDiaDeLaSemanaCorto(fecha)}</span>
                                    {formatearSoloDia(fecha)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {paso === 2 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-xl">3. Horarios</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {turnosFiltrados.map((turno, index) => (
                            <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* --- VISTA ESCRITORIO --- */}
        <aside className="hidden lg:block lg:w-1/3 xl:w-1/4 bg-white border-r border-slate-200 p-8 overflow-y-auto">
          <h3 className="text-slate-800 text-xl font-black mb-8">Sedes de Atención</h3>
          <div className="space-y-4">
            {consultorios?.map((cons) => (
              <div key={cons.id} onClick={() => setConsultorioSelec(cons.id)} className={`flex items-center gap-4 p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${cons.id === consultorioSelec ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-100 bg-white"}`}>
                <FaHospital className={`text-2xl ${cons.id === consultorioSelec ? "text-indigo-600" : "text-slate-400"}`} />
                <div>
                  {/* <p className={`font-bold text-lg ${cons.id === consultorioSelec ? 'text-indigo-900' : 'text-slate-700'}`}>{cons.nombre || "Sede"}</p> */}
                  <p className="text-slate-400 text-sm">{cons.direccion}</p>
                  <p className="text-indigo-700 uppercase font-bold text-sm">{cons.localidad}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="hidden lg:block flex-1 overflow-y-auto p-12">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-12">
            <label className="text-slate-800 text-xl font-black mb-8 flex items-center gap-3">
              <FaCalendarAlt className="text-indigo-600" /> Seleccionar Fecha
            </label>
            {isLoadingTurnos ? <BiLoaderCircle className="animate-spin text-indigo-600 text-4xl mx-auto" /> : (
              <div className="flex gap-3 overflow-x-auto pb-4 px-2">
                {fechasUnicas.map((fecha, index) => (
                  <button key={index} onClick={() => setFechaSeleccionada(fecha)} className={`flex-shrink-0 px-6 py-6 rounded-[2rem] font-bold transition-all border-2 flex flex-col items-center min-w-[90px] ${fecha === fechaSeleccionada ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border-slate-100'}`}>
                    <span className="text-[10px] uppercase tracking-widest">{obtenerDiaDeLaSemanaCorto(fecha)}</span>
                    <span className="text-2xl font-black">{formatearSoloDia(fecha)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {fechaSeleccionada && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {turnosFiltrados.map((turno, index) => <Turno key={turno.id} turno={turno} index={index} enviarTurno={handleSelectTurno} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TurnSelectModal;