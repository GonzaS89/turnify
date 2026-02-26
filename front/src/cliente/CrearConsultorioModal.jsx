import { useState, useEffect } from "react";
import useAllProvincias from "../../customHooks/useAllProvincias";
import useLocalidadesxIdProvincia from "../../customHooks/useLocalidadesxIdProvincia";
import axios from "axios";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaInfoCircle,
  FaExclamationCircle,
  FaCircleNotch,
  FaTimes,
  FaWallet,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearConsultorioModal = ({ isOpen, onClose, onSuccess, profesionalID, perfilID, perfilTipo, actualizarConsultorio }) => {
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [banco, setBanco] = useState("");
  const [cbu, setCbu] = useState("");
  const [alias, setAlias] = useState("");
  const [titular, setTitular] = useState("");
  const [seña, setSeña] = useState(false);
  const [importe, setImporte] = useState("");
  const [idProvinciaSelected, setIdProvinciaSelected] = useState("");
  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);

  const { provincias, loading: loadingProvincias } = useAllProvincias();
  const { localidades, loading: loadingLocalidades } = useLocalidadesxIdProvincia(idProvinciaSelected);

  const API_URL = import.meta.env.VITE_API_URL;

  // Bloqueo estricto de scroll al abrir el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset del form
  useEffect(() => {
    if (isOpen) {
      setDireccion(""); setLocalidad(""); setTelefono(""); setNombre("");
      setBanco(""); setCbu(""); setAlias(""); setTitular("");
      setSeña(false); setImporte(""); setIdProvinciaSelected("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreando(true);
    setError("");

    if (!nombre || !direccion || !localidad || !idProvinciaSelected) {
      setError("Los campos marcados con * son obligatorios.");
      setCreando(false);
      return;
    }

    try {
      const nuevoConsultorio = {
        perfilTipo, direccion, localidad, provincia: idProvinciaSelected,
        telefono: telefono || null, nombre, seña,
        importe: seña ? parseFloat(importe) : null,
        banco: seña ? banco : null, cbu: seña ? cbu : null,
        alias: seña ? alias : null, titular: seña ? titular : null,
      };

      const response = await axios.post(
        `${API_URL}/api/crear-y-unir-consultorio-a-perfil/${perfilID}/${profesionalID}`,
        nuevoConsultorio
      );

      toast.success("Establecimiento creado correctamente");
      setTimeout(() => {
        window.location.reload();
        onSuccess?.(response.data);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error de conexión");
      setCreando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY: Cobertura total absoluta con Blur Premium */}
      <div 
        className="fixed inset-0 w-screen h-screen bg-slate-900/95 backdrop-blur-md z-[9998] transition-all duration-500"
        onClick={onClose}
      ></div>

      {/* WRAPPER DEL MODAL: Centrado y scroll interno */}
      <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-[3rem] shadow-[0_35px_120px_-15px_rgba(0,0,0,0.6)] w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-slate-100 pointer-events-auto animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER: Sticky para mantener el control siempre visible */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-xl flex justify-between items-center p-10 sm:p-12 border-b border-slate-50 z-20">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Nuevo <span className="text-indigo-600 not-italic">Establecimiento</span>
              </h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] mt-3">Configuración de Sede</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-5 bg-slate-50 rounded-[1.5rem] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <FaTimes size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 sm:p-14 space-y-14">
            {error && (
              <div className="p-8 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-5 text-red-600 font-black text-xl animate-shake">
                <FaExclamationCircle size={30} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SECCIÓN 1: DATOS GENERALES */}
            <section className="space-y-10">
              <div className="flex items-center gap-4 border-l-8 border-indigo-600 pl-6">
                <FaBuilding className="text-slate-900" size={24} />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Información de Atención</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial *</label>
                  <input
                    type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-2xl text-slate-800 transition-all placeholder:text-slate-300"
                    placeholder="Ej: Clínica Los Olivos"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono Público</label>
                  <div className="relative group">
                    <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="tel" value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-2xl"
                      placeholder="381691..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Exacta *</label>
                <div className="relative group">
                  <FaMapMarkerAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-2xl"
                    placeholder="Ej: Av. Belgrano 2500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Provincia *</label>
                  <select
                    value={idProvinciaSelected} onChange={(e) => setIdProvinciaSelected(e.target.value)}
                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-2xl appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar...</option>
                    {provincias.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Localidad *</label>
                  <select
                    value={localidad} onChange={(e) => setLocalidad(e.target.value)}
                    disabled={!idProvinciaSelected}
                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-2xl appearance-none disabled:opacity-30 cursor-pointer"
                  >
                    <option value="">Seleccionar...</option>
                    {localidades.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: PAGOS (Solo Particulares) */}
            {perfilTipo === "Particular" && (
              <section className="pt-12 border-t-2 border-slate-50">
                <label className="flex items-center gap-6 cursor-pointer group mb-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${seña ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                    <input type="checkbox" className="hidden" checked={seña} onChange={(e) => setSeña(e.target.checked)} />
                    <FaWallet size={20} />
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">¿Solicitar seña por reserva?</span>
                </label>

                {seña && (
                  <div className="bg-slate-900 rounded-[2.5rem] p-12 space-y-10 animate-fade-in-up shadow-2xl shadow-indigo-100">
                    <div className="flex items-center gap-4 text-indigo-400 border-b border-slate-800 pb-6">
                      <FaInfoCircle size={24} />
                      <p className="text-sm font-black uppercase tracking-[0.2em]">Configuración de Cobro Directo</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Valor de la Seña ($)</label>
                        <input
                          type="number" value={importe} onChange={(e) => setImporte(e.target.value)}
                          className="w-full px-8 py-5 bg-slate-800 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:outline-none font-bold text-white text-2xl transition-all"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Banco / Billetera</label>
                        <input
                          type="text" value={banco} onChange={(e) => setBanco(e.target.value)}
                          className="w-full px-8 py-5 bg-slate-800 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:outline-none font-bold text-white text-2xl transition-all"
                          placeholder="Ej: Brubank"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">CBU / Alias / CVU</label>
                        <input
                          type="text" value={cbu} onChange={(e) => setCbu(e.target.value)}
                          className="w-full px-8 py-5 bg-slate-800 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:outline-none font-bold text-white text-2xl transition-all tracking-widest font-mono"
                          placeholder="000000..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ACCIÓN FINAL */}
            <div className="pt-8">
              <button
                type="submit" disabled={creando}
                className="w-full py-8 bg-slate-900 text-white font-black rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all uppercase tracking-[0.3em] text-2xl"
              >
                {creando ? (
                  <span className="flex items-center justify-center gap-5">
                    <FaCircleNotch className="animate-spin" /> Procesando...
                  </span>
                ) : (
                  "Confirmar y Crear"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer 
        position="bottom-center" autoClose={2000} hideProgressBar 
        toastClassName="bg-slate-900 text-white font-black rounded-3xl shadow-2xl p-8 text-xl"
      />
    </>
  );
};

export default CrearConsultorioModal;