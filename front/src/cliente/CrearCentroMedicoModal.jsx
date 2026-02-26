import { useState, useEffect } from "react";
import useAllProvincias from "../../customHooks/useAllProvincias";
import useLocalidadesxIdProvincia from "../../customHooks/useLocalidadesxIdProvincia";
import axios from "axios";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearConsultorioModal = ({ isOpen, onClose, perfilId, perfilTipo, onSuccess, actualizarConsultorios }) => {
  // Estados básicos
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [idProvinciaSelected, setIdProvinciaSelected] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [telefono, setTelefono] = useState("");
  
  // Estados para Seña (Particular)
  const [seña, setSeña] = useState(false);
  const [importe, setImporte] = useState("");
  const [banco, setBanco] = useState("");
  const [cbu, setCbu] = useState("");
  const [titular, setTitular] = useState("");

  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);

  const { provincias, loading: loadingProvincias, error: errorProvincias } = useAllProvincias();
  const { localidades, loading: loadingLocalidades, error: errorLocalidades } = useLocalidadesxIdProvincia(idProvinciaSelected);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setDireccion("");
      setIdProvinciaSelected("");
      setLocalidad("");
      setTelefono("");
      setSeña(false);
      setImporte("");
      setBanco("");
      setCbu("");
      setTitular("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreando(true);
    setError("");

    if (!nombre || !direccion || !localidad || !idProvinciaSelected || !telefono) {
      setError("Todos los campos marcados con * son obligatorios.");
      setCreando(false);
      return;
    }

    if (telefono.replace(/\D/g, "").length !== 10) {
      setError("El teléfono debe tener 10 dígitos (cod. área + número).");
      setCreando(false);
      return;
    }

    try {
      const nuevoConsultorio = {
        perfilTipo,
        nombre,
        direccion,
        localidad,
        provincia: idProvinciaSelected,
        telefono,
        // Datos de seña
        requiereSeña: seña,
        datosSeña: seña ? { importe, banco, cbu, titular } : null
      };

      const response = await axios.post(
        `${API_URL}/api/crear-y-unir-centromedico-a-perfil/${perfilId}`,
        nuevoConsultorio
      );

      toast.success("✅ ¡Centro médico creado con éxito!");
      
      setTimeout(() => {
        onSuccess?.(response.data.consultorio);
        actualizarConsultorios?.();
        setCreando(false);
        onClose(); // Cerramos el modal tras el éxito
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error de conexión";
      setError(`❌ ${errorMessage}`);
      toast.error("Error al crear el establecimiento");
      setCreando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-40 transition-opacity"></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-100">
          
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-slate-100">
            <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Nuevo Centro Médico</h2>
                <p className="text-slate-500 text-sm">Configurá la sede de atención para {perfilTipo}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <FaTimes className="text-slate-400 size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 animate-pulse">
                <FaExclamationCircle />
                <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
              </div>
            )}

            <section className="space-y-6">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <FaBuilding /> Información General
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre del Establecimiento *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ej: Clínica Central"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Dirección *</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400" />
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Calle 123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Teléfono de Contacto *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-4 text-slate-400" />
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="381 1234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Provincia *</label>
                  <select
                    value={idProvinciaSelected}
                    onChange={(e) => setIdProvinciaSelected(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    {provincias?.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Localidad *</label>
                  <select
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                    disabled={!idProvinciaSelected}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    {localidades?.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {perfilTipo === "Particular" && (
              <section className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={seña}
                    onChange={(e) => setSeña(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                  />
                  <span className="text-slate-700 font-bold uppercase text-sm tracking-tight">¿Requiere seña para reservar?</span>
                </label>

                {seña && (
                  <div className="mt-6 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                     <div className="md:col-span-2 flex items-center gap-2 text-indigo-700 text-xs font-black uppercase tracking-widest mb-2">
                        <FaInfoCircle /> Datos de Transferencia
                     </div>
                     <input placeholder="Importe $" type="number" value={importe} onChange={(e) => setImporte(e.target.value)} className="p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                     <input placeholder="Banco" value={banco} onChange={(e) => setBanco(e.target.value)} className="p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                     <input placeholder="CBU / Alias" value={cbu} onChange={(e) => setCbu(e.target.value)} className="p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                     <input placeholder="Titular de cuenta" value={titular} onChange={(e) => setTitular(e.target.value)} className="p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                )}
              </section>
            )}

            <button
              type="submit"
              disabled={creando}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-300"
            >
              {creando ? <FaSpinner className="animate-spin mx-auto text-xl" /> : "Confirmar y Crear"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
};

export default CrearConsultorioModal;