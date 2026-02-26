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

const CrearConsultorioModal = ({ isOpen, onClose, onSuccess, profesionalID, perfilID, perfilTipo }) => {
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

  const { provincias } = useAllProvincias();
  const { localidades } = useLocalidadesxIdProvincia(idProvinciaSelected);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

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

    if (telefono && telefono.length !== 10) {
        setError("El teléfono debe tener exactamente 10 dígitos.");
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
      <div className="fixed inset-0 w-screen h-screen bg-slate-900/90 backdrop-blur-md z-[9998]" onClick={onClose}></div>

      <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-100 pointer-events-auto animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER REFINADO */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md flex justify-between items-center p-8 border-b border-slate-50 z-20">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                Nuevo <span className="text-indigo-600 not-italic">Sede</span>
              </h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Turnate Management System</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {error && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-600 font-bold text-sm uppercase animate-shake">
                <FaExclamationCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* SECCIÓN 1: DATOS */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-indigo-600 pl-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Información de Atención</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial *</label>
                  <input
                    type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-700 transition-all"
                    placeholder="Ej: Centro Médico Norte"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono (10 dígitos)</label>
                  <div className="relative group">
                    <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={16} />
                    <input
                      type="tel" value={telefono} maxLength={10}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-700"
                      placeholder="3816917619"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Exacta *</label>
                <div className="relative group">
                  <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={16} />
                  <input
                    type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-700"
                    placeholder="Ej: Av. Sarmiento 1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provincia *</label>
                  <select
                    value={idProvinciaSelected} onChange={(e) => setIdProvinciaSelected(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-700 appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    {provincias.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localidad *</label>
                  <select
                    value={localidad} onChange={(e) => setLocalidad(e.target.value)}
                    disabled={!idProvinciaSelected}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-slate-700 appearance-none disabled:opacity-30"
                  >
                    <option value="">Seleccionar...</option>
                    {localidades.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: PAGOS */}
            {perfilTipo === "Particular" && (
              <section className="pt-8 border-t border-slate-50">
                <label className="flex items-center gap-4 cursor-pointer group mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${seña ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                    <input type="checkbox" className="hidden" checked={seña} onChange={(e) => setSeña(e.target.checked)} />
                    <FaWallet size={16} />
                  </div>
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Solicitar seña por reserva</span>
                </label>

                {seña && (
                  <div className="bg-slate-50 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                    <input 
                        placeholder="Importe ($)" type="number" value={importe} 
                        onChange={(e) => setImporte(e.target.value)} 
                        className="p-4 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold" 
                    />
                    <input 
                        placeholder="Banco" value={banco} 
                        onChange={(e) => setBanco(e.target.value)} 
                        className="p-4 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold" 
                    />
                    <div className="md:col-span-2">
                        <input 
                            placeholder="CBU / Alias / CVU" value={cbu} 
                            onChange={(e) => setCbu(e.target.value)} 
                            className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-mono font-bold text-sm tracking-widest" 
                        />
                    </div>
                  </div>
                )}
              </section>
            )}

            <button
              type="submit" disabled={creando}
              className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all uppercase tracking-widest text-sm active:scale-[0.98] disabled:bg-slate-200"
            >
              {creando ? <FaCircleNotch className="animate-spin mx-auto" size={20} /> : "Crear Establecimiento"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />
    </>
  );
};

export default CrearConsultorioModal;