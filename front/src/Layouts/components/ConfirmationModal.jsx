import { useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import useAllCoberturas from "../../../customHooks/useAllCoberturas";
import { useParams, useNavigate } from "react-router";
import useProfesionalxId from "../../../customHooks/useProfesionalxId";
import useConsultorioxId from "../../../customHooks/useConsultorioxId";

const ConfirmationModal = ({
  formData,
  selectedTurno,
  ordenTurno
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

  console.log(formData.selectedOption)

  const API_URL = import.meta.env.VITE_API_URL;

  // Formatear fecha
  const formatearFechaSQL = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Formatear hora
  const formatearHora = (hora) => {
    if (!hora) return "N/A";
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
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

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al conectar con el servidor.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Previene scroll del fondo
  document.body.style.overflow = "hidden";

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center xl:p-4 z-[200]"
        onClick={() => !isSubmitting && navigate(-1)}
      >
        <div
          className="bg-white xl:rounded-2xl shadow-2xl w-screen lg:max-w-md transform transition-all hover:scale-[1.01] h-[100dvh] lg:max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {isSuccess ? "¡Éxito!" : "Confirmar Reserva"}
              </h3>
              <button
                onClick={() => !isSubmitting && navigate(-1)}
                disabled={isSubmitting}
                className="text-white hover:bg-white/20 rounded-full p-1 transition disabled:opacity-50"
                aria-label="Cerrar"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
            <p className="text-blue-100 mt-2 text-sm opacity-90">
              {isSuccess
                ? "Tu turno ha sido reservado correctamente."
                : "Revisa los datos antes de confirmar."}
            </p>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {isSuccess ? (
              // Estado de éxito
              <div className="text-center py-6">
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
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-800 mb-3 text-lg">Detalles del Turno</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-medium text-blue-600">Fecha:</span>{" "}
                        {formatearFechaSQL(selectedTurno.fecha)}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Hora:</span>{" "}
                        {formatearHora(selectedTurno.hora)}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Orden:</span>{" "}
                        {ordenTurno}° turno
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Profesional:</span>{" "}
                        Dr/a {profesional?.nombre} {profesional?.apellido}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Especialidad:</span>{" "}
                        {profesional?.especialidad}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Consultorio:</span>{" "}
                        {consultorio?.tipo === "Particular"
                          ? "Consultorio Particular"
                          : `Centro médico ${consultorio?.nombre}`}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Dirección:</span>{" "}
                        {consultorio?.direccion}, {consultorio?.localidad}
                      </p>
                    </div>
                  </div>
                )}

                {/* Datos del paciente */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-800 mb-3 text-lg">Tus Datos</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium text-gray-600">Nombre:</span> {formData.nombre}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Apellido:</span> {formData.apellido}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">DNI:</span> {formData.dni}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Teléfono:</span> {formData.telefono}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Cobertura:</span>{" "}
                      {coberturaElegida
                        ? `${coberturaElegida.siglas} (${coberturaElegida.nombre})`
                        : "Particular"}
                    </p>
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <FaExclamationCircle className="text-red-600 mt-0.5" />
                    <p className="text-red-700 text-sm leading-tight">{submitError}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            {!isSuccess && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium disabled:opacity-70"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={reservarTurno}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      Confirmando...
                    </div>
                  ) : (
                    "Confirmar Reserva"
                  )}
                </button>
              </>
            // ) : (
            //   <button
            //     type="button"
            //     onClick={() =>
            //       navigate('/')
            //     }
            //     className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition"
            //   >
            //     Volver al Panel
            //   </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;