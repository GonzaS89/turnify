import { useState } from "react";
import CrearYVincularProfesionalAPerfil from "./CrearYVincularProfesionalAPerfil";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import {
  FaUserMd,
  FaLink,
  FaPlusCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const AsociarProfesionalAPerfil = ({
  onClose,
  perfilID,
  idsProfesionalesVinculados,
  refrescarListaProfesionales,
  profesionalVinculado,
  perfil,
  actualizarProfesionales
}) => {
  const {
    profesionales,
    isLoading,
    error: hookError
  } = useAllProfesionals();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState("");
  const [mensajeError, setMensajeError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [vinculando, setVinculando] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSelect = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensaje(null);
    setVinculando(true);

    if (!selectedProfesional) {
      setMensajeError("Debe seleccionar un profesional.");
      setVinculando(false);
      return;
    }
    if (!perfilID) {
      setMensajeError("No se especificó el perfil.");
      setVinculando(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/unionprofesionalperfil`,
        {
          profesionalID: selectedProfesional,
          perfilID: perfilID,
        }
      );

      toast.info("✅ Profesional vinculado correctamente");

      setTimeout(() => {
        setVinculando(false);
        refrescarListaProfesionales();
        if (perfil?.tipo === "Particular") {
          onClose();
        }
      }, 1500);

    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.statusText ||
        "Error de conexión con el servidor";

      setMensajeError(`❌ ${errorMsg}`);
      toast.error("Error al asociar profesional");
      setVinculando(false);
      console.error("Error al asociar profesional:", err);
    }
  };

  const handleCreateSuccess = () => {
    if (typeof actualizarProfesionales === "function") {
      actualizarProfesionales();
    }

    if (perfil?.tipo === "Particular") {
      window.location.reload();
    }

    refrescarListaProfesionales();
    toast.success("✅ Nuevo profesional creado y vinculado");
    setShowCreateModal(false);
  };

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[40] animate-fade-in"
        onClick={profesionalVinculado ? onClose : null}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 relative rounded-t-2xl">
            {profesionalVinculado && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            )}

            <div className="flex items-center gap-3">
              <FaLink className="text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">Vincular Profesional</h2>
                <p className="text-purple-100 text-sm opacity-90">
                  Selecciona o crea un profesional para vincularlo
                </p>
              </div>
            </div>
          </div>

          {/* Cuerpo scrollable */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
            {/* Mensajes de error/hook */}
            {hookError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Error al cargar profesionales</p>
                  <p className="mt-1">{hookError}</p>
                </div>
              </div>
            )}

            {mensajeError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="mt-1">{mensajeError}</p>
                </div>
              </div>
            )}

            {mensaje && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
                <FaCheckCircle className="mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Éxito</p>
                  <p className="mt-1">{mensaje}</p>
                </div>
              </div>
            )}

            {/* Cargando */}
            {isLoading ? (
              <div className="py-8 text-center bg-blue-50 rounded-xl border border-blue-200">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-blue-700 text-sm font-medium">Cargando profesionales...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selector de profesional */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserMd className="text-purple-600" /> Seleccionar Profesional *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProfesional}
                      onChange={(e) => setSelectedProfesional(e.target.value)}
                      className="w-full px-4 py-3 pl-11 pr-10 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow text-gray-800 font-medium appearance-none"
                      required
                    >
                      <option value="" disabled>Seleccionar profesional</option>
                      {profesionales?.map((prof) => (
                        <option
                          key={prof.id}
                          value={prof.id}
                          disabled={idsProfesionalesVinculados?.includes(prof.id)}
                          className={idsProfesionalesVinculados?.includes(prof.id) ? "text-gray-400" : ""}
                        >
                          {prof.nombre} {prof.apellido} • {prof.especialidad} • MP: {prof.matricula}
                          {idsProfesionalesVinculados?.includes(prof.id) ? " (Ya vinculado)" : ""}
                        </option>
                      ))}
                    </select>
                    <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-100 shadow-md hover:shadow-lg"
                  >
                    <FaPlusCircle size={18} /> Nuevo Profesional
                  </button>

                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={!selectedProfesional || vinculando}
                    className={`
                      flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300
                      flex items-center justify-center gap-2
                      ${vinculando
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-100 shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    {vinculando ? (
                      <>
                        <div className="animate-spin rounded-full h-2 w-4 border-t-2 border-white"></div>
                        Vinculando...
                      </>
                    ) : (
                      "Vincular Profesional"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={1500} />

      {/* Modal de creación */}
      {showCreateModal && (
        <CrearYVincularProfesionalAPerfil
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSuccess}
          perfilID={perfilID}
          perfil={perfil}
        />
      )}
    </>
  );
};

export default AsociarProfesionalAPerfil;