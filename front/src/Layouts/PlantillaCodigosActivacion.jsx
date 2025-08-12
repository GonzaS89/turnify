import { useState } from "react";
import useAllCodigosActivacion from "../../customHooks/useAllCodigosActivacion";
import { FaWhatsapp, FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Opcional: para notificaciones
import "react-toastify/dist/ReactToastify.css"; // Estilos de toast

const URL = 'https://yatenesturno-pruebas.netlify.app/crearconsultorio'

const PlantillaCodigosActivacion = () => {
  const { codigosActivacion, isLoading, error } = useAllCodigosActivacion();
  const [urlMostrada, setUrlMostrada] = useState(null);
  const [numero, setNumero] = useState("");
  const [errorNumero, setErrorNumero] = useState("");

  const mostrarPrimerCodigo = () => {
    if (codigosActivacion && codigosActivacion.length > 0) {
      const codigo = codigosActivacion[0].codigos;
      setUrlMostrada(`${URL}/${codigo}`);
    }
  };

  const validarNumero = (num) => {
    // Permite solo números, al menos 8 dígitos, máximo 15
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

    const numeroLimpio = numero.replace(/\D/g, ""); // Solo números

    if (!validarNumero(numeroLimpio)) {
      setErrorNumero("Por favor ingresa un número válido.");
      return;
    }

    const mensaje = encodeURIComponent(
      `Hola 👋 Usa este enlace para activar tu cuenta:\n\n${urlMostrada}`
    );
    const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${mensaje}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success(`Mensaje listo para enviar a ${numeroLimpio}`);
  };

  const copiarUrl = () => {
    if (urlMostrada) {
      navigator.clipboard
        .writeText(urlMostrada)
        .then(() => toast.info("URL copiada al portapapeles"))
        .catch(() => toast.error("Error al copiar"));
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-12 p-8 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Activación Rápida
      </h2>

      {/* Estado de carga o error */}
      {isLoading && (
        <div className="mb-6 p-4 text-center bg-yellow-50 text-yellow-700 rounded-lg font-medium animate-pulse">
          🕒 Cargando códigos...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 text-center bg-red-50 text-red-600 rounded-lg font-medium border border-red-200">
          ❌ Error: {error.message}
        </div>
      )}

      {/* URL generada */}
      {urlMostrada ? (
        <div className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-indigo-200 transition-all hover:shadow-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enlace de activación:
          </label>
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg text-indigo-800 text-sm break-all">
            <span>{urlMostrada}</span>
            <button
              onClick={copiarUrl}
              className="flex-shrink-0 text-indigo-500 hover:text-indigo-700 transition"
              aria-label="Copiar URL"
            >
              <FaCopy size={16} />
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-6 text-gray-400 text-center italic">
          Genera la URL para comenzar.
        </p>
      )}

      {/* Botón para generar URL */}
      <button
        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-6
          ${isLoading || !!error || (codigosActivacion && codigosActivacion.length === 0)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
          }`}
        onClick={mostrarPrimerCodigo}
        disabled={isLoading || !!error || (codigosActivacion && codigosActivacion.length === 0)}
      >
        {isLoading ? (
          "Cargando..."
        ) : urlMostrada ? (
          "Actualizar URL"
        ) : (
          "Generar URL de Activación"
        )}
      </button>

      {/* Input de número de WhatsApp */}
      <div className="mb-6">
        <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
          Número de WhatsApp (con código de país)
        </label>
        <input
          id="numero"
          type="text"
          value={numero}
          onChange={handleNumeroChange}
          placeholder="Ej: 5491123456789"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition
            ${errorNumero
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
            }`}
        />
        {errorNumero && <p className="mt-1 text-sm text-red-500">{errorNumero}</p>}
      </div>

      {/* Botón de enviar por WhatsApp */}
      <button
        className={`w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
          ${urlMostrada && !errorNumero && numero
            ? "bg-green-600 hover:bg-green-700 shadow-md"
            : "bg-gray-400 cursor-not-allowed"
          }`}
        onClick={enviarPorWhatsApp}
        disabled={!urlMostrada || !!errorNumero || !numero.trim()}
      >
        <FaWhatsapp size={20} />
        Enviar por WhatsApp
      </button>

      {/* Toastify para notificaciones */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </section>
  );
};

export default PlantillaCodigosActivacion;