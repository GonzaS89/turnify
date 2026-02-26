// src/pages/CancelarTurnoPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaTimes, FaRegClock, FaUser, FaIdCard, FaCalendarAlt, FaClock, FaStethoscope } from 'react-icons/fa';
import useObtenerTurnoxID from '../../customHooks/useObtenerTurnoxID';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import useProfesionalxId from '../../customHooks/useProfesionalxId';
import useConsultorioxId from '../../customHooks/useConsultorioxId';
import 'react-toastify/dist/ReactToastify.css';

export default function CancelarTurno() {
  const { turnoId } = useParams();
  const idParseada = parseInt(turnoId, 10);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reprogramando, setReprogramando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const { turno, loading: loadingTurno, error, mensaje: mensajeTurno } = useObtenerTurnoxID(idParseada);
  const turnoObtenido = turno ? turno[0] : null;

  const { profesional } = useProfesionalxId(turnoObtenido?.profesionalID);
  const { consultorio } = useConsultorioxId(turnoObtenido?.consultorioID);

  const consultorioObtenido = consultorio?.[0];
  const { direccion, localidad, telefono } = consultorioObtenido || {};
  const direccionCompleta = `${direccion || 'N/A'}, ${localidad || 'N/A'}`;

  const prof = profesional?.[0];
  const { slug, nombre, apellido, titulo } = prof || { slug: 'profesional' };

  const API_URL = import.meta.env.VITE_API_URL;

  const puedeCancelar = () => {
    if (!turnoObtenido?.fecha || !turnoObtenido?.hora || !turnoObtenido?.estado) return false;
    if (turnoObtenido.estado !== 'reservado') return false;

    const [hours, minutes] = turnoObtenido.hora.split(':').map(Number);
    const turnoDateTime = new Date(turnoObtenido.fecha);
    turnoDateTime.setHours(hours, minutes, 0, 0);

    const ahora = new Date();
    const diferenciaMs = turnoDateTime - ahora;
    const horasRestantes = diferenciaMs / (1000 * 60 * 60);

    return horasRestantes > 6;
  };

  const cancelacionPermitida = puedeCancelar();

  const handleCancelar = async () => {
    if (!turnoId || loading || loadingTurno || !cancelacionPermitida) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/cancelarturno/${idParseada}`);
      toast.success('✅ Turno cancelado');
      
      const definirTitulo = (val) => {
        const map = { doctor: 'Dr.', doctora: 'Dra.', licenciado: 'Lic.', licenciada: 'Lic.' };
        return map[val] || '';
      };

      const nombreProfesional = `${definirTitulo(titulo)} ${nombre} ${apellido}`.trim();
      const mensajeWhatsApp = `¡Hola ${nombreProfesional}!\n\nLamento informarte que debo CANCELAR mi turno:\n\nFecha: ${formatearFechaSQL(turnoObtenido?.fecha)}\nHora: ${formatearHora(turnoObtenido?.hora)}\n\nSaludos,\n*${turnoObtenido?.paciente}*`;

      let tel = telefono?.replace(/\D/g, "");
      if (tel.startsWith("9")) tel = "54" + tel;
      else if (tel.startsWith("11") && tel.length === 10) tel = "549" + tel;
      else if (!tel.startsWith("54")) tel = "549" + tel;

      window.open(`https://wa.me/${tel}?text=${encodeURIComponent(mensajeWhatsApp)}`, "_blank");
      navigate('/');
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al cancelar.' });
    } finally { setLoading(false); }
  };

  const handleReprogramar = async () => {
    if (!turnoId || loading || loadingTurno || !cancelacionPermitida) return;
    setReprogramando(true);
    try {
      await axios.put(`${API_URL}/api/cancelarturno/${idParseada}`);
      sessionStorage.setItem('turnoReprogramadoId', idParseada.toString());
      navigate(`/turnos/${slug}`);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudo reprogramar.' });
    } finally { setReprogramando(false); }
  };

  const formatearFechaSQL = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatearHora = (hora) => {
    if (!hora) return 'N/A';
    const [h, m] = hora.split(':');
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  };

  if (loadingTurno) return (
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black tracking-widest uppercase text-xs">Cargando información del turno...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col overflow-hidden animate-fade-in">
      <ToastContainer />

      {/* HEADER: Pantalla Completa Estilo Indigo/Slate */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-red-500 p-4 rounded-2xl shadow-lg shadow-red-500/20">
              <FaExclamationTriangle className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none uppercase">Gestión de Turno</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2">ID de Operación: #{turnoId}</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-4xl font-light p-2">
          <FaTimes />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-6">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
              ¿Qué deseas hacer con tu turno?
            </h3>
            <p className="text-slate-500 text-lg">
              Recuerda que las modificaciones solo se permiten con un mínimo de <strong>6 horas</strong> de anticipación.
            </p>

            {/* CARD DE DETALLES: Estilo Unificado */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 text-left space-y-6 shadow-inner">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <div className="bg-indigo-600 text-white p-3 rounded-xl"><FaUser /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</p>
                  <p className="text-xl font-black text-slate-800 capitalize">{turnoObtenido?.paciente}</p>
                  <p className="text-xs font-bold text-slate-500">DNI: {turnoObtenido?.dni}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-indigo-500 text-xl" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                    <p className="text-slate-700 font-bold capitalize">{formatearFechaSQL(turnoObtenido?.fecha)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-indigo-500 text-xl" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hora</p>
                    <p className="text-slate-700 font-bold">{formatearHora(turnoObtenido?.hora)} hs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 col-span-full">
                  <FaStethoscope className="text-indigo-500 text-xl" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Profesional / Especialidad</p>
                    <p className="text-slate-700 font-bold">{turnoObtenido?.profesional} | <span className="text-indigo-600 uppercase text-xs">{turnoObtenido?.especialidad}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* ALERTAS DE ESTADO */}
            {!cancelacionPermitida && (
              <div className="bg-amber-50 border-2 border-amber-100 p-5 rounded-2xl flex items-center gap-4 text-left">
                <FaExclamationTriangle className="text-amber-500 text-2xl flex-shrink-0" />
                <p className="text-amber-800 text-sm font-bold leading-tight">
                  {turnoObtenido?.estado !== 'reservado' 
                    ? `Este turno ya se encuentra en estado "${turnoObtenido.estado}".`
                    : "La gestión del turno expiró (requiere 6hs de anticipación)."}
                </p>
              </div>
            )}
          </div>

          {/* BOTONERA DE ACCIÓN */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleReprogramar}
                disabled={loading || reprogramando || !cancelacionPermitida}
                className={`py-6 rounded-3xl font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl
                  ${!cancelacionPermitida 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95'}`}
              >
                {reprogramando ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaRegClock className="text-xl" />}
                Reprogramar
              </button>

              <button
                onClick={handleCancelar}
                disabled={loading || reprogramando || !cancelacionPermitida}
                className={`py-6 rounded-3xl font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all
                  ${!cancelacionPermitida 
                    ? 'bg-slate-100 text-slate-300 border-2 border-slate-200 shadow-none' 
                    : 'bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-500 active:scale-95 shadow-lg shadow-red-100'}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <FaTimes className="text-xl" />}
                Cancelar Turno
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-5 text-slate-400 font-black tracking-widest uppercase text-xs hover:text-slate-800 transition-colors"
            >
              No deseo realizar cambios, volver al inicio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}