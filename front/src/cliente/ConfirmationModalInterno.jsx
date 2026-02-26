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
  FaSpinner 
} from "react-icons/fa";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import { useParams, useNavigate } from "react-router";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import useConsultorioxId from "../../customHooks/useConsultorioxId";
import { toast, ToastContainer } from "react-toastify";

const ConfirmationModalInterno = ({
  formData,
  selectedTurno,
  ordenTurno,
  actualizarTurnos,
}) => {
  const { consultorioId, profesionalId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { coberturas } = useAllCoberturas();
  const { profesional: prof } = useProfesionalxId(profesionalId);
  const { consultorio: consul } = useConsultorioxId(consultorioId);

  const profesional = prof?.[0];
  const consultorio = consul?.[0];

  const coberturaElegida = coberturas?.find(
    (cobertura) => cobertura.id == formData?.selectedOption
  );

  const API_URL = import.meta.env.VITE_API_URL;

  // --- LÓGICA DE FORMATEO (CONSERVADA) ---
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

  // --- RESERVAR TURNO INTERNO (MENSAJE PARA EL PACIENTE) ---
  const reservarTurno = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await axios.put(
        `${API_URL}/api/reservarturno/${selectedTurno?.id}`,
        {
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
        }
      );

      setIsSuccess(true);
      toast.success("Turno reservado con éxito");

      const nombreProfesional = `${definirTitulo(profesional?.titulo)} ${profesional?.nombre} ${profesional?.apellido}`.trim();
      
      const mensaje = `¡Hola ${formData.nombre}!\nTe agendé el siguiente turno:\n\nFecha: ${formatearFechaSQL(selectedTurno.fecha)}\nHora: ${formatearHora(selectedTurno.hora)}\nDirección: ${consultorio?.direccion}, ${consultorio?.localidad}\n\nIMPORTANTE: Si no podés asistir, reprogramá aquí:\nhttps://turnate.site/cancelar-turno/${selectedTurno?.id}\n\n¡Te esperamos!\nSaludos, ${nombreProfesional}`;

      let tel = formData.telefono.replace(/\D/g, '');
      if (tel.startsWith('9')) tel = '54' + tel;
      else if (tel.startsWith('11') && tel.length === 10) tel = '549' + tel;
      else if (!tel.startsWith('54')) tel = '549' + tel;

      const whatsappUrl = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        navigate(`/micuenta/panelturnos/${consultorio?.id}/${profesional?.id}`);
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Error al conectar con el servidor.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow || 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[400] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in font-sans">
      <ToastContainer />
      
      {/* HEADER PREMIUM */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => !isSubmitting && navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaAngleLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <FaCheckCircle className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">
                {isSuccess ? "¡Turno Confirmado!" : "Confirmación Interna"}
              </h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2">
                {isSuccess ? "Notificando al paciente..." : "Verifica los datos de la reserva"}
              </p>
            </div>
          </div>
        </div>
        {!isSubmitting && (
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-4xl font-light p-2 transition-colors">
            <FaTimes />
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8 pb-20">
          
          {isSuccess ? (
            <div className="bg-white p-12 md:p-20 rounded-[3rem] border border-slate-200 shadow-xl text-center space-y-6 animate-slide-up">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FaCheckCircle size={60} className="animate-bounce" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">¡Reserva Exitosa!</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md mx-auto">
                El turno ha sido agendado. Estamos abriendo WhatsApp para que le envíes el comprobante al paciente.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-up">
              
              {/* CARD DETALLES DEL TURNO */}
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
                  <FaCalendarAlt className="text-indigo-600" /> Datos del Turno
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="flex gap-5">
                    <div className="bg-slate-50 p-4 h-fit rounded-2xl text-indigo-600 shadow-sm"><FaCalendarAlt size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha Programada</p>
                      <p className="text-xl font-black text-slate-800 tracking-tight">{formatearFechaSQL(selectedTurno?.fecha)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-5">
                    <div className="bg-slate-50 p-4 h-fit rounded-2xl text-orange-500 shadow-sm"><FaClock size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horario de Inicio</p>
                      <p className="text-xl font-black text-slate-800 tracking-tight">{formatearHora(selectedTurno?.hora)} hs</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="bg-slate-50 p-4 h-fit rounded-2xl text-purple-600 shadow-sm"><FaStethoscope size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Profesional Asignado</p>
                      <p className="text-xl font-black text-slate-800 tracking-tight capitalize">{definirTitulo(profesional?.titulo)} {profesional?.nombre} {profesional?.apellido}</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="bg-slate-50 p-4 h-fit rounded-2xl text-red-500 shadow-sm"><FaMapMarkerAlt size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Establecimiento</p>
                      <p className="text-xl font-black text-slate-800 tracking-tight">{consultorio?.direccion}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{consultorio?.localidad}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD DATOS PACIENTE */}
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-4">
                  <FaUser className="text-indigo-600" /> Información del Paciente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaUser size={10} /> Nombre y Apellido</p>
                    <p className="text-xl font-black text-slate-800 uppercase tracking-tight">{formData?.apellido}, {formData?.nombre}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaIdCard size={10} /> DNI / Documento</p>
                    <p className="text-xl font-black text-slate-800">{formData?.dni}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaShieldAlt size={10} /> Cobertura Médica</p>
                    <p className="text-xl font-black text-indigo-600 uppercase tracking-tight">
                      {coberturaElegida ? (coberturaElegida.nombre === coberturaElegida.siglas ? coberturaElegida.nombre : `${coberturaElegida.siglas} - ${coberturaElegida.nombre}`) : "Particular"}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaPhone size={10} /> Teléfono Móvil</p>
                    <p className="text-xl font-black text-slate-800">{formData?.telefono}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENSAJE DE ERROR */}
          {submitError && (
            <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] text-red-600 font-black flex items-center gap-5 shadow-sm">
              <FaExclamationCircle className="text-3xl flex-shrink-0" />
              <div>
                <p className="uppercase text-[10px] tracking-widest mb-1">Error de procesamiento</p>
                <p className="text-lg tracking-tight leading-none">{submitError}</p>
              </div>
            </div>
          )}

          {/* FOOTER DE ACCIONES */}
          <div className="flex flex-col md:flex-row gap-5 pb-20">
            {!isSuccess ? (
              <>
                <button
                  type="button" onClick={() => !isSubmitting && navigate(-1)}
                  disabled={isSubmitting}
                  className="flex-1 py-6 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-3xl font-black tracking-widest uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <FaAngleLeft /> CORREGIR DATOS
                </button>
                <button
                  type="button" onClick={reservarTurno}
                  disabled={isSubmitting}
                  className={`flex-[2] py-6 px-8 rounded-3xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3
                    ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'}`}
                >
                  {isSubmitting ? (
                    <><FaSpinner className="animate-spin" /> PROCESANDO...</>
                  ) : (
                    <><FaCheck /> AGENDAR Y NOTIFICAR</>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/micuenta/panelturnos/${consultorio?.id}/${profesional?.id}`)}
                className="w-full py-7 bg-slate-900 text-white rounded-3xl font-black tracking-[0.3em] hover:bg-indigo-600 shadow-2xl transition-all uppercase"
              >
                VOLVER AL PANEL DE TURNOS
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationModalInterno;