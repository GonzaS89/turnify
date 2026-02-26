import { useState } from "react";
import useAllCodigosActivacion from "../../customHooks/useAllCodigosActivacion";
import { FaWhatsapp, FaCopy, FaLink, FaCircleNotch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URL = 'https://turnate.site/crearperfil';

const PlantillaCodigosActivacion = () => {
  const { codigosActivacion, isLoading, error } = useAllCodigosActivacion();
  const [urlMostrada, setUrlMostrada] = useState(null);
  const [numero, setNumero] = useState("");
  const [errorNumero, setErrorNumero] = useState("");

  const mostrarPrimerCodigo = () => {
    if (codigosActivacion && codigosActivacion.length > 0) {
      const codigo = codigosActivacion[0].codigos;
      setUrlMostrada(`${URL}/${codigo}`);
      toast.success("Enlace generado correctamente");
    }
  };

  const validarNumero = (num) => {
    const soloNumeros = num.replace(/\D/g, "");
    return soloNumeros.length >= 8 && soloNumeros.length <= 15;
  };

  const handleNumeroChange = (e) => {
    const value = e.target.value;
    setNumero(value);
    if (value && !validarNumero(value)) {
      setErrorNumero("El número debe tener entre 8 y 15 dígitos.");
    } else {
      setErrorNumero("");
    }
  };

  const enviarPorWhatsApp = () => {
    if (!urlMostrada) return;
    const numeroLimpio = numero.replace(/\D/g, "");

    if (!validarNumero(numeroLimpio)) {
      setErrorNumero("Ingresa un número válido.");
      return;
    }

    const mensaje = encodeURIComponent(
      `Hola 👋 Usa este enlace para activar tu cuenta en Turnate:\n\n${urlMostrada}`
    );
    const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${mensaje}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const copiarUrl = () => {
    if (urlMostrada) {
      navigator.clipboard
        .writeText(urlMostrada)
        .then(() => toast.info("Copiado al portapapeles"))
        .catch(() => toast.error("Error al copiar"));
    }
  };

  return (
    <section className="max-w-xl mx-auto mt-10 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 text-slate-800">
      {/* Título con estilo font-black y colores Slate/Indigo */}
      <header className="text-center mb-10">
        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
          Activación <span className="text-indigo-600">Express</span>
        </h2>
        <p className="text-slate-500 font-medium">Gestión de accesos para nuevos profesionales</p>
      </header>

      {/* Estado de carga */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold animate-pulse">
          <FaCircleNotch className="animate-spin" />
          <span>Sincronizando códigos...</span>
        </div>
      )}

      {/* URL generada con estilo de tarjeta interna Premium */}
      <div className="mb-8">
        {urlMostrada ? (
          <div className="p-6 bg-slate-50 rounded-3xl border border-indigo-100 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-600">
              <FaLink size={14} />
              <span className="text-xs font-black uppercase tracking-widest">Enlace de Invitación</span>
            </div>
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <code className="text-indigo-600 font-bold truncate text-sm">{urlMostrada}</code>
              <button
                onClick={copiarUrl}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                title="Copiar Enlace"
              >
                <FaCopy size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-[2rem]">
            <p className="text-slate-400 font-medium">No hay ningún enlace activo actualmente</p>
          </div>
        )}
      </div>

      {/* Botón Principal: Generar */}
      <button
        className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all mb-8 shadow-lg
          ${isLoading || !!error || (codigosActivacion && codigosActivacion.length === 0)
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-indigo-600 text-white hover:bg-slate-900 hover:scale-[1.02] active:scale-95 shadow-indigo-200"
          }`}
        onClick={mostrarPrimerCodigo}
        disabled={isLoading || !!error || (codigosActivacion && codigosActivacion.length === 0)}
      >
        {urlMostrada ? "ACTUALIZAR ENLACE" : "GENERAR NUEVO ACCESO"}
      </button>

      {/* Sección de Envío WhatsApp */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div>
          <label htmlFor="numero" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 ml-2">
            Número del Profesional
          </label>
          <input
            id="numero"
            type="text"
            value={numero}
            onChange={handleNumeroChange}
            placeholder="Ej: 549381..."
            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl font-bold focus:outline-none transition-all
              ${errorNumero 
                ? "border-red-400 text-red-600" 
                : "border-transparent focus:border-indigo-600 focus:bg-white text-slate-800"
              }`}
          />
          {errorNumero && <p className="mt-2 ml-2 text-xs font-bold text-red-500 italic">{errorNumero}</p>}
        </div>

        <button
          className={`w-full py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-3 transition-all
            ${urlMostrada && !errorNumero && numero
              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          onClick={enviarPorWhatsApp}
          disabled={!urlMostrada || !!errorNumero || !numero.trim()}
        >
          <FaWhatsapp size={22} />
          ENVIAR POR WHATSAPP
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />
    </section>
  );
};

export default PlantillaCodigosActivacion;