// src/components/GenerarTurnosModal.jsx
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaCheckCircle,
  FaTrashAlt,
  FaHourglassHalf,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import useObtenerCnsultorioxId from "../../customHooks/useConsultorioxId";

const GenerarTurnosModal = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duracionTurno, setDuracionTurno] = useState(30);
  const [generando, setGenerando] = useState(false);

  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();

  const consultorioIdParsed = parseInt(consultorioId, 10);
  const profesionalIdParsed = parseInt(profesionalId, 10);

  const { consultorio } = useObtenerCnsultorioxId(consultorioIdParsed);
  const consultorioObtenido = consultorio?.[0] || {};
  const { tipo } = consultorioObtenido;

  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= LÓGICA (Se mantiene intacta) ================= */
  const calculatedTurns = useMemo(() => {
    if (!startTime || !endTime || duracionTurno <= 0) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) return 0;
    const diffMins = (end - start) / (1000 * 60);
    return Math.floor(diffMins / duracionTurno);
  }, [startTime, endTime, duracionTurno]);

  const totalTurns = calculatedTurns * selectedDates.length;

  const handleAddDate = (e) => {
    const value = e.target.value;
    if (value && !selectedDates.includes(value)) {
      setSelectedDates((prev) => [...prev, value]);
    }
    e.target.value = "";
  };

  const handleEnableTurns = async () => {
    if (selectedDates.length === 0) return toast.warn("⚠️ Selecciona al menos un día.");
    if (!startTime) return toast.warn("⏰ Selecciona una hora de inicio.");
    if (!endTime) return toast.warn("🕗 Selecciona una hora de finalización.");
    if (calculatedTurns <= 0) return toast.warn("❌ El horario no permite generar turnos.");

    setGenerando(true);
    try {
      const response = await fetch(`${API_URL}/api/habilitarturnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultorioId: consultorioIdParsed,
          profesionalId: profesionalIdParsed,
          fechas: selectedDates,
          horaInicio: startTime,
          duracion: duracionTurno,
          cantidadTurnosPorDia: calculatedTurns
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al generar turnos");
      }

      toast.success("✅ Turnos generados con éxito");
      setTimeout(() => {
        tipo === "centro médico"
          ? navigate(`/micuenta/panelturnos-centromedico/${consultorioId}/${profesionalId}`)
          : navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`);
      }, 1600);
    } catch (err) {
      toast.error(`❌ ${err.message || "Error al procesar"}`);
    } finally {
      setGenerando(false);
    }
  };

  /* ================= INTERFAZ ACTUALIZADA ================= */
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[600] animate-fade-in">
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-white border-b border-slate-100 p-8 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-100">
                <FaCalendarAlt size={18} />
              </div>
              Habilitar Agenda
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Configuración de turnos masivos</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* SELECCIÓN DE FECHAS */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500" /> Seleccionar Días
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={handleAddDate}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
            />
            
            {selectedDates.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 animate-fadeIn">
                {selectedDates.map((d) => (
                  <span
                    key={d}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-slate-700 shadow-sm"
                  >
                    {format(parseISO(d), "dd/MM", { locale: es })}
                    <button
                      onClick={() => setSelectedDates((prev) => prev.filter((x) => x !== d))}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <FaTrashAlt size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HORA INICIO */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaClock className="text-emerald-500" /> Hora Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            {/* HORA FIN */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaClock className="text-rose-500" /> Hora Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-50 focus:border-rose-500 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          {/* DURACIÓN */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaHourglassHalf className="text-indigo-500" /> Duración por turno (minutos)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={duracionTurno}
              onChange={(e) => setDuracionTurno(Math.max(5, +e.target.value))}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
            />
          </div>

          {/* RESUMEN DE GENERACIÓN */}
          {calculatedTurns > 0 && (
            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <FaCheckCircle size={24} />
                </div>
                <div>
                  <p className="text-lg font-black">{calculatedTurns} turnos <span className="text-indigo-300 font-medium">por día</span></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Carga total: {totalTurns} espacios de atención
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnableTurns}
            disabled={generando || calculatedTurns <= 0 || selectedDates.length === 0}
            className={`flex-[2] py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
              generando || calculatedTurns <= 0 || selectedDates.length === 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
            }`}
          >
            {generando ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </div>
            ) : (
              `Habilitar Turnos`
            )}
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default GenerarTurnosModal;