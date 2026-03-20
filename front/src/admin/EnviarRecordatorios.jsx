import { useState, useMemo } from "react";
import useObtenerTurnosxFecha from "../../customHooks/useObtenerTurnosxFecha";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaRegCalendarAlt, FaClock, FaUserMd, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- SUBCOMPONENTE PROFESIONAL ---
const SeccionProfesional = ({ profesional, fechas, mensajeRecordatorio, limpiarTelefono, formatearFechaSQL, formatearHora }) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalTurnos = useMemo(() => 
    Object.values(fechas).reduce((acc, curr) => acc + curr.length, 0), 
  [fechas]);

  return (
    <div className="mb-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors text-left"
      >
        <div className={`p-4 rounded-2xl ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <FaUserMd size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            {profesional}
          </h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">
            {totalTurnos} {totalTurnos === 1 ? 'Turno' : 'Turnos'} en total
          </p>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-300">
          <FaChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-8 space-y-8 bg-slate-50/30">
              {Object.keys(fechas).sort().map((fecha) => (
                <div key={fecha} className="space-y-4">
                  <div className="flex items-center gap-3 pt-4">
                    <FaRegCalendarAlt className="text-slate-300" size={14} />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {formatearFechaSQL(fecha)}
                    </h3>
                    <div className="h-px flex-1 bg-slate-200/60"></div>
                  </div>

                  <div className="grid gap-3">
                    {fechas[fecha]
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((turno) => (
                        <div key={turno.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-5 flex-1 w-full">
                            <div className="bg-slate-50 p-3 rounded-2xl text-indigo-600 font-black text-lg tabular-nums min-w-[80px] text-center shadow-inner">
                              {formatearHora(turno.hora)}
                            </div>
                            <div>
                              <p className="text-slate-900 font-black uppercase text-sm leading-none">{turno.paciente}</p>
                              <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">Tel: {turno.telefono}</p>
                            </div>
                          </div>
                          <a
                            href={`https://wa.me/${limpiarTelefono(turno.telefono)}?text=${mensajeRecordatorio(turno)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                          >
                            <IoLogoWhatsapp size={18} /> Enviar
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const EnviarRecordatorios = () => {
  // --- Tus Funciones de Formato ---
  const formatearHora = (hora) => {
    if (!hora) return "N/A";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const formatearFechaSQL = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    let fechaFormateada = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
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

  const { turnos, loading } = useObtenerTurnosxFecha(new Date().toISOString().split('T')[0]);

  console.log(turnos)

  // --- Lógica de Agrupación y Ordenamiento Cronológico por Profesional ---
  const profesionalesOrdenados = useMemo(() => {
    if (!turnos) return [];

    // 1. Agrupar datos
    const agrupados = turnos.reduce((acc, turno) => {
      const profesional = `${turno.nombreProfesional} ${turno.apellidoProfesional}`;
      if (!acc[profesional]) acc[profesional] = {};
      if (!acc[profesional][turno.fecha]) acc[profesional][turno.fecha] = [];
      acc[profesional][turno.fecha].push(turno);
      return acc;
    }, {});

    // 2. Crear una lista de profesionales con su "Turno más cercano" para poder ordenar
    return Object.keys(agrupados)
      .map(nombre => {
        // Encontrar la fecha mínima y la hora mínima de esa fecha para este profesional
        const fechasDoc = Object.keys(agrupados[nombre]).sort();
        const primeraFecha = fechasDoc[0];
        const primeraHora = agrupados[nombre][primeraFecha].sort((a,b) => a.hora.localeCompare(b.hora))[0].hora;

        return {
          nombre,
          datos: agrupados[nombre],
          criterioOrden: `${primeraFecha}T${primeraHora}` // Formato YYYY-MM-DDTHH:MM para sort
        };
      })
      .sort((a, b) => a.criterioOrden.localeCompare(b.criterioOrden)); // Ordenar por el turno más cercano
  }, [turnos]);

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
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
          Enviar <br /><span className="text-indigo-600">Recordatorios</span>
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 animate-pulse text-indigo-600 font-black">CARGANDO...</div>
      ) : (
        profesionalesOrdenados.map(({ nombre, datos }) => (
          <SeccionProfesional
            key={nombre}
            profesional={nombre}
            fechas={datos}
            mensajeRecordatorio={mensajeRecordatorio}
            limpiarTelefono={limpiarTelefono}
            formatearFechaSQL={formatearFechaSQL}
            formatearHora={formatearHora}
          />
        ))
      )}

      {!loading && profesionalesOrdenados.length === 0 && (
        <div className="text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs">
          No hay turnos hoy
        </div>
      )}
    </section>
  );
};

export default EnviarRecordatorios;