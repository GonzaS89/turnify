import { useState, useEffect } from "react";
import axios from "axios";
import useAllEspecialidades from "../../customHooks/useAllEspecialidades";
import {
  FaTimes,
  FaUserMd,
  FaStethoscope,
  FaIdCard,
  FaGraduationCap,
  FaPhone,
  FaExclamationCircle,
  FaSpinner,
  FaArrowLeft,
  FaCheck,
  FaGlobeAmericas
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearProfesionalModal = ({ onClose, onCreate, consultorioID }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [matricula, setMatricula] = useState("");
  const [titulo, setTitulo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [slug, setSlug] = useState("");
  const [mensajeError, setMensajeError] = useState(null);
  const [creando, setCreando] = useState(false);

  const { especialidades, isLoading: loading, error: hookError } = useAllEspecialidades();
  const API_URL = import.meta.env.VITE_API_URL;

  const generarSlug = (titulo, nombre, apellido) => {
    if (!titulo || !nombre || !apellido) return "";
    const titulosMap = { doctor: "dr", doctora: "dra", licenciado: "lic", licenciada: "lic" };
    const abreviatura = titulosMap[titulo.toLowerCase()] || "prof";
    const n = nombre.trim().toLowerCase();
    const a = apellido.trim().toLowerCase();
    const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return [abreviatura, normalizar(n), normalizar(a)].join("-");
  };

  useEffect(() => {
    if (titulo && nombre && apellido) {
      setSlug(generarSlug(titulo, nombre, apellido));
    } else {
      setSlug("");
    }
  }, [titulo, nombre, apellido]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null);

    if (!nombre.trim() || !apellido.trim()) return setMensajeError("Nombre y apellido son obligatorios.");
    if (!especialidad) return setMensajeError("Debe seleccionar una especialidad.");
    if (!/^\d{4,5}$/.test(matricula.trim())) return setMensajeError("La matrícula debe tener entre 4 y 5 dígitos.");
    if (telefono.replace(/\D/g, "").length !== 10) return setMensajeError("El teléfono debe tener 10 dígitos.");

    setCreando(true);
    try {
      const nuevoProfesional = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        especialidad,
        titulo,
        matricula: matricula.trim(),
        telefono: telefono.replace(/\D/g, ""),
        consultorioID,
        slug,
      };

      await axios.post(`${API_URL}/api/crear-y-vincular-profesional`, nuevoProfesional);

      toast.success("✅ ¡Profesional creado con éxito!");
      setTimeout(() => {
        onClose();
        onCreate?.();
        setCreando(false);
      }, 1500);
    } catch (err) {
      setMensajeError(err.response?.data?.message || "Error al crear el profesional");
      setCreando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in font-sans">
      <ToastContainer position="bottom-right" autoClose={1000} />

      {/* HEADER PREMIUM SLATE/INDIGO */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20">
              <FaUserMd className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Registro de Staff</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2 italic">Creación y alta de profesional</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-4xl font-light p-2 transition-colors">
          <FaTimes />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8 pb-20">
          
          <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
            
            {/* CARD 1: IDENTIDAD PROFESIONAL */}
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
              <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-5 uppercase tracking-tighter">
                <FaIdCard className="text-indigo-600" /> Datos de Identidad
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Apellido *</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Pérez"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Título Académico</label>
                  <select
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="doctor">Doctor</option>
                    <option value="doctora">Doctora</option>
                    <option value="licenciado">Licenciado</option>
                    <option value="licenciada">Licenciada</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-indigo-600 flex items-center gap-2">
                    <FaGlobeAmericas /> Slug de Perfil (URL)
                  </label>
                  <div className="px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-xs break-all border border-indigo-100">
                    {slug ? `turnate.site/p/${slug}` : "Esperando datos..."}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: ESPECIALIDAD Y MATRÍCULA */}
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
              <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-5 uppercase tracking-tighter">
                <FaStethoscope className="text-indigo-600" /> Especialidad y Contacto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Especialidad Médica *</label>
                  <select
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{loading ? "Cargando..." : "Elegir especialidad..."}</option>
                    {especialidades?.map((esp) => (
                      <option key={esp.id} value={esp.nombre}>{esp.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Matrícula (4-5 dígitos) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={matricula}
                    onChange={(e) => /^\d{0,5}$/.test(e.target.value) && setMatricula(e.target.value)}
                    placeholder="12345"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-green-600 flex items-center gap-2">
                    <FaPhone /> WhatsApp / Celular (10 dígitos) *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-indigo-600 transition-colors">+54 9</span>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                      placeholder="381 000 0000"
                      maxLength="10"
                      className="w-full pl-20 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                    />
                  </div>
                  {telefono && telefono.length !== 10 && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter ml-2 mt-2">Debe tener exactamente 10 dígitos</p>
                  )}
                </div>
              </div>
            </div>

            {/* ERROR FEEDBACK */}
            {(mensajeError || hookError) && (
              <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] text-red-600 font-black flex items-center gap-4 animate-shake shadow-sm">
                <FaExclamationCircle className="text-2xl flex-shrink-0" />
                <p className="tracking-tight uppercase text-xs">{mensajeError || "Error al cargar datos necesarios."}</p>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row gap-5">
              <button
                type="button"
                onClick={onClose}
                disabled={creando}
                className="flex-1 py-6 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-3xl font-black tracking-widest uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creando || loading}
                className={`flex-[2] py-6 px-8 rounded-3xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3
                  ${creando ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'}`}
              >
                {creando ? (
                  <><FaSpinner className="animate-spin" /> PROCESANDO...</>
                ) : (
                  <><FaCheck /> FINALIZAR CREACIÓN</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CrearProfesionalModal;