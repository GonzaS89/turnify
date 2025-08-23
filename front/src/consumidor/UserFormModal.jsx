import { useState, useEffect } from 'react';
import useCoberturaxIdConsultorio from '../../customHooks/useCoberturaxIdConsultorio';
import { useParams, useNavigate } from 'react-router';
import { FaUser, FaIdCard, FaPhone, FaShieldAlt, FaTimes, FaExclamationCircle, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserFormModal = ({ onSubmit }) => {
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
    setIsConfirm(true)

    if (formData.nombre.trim().length < 2) {
      toast.error('El nombre es demasiado corto.');
      return;
    }

    if (formData.apellido.trim().length < 2) {
      toast.error('El apellido es demasiado corto.');
      return;
    }

    if (formData.dni.length < 7 || formData.dni.length > 8) {
      toast.error('El DNI debe tener entre 7 y 8 dígitos.');
      return;
    }

    if (formData.telefono.length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos.');
      return;
    }

    if (!formData.selectedOption) {
      toast.warn('Por favor, selecciona una cobertura médica.');
      return;
    }

    onSubmit(formData);
    setTimeout(() => {
      navigate(`/confirmacionturno/${consultorioId}/${profesionalId}`);
      setIsConfirm(false)
    }, 1000);
  };

  return (
<div className="fixed inset-0 z-[300] flex items-center justify-center bg-black bg-opacity-50 p-4">
<div className="bg-white rounded-2xl shadow-2xl w-screen sm:max-w-lg h-[90dvh] sm:max-h-[80vh] flex flex-col">
        
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUser className="text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">Confirma tus Datos</h2>
                <p className="text-blue-100 text-sm opacity-90">Completa para confirmar tu turno</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Cerrar"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Cuerpo del formulario */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} id="user-form" className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-blue-500" /> Nombre *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
                  required
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Apellido */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-blue-500" /> Apellido *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                  required
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* DNI */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaIdCard className="text-green-500" /> DNI (7-8 dígitos) *
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
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition"
                  required
                />
                <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <p className="text-gray-500 text-xs mt-1">Solo números. No incluyas puntos.</p>
            </div>

            {/* Teléfono */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition"
                  required
                />
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <p className="text-gray-500 text-xs mt-1">Sin 0, sin 15. Ej: 1112345678</p>
            </div>

            {/* Cobertura Médica */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaShieldAlt className="text-purple-500" /> Cobertura Médica *
              </label>

              {isLoadingOptions ? (
                <div className="py-4 text-center bg-blue-50 rounded-xl border border-blue-200">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-blue-700 text-sm">Cargando coberturas...</p>
                </div>
              ) : errorOptions ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                  <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error al cargar coberturas</p>
                    <p className="mt-1">{errorOptions}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    name="selectedOption"
                    value={formData.selectedOption}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none transition"
                    required
                  >
                    <option value="" disabled>Seleccionar cobertura</option>
                    <option value="particular">Particular</option>
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.nombre === opt.siglas ? opt.nombre : opt.nombre - opt.siglas}
                      </option>
                    ))}
                  </select>
                  <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="user-form"
            className={`flex-1 py-3 px-4  text-white rounded-xl  ${isConfirm ? 'bg-gray-300' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed'}`}
          >
            {isConfirm ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Enviando ...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <FaCheck className="inline mr-2" /> Confirmar
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;