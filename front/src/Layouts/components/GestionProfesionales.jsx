import { useEffect, useState } from "react";
import useProfesionalxIdConsultorio from "../../../customHooks/useProfesionalxIdConsultorio";
import {
  FaRegEye,
  FaEdit,
  FaTrashAlt,
  FaUserMd,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import AsociarProfesionalAConsultorio from "../AsociarProfesionalAConsultorio";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const GestionProfesionales = (profesionalVinculado) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { consultorioId } = useParams();
  const navigate = useNavigate();

  const [refreshProfesionales, setRefreshProfesionales] = useState(null);

  const [idsProfesionalesVinculados, setIdsProfesionalesVinculados] = useState(
    []
  );



  const {
    profesional: profesionales,
    isLoading,
    error,
  } = useProfesionalxIdConsultorio(consultorioId, refreshProfesionales);
  const [orden, setOrden] = useState("nombre");
  const [direccion, setDireccion] = useState("asc");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
    if (profesionales) {
      setIdsProfesionalesVinculados(profesionales.map((p) => p.id));
    }
  }, [profesionales]);

  // Previene scroll del fondo
  document.body.style.overflow = "hidden";

  // Detectar tamaño de pantalla
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
  }

  const especialidades = [
    ...new Set(profesionales?.map((p) => p.especialidad) || []),
  ];

  const profesionalesFiltradosYOrdenados = profesionales
    ? profesionales
        .filter(
          (profesional) =>
            filtroEspecialidad === "" ||
            profesional.especialidad === filtroEspecialidad
        )
        .sort((a, b) => {
          let comparison = 0;
          if (orden === "nombre") {
            const nombreA = `${a.apellido}, ${a.nombre}`.toLowerCase();
            const nombreB = `${b.apellido}, ${b.nombre}`.toLowerCase();
            comparison = nombreA.localeCompare(nombreB);
          } else if (orden === "especialidad") {
            comparison = a.especialidad.localeCompare(b.especialidad);
          }
          return direccion === "asc" ? comparison : -comparison;
        })
    : [];

  const handleBotonTurnos = (profesionalId) => {
    navigate(
      `/micuenta/panelturnos-centromedico/${consultorioId}/${profesionalId}`
    );
  };

  const handleDesvincularProfesional = async (profesionalId) => {
    if (!profesionalId) {
      toast.error("❌ ID de profesional no válido");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/desvincularprofesional/${consultorioId}/${profesionalId}`
      );

          refrescarListaProfesionales()

      toast.success("✅ Desvinculado con éxito");

     
    } catch {
      toast.error("❌ Error al desvincular profesional");
    } finally {
      setIsDeleting(false);
    }
  };

  const cambiarOrden = (nuevoOrden) => {
    if (orden === nuevoOrden) {
      setDireccion(direccion === "asc" ? "desc" : "asc");
    } else {
      setOrden(nuevoOrden);
      setDireccion("asc");
    }
  };

  const getSortIcon = (columna) => {
    if (orden !== columna) return null;
    return direccion === "asc" ? (
      <FaSortAmountDown className="inline ml-1" />
    ) : (
      <FaSortAmountUp className="inline ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center xl:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando profesionales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <FaTrashAlt className="text-red-500 mx-auto mb-3" size={24} />
          <p className="text-red-700 font-medium">Error al cargar</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center xl:p-4 z-[200]"
        onClick={() => navigate("/micuenta")}
      >
        <div
          className="bg-white xl:rounded-2xl shadow-2xl w-screen h-[100dvh] xl:max-w-7xl xl:h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 xl:rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaUserMd className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Gestión de Profesionales</h3>
              </div>
              <button
                onClick={() => navigate("/micuenta")}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
               
              </button>
            </div>
            <p className="text-blue-100 mt-2 text-sm opacity-90">
              Administra los médicos asociados a este consultorio.
            </p>
          </div>

          {/* Cuerpo scrollable */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Botón de agregar profesional */}
            <div className="flex justify-center">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                onClick={() => setShowModalAsociarProfesional(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agregar Profesional
              </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por especialidad */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaFilter className="text-blue-500" /> Especialidad
                </label>
                <select
                  value={filtroEspecialidad}
                  onChange={(e) => setFiltroEspecialidad(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Todas las especialidades</option>
                  {especialidades.map((especialidad) => (
                    <option key={especialidad} value={especialidad}>
                      {especialidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones de orden */}
              <div className="sm:col-span-2 flex justify-end gap-2 self-end">
                <button
                  onClick={() => cambiarOrden("nombre")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    orden === "nombre"
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Nombre {getSortIcon("nombre")}
                </button>
                <button
                  onClick={() => cambiarOrden("especialidad")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    orden === "especialidad"
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Especialidad {getSortIcon("especialidad")}
                </button>
              </div>
            </div>

            {/* Vista de tarjetas (mobile) */}
            {viewMode === "cards" ? (
              <div className="grid gap-4">
                {profesionalesFiltradosYOrdenados.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-base">
                      No se encontraron profesionales
                    </p>
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
                  profesionalesFiltradosYOrdenados.map((profesional) => (
                    <div
                      key={profesional.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {profesional.apellido}, {profesional.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {profesional.especialidad}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {profesional.telefono}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleBotonTurnos(profesional.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <FaRegEye className="w-4 h-4" /> Ver turnos
                        </button>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={()=> handleDesvincularProfesional(profesional.id)}>
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Vista de tabla (desktop) */
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Nombre
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Especialidad
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Matrícula
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Teléfono
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Turnos
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Desvincular
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profesionalesFiltradosYOrdenados.map((profesional) => (
                      <tr key={profesional.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-blue-100 rounded-full">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {profesional.apellido}, {profesional.nombre}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {profesional.especialidad}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm truncate max-w-xs">
                          {profesional.matricula}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm truncate max-w-xs">
                          {profesional.telefono}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleBotonTurnos(profesional.id)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                              aria-label="Ver turnos"
                            >
                              <FaRegEye className="w-4 h-4" />
                            </button>
                            {/* <button
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-lg transition-colors"
                              aria-label="Editar"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button> */}
                           
                           
                          </div>
                        </td>
                        <td className="py-3 px-4">
                            <button
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                              aria-label="Eliminar"
                              onClick={() =>
                                handleDesvincularProfesional(profesional.id)
                              }
                            >
                              <FaTrashAlt className="w-4 h-4" />
                            </button>
                            </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200 text-sm text-gray-600">
            <span>
              Mostrando {profesionalesFiltradosYOrdenados.length}{" "}
              profesional(es)
            </span>
            <button
              onClick={() => navigate("/micuenta")}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition"
            >
              Cerrar
            </button>
          </div>

          {/* Modal de asociación */}
          {showModalAsociarProfesional && (
            <AsociarProfesionalAConsultorio
              consultorioID={consultorioId}
              onClose={() => setShowModalAsociarProfesional(false)}
              idsProfesionalesVinculados = {idsProfesionalesVinculados}
              refrescarListaProfesionales={refrescarListaProfesionales}
              profesionalVinculado={profesionalVinculado}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default GestionProfesionales;
