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
  const { consultorioId } = useParams();
  const { profesionalId } = useParams();

  const { coberturas } = useCoberturaxIdConsultorio(consultorioId);

  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [errorOptions, setErrorOptions] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  // Cargar coberturas y resetear formulario
  useEffect(() => {
    setIsLoadingOptions(true);
    setErrorOptions(null);

    if (coberturas) {
      if (Array.isArray(coberturas)) {
        setOptions(coberturas);
      } else {
        console.error("Coberturas no es un array:", coberturas);
        setErrorOptions("Formato de coberturas incorrecto.");
      }
    } else {
      setErrorOptions("No se encontraron coberturas disponibles.");
    }

    setIsLoadingOptions(false);

    // Resetear formulario
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      selectedOption: '',
    });
  }, [coberturas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dni') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 8) {
        setFormData((prev) => ({ ...prev, dni: numericValue }));
      }
      return;
    }

    if (name === 'telefono') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, telefono: numericValue }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirm(true);

    if (formData.nombre.trim().length < 2) {
      toast.error('El nombre es demasiado corto.');
      setIsConfirm(false);
      return;
    }

    if (formData.apellido.trim().length < 2) {
      toast.error('El apellido es demasiado corto.');
      setIsConfirm(false);
      return;
    }

    if (formData.dni.length < 7 || formData.dni.length > 8) {
      toast.error('El DNI debe tener entre 7 y 8 dígitos.');
      setIsConfirm(false);
      return;
    }

    if (formData.telefono.length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos.');
      setIsConfirm(false);
      return;
    }

    if (!formData.selectedOption) {
      toast.warn('Por favor, selecciona una cobertura médica.');
      setIsConfirm(false);
      return;
    }

    onSubmit(formData);
    setTimeout(() => {
      navigate(`/confirmacionturno/${consultorioId}/${profesionalId}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm lg:p-4 animate-fade-in">
      <div className="bg-white lg:rounded-2xl shadow-xl w-screen max-w-3xl h-[100dvh] lg:h-[95vh] lg:max-h-[90dvh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Cerrar"
          >
            <FaTimes size={20} />
          </button>

          <div className="flex items-center gap-3">
            <FaUser className="text-2xl" />
            <div>
              <h2 className="text-2xl font-bold">Confirma tus Datos</h2>
              <p className="text-blue-100 text-sm opacity-90">Completa para confirmar tu turno</p>
            </div>
          </div>
        </div>

        {/* Cuerpo del formulario */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
          <form onSubmit={handleSubmit} id="user-form" className="space-y-6">
            
            {/* Fila horizontal: Nombre + Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-blue-600" /> Nombre *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan"
                    className="w-full px-4 py-3 pl-11 pr-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-gray-800 font-medium"
                    required
                  />
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-indigo-600" /> Apellido *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                    className="w-full px-4 py-3 pl-11 pr-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow text-gray-800 font-medium"
                    required
                  />
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Fila horizontal: DNI + Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* DNI */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaIdCard className="text-green-600" /> DNI (7-8 dígitos) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength="8"
                    pattern="[0-9]{7,8}"
                    placeholder="Ej: 34567890"
                    className="w-full px-4 py-3 pl-11 pr-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow text-gray-800 font-medium"
                    required
                  />
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
                <p className="text-gray-500 text-xs mt-1">Solo números. Sin puntos ni guiones.</p>
              </div>

              {/* Teléfono */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-orange-500" /> Teléfono (10 dígitos) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    placeholder="Ej: 1112345678"
                    className="w-full px-4 py-3 pl-11 pr-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-shadow text-gray-800 font-medium"
                    required
                  />
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
                <p className="text-gray-500 text-xs mt-1">Sin 0 ni 15. Ej: 1112345678</p>
              </div>
            </div>

            {/* Cobertura Médica (siempre vertical por espacio) */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaShieldAlt className="text-purple-600" /> Cobertura Médica *
              </label>

              {isLoadingOptions ? (
                <div className="py-5 text-center bg-blue-50 rounded-xl border border-blue-200">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-blue-700 text-sm font-medium">Cargando coberturas...</p>
                </div>
              ) : errorOptions ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                  <FaExclamationCircle className="mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Error al cargar coberturas</p>
                    <p className="mt-1">{errorOptions}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    name="selectedOption"
                    value={formData.selectedOption}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 pr-10 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow text-gray-800 font-medium appearance-none"
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
                  <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Botones de acción */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex justify-center gap-2 text-base flex-1 py-3 px-4 items-center bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium"
            >
              <FaAngleLeft size={18}/>  Volver
            </button>
            <button
              type="submit"
              form="user-form"
              disabled={isConfirm}
              className={`
                flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300
                flex items-center justify-center gap-2
                ${isConfirm
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-100 shadow-md hover:shadow-lg'
                }
              `}
            >
              {isConfirm ? (
                <>
                  <div className="animate-spin rounded-full h-2 w-4 border-t-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <FaCheck size={18} />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFormModalHorizontal;