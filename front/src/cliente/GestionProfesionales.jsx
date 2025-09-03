// src/components/GestionProfesionales.jsx
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Iconos
import {
  
FaCalendarAlt,
  FaEdit,
  FaTrashAlt,
  FaUserMd,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
  FaSpinner,
  FaUserPlus,
  FaList,
  FaThLarge,
} from "react-icons/fa";

// Hook personalizado
import useProfesionalxIdConsultorio from "../../customHooks/useProfesionalxIdConsultorio";

// Componentes
import AsociarProfesionalAConsultorio from "./AsociarProfesionalAConsultorio";

const GestionProfesionales = ({ profesionalVinculado, consultorioTipo }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { consultorioId } = useParams();
  const navigate = useNavigate();

  const [refreshProfesionales, setRefreshProfesionales] = useState(0);
  const [idsProfesionalesVinculados, setIdsProfesionalesVinculados] = useState([]);
  const [orden, setOrden] = useState("nombre");
  const [direccion, setDireccion] = useState("asc");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" o "cards"
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const {
    profesional: profesionales,
    isLoading,
    error,
  } = useProfesionalxIdConsultorio(consultorioId, refreshProfesionales);

  // Actualizar lista de IDs vinculados
  useEffect(() => {
    if (profesionales) {
      setIdsProfesionalesVinculados(profesionales.map((p) => p.id));
    }
  }, [profesionales]);

  // Cambiar vista según tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "cards" : "table");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refrescarListaProfesionales = () => {
    setRefreshProfesionales((prev) => prev + 1);
  };

  // Obtener especialidades únicas
  const especialidades = [
    ...new Set(profesionales?.map((p) => p.especialidad).filter(Boolean) || []),
  ].sort();

  // Filtrar y ordenar
  const profesionalesFiltradosYOrdenados = profesionales
    ? profesionales
        .filter(
          (p) =>
            !filtroEspecialidad || p.especialidad === filtroEspecialidad
        )
        .sort((a, b) => {
          let comparison = 0;
          if (orden === "nombre") {
            const nombreA = `${a.apellido}, ${a.nombre}`.toLowerCase();
            const nombreB = `${b.apellido}, ${b.nombre}`.toLowerCase();
            comparison = nombreA.localeCompare(nombreB);
          } else if (orden === "especialidad") {
            comparison = (a.especialidad || "").localeCompare(b.especialidad || "");
          }
          return direccion === "asc" ? comparison : -comparison;
        })
    : [];

  const handleBotonTurnos = (profesionalId) => {
    navigate(`/micuenta/panelturnos-centromedico/${consultorioId}/${profesionalId}`);
  };

  const handleDesvincularProfesional = async (profesionalId) => {
    if (!profesionalId) {
      toast.error("❌ ID inválido");
      return;
    }

    setDeletingIds((prev) => new Set([...prev, profesionalId]));

    try {
      await axios.put(`${API_URL}/api/desvincularprofesional/${consultorioId}/${profesionalId}`);
      toast.success("✅ Profesional desvinculado");
      setTimeout(() => {
        refrescarListaProfesionales();
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(profesionalId);
          return next;
        });
      }, 1000);
    } catch (err) {
      toast.error("❌ Error al desvincular");
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(profesionalId);
        return next;
      });
    }
  };

  const cambiarOrden = (columna) => {
    if (orden === columna) {
      setDireccion(direccion === "asc" ? "desc" : "asc");
    } else {
      setOrden(columna);
      setDireccion("asc");
    }
  };

  const getSortIcon = (columna) => {
    if (orden !== columna) return null;
    return direccion === "asc" ? (
      <FaSortAmountDown className="inline ml-1 text-blue-500" />
    ) : (
      <FaSortAmountUp className="inline ml-1 text-blue-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-xs mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando médicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
          <FaUserMd className="text-red-500 mx-auto mb-3" size={32} />
          <h3 className="text-lg font-bold text-red-700">Error</h3>
          <p className="text-gray-600 text-sm mt-1">{error.message}</p>
          <button
            onClick={() => navigate("/micuenta")}
            className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40"
        onClick={() => navigate("/micuenta")}
      >
        <div
          className="bg-white xl:rounded-2xl shadow-2xl w-full max-w-7xl h-[100dvh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente profesional */}
          <header className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaUserMd size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Gestión de Profesionales</h2>
                  <p className="text-sky-100 text-sm mt-0.5">
                    Administra los médicos asociados a tu centro
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/micuenta")}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </header>

          {/* Cuerpo principal */}
          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            {/* Botón principal */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <button
                onClick={() => setShowModalAsociarProfesional(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <FaUserPlus /> Agregar Médico
              </button>

              {/* Controles de vista y filtros */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"} transition`}
                  >
                    <FaList />
                  </button>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-2 ${viewMode === "cards" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"} transition`}
                  >
                    <FaThLarge />
                  </button>
                </div>

                <select
                  value={filtroEspecialidad}
                  onChange={(e) => setFiltroEspecialidad(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las especialidades</option>
                  {especialidades.map((esp) => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vista en tarjetas (móvil) */}
            {viewMode === "cards" ? (
              <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {profesionalesFiltradosYOrdenados.length === 0 ? (
                  <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm">
                    <FaUserMd className="text-gray-300 mx-auto mb-3" size={40} />
                    <p className="text-gray-500 text-lg">No hay médicos asociados</p>
                    {filtroEspecialidad && (
                      <button
                        onClick={() => setFiltroEspecialidad("")}
                        className="text-blue-600 text-sm underline mt-2"
                      >
                        Limpiar filtro
                      </button>
                    )}
                  </div>
                ) : (
                  profesionalesFiltradosYOrdenados.map((prof) => (
                    <div
                      key={prof.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{prof.apellido}, {prof.nombre}</h3>
                          <p className="text-sm text-gray-600">{prof.especialidad}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1 mb-4">
                        <p><strong>Matrícula:</strong> {prof.matricula}</p>
                        <p><strong>Teléfono:</strong> {prof.telefono}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleBotonTurnos(prof.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                        >
                          Turnos
                        </button>
                        <button
                          onClick={() => handleDesvincularProfesional(prof.id)}
                          disabled={deletingIds.has(prof.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg transition disabled:opacity-60"
                        >
                          {deletingIds.has(prof.id) ? (
                            <FaSpinner className="animate-spin" size={14} />
                          ) : (
                            <FaTrashAlt size={14} />
                          )}
                          {deletingIds.has(prof.id) ? "Desvinculando..." : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Vista en tabla (escritorio) */
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
                      <tr>
                        <th
                          className="py-4 px-5 text-left font-semibold cursor-pointer hover:bg-gray-100"
                          onClick={() => cambiarOrden("nombre")}
                        >
                          Nombre {getSortIcon("nombre")}
                        </th>
                        <th
                          className="py-4 px-5 text-left font-semibold cursor-pointer hover:bg-gray-100"
                          onClick={() => cambiarOrden("especialidad")}
                        >
                          Especialidad {getSortIcon("especialidad")}
                        </th>
                        <th className="py-4 px-5 text-left font-semibold">Matrícula</th>
                        <th className="py-4 px-5 text-left font-semibold">Teléfono</th>
                        <th className="py-4 px-5 text-left font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {profesionalesFiltradosYOrdenados.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">
                            <FaUserMd className="mx-auto mb-2 text-gray-300" size={24} />
                            No hay médicos asociados
                            {filtroEspecialidad && (
                              <button
                                onClick={() => setFiltroEspecialidad("")}
                                className="block mx-auto mt-2 text-blue-600 text-sm underline"
                              >
                                Limpiar filtro
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        profesionalesFiltradosYOrdenados.map((prof) => (
                          <tr key={prof.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="p-1 bg-blue-100 rounded-full">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{prof.apellido}, {prof.nombre}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-gray-700">{prof.especialidad}</td>
                            <td className="py-4 px-5 text-gray-600 text-sm">{prof.matricula}</td>
                            <td className="py-4 px-5 text-gray-600 text-sm">{prof.telefono}</td>
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleBotonTurnos(prof.id)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                  aria-label="Ver turnos"
                                >
                             <span className="text-lg">📅</span>
                                </button>
                                <button
                                  onClick={() => handleDesvincularProfesional(prof.id)}
                                  disabled={deletingIds.has(prof.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition disabled:opacity-60"
                                  aria-label="Eliminar"
                                >
                                  {deletingIds.has(prof.id) ? (
                                    <FaSpinner className="animate-spin" size={16} />
                                  ) : (
                                    <FaTrashAlt size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
            <span>
              Mostrando <strong>{profesionalesFiltradosYOrdenados.length}</strong> profesional(es)
            </span>
            <button
              onClick={() => navigate("/micuenta")}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
            >
              Cerrar
            </button>
          </footer>
        </div>
      </div>

      {/* Modal de asociación */}
      {showModalAsociarProfesional && (
        <AsociarProfesionalAConsultorio
          consultorioID={consultorioId}
          tipo={consultorioTipo}
          onClose={() => setShowModalAsociarProfesional(false)}
          idsProfesionalesVinculados={idsProfesionalesVinculados}
          refrescarListaProfesionales={refrescarListaProfesionales}
          profesionalVinculado={profesionalVinculado}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={1500} hideProgressBar />
    </>
  );
};

export default GestionProfesionales;