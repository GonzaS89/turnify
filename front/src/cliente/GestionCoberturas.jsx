import { useState, useEffect } from "react";
import useCoberturaxIdConsultorio from "../../customHooks/useCoberturaxIdConsultorio";
import useAllCoberturas from "../../customHooks/useAllCoberturas";
import {
  FaSearch,
  FaPlusCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaArrowLeft,
  FaShieldAlt,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const GestionCoberturas = () => {
  const { consultorioId } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isRemoving, setIsRemoving] = useState(null);
  const [isAdding, setIsAdding] = useState(null);
  const [showModalAccion, setShowModalAccion] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [coberturaToDelete, setCoberturaToDelete] = useState(null);

  const {
    coberturas: activeCoberturas,
    isLoading,
    error,
    refetch,
  } = useCoberturaxIdConsultorio(consultorioId);
  const { coberturas: allCoberturas, isLoading: isLoadingAll } = useAllCoberturas();

  const API_URL = import.meta.env.VITE_API_URL;

  const activeCoverageIds = new Set(activeCoberturas?.map((c) => c.id) || []);
  const filteredAllCoberturas =
    allCoberturas?.filter(
      (cobertura) =>
        cobertura.siglas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cobertura.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const availableCoberturasToAdd = filteredAllCoberturas.filter(
    (c) => !activeCoverageIds.has(c.id)
  );
  const isLoadingState = isLoading || isLoadingAll;

  const handleOpenConfirmModal = (coberturaId, siglas) => {
    setCoberturaToDelete({ id: coberturaId, siglas });
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!coberturaToDelete) return;
    const { id, siglas } = coberturaToDelete;
    setIsRemoving(id);

    try {
      await axios.delete(`${API_URL}/api/borrarCoberturaDeConsulotorio/${id}/${consultorioId}`);
      toast.warn(<div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><FaTimesCircle /> Eliminando {siglas}...</div>);

      setTimeout(() => {
        refetch();
        setIsRemoving(null);
        setShowConfirmModal(false);
        setCoberturaToDelete(null);
      }, 1500);
    } catch (err) {
      toast.error(`❌ Error al eliminar`);
      setIsRemoving(null);
    }
  };

  const handleAddCobertura = async (coberturaId, siglas) => {
    setIsAdding(coberturaId);
    setShowModalAccion(true);
    try {
      await axios.post(`${API_URL}/api/agregarCoberturaAlConsultorio/${coberturaId}/${consultorioId}`);
      toast.success(<div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><FaCheckCircle /> Vinculando {siglas}...</div>);

      setTimeout(() => {
        refetch();
        setIsAdding(null);
        setShowModalAccion(false);
      }, 1500);
    } catch (err) {
      toast.error(`❌ Error al añadir`);
      setIsAdding(null);
      setShowModalAccion(false);
    }
  };

  if (isLoadingState) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[400]">
        <FaSpinner className="animate-spin text-indigo-600 mb-4" size={50} />
        <p className="text-slate-800 font-black tracking-widest uppercase text-xs">Sincronizando Coberturas...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col h-screen w-full overflow-hidden animate-fade-in font-sans">
      <ToastContainer position="bottom-right" autoClose={1000} theme="colored" />

      {/* HEADER PREMIUM SLATE/INDIGO */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/micuenta")} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl hidden md:block shadow-lg shadow-indigo-500/20">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Gestión de Seguros</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2 italic">Administración de Obras Sociales</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/micuenta")} className="text-slate-400 hover:text-white text-4xl font-light p-2 transition-colors">
          <FaTimes />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-12 pb-20">
          
          {/* SECCIÓN: COBERTURAS ACTIVAS */}
          <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 animate-slide-up">
            <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 border-b border-slate-100 pb-5 uppercase tracking-tighter">
              <FaCheckCircle className="text-green-500" /> Coberturas Activas en Consultorio
            </h3>
            
            {activeCoberturas && activeCoberturas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeCoberturas.map((cobertura) => (
                  <div key={cobertura.id} className="group relative bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl flex items-center justify-between hover:border-red-200 hover:bg-red-50 transition-all duration-300">
                    <div>
                      <p className="font-black text-slate-800 text-lg tracking-tighter uppercase">{cobertura.siglas}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{cobertura.nombre}</p>
                    </div>
                    <button
                      onClick={() => handleOpenConfirmModal(cobertura.id, cobertura.siglas)}
                      className="p-3 bg-white text-slate-300 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-center flex flex-col items-center gap-4">
                <FaShieldAlt className="text-slate-100 text-6xl" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No hay coberturas vinculadas actualmente</p>
              </div>
            )}
          </section>

          {/* SECCIÓN: BÚSQUEDA Y ALTA */}
          <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-slate-800 text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                  <FaPlusCircle className="text-indigo-600" /> Vincular Nueva Cobertura
                </h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic ml-8">Busca en nuestra base de datos nacional</p>
              </div>
              
              <div className="relative w-full md:w-96 group">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="BUSCAR SIGLAS O NOMBRE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all uppercase tracking-widest shadow-inner"
                />
              </div>
            </div>

            {searchTerm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                {availableCoberturasToAdd.length > 0 ? (
                  availableCoberturasToAdd.map((cobertura) => (
                    <div key={cobertura.id} className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                      <div>
                        <p className="font-black text-slate-800 text-xl tracking-tighter">{cobertura.siglas}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cobertura.nombre}</p>
                      </div>
                      <button
                        onClick={() => handleAddCobertura(cobertura.id, cobertura.siglas)}
                        disabled={isAdding === cobertura.id}
                        className="px-6 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group-hover:scale-105"
                      >
                        {isAdding === cobertura.id ? 'VINCULANDO...' : 'VINCULAR'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center bg-slate-50 rounded-[2rem] font-black text-[10px] text-slate-400 uppercase tracking-widest border-2 border-slate-100">
                    No se encontraron resultados para "{searchTerm}"
                  </div>
                )}
              </div>
            )}
            
            {!searchTerm && (
              <div className="py-20 text-center space-y-4 opacity-30">
                <FaSearch className="mx-auto text-slate-200" size={60} />
                <p className="font-black text-xs uppercase tracking-[0.3em]">Utiliza el buscador para añadir convenios</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MODAL DE PROCESAMIENTO (AGREGAR) */}
      {showModalAccion && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center space-y-6 max-w-sm w-full">
            <FaSpinner className="animate-spin text-indigo-600 mx-auto" size={50} />
            <h4 className="text-xl font-black uppercase tracking-tighter text-slate-800">Actualizando Base de Datos</h4>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">Vinculando cobertura al centro médico...</p>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN (ELIMINAR) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-red-50" onClick={(e) => e.stopPropagation()}>
            <div className="bg-red-600 text-white p-8 pb-12 text-center space-y-4 relative">
              <FaExclamationTriangle className="mx-auto text-white" size={40} />
              <h3 className="text-2xl font-black uppercase tracking-tighter">¿Desvincular Cobertura?</h3>
              <p className="text-red-100 font-bold text-[10px] uppercase tracking-[0.2em] italic">Atención: Acción Irreversible</p>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-slate-500 font-medium text-center leading-relaxed">
                Estás por remover <span className="text-slate-800 font-black italic">{coberturaToDelete?.siglas}</span>. Los pacientes ya no podrán seleccionar este convenio en sus turnos.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleConfirmDelete} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-3">
                  {isRemoving ? <FaSpinner className="animate-spin" /> : 'CONFIRMAR DESVINCULACIÓN'}
                </button>
                <button onClick={() => setShowConfirmModal(false)} className="w-full py-5 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-800 transition-colors">CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCoberturas;