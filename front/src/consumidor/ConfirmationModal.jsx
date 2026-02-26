import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaCheck,
  FaExclamationCircle,
  FaTimes,
  FaUser,
  FaIdCard,
  FaPhone,
  FaShieldAlt,
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaMapMarkerAlt,
  FaAngleLeft,
} from "react-icons/fa";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import { useParams, useNavigate } from "react-router";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import useConsultorioxId from "../../customHooks/useConsultorioxId";
import useObtenerTurnoxID from "../../customHooks/useObtenerTurnoxID";

const ConfirmationModal = ({ formData, selectedTurno, ordenTurno }) => {
  const { consultorioId, profesionalId } = useParams();
  const navigate = useNavigate();
  const [turnoReprogramadoId, setTurnoReprogramadoId] = useState(null);

  useEffect(() => {
    const savedId = sessionStorage.getItem('turnoReprogramadoId');
    if (savedId) setTurnoReprogramadoId(savedId);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { coberturas } = useAllCoberturas();
  const { profesional: prof } = useProfesionalxId(profesionalId);
  const { consultorio: consul } = useConsultorioxId(consultorioId);
  const { turno } = useObtenerTurnoxID(turnoReprogramadoId || null);

  const turnoCancelado = turno?.[0] || null;
  const { fecha: fechaReprogramada, hora: horaReprogramada } = turnoCancelado || {};
  const profesional = prof?.[0];
  const consultorio = consul?.[0];

  const coberturaElegida = coberturas?.find(
    (cobertura) => cobertura.id == formData?.selectedOption
  );

  const API_URL = import.meta.env.VITE_API_URL;

  const formatearFechaSQL = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    let f = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return f.charAt(0).toUpperCase() + f.slice(1);
  };

  const definirTitulo = (value) => {
    const map = { doctor: 'Dr.', doctora: 'Dra.', licenciado: 'Lic.', licenciada: 'Lic.' };
    return map[value] || '';
  };

  const formatearHora = (hora) => {
    if (!hora) return "N/A";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const reservarTurno = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await axios.put(`${API_URL}/api/reservarturno/${selectedTurno?.id}`, {
        nombre_paciente: formData.nombre,
        apellido_paciente: formData.apellido,
        DNI: formData.dni,
        cobertura: formData.selectedOption,
        telefono: formData.telefono,
        estado: "reservado",
        fecha: formatearFechaSQL(selectedTurno.fecha),
        consultorioID: consultorio?.id,
        profesionalID: profesional?.id,
        hora: formatearHora(selectedTurno.hora),
      });

      setIsSuccess(true);
      const nombreProfesional = `${definirTitulo(profesional?.titulo)} ${profesional?.nombre} ${profesional?.apellido}`.trim();
      const fechaFormateada = formatearFechaSQL(selectedTurno.fecha);
      const horaFormateada = formatearHora(selectedTurno.hora);
      const direccionCompleta = `${consultorio?.direccion}, ${consultorio?.localidad}`;

      const mensaje = `¡Hola ${nombreProfesional}!\n\nReservé el siguiente turno:\n\nFecha: ${fechaFormateada}\nHora: ${horaFormateada}\nDirección: ${direccionCompleta}\n\nSaludos,\n${formData.nombre} ${formData.apellido}\n\n¡¡IMPORTANTE!!\nReprogramar turno desde https://turnate.site/cancelar-turno/${selectedTurno?.id}`;
      
      let tel = consultorio.telefono.replace(/\D/g, "");
      if (tel.startsWith("9")) tel = "54" + tel;
      else if (tel.startsWith("11") && tel.length === 10) tel = "549" + tel;
      else if (!tel.startsWith("54")) tel = "549" + tel;

      const whatsappUrl = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;

      setTimeout(() => {
        navigate("/");
        window.open(whatsappUrl, "_blank");
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Error al conectar.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in">
      
      {/* HEADER UNIFICADO */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => !isSubmitting && navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaAngleLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl">
              <FaCheckCircle className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                {isSuccess ? "¡Reserva Exitosa!" : "Confirmación de Turno"}
              </h2>
              <p className="text-indigo-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">
                {isSuccess ? "Todo listo" : "Verifica los detalles"}
              </p>
            </div>
          </div>
        </div>
        {!isSubmitting && (
          <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white text-4xl font-light p-2">
            <FaTimes />
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          
          {isSuccess ? (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl text-center space-y-6 animate-slide-up">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={60} className="animate-bounce" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">¡Turno Reservado!</h2>
              <p className="text-slate-500 text-lg font-medium">Te estamos redirigiendo a WhatsApp para avisar al profesional...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              {/* CARD DETALLES DEL TURNO */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
                  <FaCalendarAlt className="text-indigo-600" /> Datos del Turno
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-3 h-fit rounded-xl text-indigo-600"><FaCalendarAlt /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                      <p className="text-lg font-bold text-slate-700">{formatearFechaSQL(selectedTurno?.fecha)}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-3 h-fit rounded-xl text-orange-500"><FaClock /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario</p>
                      <p className="text-lg font-bold text-slate-700">{formatearHora(selectedTurno?.hora)} hs</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-3 h-fit rounded-xl text-purple-600"><FaStethoscope /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profesional</p>
                      <p className="text-lg font-bold text-slate-700">{definirTitulo(profesional?.titulo)} {profesional?.nombre} {profesional?.apellido}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-3 h-fit rounded-xl text-red-500"><FaMapMarkerAlt /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lugar</p>
                      <p className="text-lg font-bold text-slate-700">{consultorio?.direccion}</p>
                      <p className="text-sm text-slate-400 font-bold uppercase">{consultorio?.localidad}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD DATOS PACIENTE */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
                  <FaUser className="text-indigo-600" /> Datos del Paciente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nombre Completo</p>
                    <p className="text-xl font-black text-slate-800">{formData?.apellido}, {formData?.nombre}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Documento (DNI)</p>
                    <p className="text-xl font-black text-slate-800">{formData?.dni}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cobertura</p>
                    <p className="text-lg font-bold text-indigo-600 uppercase">
                      {coberturaElegida ? `${coberturaElegida.siglas}` : "Particular"}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Teléfono</p>
                    <p className="text-lg font-bold text-slate-800">{formData?.telefono}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENSAJE DE ERROR */}
          {submitError && (
            <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-4">
              <FaExclamationCircle className="text-2xl" /> {submitError}
            </div>
          )}

          {/* FOOTER DE BOTONES */}
          <div className="flex flex-col md:flex-row gap-5 pb-20">
            {!isSuccess ? (
              <>
                <button
                  type="button" onClick={() => navigate(-1)} disabled={isSubmitting}
                  className="flex-1 py-5 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <FaAngleLeft /> EDITAR
                </button>
                <button
                  type="button" onClick={reservarTurno} disabled={isSubmitting}
                  className={`flex-[2] py-5 px-8 rounded-2xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3
                    ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-green-600 hover:shadow-green-200'}`}
                >
                  {isSubmitting ? 'PROCESANDO...' : <><FaCheck /> CONFIRMAR TODO</>}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black tracking-[0.3em] hover:bg-indigo-600 shadow-2xl transition-all"
              >
                IR AL INICIO
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationModal;