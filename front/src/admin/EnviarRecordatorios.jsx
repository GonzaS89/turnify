import useObtenerTurnosxFecha from "../../customHooks/useObtenerTurnosxFecha";
import { IoLogoWhatsapp } from "react-icons/io";

const EnviarRecordatorios = () => {
  // Formatea la hora (HH:mm)
  const formatearHora = (hora) => {
    if (!hora) return "N/A";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  // Formatea la fecha legible (ej: "Lunes 5 de abril de 2025")
  const formatearFechaSQL = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    let fechaFormateada = date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  // Obtiene título abreviado y pronombre según el título profesional
  const definirTitulo = (value) => {
    switch (value?.toLowerCase()) {
      case "doctor":
        return { tituloAbrev: "Dr.", pronombre: "el" };
      case "doctora":
        return { tituloAbrev: "Dra.", pronombre: "la" };
      case "licenciado":
        return { tituloAbrev: "Lic.", pronombre: "el" };
      case "licenciada":
        return { tituloAbrev: "Lic.", pronombre: "la" };
      default:
        return { tituloAbrev: "", pronombre: "el/la" };
    }
  };

  // Obtiene la fecha de hoy en formato YYYY-MM-DD
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  

  const fechaHoy = obtenerFechaHoy();
  const { turnos, loading, error } = useObtenerTurnosxFecha(fechaHoy);

  console.log(turnos)

  // Agrupa turnos por fecha
  const turnosAgrupados = turnos?.reduce((acc, turno) => {
    const fecha = turno.fecha;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(turno);
    return acc;
  }, {}) || {};


  // Genera el mensaje de WhatsApp para cada turno
  const mensajeRecordatorio = (turno) => {
    const { tituloAbrev } = definirTitulo(turno.titulo);
    const fechaFormateada = formatearFechaSQL(turno.fecha);
    const horaFormateada = formatearHora(turno.hora);

   let mensaje = `
¡Hola ${turno.paciente}!

Este es un recordatorio de tu turno con ${tituloAbrev} ${turno.nombreProfesional.toUpperCase()} ${turno.apellidoProfesional.toUpperCase()}.

El día ${fechaFormateada} a las ${horaFormateada} hrs.
En ${turno.direccion.toUpperCase()}, ${turno.localidad.toUpperCase()}

Tiempo de tolerancia: 15 minutos

Si necesitás reprogramar o cancelar: https://turnate.site/cancelar-turno/${turno.id}

Ante cualquier duda sobre la agenda comunicate directamente con el consultorio al ${turno.telefonoConsultorio}.

(SI VAS A CANCELAR O REPROGRAMAR HACELO CON BASTANTE ANTICIPACIÓN, POR FAVOR)

NO RESPONDAS ESTE MENSAJE, es un sistema automático.

Te esperamos
`.trim();


    return mensaje.replace(/\n/g, "%0A");
  };

  // Limpia y formatea el número de teléfono para Argentina (internacional)
  const limpiarTelefono = (telefono) => {
    if (!telefono) return "";
    let tel = telefono.replace(/\D/g, ""); // Solo dígitos

    if (tel.startsWith("9") && tel.length >= 10) {
      tel = "54" + tel;
    } else if (tel.startsWith("11") && tel.length === 10) {
      tel = "549" + tel;
    } else if (!tel.startsWith("54")) {
      tel = "549" + tel;
    }

    return tel;
  };
  
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Envío de Recordatorios
          </h1>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
            <p className="text-red-700 font-medium">Error al cargar turnos: {error.message}</p>
          </div>
        )}

        {/* Turnos Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {turnos?.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-700">
                  Sin turnos programados
                </h3>
                <p className="mt-2 text-gray-500">
                  No hay turnos para enviar recordatorios hoy.
                </p>
              </div>
            ) : (
              Object.keys(turnosAgrupados)
                .sort((a, b) => a.localeCompare(b)) // 👈 ORDENAR FECHAS DE MENOR A MAYOR
                .map((fecha) => (
                  <div
                    key={fecha}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg"
                  >
                    {/* Fecha Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white">
                        {formatearFechaSQL(fecha)}
                      </h2>
                    </div>

                    {/* Lista de Turnos */}
                    <ul className="divide-y divide-gray-100">
                      {turnosAgrupados[fecha].map((turno) => {
                        const telefonoLimpio = limpiarTelefono(turno.telefono);
                        const mensaje = mensajeRecordatorio(turno);
                        const urlWhatsApp = `https://wa.me/${telefonoLimpio}?text=${mensaje}`; // 👈 ESPACIO ELIMINADO

                        return (
                          <li
                            key={turno.id}
                            className="p-5 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <p>{turno.nombreProfesional} {turno.apellidoProfesional}</p>
                              <div>
                                <span className="inline-block px-3 py-1 text-slate-900 text-lg font-semibold rounded-full">
                                  {formatearHora(turno.hora)}
                                </span>
                              
                              </div>
                              <div className="flex items-center">
                                <a
                                  href={urlWhatsApp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                  <IoLogoWhatsapp className="text-xl mr-2" />
                                  Enviar a {turno.telefono}
                                </a>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EnviarRecordatorios;