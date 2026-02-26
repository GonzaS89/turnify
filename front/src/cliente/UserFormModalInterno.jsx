import { useState, useEffect } from 'react';
import useCoberturaxIdConsultorio from '../../customHooks/useCoberturaxIdConsultorio';
import useObtenerPacientesxIDConsultorio from '../../customHooks/useObtenerPacientesxIDConsultorio';
import { useParams, useNavigate } from 'react-router';
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaShieldAlt,
  FaTimes,
  FaExclamationCircle,
  FaCheck,
  FaAngleLeft,
  FaSearch,
  FaPlus
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserFormModalInterno = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    selectedOption: '',
  });

  const [showPacientesModal, setShowPacientesModal] = useState(false);
  const navigate = useNavigate();
  const { consultorioId, profesionalId } = useParams();

  const { coberturas } = useCoberturaxIdConsultorio(consultorioId);
  const { pacientes, isLoading: isLoadingPacientes, error: errorPacientes } = useObtenerPacientesxIDConsultorio(consultorioId);

  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [errorOptions, setErrorOptions] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  useEffect(() => {
    setIsLoadingOptions(true);
    if (coberturas) {
      if (Array.isArray(coberturas)) {
        setOptions(coberturas);
      } else {
        setErrorOptions("Formato de coberturas incorrecto.");
      }
    }
    setIsLoadingOptions(false);
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
      setIsConfirm(false);
      return;
    }
    if (formData.dni.length < 7) {
      toast.error('DNI inválido.');
      setIsConfirm(false);
      return;
    }
    if (formData.telefono.length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos.');
      setIsConfirm(false);
      return;
    }
    if (!formData.selectedOption) {
      toast.warn('Selecciona una cobertura.');
      setIsConfirm(false);
      return;
    }

    onSubmit(formData);
    setTimeout(() => {
      navigate(`/micuenta/confirmacionturno/${consultorioId}/${profesionalId}`);
    }, 1000);
  };

  const handleSelectPaciente = (paciente) => {
    setFormData((prev) => ({
      ...prev,
      nombre: paciente.nombre || '',
      apellido: paciente.apellido || '',
      dni: paciente.dni || '',
      telefono: paciente.telefono || '',
    }));
    setShowPacientesModal(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in font-sans">
      
      {/* HEADER PREMIUM */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaAngleLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <FaUser className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Datos del Paciente</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2">Asignación interna de turno</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-4xl font-light p-2">
          <FaTimes />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto py-10 px-6 flex flex-col items-center bg-slate-50">
        <div className="w-full max-w-4xl space-y-8 pb-20">
          
          {/* BUSCADOR DE PACIENTES FRECUENTES */}
          <button
            onClick={() => setShowPacientesModal(true)}
            className="w-full group bg-white p-6 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-between hover:border-indigo-400 hover:bg-indigo-50/30 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-500">
                <FaSearch size={20} />
              </div>
              <div>
                <p className="text-slate-800 font-black text-lg tracking-tight">Cargar paciente frecuente</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                  {pacientes?.length || 0} pacientes registrados en este consultorio
                </p>
              </div>
            </div>
            <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">Ver Lista</span>
          </button>

          <form onSubmit={handleSubmit} id="user-form" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            
            {/* NOMBRE Y APELLIDO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FaUser className="text-indigo-600" /> Nombre *
                </label>
                <input
                  type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                  placeholder="Ej: Juan"
                  className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-lg text-slate-700 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FaUser className="text-indigo-600" /> Apellido *
                </label>
                <input
                  type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                  placeholder="Ej: Pérez"
                  className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-lg text-slate-700 shadow-inner"
                  required
                />
              </div>
            </div>

            {/* DNI Y TELÉFONO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FaIdCard className="text-indigo-600" /> DNI *
                </label>
                <input
                  type="text" name="dni" value={formData.dni} onChange={handleChange}
                  placeholder="34567890" maxLength="8"
                  className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-xl text-slate-700 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FaPhone className="text-indigo-600" /> Teléfono *
                </label>
                <input
                  type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                  placeholder="1112345678" maxLength="10"
                  className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-xl text-slate-700 shadow-inner"
                  required
                />
              </div>
            </div>

            {/* COBERTURA */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaShieldAlt className="text-indigo-600" /> Cobertura Médica *
              </label>
              {isLoadingOptions ? (
                <div className="p-5 bg-slate-50 rounded-2xl animate-pulse text-slate-400 font-bold">Cargando coberturas...</div>
              ) : (
                <select
                  name="selectedOption" value={formData.selectedOption} onChange={handleChange}
                  className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-lg text-slate-700 appearance-none shadow-inner"
                  required
                >
                  <option value="" disabled>Seleccionar cobertura</option>
                  <option value="particular">Particular</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nombre === opt.siglas ? opt.nombre : `${opt.siglas} - ${opt.nombre}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </form>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col md:flex-row gap-5">
            <button
              type="button" onClick={() => navigate(-1)}
              className="flex-1 py-6 px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-3xl font-black tracking-widest uppercase hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit" form="user-form" disabled={isConfirm}
              className={`flex-[2] py-6 px-8 rounded-3xl font-black tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3
                ${isConfirm 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'}`}
            >
              {isConfirm ? "ENVIANDO..." : <><FaCheck /> SIGUIENTE</>}
            </button>
          </div>
        </div>
      </main>

      {/* MODAL LISTA DE PACIENTES */}
      {showPacientesModal && (
        <div className="fixed inset-0 z-[400] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowPacientesModal(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">Pacientes del Consultorio</h3>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">Selecciona para cargar datos automáticamente</p>
              </div>
              <button onClick={() => setShowPacientesModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-2xl">
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/50">
              {isLoadingPacientes ? (
                <div className="flex flex-col items-center py-12 text-slate-400 font-black uppercase text-xs">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
                  Cargando...
                </div>
              ) : pacientes?.length > 0 ? (
                pacientes.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPaciente(p)}
                    className="w-full bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-indigo-400 hover:shadow-lg transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{p.apellido}, {p.nombre}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <FaIdCard className="text-indigo-400" /> {p.dni}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <FaPhone className="text-indigo-400" /> {p.telefono}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white p-3 rounded-xl transition-all">
                      <FaPlus />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-slate-300 font-black uppercase text-xs tracking-widest">No hay pacientes registrados</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFormModalInterno;