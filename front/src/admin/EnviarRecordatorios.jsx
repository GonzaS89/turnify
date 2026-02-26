import useObtenerTurnosxFecha from "../../customHooks/useObtenerTurnosxFecha";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaRegCalendarAlt, FaClock, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";

const EnviarRecordatorios = () => {
  const formatearHora = (hora) => {
    if (!hora) return "N/A";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const formatearFechaSQL = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    let fechaFormateada = date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  const definirTitulo = (value) => {
    switch (value?.toLowerCase()) {
      case "doctor": return { tituloAbrev: "Dr." };
      case "doctora": return { tituloAbrev: "Dra." };
      case "licenciado": return { tituloAbrev: "Lic." };
      case "licenciada": return { tituloAbrev: "Lic." };
      default: return { tituloAbrev: "" };
    }
  };

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const fechaHoy = obtenerFechaHoy();
  const { turnos, loading, error } = useObtenerTurnosxFecha(fechaHoy);

  const turnosAgrupados = turnos?.reduce((acc, turno) => {
    const fecha = turno.fecha;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(turno);
    return acc;
  }, {}) || {};

  const mensajeRecordatorio = (turno) => {
    const { tituloAbrev } = definirTitulo(turno.titulo);
    const mensaje = `¡Hola ${turno.paciente}!\n\nEste es un recordatorio de tu turno con ${tituloAbrev} ${turno.nombreProfesional.toUpperCase()} ${turno.apellidoProfesional.toUpperCase()}.\n\n📅 ${formatearFechaSQL(turno.fecha)} a las ${formatearHora(turno.hora)} hrs.\n📍 ${turno.direccion.toUpperCase()}, ${turno.localidad.toUpperCase()}\n\nTiempo de tolerancia: 15 min.\n\nSi necesitás cancelar: https://turnate.site/cancelar-turno/${turno.id}\n\nTe esperamos.`.trim();
    return encodeURIComponent(mensaje);
  };


  const limpiarTelefono = (telefono) => {
    if (!telefono) return "";
    let tel = telefono.replace(/\D/g, "");
    if (!tel.startsWith("54")) tel = "549" + tel;
    return tel;
  };

  return (
    <section className="min-h-screen py-12 px-6 max-w-5xl mx-auto">
      {/* Header Estilo Turnate */}
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Asistente de Comunicación</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
          Enviar <br /><span className="text-indigo-600">Recordatorios</span>
        </h1>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-10">
          {turnos?.length === 0 ? (
            <div className="bg-white p-16 rounded-[3rem] border border-slate-100 shadow-xl text-center">
              <p className="text-slate-400 font-black uppercase tracking-widest">No hay turnos para hoy</p>
            </div>
          ) : (
            Object.keys(turnosAgrupados)
              .sort((a, b) => a.localeCompare(b))
              .map((fecha) => (
                <div key={fecha} className="space-y-6">
                  <div className="flex items-center gap-4 px-4">
                    <FaRegCalendarAlt className="text-indigo-600 text-xl" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                      {formatearFechaSQL(fecha)}
                    </h2>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>

                  <div className="grid gap-4">
                    {turnosAgrupados[fecha].map((turno) => (
                      <motion.div
                        key={turno.id}
                        whileHover={{ x: 10 }}
                        className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-indigo-500"
                      >
                        <div className="flex items-center gap-6 flex-1">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                             <FaClock size={24} />
                          </div>
                          <div>
                            <span className="text-indigo-600 font-black text-2xl tracking-tighter">
                              {formatearHora(turno.hora)}
                            </span>
                            <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-sm tracking-tighter">
                              <FaUserMd className="text-slate-300" />
                              {turno.nombreProfesional} {turno.apellidoProfesional}
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Paciente: {turno.paciente}</p>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/${limpiarTelefono(turno.telefono)}?text=${mensajeRecordatorio(turno)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-emerald-100 hover:bg-slate-900 transition-all active:scale-95"
                        >
                          <IoLogoWhatsapp size={20} />
                          Enviar a {turno.telefono}
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </section>
  );
};

export default EnviarRecordatorios;