// src/components/AsociarProfesionalAConsultorio.jsx
import { useState } from "react";
import CrearProfesionalModal from "./CrearProfesionalModal";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Iconos
import {
  FaUserMd,
  FaLink,
  FaPlusCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const AsociarProfesionalAConsultorio = ({
  onClose,
  consultorioID,
  idsProfesionalesVinculados = [],
  refrescarListaProfesionales,
  profesionalVinculado,
  tipo
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState("");
  const [mensajeError, setMensajeError] = useState(null);
  const [vinculando, setVinculando] = useState(false);

  // Hook para obtener todos los profesionales
  const {
    profesionales,
    isLoading,
    error: hookError,
    actualizarProfesionales,
  } = useAllProfesionals();

  // Manejar la vinculación
  const handleSelect = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setVinculando(true);

    if (!selectedProfesional) {
      setMensajeError("Debe seleccionar un profesional.");
      setVinculando(false);
      return;
    }

    if (!consultorioID) {
      setMensajeError("No se especificó el consultorio.");
      setVinculando(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/api/unionprofesionalconsultorio`, {
        profesionalID: selectedProfesional,
        consultorioID,
      });

      toast.success("✅ Profesional vinculado exitosamente");
      setVinculando(false);

      // Refrescar listas
      setTimeout(() => {
        refrescarListaProfesionales();

        // Cerrar modal si es consultorio particular
        if (tipo === "Particular") {
          onClose();
        }
      }, 800);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.statusText ||
        "No se pudo conectar con el servidor";

      setMensajeError(`❌ ${errorMsg}`);
      toast.error("Error al vincular profesional");
      setVinculando(false);
      console.error("Error al vincular profesional:", err);
    }
  };

  // Manejar éxito al crear un nuevo profesional
  const handleCreateSuccess = () => {
    // Actualizar listado de profesionales
    if (typeof actualizarProfesionales === "function") {
      actualizarProfesionales();
    }

    // Refrescar lista de profesionales en el consultorio
    refrescarListaProfesionales();

    // Cerrar modal si es particular
    if (tipo === "Particular") {
      onClose();
    }

    // Mostrar notificación
    toast.success("✅ Profesional creado y vinculado correctamente");
  };

  return (
    <>
      {/* Overlay oscuro con efecto blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={profesionalVinculado ? onClose : null}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente profesional */}
          <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaLink size={20} />
                </div>
                <h2 className="text-xl font-bold">Vincular Profesional</h2>
              </div>

                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition"
                  aria-label="Cerrar"
                >
                  <FaTimes size={18} />
                </button>
           
            </div>
          </header>

          {/* Cuerpo principal */}
          <main className="p-6 space-y-6">
            {/* Mensajes de error */}
            {hookError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                <span>{hookError}</span>
              </div>
            )}

            {mensajeError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                <span>{mensajeError}</span>
              </div>
            )}

            {/* Estado de carga */}
            {isLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 text-sm">Cargando profesionales...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selector de profesional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserMd className="text-purple-500" />
                    Seleccionar Profesional
                  </label>
                  <select
                    value={selectedProfesional}
                    onChange={(e) => {
                      setSelectedProfesional(e.target.value);
                      setMensajeError(null);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-0 hover:border-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccionar profesional</option>
                    {profesionales?.length > 0 ? (
                      profesionales.map((prof) => (
                        <option
                          key={prof.id}
                          value={prof.id}
                          disabled={idsProfesionalesVinculados.includes(prof.id)}
                          className="font-medium"
                        >
                          {prof.nombre} {prof.apellido} • {prof.especialidad} • MP: {prof.matricula}
                          {idsProfesionalesVinculados.includes(prof.id) && " (Ya vinculado)"}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay profesionales disponibles</option>
                    )}
                  </select>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <FaPlusCircle /> Nuevo Profesional
                  </button>

                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={!selectedProfesional || vinculando}
                    className={`flex-1 py-3 px-4 text-white font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      vinculando
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 transform hover:scale-105"
                    }`}
                  >
                    {vinculando ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" size={16} /> Vinculando...
                      </span>
                    ) : (
                      "Vincular Profesional"
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Footer opcional (solo en pantallas grandes) */}
          <footer className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
            Seleccione un profesional y confirme para vincularlo al consultorio.
          </footer>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Modal de creación de profesional */}
      {showCreateModal && (
        <CrearProfesionalModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSuccess}
          consultorioID={consultorioID}
          // consultorio={consultorio}
        />
      )}
    </>
  );
};

export default AsociarProfesionalAConsultorio;