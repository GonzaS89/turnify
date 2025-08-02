import React, { useState, useEffect, useRef } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { BiFilterAlt, BiSearch } from "react-icons/bi";
import BotonesConsultorios from "./BotonesConsultorios";

const SearchModal = ({
  showModal,
  onClose,
  profesionales,
  isLoading,
  error,
  enviarIds,
}) => {
  const [specialty, setSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const firstDoctorRef = useRef(null);

  const normalizeString = (str) => {
    return (
      str
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() || ""
    );
  };

  useEffect(() => {
    if (!showModal) return;

    const hasFilters = specialty || searchQuery;
    setHasSearched(hasFilters);

    if (!profesionales || profesionales.length === 0 || !hasFilters) {
      setFilteredDoctors([]);
      return;
    }

    let results = [...profesionales];

    if (specialty) {
      results = results.filter((doc) => doc.especialidad === specialty);
    }

    if (searchQuery) {
      const query = normalizeString(searchQuery);
      results = results.filter(
        (doc) =>
          normalizeString(doc.nombre).includes(query) ||
          normalizeString(doc.apellido).includes(query)
      );
    }

    setFilteredDoctors(results);

    if (results.length > 0) {
      setTimeout(() => {
        firstDoctorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [showModal, specialty, searchQuery, profesionales]);

  if (!showModal) return null;

  const cerrarModal = () => {
    setSpecialty("");
    setSearchQuery("");
    setFilteredDoctors([]);
    setHasSearched(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center xl:p-4 z-50 backdrop-blur-md">
      <div className="bg-white backdrop-blur-sm xl:rounded-3xl shadow-xl border border-gray-200/50 w-screen xl:max-w-6xl h-screen  xl:max-h-[90vh] overflow-y-auto relative">
        {/* Botón de cierre */}
        <button
          onClick={cerrarModal}
          className="absolute top-1 right-4 text-gray-600 hover:text-gray-800 text-3xl font-bold z-10 rounded-full flex items-center justify-center"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        {/* Encabezado */}
        <div className="text-center p-6 pt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Encuentra a tu Especialista
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Selecciona una especialidad o escribe un nombre para comenzar.
          </p>
        </div>

        {/* Filtros */}
        <form className="bg-white/70 p-5 rounded-2xl mb-6 mx-6 border border-gray-200/60 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-4">
            {/* Especialidad */}
            <div className="flex flex-col">
              <label
                htmlFor="specialty"
                className="text-sm font-semibold text-gray-700 mb-1 flex items-center"
              >
                <BiFilterAlt className="mr-1 text-indigo-500" /> Especialidad
              </label>
              <select
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-shadow bg-white shadow-sm"
              >
                <option value="" disabled>
                  Todas
                </option>
                {[...new Set(profesionales?.map((p) => p.especialidad))]
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
                className="text-sm font-semibold text-gray-700 mb-1 flex items-center"
              >
                <BiSearch className="mr-1 text-indigo-500" /> Nombre o Apellido
              </label>
              <input
                type="text"
                id="searchQuery"
                placeholder="Ej: Ana López"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-shadow bg-white shadow-sm"
              />
            </div>
          </div>
        </form>

        {/* Resultados */}
        <div className="px-6 pb-6">
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-indigo-600 text-xl">Cargando...</span>
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 text-lg py-16 bg-red-50 rounded-xl border border-red-200">
              ⚠️ {error.message || "Error al cargar los profesionales."}
            </p>
          )}

          {!isLoading && !error && (
            <>
              {/* Mensaje inicial */}
              {!hasSearched && (
                <div className="text-center py-16">
                  <FaUserDoctor className="text-6xl text-indigo-200 mx-auto mb-4" />
                  <h3 className="text-gray-700 font-semibold text-lg">
                    ¿A quién estás buscando?
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    Usa los filtros de arriba para encontrar médicos por
                    especialidad o nombre.
                  </p>
                </div>
              )}

              {/* Resultados encontrados */}
              {hasSearched && filteredDoctors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
                  {filteredDoctors.map((doctor, index) => (
                    <div
                      key={doctor.id}
                      ref={index === 0 ? firstDoctorRef : null}
                      class="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 hover:border-indigo-400 hover:shadow-2xl transform transition-all duration-500 hover:scale-[1.02] flex flex-col h-full group overflow-hidden w-80"
                    >
                      <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-50 z-0"></div>

                      <div class="relative z-10 flex flex-col h-full">
                        <div class="p-6 pb-4 border-b border-gray-100/70">
                          <div class="flex items-start gap-5">
                            <div
                              class="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white flex-shrink-0 shadow-lg 
                 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105"
                            >
                              <FaUserDoctor class="text-3xl" />
                            </div>
                            <div class="flex-1 min-w-0">
                              <h3 class="text-xl font-extrabold text-gray-900 group-hover:text-indigo-800 transition-colors duration-300 truncate mb-1">
                                {doctor.apellido}, {doctor.nombre}
                              </h3>
                              <p class="text-indigo-700 font-bold text-md mt-1">
                                {doctor.especialidad}
                              </p>
                              <p class="text-gray-500 text-sm mt-1">
                                Matrícula: {doctor.matricula}
                              </p>
                              {doctor.consultorios &&
                                doctor.consultorios.length > 0 && (
                                  <div class="mt-3 flex flex-wrap gap-2">
                                    {doctor.consultorios
                                      .slice(0, 2)
                                      .map((consultorio) => (
                                        <span
                                          key={consultorio.id}
                                          class="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold truncate max-w-[150px] 
                         hover:bg-indigo-200 transition-colors cursor-help"
                                          title={consultorio.nombre}
                                        >
                                          {consultorio.nombre}
                                        </span>
                                      ))}
                                    {doctor.consultorios.length > 2 && (
                                      <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                        +{doctor.consultorios.length - 2} más
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        <div class="p-5 bg-gray-50/80 rounded-b-3xl border-t border-gray-100/70 mt-auto">
                          <BotonesConsultorios
                            idProfesional={doctor.id}
                            enviarIds={enviarIds}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sin resultados */}
              {hasSearched && filteredDoctors.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">
                    No se encontraron médicos con esos criterios.
                  </p>
                  <p className="text-gray-500 mt-1">
                    Intenta con otra especialidad o nombre.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
