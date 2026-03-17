// src/components/AsociarProfesionalAPerfil.jsx
import { useState, useEffect, useMemo } from "react";
import CrearYVincularProfesionalAPerfil from "./CrearYVincularProfesionalAPerfil";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import useAllPerfilesProfesionalesVinculados from "../../customHooks/useAllPerfilesProfesionalesVinculados";
import axios from "axios";
import {
  FaUserMd,
  FaLink,
  FaPlusCircle,
  FaExclamationCircle,
  FaTimes,
  FaCircleNotch,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AsociarProfesionalAPerfil = ({
  onClose,
  perfilID,
  onSuccess,
  perfil,
  actualizarProfesionales
}) => {
  const { profesionales, isLoading: loadingProfs, error: errorProfs } = useAllProfesionals();
  const { perfilesProfesionales, isLoading: loadingVinculados, error: errorVinculados } = useAllPerfilesProfesionalesVinculados();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState("");
  const [mensajeError, setMensajeError] = useState(null);
  const [vinculando, setVinculando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Bloqueo de scroll al montar el modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // 1. FILTRADO: Obtenemos solo los profesionales que NO están en perfilesProfesionales
  const profesionalesDisponibles = useMemo(() => {
    if (!profesionales || !perfilesProfesionales) return profesionales || [];
    
    // Extraemos los IDs ya vinculados
    const idsVinculados = perfilesProfesionales.map(p => p.profesional_id);
    
    // Retornamos solo los que NO coinciden con esos IDs
    return profesionales.filter(prof => !idsVinculados.includes(prof.id));
  }, [profesionales, perfilesProfesionales]);

  const handleSelect = async (e) => {
    if (e) e.preventDefault();
    setMensajeError(null);
    setVinculando(true);

    if (!selectedProfesional) {
      setMensajeError("Debe seleccionar un profesional.");
      setVinculando(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/api/unionprofesionalperfil`, {
        profesionalID: selectedProfesional,
        perfilID: perfilID,
      });

      toast.success("Vínculo establecido con éxito");

      setTimeout(() => {
        setVinculando(false);
        if (typeof onSuccess === "function") onSuccess();
        if (typeof onClose === "function") onClose();
      }, 1000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error de conexión";
      setMensajeError(errorMsg);
      toast.error("Error al asociar profesional");
      setVinculando(false);
    }
  };

  const handleCreateSuccess = () => {
    toast.success("Profesional creado y vinculado");
    setShowCreateModal(false);
    if (typeof actualizarProfesionales === "function") actualizarProfesionales();
    if (typeof onSuccess === "function") onSuccess();
    if (typeof onClose === "function") onClose();
  };

  const isLoading = loadingProfs || loadingVinculados;
  const globalError = errorProfs || errorVinculados || mensajeError;

  return (
    <>
      {/* OVERLAY PRINCIPAL */}
      <div 
        className="fixed inset-0 w-screen h-[100dvh] bg-slate-900/95 backdrop-blur-md z-[9998] transition-all duration-500"
        onClick={onClose}
      ></div>

      {/* CONTENEDOR MODAL PRINCIPAL */}
      <div className="fixed inset-0 w-full h-[100dvh] z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_35px_100px_-15px_rgba(0,0,0,0.5)] w-full max-w-xl max-h-[90dvh] overflow-y-auto pointer-events-auto animate-fade-in-up border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado */}
          <div className="bg-slate-900 text-white p-8 sm:p-12 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl p-3 transition-all active:scale-90"
            >
              <FaTimes size={20} />
            </button>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FaLink size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic leading-none">
                  Vincular <span className="text-indigo-400 not-italic">Profesional</span>
                </h2>
                <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-3">Gestión de accesos</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-14 space-y-8 bg-white">
            {globalError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm sm:text-lg flex items-center gap-4 animate-shake">
                <FaExclamationCircle size={24} className="flex-shrink-0" />
                <span>{globalError}</span>
              </div>
            )}

            {isLoading ? (
              <div className="py-16 text-center bg-slate-50 rounded-[2rem] border border-slate-100 font-black">
                <FaCircleNotch className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
                <p className="text-slate-400 uppercase tracking-widest text-[10px]">Cargando datos...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                    Seleccionar Existente
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedProfesional}
                      onChange={(e) => setSelectedProfesional(e.target.value)}
                      className="w-full px-6 py-5 sm:px-8 sm:py-6 pl-14 bg-slate-50 border-2 border-transparent rounded-[1.5rem] sm:rounded-[1.8rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-lg text-slate-800 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seleccionar de la lista</option>
                      {profesionalesDisponibles.length > 0 ? (
                        profesionalesDisponibles.map((prof) => (
                          <option key={prof.id} value={prof.id}>
                            {prof.nombre} {prof.apellido} - MP {prof.matricula}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No hay más profesionales disponibles</option>
                      )}
                    </select>
                    <FaUserMd className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={!selectedProfesional || vinculando}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all uppercase tracking-[0.2em] text-sm sm:text-lg"
                  >
                    {vinculando ? "VINCULANDO..." : "CONFIRMAR VÍNCULO"}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-300"><span className="bg-white px-4">O también</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="w-full py-4 sm:py-5 bg-indigo-50 text-indigo-600 font-black rounded-3xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-[0.2em] text-xs sm:text-sm border-2 border-transparent hover:border-indigo-200"
                  >
                    <FaPlusCircle className="inline mr-2" /> Crear Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-center" autoClose={1500} hideProgressBar />

      {/* MODAL DE CREACIÓN */}
      {showCreateModal && (
        <div className="relative z-[10000]">
          <CrearYVincularProfesionalAPerfil
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateSuccess}
            perfilID={perfilID}
            perfil={perfil}
          />
        </div>
      )}
    </>
  );
};

export default AsociarProfesionalAPerfil;