import { useState, useEffect, useMemo } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { BiFilterAlt, BiSearch } from "react-icons/bi";
import BotonesConsultorios from "./BotonesConsultorios";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import useProfesionalxId from "../../customHooks/useProfesionalxId";
import { useNavigate } from "react-router";

const SearchModal = ({ enviarIds }) => {
  const [specialty, setSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  const { profesionales, isLoading, error } = useAllProfesionals();

  const normalizeString = (str) => {
    return (
      str
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() || ""
    );
  };

  // Pre-procesar y normalizar nombres una vez
  const processedProfesionales = useMemo(() => {
    if (!Array.isArray(profesionales)) return [];

    return profesionales.map((p) => ({
      ...p,
      fullNameNormalized: normalizeString(`${p.nombre} ${p.apellido}`),
      especialidadNormalized: normalizeString(p.especialidad),
    }));
  }, [profesionales]);

  // Filtrar doctores: mostrar todos si no hay filtros
  const filteredDoctors = useMemo(() => {
    if (!processedProfesionales.length) return [];

    let results = [...processedProfesionales];

    if (specialty) {
      const normalizedSpec = normalizeString(specialty);
      results = results.filter((doc) => doc.especialidadNormalized === normalizedSpec);
    }

    if (searchQuery) {
      const query = normalizeString(searchQuery);
      results = results.filter((doc) => doc.fullNameNormalized.includes(query));
    }

    // Ordenar alfabéticamente por apellido
    return results.sort((a, b) => a.apellido.localeCompare(b.apellido));
  }, [processedProfesionales, specialty, searchQuery]);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [specialty, searchQuery]);

  const hasSearched = !!specialty || !!searchQuery;

  const displayedDoctors = filteredDoctors.slice(0, page * itemsPerPage);
  const hasMore = displayedDoctors.length < filteredDoctors.length;

  const cerrarModal = () => {
    setSpecialty("");
    setSearchQuery("");
    setPage(1);
    navigate("/");
  };

  const verTurnos = (id) => {
    const doctor = processedProfesionales.find((p) => p.id === id);
    if (doctor && doctor.slug) {
      navigate(`/turnos/${doctor.slug}`);
    } else {
      console.warn("No se encontró el slug del profesional");
      navigate(`/turnos/id-${id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center xl:p-4 z-50">
      <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 shadow-2xl border border-white/40 xl:rounded-3xl w-full xl:max-w-7xl h-[100dvh] xl:h-[90vh] flex flex-col relative overflow-hidden">
        
        {/* Overlay de grid sutil */}
        <div
          className="absolute inset-0 opacity-5 md:block hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 160, 220, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 160, 220, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Botón de cierre */}
        <button
          onClick={cerrarModal}
          className="absolute top-4 right-6 text-gray-600 text-3xl font-bold rounded-full hover:scale-110 duration-300 z-50"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        {/* Scroll interno */}
        <div className="overflow-y-auto flex-1 relative z-10">
          
          {/* Encabezado */}
          <div className="text-center p-6 pt-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Encuentra a tu Especialista
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Selecciona una especialidad o escribe un nombre para buscar.
            </p>
          </div>

          {/* Filtros */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white/60 p-6 rounded-3xl mb-6 mx-6 border border-white/50 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-4">
              
              {/* Especialidad */}
              <div className="flex flex-col">
                <label
                  htmlFor="specialty"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <BiFilterAlt className="mr-1 text-indigo-500" /> Especialidad
                </label>
                <select
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="p-3 border border-white/50 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-white/80 shadow-sm"
                >
                  <option value="">Todas</option>
                  {Array.isArray(profesionales) &&
                    [...new Set(profesionales.map((p) => p.especialidad))]
                      .sort()
                      .map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                </select>
              </div>

              {/* Búsqueda */}
              <div className="flex flex-col">
                <label
                  htmlFor="searchQuery"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <BiSearch className="mr-1 text-indigo-500" /> Nombre o Apellido
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  placeholder="Ej: Ana López"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-3 border border-white/50 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-white/80 shadow-sm"
                />
              </div>
            </div>
          </form>

          {/* Resultados */}
          <div className="px-6 pb-8">
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-indigo-600">Cargando...</span>
              </div>
            )}

            {error && (
              <p className="text-center text-red-600 text-lg py-4 bg-red-50 rounded-2xl border border-red-200">
                ⚠️ {error.message || "Error al cargar los profesionales."}
              </p>
            )}

            {!isLoading && !error && (
              <>
                {/* Mensaje cuando no hay filtros */}
                {!hasSearched && (
                  <div className="text-center py-4 mb-6">
                    <h3 className="text-gray-800 font-bold text-lg">
                      Todos los especialistas ({filteredDoctors.length})
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                      Selecciona uno para ver disponibilidad de turnos.
                    </p>
                  </div>
                )}

                {/* Resultados encontrados */}
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                    {displayedDoctors.map((doctor) => {
                      if (!doctor || !doctor.id) return null;

                      return (
                        <div
                        key={doctor.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-200 transition-all duration-300 transform hover:scale-102 flex flex-col h-full overflow-hidden w-full md:min-w-[200px] shadow-black"
                      >
                        {/* Encabezado con gradiente y avatar */}
                        <div className="p-5 pb-4 bg-gradient-to-br from-white to-gray-50 border-b border-gray-100">
                          <div className="flex items-start gap-4">
                            {/* Avatar con fondo degradado */}
                            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-3 rounded-xl text-white flex-shrink-0 shadow-md group-hover:from-purple-500 group-hover:to-pink-500 transition-colors duration-300">
                              <FaUserDoctor className="text-2xl" />
                            </div>
                      
                            {/* Info principal */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 leading-tight capitalize group-hover:text-indigo-700 transition-colors duration-200">
                                {doctor.apellido}, {doctor.nombre}
                              </h3>
                              <p className="text-indigo-600 font-semibold text-sm mt-1 flex items-center">
                                {doctor.especialidad}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded">MP {doctor.matricula}</span>
                              </p>
                      
                              {/* Consultorios */}
                              {Array.isArray(doctor.consultorios) && doctor.consultorios.length > 0 && (
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                  {doctor.consultorios.slice(0, 2).map((consultorio) => (
                                    <span
                                      key={consultorio.id}
                                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-800 border border-indigo-100 shadow-sm hover:shadow transition-shadow duration-200"
                                      title={`Consultorio: ${consultorio.nombre}`}
                                    >
                                      {consultorio.tipo === "Particular" ? (
                                        <FaHome className="text-[0.6rem]" />
                                      ) : (
                                        <FaHospital className="text-[0.6rem]" />
                                      )}
                                      {consultorio.nombre}
                                    </span>
                                  ))}
                                  {doctor.consultorios.length > 2 && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                                      +{doctor.consultorios.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      
                        {/* Botón de acción */}
                        <button
                          onClick={() => verTurnos(doctor.id)}
                          className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm tracking-wide rounded-b-2xl transition-all duration-200 shadow-sm hover:shadow-md group-hover:shadow-lg"
                        >
                          Ver disponibilidad
                        </button>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Sin resultados */
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">
                      No se encontraron médicos con esos criterios.
                    </p>
                    <p className="text-gray-500 mt-1">
                      Intenta con otra especialidad o nombre.
                    </p>
                  </div>
                )}

                {/* Botón cargar más */}
                {hasSearched && hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200"
                    >
                      Cargar más
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;