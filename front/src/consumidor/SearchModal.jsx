import { useState, useEffect, useMemo } from "react";
import { FaUserDoctor, FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { BiFilterAlt, BiSearch, BiX } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import useAllProvincias from "../../customHooks/useAllProvincias";
import useAllConsultorios from "../../customHooks/useAllConsultorios";
import { useNavigate } from "react-router";

const SearchModal = ({ enviarIds }) => {
  const [specialty, setSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(""); 
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  const { profesionales, isLoading: isLoadingProf, error: errorProf } = useAllProfesionals();
  const { consultorios, isLoading: isLoadingCons, error: errorCons } = useAllConsultorios();
  const { provincias: allProvincias, isLoading: isLoadingProv, error: errorProv } = useAllProvincias();

  // --- LÓGICA (Sin cambios) ---
  const normalizeString = (str) => (str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "");

  const processedProfesionales = useMemo(() => {
    if (!Array.isArray(profesionales)) return [];
    return profesionales.map((p) => ({
      ...p,
      fullNameNormalized: normalizeString(`${p.nombre} ${p.apellido}`),
      especialidadNormalized: normalizeString(p.especialidad),
    }));
  }, [profesionales]);

  const provincias = useMemo(() => {
    if (!Array.isArray(consultorios)) return [];
    const unique = [...new Set(consultorios.map((c) => c.provincia))].filter(Boolean).sort();
    return unique;
  }, [consultorios]);

  const consultorioProvinciaMap = useMemo(() => {
    if (!Array.isArray(consultorios)) return {};
    const map = {};
    consultorios.forEach((c) => { if (c.id && c.provincia) map[c.id] = c.provincia; });
    return map;
  }, [consultorios]);

  const filteredDoctors = useMemo(() => {
    if (!processedProfesionales.length) return [];
    let results = [...processedProfesionales];
    if (selectedProvince) {
      results = results.filter((doc) => doc.consultorios?.some((consId) => consultorioProvinciaMap[consId] === selectedProvince));
    }
    if (specialty) {
      const normalizedSpec = normalizeString(specialty);
      results = results.filter((doc) => doc.especialidadNormalized === normalizedSpec);
    }
    if (searchQuery) {
      const query = normalizeString(searchQuery);
      results = results.filter((doc) => doc.fullNameNormalized.includes(query));
    }
    return results.sort((a, b) => a.apellido.localeCompare(b.apellido));
  }, [processedProfesionales, selectedProvince, specialty, searchQuery, consultorioProvinciaMap]);

  useEffect(() => { setPage(1); }, [specialty, searchQuery, selectedProvince]);

  const hasSearched = !!specialty || !!searchQuery || !!selectedProvince;
  const displayedDoctors = filteredDoctors.slice(0, page * itemsPerPage);
  const hasMore = displayedDoctors.length < filteredDoctors.length;

  const cerrarModal = () => {
    setSpecialty(""); setSearchQuery(""); setSelectedProvince(""); setPage(1);
    navigate("/");
  };

  const verTurnos = (id) => {
    const doctor = processedProfesionales.find((p) => p.id === id);
    if (doctor && doctor.slug) navigate(`/turnos/${doctor.slug}`);
    else navigate(`/turnos/id-${id}`);
  };

  const isLoading = isLoadingProf || isLoadingCons;
  const error = errorProf || errorCons;

  return (
    <div className="fixed inset-0 bg-indigo-950/80 flex items-center justify-center z-[100] p-0">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#f0f2f5] w-full h-full md:h-[100vh] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] flex flex-col overflow-hidden relative"
      >
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={cerrarModal}
          className="absolute top-6 right-8 w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-slate-400 hover:text-red-500 shadow-[4px_4px_10px_#d1d1d1,-4px_-4px_10px_#ffffff] transition-all z-50 active:scale-90"
        >
          <BiX size={32} />
        </button>

        {/* HEADER AREA */}
        <div className="p-8 md:p-12 pb-4">
          <div className="mb-10 text-center">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-2">
              Cartilla <span className="text-indigo-600">Médica</span>
            </h2>
            <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full" />
          </div>

          {/* FILTROS TIPO "ISLA" */}
          <div className="bg-white/40 p-4 rounded-[32px] shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Busqueda */}
            <div className="relative">
              <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl" />
              <input 
                type="text"
                placeholder="Nombre del profesional..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>

            {/* Select Especialidad */}
            <div className="relative">
              <BiFilterAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
              <select 
                value={specialty} 
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="">Todas las Especialidades</option>
                {[...new Set(profesionales.map(p => p.especialidad))].sort().map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Select Provincia */}
            <div className="relative">
              <FaLocationDot className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
              <select 
                value={selectedProvince} 
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="">Todas las Provincias</option>
                {provincias.map(prov => (
                  <option key={prov} value={prov}>{allProvincias.find(p => p.id === prov)?.nombre || prov}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CONTENIDO (GRID DE RESULTADOS) */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 custom-scrollbar">
          
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-indigo-900 font-black tracking-widest animate-pulse">CARGANDO RED MÉDICA</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {displayedDoctors.map((doc) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={doc.id}
                    className="bg-white rounded-[32px] p-6 shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 group flex flex-col border border-white/40"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                        <FaUserDoctor />
                      </div>
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400">MP {doc.matricula}</span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-black text-slate-800 leading-tight">
                        {doc.apellido.toUpperCase()}, <br /> {doc.nombre}
                      </h3>
                      <p className="text-indigo-600 font-black text-xs uppercase tracking-wider">{doc.especialidad}</p>
                      
                      <div className="pt-4 flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                        <FaLocationDot />
                        {doc.consultorios?.slice(0, 1).map(id => (
                          <span key={id}>{consultorioProvinciaMap[id] || "N/A"}</span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => verTurnos(doc.id)}
                      className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group/btn active:scale-95"
                    >
                      AGENDAR <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] hover:shadow-inner transition-all"
              >
                MOSTRAR MÁS PROFESIONALES
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default SearchModal;