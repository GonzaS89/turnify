import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { FaCalendarAlt, FaClock, FaStopwatch, FaTimes, FaCheckCircle, FaTrash, FaArrowLeft, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { format, parseISO } from 'date-fns';
import useObtenerCnsultorioxId from '../../customHooks/useConsultorioxId';

const GenerarTurnosModal = () => {
  const [selectedDates, setSelectedDates] = useState([]); 
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duracionTurno, setDuracionTurno] = useState(30);
  const [generando, setGenerando] = useState(false);

  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();

  const consultorioIdParsed = parseInt(consultorioId, 10);
  const profesionalIdParsed = parseInt(profesionalId, 10);

  const { consultorio } = useObtenerCnsultorioxId(consultorioIdParsed);
  const consultorioObtenido = consultorio[0] || null;
  const { tipo } = consultorioObtenido || {};

  const API_URL = import.meta.env.VITE_API_URL;

  // CORRECCIÓN: Obtener fecha de hoy en horario LOCAL (Argentina) para el atributo 'min'
  const localToday = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (!newDate) return;
    
    if (selectedDates.includes(newDate)) {
      toast.info("Esta fecha ya está seleccionada.");
    } else {
      setSelectedDates([...selectedDates, newDate].sort());
    }
    e.target.value = ""; 
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(d => d !== dateToRemove));
  };

  const calculatedTurnsPerDay = useMemo(() => {
    if (!startTime || !endTime || duracionTurno <= 0) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) return 0;
    const diffMins = (end - start) / (1000 * 60);
    return Math.floor(diffMins / duracionTurno);
  }, [startTime, endTime, duracionTurno]);

  const totalTurnosTotal = calculatedTurnsPerDay * selectedDates.length;

  const handleEnableTurns = async () => {
    if (selectedDates.length === 0) return toast.warn("Agrega al menos una fecha.");
    if (!startTime || !endTime) return toast.warn("Completa el rango horario.");
    if (duracionTurno < 5) return toast.error("La duración mínima es 5 minutos.");
    if (calculatedTurnsPerDay <= 0) return toast.warn("Parámetros inválidos.");

    setGenerando(true);
    try {
      const response = await fetch(`${API_URL}/api/habilitarturnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultorioId: consultorioIdParsed,
          profesionalId: profesionalIdParsed,
          fechas: selectedDates,
          horaInicio: startTime,
          duracion: duracionTurno,
          cantidadTurnosPorDia: calculatedTurnsPerDay
        }),
      });

      console.log(consultorioIdParsed)

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error');

      toast.success("Turnos habilitados con éxito");
      setTimeout(() => {
        tipo === 'centro médico' ?
          navigate(`/micuenta/panelturnos-centromedico/${consultorioId}/${profesionalId}`) :
          navigate(`/micuenta/panelturnos/${consultorioId}/${profesionalId}`);
      }, 1500);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setGenerando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in">
      <ToastContainer />
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <FaCalendarAlt className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Habilitar Turnos</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2">Configuración masiva de agenda</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-4xl font-light p-2">
          <FaTimes />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8 pb-20">
          
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
            
            {/* SECCIÓN 1: FECHAS */}
            <section className="space-y-6">
              <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
                <FaCalendarAlt className="text-indigo-600" /> 1. Días de atención
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1">Seleccionar Fecha</label>
                  <input
                    type="date"
                    onChange={handleDateChange}
                    min={localToday} // CORRECCIÓN: Usa la fecha local calculada arriba
                    className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-lg text-slate-700 cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-6">
                  {selectedDates.length === 0 ? (
                    <p className="text-slate-300 italic text-sm">No hay fechas seleccionadas aún.</p>
                  ) : (
                    selectedDates.map(date => (
                      <div key={date} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black border border-indigo-100 flex items-center gap-3 animate-slide-up">
                        {format(parseISO(date), "dd/MM/yy")}
                        <button onClick={() => removeDate(date)} className="text-red-400 hover:text-red-600 transition-colors">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: RANGO HORARIO */}
            <section className="space-y-6">
              <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
                <FaClock className="text-indigo-600" /> 2. Rango Horario y Duración
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1">Hora Inicio</label>
                  <input
                    type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-xl text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1">Hora Fin</label>
                  <input
                    type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} min={startTime}
                    className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-xl text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1">Minutos por Turno</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setDuracionTurno(prev => Math.max(5, prev - 5))} className="p-5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xl font-black text-slate-600 transition-all">−</button>
                    <input
                      type="number" value={duracionTurno} readOnly
                      className="w-full p-5 bg-transparent text-center font-black text-2xl text-indigo-600"
                    />
                    <button type="button" onClick={() => setDuracionTurno(prev => prev + 5)} className="p-5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xl font-black text-slate-600 transition-all">+</button>
                  </div>
                </div>
              </div>
            </section>

            {/* RESUMEN FINAL */}
            {totalTurnosTotal > 0 && (
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="bg-green-500 p-4 rounded-2xl">
                    <FaCheckCircle className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-indigo-300 font-black uppercase text-[10px] tracking-widest">Resumen de generación</p>
                    <h4 className="text-2xl font-black tracking-tighter">
                      {calculatedTurnsPerDay} turnos por día • {totalTurnosTotal} turnos totales
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <button
              type="button" onClick={() => navigate(-1)}
              className="flex-1 py-6 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-3xl font-black tracking-widest uppercase hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button" onClick={handleEnableTurns} disabled={generando || totalTurnosTotal <= 0}
              className={`flex-[2] py-6 px-8 rounded-3xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3
                ${generando || totalTurnosTotal <= 0 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
            >
              {generando ? "PROCESANDO..." : <><FaPlus /> HABILITAR {totalTurnosTotal} TURNOS</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerarTurnosModal;