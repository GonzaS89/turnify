import { useState, useEffect } from 'react';
import useCoberturaxIdConsultorio from '../../customHooks/useCoberturaxIdConsultorio';
import { useParams, useNavigate } from 'react-router';
import { FaUser, FaIdCard, FaPhone, FaShieldAlt, FaTimes, FaExclamationCircle, FaCheck, FaAngleLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserFormModalHorizontal = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    selectedOption: '',
  });

  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();
  const { coberturas } = useCoberturaxIdConsultorio(consultorioId);

  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [errorOptions, setErrorOptions] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  useEffect(() => {
    setIsLoadingOptions(true);
    setErrorOptions(null);
    if (coberturas) {
      if (Array.isArray(coberturas)) {
        setOptions(coberturas);
      } else {
        setErrorOptions("Formato de coberturas incorrecto.");
      }
    } else {
      setErrorOptions("No se encontraron coberturas disponibles.");
    }
    setIsLoadingOptions(false);
    setFormData({ nombre: '', apellido: '', dni: '', telefono: '', selectedOption: '' });
  }, [coberturas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dni' || name === 'telefono') {
      const numericValue = value.replace(/\D/g, '');
      const limit = name === 'dni' ? 8 : 10;
      if (numericValue.length <= limit) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirm(true);
    if (formData.nombre.trim().length < 2 || formData.apellido.trim().length < 2) {
      toast.error('Nombre/Apellido demasiado corto.');
      setIsConfirm(false); return;
    }
    if (formData.dni.length < 7 || formData.dni.length > 8) {
      toast.error('DNI inválido.');
      setIsConfirm(false); return;
    }
    if (formData.telefono.length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos.');
      setIsConfirm(false); return;
    }
    if (!formData.selectedOption) {
      toast.warn('Selecciona una cobertura médica.');
      setIsConfirm(false); return;
    }
    onSubmit(formData);
    setTimeout(() => {
      navigate(`/confirmacionturno/${consultorioId}/${profesionalId}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in">
      
      {/* HEADER: Ajustado para mobile */}
      <header className="bg-slate-900 text-white p-4 md:p-6 md:px-12 flex items-center justify-between shadow-xl z-20">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate(-1)} className="p-2 md:p-3 hover:bg-white/10 rounded-full transition-all">
            <FaAngleLeft className="text-xl md:text-2xl" />
          </button>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="bg-indigo-600 p-3 md:p-4 rounded-xl md:rounded-2xl hidden sm:block">
              <FaUser className="text-xl md:text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-3xl font-black tracking-tight leading-none">Confirma tus Datos</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-sm tracking-widest mt-1 md:mt-2">Paso final para tu turno</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white text-2xl md:text-4xl font-light p-2">
          <FaTimes />
        </button>
      </header>

      {/* MAIN: Espaciado interno optimizado */}
      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col items-center py-6 md:py-10 px-4 md:px-6">
        <div className="w-full max-w-4xl space-y-6 md:space-y-8">
          
          <form onSubmit={handleSubmit} id="user-form" className="bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 md:space-y-10">
            
            {/* SECCIÓN: IDENTIDAD */}
            <div className="space-y-5 md:space-y-6">
              <h3 className="text-slate-800 text-lg md:text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-3 md:pb-4">
                <FaUser className="text-indigo-600" /> Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Nombre *</label>
                  <input
                    type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                    placeholder="Ej: Juan" required
                    className="w-full p-4 md:p-5 border-2 border-slate-100 rounded-xl md:rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-base md:text-lg text-slate-700"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Apellido *</label>
                  <input
                    type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                    placeholder="Ej: Pérez" required
                    className="w-full p-4 md:p-5 border-2 border-slate-100 rounded-xl md:rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-base md:text-lg text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: CONTACTO Y DOC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">DNI (7-8 dígitos) *</label>
                <div className="relative">
                  <FaIdCard className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 text-lg md:text-xl" />
                  <input
                    type="text" name="dni" value={formData.dni} onChange={handleChange}
                    inputMode="numeric" maxLength="8" placeholder="34567890" required
                    className="w-full p-4 md:p-5 pl-12 md:pl-14 border-2 border-slate-100 rounded-xl md:rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-base md:text-lg text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Teléfono (10 dígitos) *</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 text-lg md:text-xl" />
                  <input
                    type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                    inputMode="numeric" maxLength="10" placeholder="1112345678" required
                    className="w-full p-4 md:p-5 pl-12 md:pl-14 border-2 border-slate-100 rounded-xl md:rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-base md:text-lg text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: COBERTURA */}
            <div className="space-y-4 md:space-y-5">
              <label className="text-slate-800 text-lg md:text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-3 md:pb-4">
                <FaShieldAlt className="text-indigo-600" /> Cobertura Médica
              </label>

              {isLoadingOptions ? (
                <div className="p-6 md:p-8 text-center bg-indigo-50 rounded-xl md:rounded-2xl animate-pulse">
                  <p className="text-indigo-600 font-bold text-sm md:text-base">Cargando coberturas disponibles...</p>
                </div>
              ) : errorOptions ? (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl md:rounded-2xl text-red-600 font-bold flex items-center gap-3 text-sm md:text-base">
                  <FaExclamationCircle className="shrink-0" /> {errorOptions}
                </div>
              ) : (
                <select
                  name="selectedOption" value={formData.selectedOption} onChange={handleChange} required
                  className="w-full p-4 md:p-6 border-2 border-slate-100 rounded-xl md:rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-base md:text-lg text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Seleccionar cobertura</option>
                  <option value="particular">Particular</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.siglas} - {opt.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </form>

          {/* BOTONES DE ACCIÓN: Apilados en mobile, horizontales en desktop */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 pb-16 md:pb-20">
            <button
              type="button" onClick={() => navigate(-1)}
              className="w-full md:flex-1 py-4 md:py-5 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-xl md:rounded-2xl font-black tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
            >
              <FaAngleLeft /> VOLVER
            </button>
            <button
              type="submit" form="user-form" disabled={isConfirm}
              className={`w-full md:flex-[2] py-4 md:py-5 px-8 rounded-xl md:rounded-2xl font-black tracking-[0.15em] md:tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3 text-sm md:text-base
                ${isConfirm 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-[0.98]'}`}
            >
              {isConfirm ? 'ENVIANDO...' : <><FaCheck /> CONFIRMAR TURNO</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserFormModalHorizontal;