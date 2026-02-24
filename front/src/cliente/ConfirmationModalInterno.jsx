import { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle, FaTimes, FaCalendarAlt, FaUser, FaIdCard, FaPhone, FaShieldAlt, FaAngleLeft, FaCheck, FaClock, FaStethoscope,FaMapMarkerAlt } from "react-icons/fa";
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
  const { consultorioId } = useParams();
  const { profesionalId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { coberturas } = useAllCoberturas();
  const { profesional: prof, isLoading: loadingProfesional } = useProfesionalxId(profesionalId);
  const { consultorio: consul, isLoading: loadingConsultorio } = useConsultorioxId(consultorioId);

  const profesional = prof?.[0];
  const consultorio = consul?.[0];

  const coberturaElegida = coberturas?.find(
    (cobertura) => cobertura.id == formData?.selectedOption
  );

  const API_URL = import.meta.env.VITE_API_URL;

  // Formatear fecha y hora
  const formatearFechaSQL = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    let fechaFormateada = date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Capitalizar la primera letra
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  const formatearHora = (hora) => {
    if (!hora) return "N/A";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const definirTitulo = (value) => {
    switch (value) {
      case 'doctor':
        return 'Dr.';
      case 'doctora':
        return 'Dra.';
      case 'licenciado':
      case 'licenciada':
        return 'Lic.';
      default:
        return '';
    }
  };

  // Reservar turno
  const reservarTurno = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axios.put(
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
      toast.success("Turno reservado")

      // 🟢 ENLACE DE WHATSAPP AUTOMÁTICO - Mensaje mejorado
      const nombreProfesional = `${definirTitulo(profesional?.titulo)} ${profesional?.nombre} ${profesional?.apellido}`.trim();
      const fechaFormateada = formatearFechaSQL(selectedTurno.fecha);
      const horaFormateada = formatearHora(selectedTurno.hora);
      const direccionCompleta = `${consultorio?.direccion}, ${consultorio?.localidad}`;

      const mensaje = `¡Hola ${formData.nombre}!
      Te agendé el siguiente turno:
      
      Fecha: ${fechaFormateada}
      Hora: ${horaFormateada}
      Dirección: ${direccionCompleta}
      
      IMPORTANTE
      Si no podés asistir, por favor reprogramá tu turno desde aquí:
      https://turnate.site/cancelar-turno/${selectedTurno?.id}
      
      Tolerancia de espera: 15 minutos

      Por favor confirmar presencial por este mismo medio 

      ¡Te esperamos! 
      
      Saludos, ${nombreProfesional}
      
      Turno generado desde https://turnate.site`;

      

// Formatear número: asumimos que formData.telefono tiene el número sin + ni espacios
// Para Argentina, asumimos prefijo 54 y si empieza con 9 o 11, lo ajustamos
let telefono = formData.telefono.replace(/\D/g, ''); // Solo dígitos

// Si empieza con 9 (celular argentino), agregamos 54 adelante
if (telefono.startsWith('9')) {
  telefono = '54' + telefono;
} 
// Si empieza con 11 (teléfono de Buenos Aires), también lo convertimos a móvil
else if (telefono.startsWith('11') && telefono.length === 10) {
  telefono = '549' + telefono;
}
// Si ya tiene 54, lo dejamos tal cual
else if (!telefono.startsWith('54')) {
  // Puedes ajustar lógica según tu caso, ejemplo genérico:
  telefono = '549' + telefono; // asume celular argentino por defecto
}

const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

      setTimeout(() => {
        navigate(`/micuenta/panelturnos/${consultorio?.id}/${profesional?.id}`);
        setIsSubmitting(false);
        window.open(whatsappUrl, '_blank');
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al conectar con el servidor.";
      setSubmitError(errorMessage);
    }
  };
  useEffect(() => {
    // Bloquea el scroll al montar
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Restaura el scroll al desmontar
    return () => {
      document.body.style.overflow = prevOverflow || 'auto';
    };
  }, []);
  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[300] animate-fade-in"
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-screen sm:max-w-md max-h-[90dvh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative rounded-t-2xl">
            <button
              onClick={() => !isSubmitting && navigate(-1)}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-2xl" />
              <div>
                <h3 className="text-2xl font-bold">
                  {isSuccess ? "¡Turno Confirmado!" : "Revisa tu Reserva"}
                </h3>
                <p className="text-blue-100 text-sm opacity-90">
                  {isSuccess
                    ? "Tu turno ha sido reservado correctamente."
                    : "Confirma los datos antes de continuar."}
                </p>
              </div>
            </div>
          </div>

          {/* Cuerpo scrollable */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
            {isSuccess ? (
              // Estado de éxito
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h2>
                <p className="text-gray-600 text-sm">
                  Tu turno ha sido reservado exitosamente.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Recibirás una confirmación por WhatsApp.
                </p>
              </div>
            ) : (
              // Estado de confirmación
              <>
                {/* Detalles del turno */}
                {selectedTurno && (
                  <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" /> Detalles del Turno
                    </h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Fecha:</span>{" "}
                          {formatearFechaSQL(selectedTurno.fecha)}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaClock className="text-orange-500 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Hora:</span>{" "}
                          {formatearHora(selectedTurno.hora)}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaUser className="text-indigo-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Orden:</span>{" "}
                          {ordenTurno}° turno
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaStethoscope className="text-purple-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Profesional:</span>{" "}
                          {definirTitulo(profesional?.titulo)} {profesional?.nombre} {profesional?.apellido}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaStethoscope className="text-purple-500 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Especialidad:</span>{" "}
                          {profesional?.especialidad}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Establecimiento:</span>{" "}
                          {consultorio?.tipo === "Particular"
                            ? "Consultorio Particular"
                            : `Centro médico ${consultorio?.nombre}`}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <span className="font-medium text-gray-600">Dirección:</span>{" "}
                          {consultorio?.direccion}, {consultorio?.localidad}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Datos del paciente */}
                <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                    <FaUser className="text-green-600" /> Tus Datos
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <FaUser className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <span className="font-medium text-gray-600">Nombre:</span> {formData?.nombre}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaUser className="text-indigo-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <span className="font-medium text-gray-600">Apellido:</span> {formData?.apellido}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaIdCard className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <span className="font-medium text-gray-600">DNI:</span> {formData?.dni}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaPhone className="text-orange-500 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <span className="font-medium text-gray-600">Teléfono:</span> {formData?.telefono}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaShieldAlt className="text-purple-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <span className="font-medium text-gray-600">Cobertura:</span>{" "}
                        {coberturaElegida ? (
                          coberturaElegida.nombre === coberturaElegida.siglas
                            ? coberturaElegida.nombre
                            : `${coberturaElegida.siglas} - ${coberturaElegida.nombre}`
                        ) : "Particular"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                    <FaExclamationCircle className="mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold">Error al reservar</p>
                      <p className="mt-1">{submitError}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-white border-t border-gray-200">
            {!isSuccess ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <FaAngleLeft size={16} /> Editar
                </button>
                <button
                  type="button"
                  onClick={reservarTurno}
                  disabled={isSubmitting}
                  className={`
                    flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300
                    flex items-center justify-center gap-2
                    ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-100 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-2 w-4 border-t-2 border-white"></div>
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <FaCheck size={18} />
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-100 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaAngleLeft size={18} /> Volver al Inicio
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModalInterno;