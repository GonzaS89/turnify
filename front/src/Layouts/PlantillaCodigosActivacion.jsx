import { useState } from "react";
import useAllCodigosActivacion from "../../customHooks/useAllCodigosActivacion";
import { FaWhatsapp, FaCopy, FaLink, FaCircleNotch, FaTicketAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URL_BASE = 'https://turnate.site/crearperfil';

const PlantillaCodigosActivacion = () => {
  const { codigosActivacion, isLoading, error } = useAllCodigosActivacion();
  const [numero, setNumero] = useState("");
  const [errorNumero, setErrorNumero] = useState("");

  // Función para copiar cualquier código al portapapeles
  const copiarAlPortapapeles = (codigo) => {
    const urlCompleta = `${URL_BASE}/${codigo}`;
    navigator.clipboard
      .writeText(urlCompleta)
      .then(() => toast.info(`Copiado: ${codigo}`))
      .catch(() => toast.error("Error al copiar"));
  };

  // Función para enviar un código específico por WhatsApp
  const enviarWhatsAppEspecifico = (codigo) => {
    const numeroLimpio = numero.replace(/\D/g, "");
    if (!numeroLimpio || numeroLimpio.length < 8) {
      setErrorNumero("Ingresa un número válido antes de enviar.");
      toast.warning("Falta el número de teléfono");
      return;
    }

    const urlCompleta = `${URL_BASE}/${codigo}`;
    const mensaje = encodeURIComponent(
      `Hola 👋 Usa este enlace para activar tu cuenta en Turnate:\n\n${urlCompleta}`
    );
    window.open(`https://wa.me/${numeroLimpio}?text=${mensaje}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 text-slate-800">
      <header className="text-center mb-8">
        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
          Panel de <span className="text-indigo-600">Accesos</span>
        </h2>
        <p className="text-slate-500 font-medium">Lista de códigos disponibles para activación</p>
      </header>

      {/* Input de número de teléfono (Global para la sesión) */}
      <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">
          Número del Destinatario (Opcional para WhatsApp)
        </label>
        <input
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ej: 549381..."
          className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all"
        />
        {errorNumero && <p className="mt-2 text-xs font-bold text-red-500">{errorNumero}</p>}
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 p-8 text-indigo-600 font-bold">
          <FaCircleNotch className="animate-spin" size={24} />
          <span>Cargando códigos...</span>
        </div>
      )}

      {/* Listado de Códigos */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {codigosActivacion && codigosActivacion.length > 0 ? (
          codigosActivacion.map((item, index) => (
            <div 
              key={index} 
              className="group flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FaTicketAlt size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Código Disponible</p>
                  <code className="text-lg font-bold text-slate-700">{item.codigos}</code>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* Botón Copiar */}
                <button
                  onClick={() => copiarAlPortapapeles(item.codigos)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                  title="Copiar Link"
                >
                  <FaCopy /> <span className="md:hidden lg:inline text-sm">Copiar</span>
                </button>

                {/* Botón WhatsApp */}
                <button
                  onClick={() => enviarWhatsAppEspecifico(item.codigos)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all"
                  title="Enviar por WhatsApp"
                >
                  <FaWhatsapp size={18} /> <span className="md:hidden lg:inline text-sm">Enviar</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          !isLoading && (
            <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-[2rem]">
              <p className="text-slate-400 font-medium">No hay códigos disponibles en la base de datos.</p>
            </div>
          )
        )}
      </div>

      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />
    </section>
  );
};

export default PlantillaCodigosActivacion;