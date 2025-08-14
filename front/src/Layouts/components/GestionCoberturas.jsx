import { useState, useEffect } from 'react';
import useCoberturaxIdConsultorio from '../../../customHooks/useCoberturaxIdConsultorio';
import useAllCoberturas from '../../../customHooks/useAllCoberturas';
import { FaSearch, FaPlusCircle, FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GestionCoberturas = () => {
  const { consultorioId } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [isRemoving, setIsRemoving] = useState(null);
  const [isAdding, setIsAdding] = useState(null);

  // Nuevo: estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [coberturaToDelete, setCoberturaToDelete] = useState(null);

  const { coberturas: activeCoberturas, isLoading, error, refetch } = useCoberturaxIdConsultorio(consultorioId);
  const { coberturas: allCoberturas, isLoading: isLoadingAll } = useAllCoberturas();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Bloquea el scroll al montar
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Restaura el scroll al desmontar
    return () => {
      document.body.style.overflow = prevOverflow || 'auto';
    };
  }, []);

  const activeCoverageIds = new Set(activeCoberturas?.map(c => c.id) || []);
  const filteredAllCoberturas = allCoberturas?.filter(cobertura =>
    cobertura.siglas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cobertura.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const availableCoberturasToAdd = filteredAllCoberturas.filter(c => !activeCoverageIds.has(c.id));
  const isLoadingState = isLoading || isLoadingAll;

  // --- Abrir modal de confirmación ---
  const handleOpenConfirmModal = (coberturaId, siglas) => {
    setCoberturaToDelete({ id: coberturaId, siglas });
    setShowConfirmModal(true);
  };

  // --- Confirmar eliminación ---
  const handleConfirmDelete = async () => {
    if (!coberturaToDelete) return;

    const { id, siglas } = coberturaToDelete;
    setIsRemoving(id);

    try {
      await axios.delete(`${API_URL}/api/borrarCoberturaDeConsulotorio/${id}/${consultorioId}`);
      refetch();
      toast.success(
        <div className="flex items-center gap-2 text-sm">
          <FaCheckCircle /> Cobertura {siglas} eliminada
        </div>,
        { autoClose: 1500 }
      );
    } catch (err) {
      console.error('Error al eliminar cobertura:', err);
      toast.error(
        `❌ ${err.response?.data?.message || 'No se pudo eliminar la cobertura'}`
      );
    } finally {
      setIsRemoving(false);
      setShowConfirmModal(false);
      setCoberturaToDelete(null);
    }
  };

  // --- Cancelar eliminación ---
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setCoberturaToDelete(null);
  };

  // --- Añadir cobertura ---
  const handleAddCobertura = async (coberturaId, siglas) => {
    setIsAdding(coberturaId);
    try {
      await axios.post(`${API_URL}/api/agregarCoberturaAlConsultorio/${coberturaId}/${consultorioId}`);
      refetch();
      setSearchTerm('');
      toast.success(
        <div className="flex items-center gap-2 text-sm">
          <FaCheckCircle /> Cobertura {siglas} añadida
        </div>,
        { autoClose: 1500 }
      );
    } catch (err) {
      console.error('Error al añadir cobertura:', err);
      toast.error(
        `❌ ${err.response?.data?.message || 'No se pudo añadir la cobertura'}`
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center xl:p-4 z-[200]"
        onClick={() => navigate('/micuenta')}
      >
        <div
          className="bg-white xl:rounded-2xl shadow-2xl w-full xl:max-w-7xl h-screen xl:max-h-[90dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaCheckCircle className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Gestionar Coberturas</h3>
              </div>
              <button
                onClick={() => navigate('/micuenta')}
                disabled={isLoadingState}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-blue-100 mt-2 text-sm opacity-90">
              Añade o elimina coberturas médicas disponibles en tu consultorio.
            </p>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {isLoadingState ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Cargando coberturas...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                <FaTimesCircle className="text-red-500 mx-auto mb-3" size={24} />
                <p className="text-red-700 font-medium">Error al cargar datos</p>
                <p className="text-red-600 text-sm mt-1">{error.message}</p>
              </div>
            ) : (
              <>
                {/* Coberturas Activas */}
                <section>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Coberturas Activas
                  </h4>

                  {activeCoberturas && activeCoberturas.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {activeCoberturas.map((cobertura) => (
                        <div
                          key={cobertura.id}
                          className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:bg-green-100 transition"
                        >
                          <span className="font-semibold text-green-800 text-sm truncate">
                            {cobertura.siglas}
                          </span>
                          <button
                            onClick={() => handleOpenConfirmModal(cobertura.id, cobertura.siglas)}
                            disabled={isRemoving === cobertura.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition disabled:opacity-50"
                          >
                            {isRemoving === cobertura.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                            ) : (
                              <FaTimesCircle size={14} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                      <p className="text-gray-500 text-sm">No hay coberturas activas en este consultorio.</p>
                    </div>
                  )}
                </section>

                {/* Añadir Cobertura */}
                <section>
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaPlusCircle className="text-blue-500" /> Añadir Nueva Cobertura
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">Busca una cobertura para agregarla a tu lista.</p>

                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por sigla o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {searchTerm && (
                    <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 max-h-80 overflow-y-auto">
                      {availableCoberturasToAdd.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {availableCoberturasToAdd.map((cobertura) => (
                            <li
                              key={cobertura.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-100 transition"
                            >
                              <div>
                                <p className="font-semibold text-gray-800">{cobertura.siglas}</p>
                                <p className="text-xs text-gray-500">{cobertura.nombre}</p>
                              </div>
                              <button
                                onClick={() => handleAddCobertura(cobertura.id, cobertura.siglas)}
                                disabled={isAdding === cobertura.id}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-1"
                              >
                                {isAdding === cobertura.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div>
                                    Añadiendo...
                                  </>
                                ) : (
                                  "Añadir"
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-6">
                          {filteredAllCoberturas.length === 0
                            ? `No se encontraron coberturas para "${searchTerm}".`
                            : `Ya tienes todas las coberturas que coinciden con "${searchTerm}".`}
                        </p>
                      )}
                    </div>
                  )}

                  {!searchTerm && (
                    <p className="text-gray-400 text-sm text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl mt-4">
                      Escribe en el campo de arriba para comenzar a buscar.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <button
              onClick={() => navigate('/micuenta')}
              disabled={isLoadingState}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium disabled:opacity-70"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* === Modal de Confirmación para Eliminar Cobertura === */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[201]"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado rojo */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTimesCircle className="text-white" />
                <h3 className="text-2xl font-bold">Eliminar Cobertura</h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="p-6 space-y-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                ¿Estás seguro de que deseas eliminar la cobertura <strong>{coberturaToDelete?.siglas}</strong> del consultorio?
              </p>
             
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isRemoving}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRemoving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FaTimesCircle /> Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionCoberturas;