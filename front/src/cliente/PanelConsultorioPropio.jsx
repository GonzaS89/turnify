// src/components/PanelConsultorioPropio.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import AsociarProfesionalAPerfil from "./AsociarProfesionalAPerfil";
import CrearConsultorioModal from "../cliente/CrearConsultorioModal";

// Iconos
import {
  FaCalendarAlt, FaStethoscope, FaChevronRight,
  FaClock, FaCheckCircle, FaPlus, FaCircleNotch,
  FaWhatsapp, FaChevronLeft, FaLink, FaTimes
} from "react-icons/fa";
import { FaHouseMedical } from "react-icons/fa6";

// Hooks
import useObtenerProfesionalxIdPerfil from "../../customHooks/useObtenerProfesionalxIdPerfil";
import useObtenerConsultorioxIdPerfil from "../../customHooks/useObtenerConsultorioxIdPerfil";
import useProfessionalConsultorioTurnos from "../../customHooks/useProfessionalConsultorioTurnos";

const PanelConsultorioPropio = ({ perfilData: perfil, enviarMedicoID }) => {
  const navigate = useNavigate();
  const [showModalCrearConsultorio, setShowModalCrearConsultorio] = useState(false);
  const [showModalUnirse, setShowModalUnirse] = useState(false);
  const [showAsociarModal, setShowAsociarModal] = useState(false);
  const [fechaVisualizada, setFechaVisualizada] = useState(new Date());

  const perfilID = perfil?.id;
  const perfilTipo = perfil.tipo;

  const { consultorios: consultoriosObtenidos, fetchConsultorio } = useObtenerConsultorioxIdPerfil(perfilID);
  const { profesional: profesionalesObtenidos, isLoading: isLoadingProfesionales, error: errorProfesionales, fetchProfesional } = useObtenerProfesionalxIdPerfil(perfilID);

  console.log(consultoriosObtenidos)

  const medico = profesionalesObtenidos?.[0] || null;
  const medicoID = medico?.id;

  // Lógica para abrir modal de asociación si no hay médico
  useEffect(() => {
    if (!isLoadingProfesionales && (!profesionalesObtenidos || profesionalesObtenidos.length === 0)) {
      setShowAsociarModal(true);
    }
  }, [isLoadingProfesionales, profesionalesObtenidos]);

  const storedSelection = typeof window !== "undefined" ? localStorage.getItem("consultorioSeleccionadoId") : null;
  const [ConsultorioSelecID, setConsultorioSelecID] = useState(storedSelection);

  useEffect(() => {
    if (consultoriosObtenidos?.length > 0) {
      if (!ConsultorioSelecID) {
        const primerId = consultoriosObtenidos[0].id;
        setConsultorioSelecID(primerId);
        localStorage.setItem("consultorioSeleccionadoId", primerId);
      }
    } else {
      setConsultorioSelecID(null);
      localStorage.removeItem("consultorioSeleccionadoId");
    }
  }, [consultoriosObtenidos, ConsultorioSelecID]);

  const { turnos, isLoading: isLoadingTurnos } = useProfessionalConsultorioTurnos(medicoID, ConsultorioSelecID);

  useEffect(() => {
    if (medicoID) enviarMedicoID(medicoID);
  }, [medicoID, enviarMedicoID]);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const fechaVisualizadaStr = fechaVisualizada.toLocaleDateString('en-CA');
  const turnosFiltrados = turnos?.filter(t => new Date(t.fecha).toLocaleDateString('en-CA') === fechaVisualizadaStr && t.estado === "reservado").sort((a, b) => a.hora.localeCompare(b.hora)) || [];
  const countByEstado = (estado) => turnos?.filter(t => new Date(t.fecha).toLocaleDateString('en-CA') === todayStr && t.estado === estado).length || 0;
  const fechaDisplay = fechaVisualizada.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fechaVisualizada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaVisualizada(nuevaFecha);
  };

  if (isLoadingProfesionales) return <LoadingCard />;
  if (errorProfesionales || !perfil) return <ErrorCard title="Error" message={errorProfesionales?.message || "Error al cargar la interfaz."} />;

  const noHayConsultorios = !consultoriosObtenidos || consultoriosObtenidos.length === 0;

  return (
    <div className="min-h-screen py-4 sm:py-12 px-2 sm:px-6 bg-slate-50">
      
      {showAsociarModal && (
        <AsociarProfesionalAPerfil 
          perfilID={perfilID} 
          onClose={() => setShowAsociarModal(false)}
          refrescarListaProfesionales={fetchProfesional} // <- Corrección aquí
          onSuccess={() => { setShowAsociarModal(false); fetchProfesional(); }}
        />
      )}

      {showModalUnirse && (
        <UnirseAConsultorioModal 
          isOpen={showModalUnirse} 
          onClose={() => setShowModalUnirse(false)} 
          perfilID={perfilID} 
          onSuccess={fetchConsultorio} 
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
        <header className="bg-slate-900 text-white rounded-[1.5rem] sm:rounded-[3.5rem] shadow-2xl p-6 sm:p-14 relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-5xl font-black italic mb-6 sm:mb-10 uppercase">
                Panel de <span className="text-indigo-500 not-italic">Gestión</span>
              </h1>
              {medico && (
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl sm:text-3xl shadow-2xl shrink-0">
                    {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-3xl font-black mb-1">Dr. {medico.nombre} {medico.apellido}</h2>
                    <span className="text-[10px] uppercase font-black text-slate-400"><FaStethoscope className="inline mr-1 text-indigo-400" /> {medico.especialidad}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-[350px] bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3 ml-1">Tus Sedes</h3>
              <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {consultoriosObtenidos?.map((c) => (
                  <button key={c.id} onClick={() => { setConsultorioSelecID(c.id); localStorage.setItem("consultorioSeleccionadoId", c.id); }}
                    className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 border ${ConsultorioSelecID === c.id ? "bg-white border-indigo-500 text-slate-900" : "bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800"}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-500"><FaHouseMedical size={12} /></div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-black text-[10px] uppercase truncate">{c.nombre}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={() => setShowModalCrearConsultorio(true)} className="py-2 border border-dashed border-slate-600 text-[8px] font-black rounded-lg text-slate-500 uppercase hover:text-indigo-400">
                  <FaPlus className="inline mr-1" /> Nueva Sede
                </button>
                <button onClick={() => setShowModalUnirse(true)} className="py-2 border border-dashed border-slate-600 text-[8px] font-black rounded-lg text-slate-500 uppercase hover:text-indigo-400">
                  <FaLink className="inline mr-1" /> Unirse
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ... (Aquí iría el resto de tu grid de estadísticas y agenda, omitido por brevedad para este bloque) ... */}
      </div>

      <CrearConsultorioModal isOpen={showModalCrearConsultorio} onClose={() => setShowModalCrearConsultorio(false)} perfilID={perfilID} profesionalID={medicoID} perfilTipo={perfilTipo} onSuccess={fetchConsultorio} />
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

// --- COMPONENTE MODAL INTERNO ---
const UnirseAConsultorioModal = ({ isOpen, onClose, perfilID, onSuccess }) => {
    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUnirse = async () => {
        if (!codigo) return;
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/unirse-consultorio`, { perfilID, codigoConsultorio: codigo });
            toast.success("Solicitud enviada");
            onSuccess();
            onClose();
        } catch (e) { toast.error("Error al unir"); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm">
                <div className="flex justify-between mb-6"><h3 className="font-black text-lg">Unirse a Consultorio</h3><button onClick={onClose}><FaTimes/></button></div>
                <input className="w-full p-4 bg-slate-100 rounded-xl mb-4 font-bold" placeholder="Código" onChange={(e) => setCodigo(e.target.value)} />
                <button onClick={handleUnirse} disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">{loading ? "Procesando..." : "Confirmar"}</button>
            </div>
        </div>
    );
};

const LoadingCard = () => <div className="min-h-screen flex items-center justify-center text-indigo-600"><FaCircleNotch className="animate-spin" size={40} /></div>;
const ErrorCard = ({ title, message }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-3xl border border-red-100 shadow-xl">
            <h2 className="font-black text-red-500 uppercase">{title}</h2>
            <p className="text-xs text-slate-500 mt-2">{message}</p>
        </div>
    </div>
);

export default PanelConsultorioPropio;