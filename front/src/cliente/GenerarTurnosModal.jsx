import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { FaCalendarAlt, FaClock, FaTimes, FaCheckCircle, FaTrash, FaArrowLeft, FaPlus, FaCalendarPlus, FaLayerGroup, FaHistory, FaMousePointer } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { format, parseISO, addDays, isBefore, isSameDay } from 'date-fns';
import useObtenerCnsultorioxId from '../../customHooks/useConsultorioxId';

const GenerarTurnosModal = () => {
  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();
  
  // ESTADOS DE DATOS
  const [selectedDates, setSelectedDates] = useState([]); 
  const [bloquesHorarios, setBloquesHorarios] = useState([]);
  const [generando, setGenerando] = useState(false);

  // ESTADOS TEMPORALES (INPUTS)
  const [startDateRange, setStartDateRange] = useState('');
  const [endDateRange, setEndDateRange] = useState('');
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');
  const [duracionTurno, setDuracionTurno] = useState(30);

  const consultorioIdParsed = parseInt(consultorioId, 10);
  const profesionalIdParsed = parseInt(profesionalId, 10);
  const { consultorio } = useObtenerCnsultorioxId(consultorioIdParsed);
  const tipo = consultorio[0]?.tipo || null;
  const API_URL = import.meta.env.VITE_API_URL;

  const localToday = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  // --- LÓGICA DE FECHAS ---
  const handleIndividualDate = (e) => {
    const date = e.target.value;
    if (!date) return;
    if (selectedDates.includes(date)) return toast.info("Fecha ya agregada.");
    setSelectedDates([...selectedDates, date].sort());
    e.target.value = "";
  };

  const addDateRange = () => {
    if (!startDateRange || !endDateRange) return toast.warn("Completa el rango.");
    const start = parseISO(startDateRange);
    const end = parseISO(endDateRange);
    if (isBefore(end, start)) return toast.error("Fecha fin inválida.");

    const newDates = [];
    let current = start;
    while (isBefore(current, end) || isSameDay(current, end)) {
      newDates.push(format(current, 'yyyy-MM-dd'));
      current = addDays(current, 1);
    }
    setSelectedDates(Array.from(new Set([...selectedDates, ...newDates])).sort());
    setStartDateRange(''); setEndDateRange('');
  };

  const removeDate = (date) => setSelectedDates(selectedDates.filter(d => d !== date));

  // --- LÓGICA DE HORARIOS ---
  const agregarBloqueHorario = () => {
    if (!tempStartTime || !tempEndTime) return toast.warn("Faltan horas.");
    const start = new Date(`2000-01-01T${tempStartTime}`);
    const end = new Date(`2000-01-01T${tempEndTime}`);
    if (end <= start) return toast.error("Hora fin debe ser posterior.");
    
    const diffMins = (end - start) / (1000 * 60);
    const cantidad = Math.floor(diffMins / duracionTurno);
    if (cantidad <= 0) return toast.error("Rango muy corto para la duración.");

    setBloquesHorarios([...bloquesHorarios, {
      id: Date.now(), inicio: tempStartTime, fin: tempEndTime, duracion: duracionTurno, cantidad
    }]);
    setTempStartTime(''); setTempEndTime('');
  };

  const totalTurnosPorDia = bloquesHorarios.reduce((acc, b) => acc + b.cantidad, 0);
  const totalTurnosGlobal = totalTurnosPorDia * selectedDates.length;

  const handleEnableTurns = async () => {
    if (selectedDates.length === 0 || bloquesHorarios.length === 0) return toast.warn("Faltan datos.");
    setGenerando(true);
    try {
      const promesas = bloquesHorarios.map(bloque => 
        fetch(`${API_URL}/api/habilitarturnos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            consultorioId: consultorioIdParsed,
            profesionalId: profesionalIdParsed,
            fechas: selectedDates,
            horaInicio: bloque.inicio,
            duracion: bloque.duracion,
            cantidadTurnosPorDia: bloque.cantidad
          }),
        })
      );
      await Promise.all(promesas);
      toast.success("¡Agenda habilitada con éxito!");
      setTimeout(() => navigate(tipo === 'centro médico' ? `/micuenta/panelturnos-centromedico/${consultorioId}/${profesionalId}` : `/micuenta/panelturnos/${consultorioId}/${profesionalId}`), 1500);
    } catch (err) { toast.error(err.message); setGenerando(false); }
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in font-sans">
      <ToastContainer autoClose={2000} />
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all"><FaArrowLeft className="text-2xl" /></button>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Habilitar Agenda</h2>
        </div>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-4xl p-2"><FaTimes /></button>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-6 flex flex-col items-center custom-scrollbar">
        <div className="w-full max-w-5xl space-y-8 pb-24">
          
          {/* SECCIÓN 1: DÍAS */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
              <FaCalendarPlus className="text-indigo-600" /> 1. Días de atención
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><FaMousePointer /> Individual</p>
                <input type="date" min={localToday} onChange={handleIndividualDate} className="w-full p-4 rounded-xl border-2 border-white focus:border-indigo-500 outline-none font-bold" />
              </div>
              {/* Rango */}
              <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-3">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><FaLayerGroup /> Por Rango</p>
                <div className="flex gap-2">
                  <input type="date" value={startDateRange} min={localToday} onChange={(e) => setStartDateRange(e.target.value)} className="w-1/2 p-4 rounded-xl border-2 border-white outline-none font-bold text-xs" />
                  <input type="date" value={endDateRange} min={startDateRange || localToday} onChange={(e) => setEndDateRange(e.target.value)} className="w-1/2 p-4 rounded-xl border-2 border-white outline-none font-bold text-xs" />
                </div>
                <button onClick={addDateRange} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase hover:bg-indigo-700 transition-all">Agregar Rango</button>
              </div>
            </div>

            {/* Listado de fechas */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 min-h-[60px]">
              {selectedDates.length === 0 ? <p className="text-slate-300 italic text-sm w-full text-center">No hay fechas seleccionadas</p> : 
                selectedDates.map(date => (
                  <div key={date} className="bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-black border border-indigo-100 shadow-sm flex items-center gap-2 animate-slide-up">
                    {format(parseISO(date), "dd/MM")}
                    <button onClick={() => removeDate(date)} className="text-red-400"><FaTrash size={10} /></button>
                  </div>
                ))}
            </div>
          </div>

          {/* SECCIÓN 2: HORARIOS */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
              <FaClock className="text-indigo-600" /> 2. Horarios de atención
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Inicio</label>
                <input type="time" value={tempStartTime} onChange={(e) => setTempStartTime(e.target.value)} className="w-full p-4 rounded-xl border-2 border-white outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fin</label>
                <input type="time" value={tempEndTime} onChange={(e) => setTempEndTime(e.target.value)} className="w-full p-4 rounded-xl border-2 border-white outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Duración (min)</label>
                <input type="number" value={duracionTurno} onChange={(e) => setDuracionTurno(parseInt(e.target.value))} className="w-full p-4 rounded-xl border-2 border-white outline-none font-bold text-indigo-600" />
              </div>
              <button onClick={agregarBloqueHorario} className="h-[56px] mt-auto bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg">
                <FaPlus /> Agregar Bloque
              </button>
            </div>

            {/* Listado de bloques */}
            <div className="space-y-3">
              {bloquesHorarios.length === 0 ? <p className="text-slate-300 italic text-sm text-center py-4">Agrega bloques horarios (ej: Mañana 08-12, Tarde 16-20)</p> :
                bloquesHorarios.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-indigo-50/30 border-2 border-indigo-100/50 rounded-2xl animate-slide-up">
                    <div className="flex items-center gap-4 text-indigo-700">
                      <FaHistory size={20} />
                      <div>
                        <p className="font-black text-sm uppercase leading-none">{b.inicio}hs a {b.fin}hs</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{b.duracion} min/turno • {b.cantidad} turnos</p>
                      </div>
                    </div>
                    <button onClick={() => setBloquesHorarios(bloquesHorarios.filter(x => x.id !== b.id))} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><FaTrash /></button>
                  </div>
                ))}
            </div>
          </div>

          {/* RESUMEN Y ACCIÓN */}
          <div className="space-y-6">
            {totalTurnosGlobal > 0 && (
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl animate-fade-in border-b-4 border-indigo-500">
                <div className="flex items-center gap-5">
                  <div className="bg-green-500 p-4 rounded-2xl shadow-lg"><FaCheckCircle className="text-3xl" /></div>
                  <div>
                    <p className="text-indigo-300 font-black uppercase text-[10px] tracking-widest">Resumen de generación</p>
                    <h4 className="text-2xl font-black tracking-tighter">
                      {totalTurnosPorDia} turnos/día • {selectedDates.length} días • {totalTurnosGlobal} turnos totales
                    </h4>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-5">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-6 bg-white border-2 border-slate-200 text-slate-500 rounded-3xl font-black tracking-widest uppercase hover:bg-slate-50 transition-all">Cancelar</button>
              <button type="button" onClick={handleEnableTurns} disabled={generando || totalTurnosGlobal <= 0} className={`flex-[2] py-6 rounded-3xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3 ${generando || totalTurnosGlobal <= 0 ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}>
                {generando ? "PROCESANDO..." : `HABILITAR ${totalTurnosGlobal} TURNOS`}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default GenerarTurnosModal;