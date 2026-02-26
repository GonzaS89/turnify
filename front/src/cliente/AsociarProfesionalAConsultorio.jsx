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
  FaTimes,
  FaSpinner,
  FaArrowLeft,
  FaCheck,
  FaExclamationCircle,
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

  const {
    profesionales,
    isLoading,
    error: hookError,
    actualizarProfesionales,
  } = useAllProfesionals();

  const handleSelect = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setVinculando(true);

    if (!selectedProfesional) {
      setMensajeError("Debe seleccionar un profesional.");
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

      setTimeout(() => {
        refrescarListaProfesionales();
        if (tipo === "Particular") {
          onClose();
        }
      }, 800);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "No se pudo conectar con el servidor";
      setMensajeError(`❌ ${errorMsg}`);
      toast.error("Error al vincular profesional");
      setVinculando(false);
    }
  };

  const handleCreateSuccess = () => {
    if (typeof actualizarProfesionales === "function") {
      actualizarProfesionales();
    }
    refrescarListaProfesionales();
    if (tipo === "Particular") {
      onClose();
    }
    toast.success("✅ Profesional creado y vinculado correctamente");
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in font-sans">
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

      {/* HEADER PREMIUM SLATE/INDIGO */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20">
              <FaLink className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Vincular Staff</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2 italic">Asociar médico al consultorio</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-4xl font-light p-2 transition-colors">
          <FaTimes />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8 pb-20">
          
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 animate-slide-up">
            <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-5 uppercase tracking-tighter">
              <FaUserMd className="text-indigo-600" /> Selección de Profesional
            </h3>

            {isLoading ? (
              <div className="py-20 text-center flex flex-col items-center">
                <FaSpinner className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Sincronizando base de datos...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Profesionales Disponibles</label>
                  <select
                    value={selectedProfesional}
                    onChange={(e) => {
                      setSelectedProfesional(e.target.value);
                      setMensajeError(null);
                    }}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="">Selecciona un profesional de la lista...</option>
                    {profesionales?.map((prof) => (
                      <option
                        key={prof.id}
                        value={prof.id}
                        disabled={idsProfesionalesVinculados.includes(prof.id)}
                      >
                        {prof.nombre} {prof.apellido} — {prof.especialidad} {idsProfesionalesVinculados.includes(prof.id) ? "(Ya vinculado)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ERROR MESSAGE */}
                {(mensajeError || hookError) && (
                  <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 font-black flex items-center gap-4 shadow-sm">
                    <FaExclamationCircle className="text-2xl flex-shrink-0" />
                    <p className="tracking-tight text-sm uppercase">{mensajeError || hookError}</p>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex flex-col md:flex-row gap-5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="flex-1 py-6 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-3xl font-black tracking-widest uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    <FaPlusCircle className="text-green-500" /> Nuevo Profesional
                  </button>
                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={!selectedProfesional || vinculando}
                    className={`flex-[1.5] py-6 px-8 rounded-3xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3
                      ${vinculando || !selectedProfesional ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'}`}
                  >
                    {vinculando ? (
                      <><FaSpinner className="animate-spin" /> VINCULANDO...</>
                    ) : (
                      <><FaCheck /> VINCULAR STAFF</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
            Selecciona un profesional existente o crea uno nuevo para este centro médico
          </p>
        </div>
      </main>

      {/* Modal de creación de profesional */}
      {showCreateModal && (
        <CrearProfesionalModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSuccess}
          consultorioID={consultorioID}
        />
      )}
    </div>
  );
};

export default AsociarProfesionalAConsultorio;