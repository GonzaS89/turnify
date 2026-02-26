import { useState, useMemo } from "react";
import { FaUserDoctor, FaHospital, FaChevronDown, FaChevronUp, FaArrowRight } from "react-icons/fa6";
import { BiFilterAlt, BiSearch, BiBuildingHouse } from "react-icons/bi";
import useAllProfesionals from "../../customHooks/useAllProfesionals";
import useAllConsultorios from "../../customHooks/useAllConsultorios";
import useProfesionalxIdConsultorio from "../../customHooks/useProfesionalxIdConsultorio";
import { useNavigate } from "react-router";

const SearchModal = () => {
  const [searchType, setSearchType] = useState("profesionales");
  const [specialty, setSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 16;

  const navigate = useNavigate();
  const { profesionales } = useAllProfesionals();
  const { consultorios } = useAllConsultorios();

  const normalizeString = (str) => {
    return str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";
  };

  const centrosMedicosFiltrados = useMemo(() => {
    if (!Array.isArray(consultorios)) return [];
    return consultorios.filter(c => c.tipo === "centro médico");
  }, [consultorios]);

  const processedDocs = useMemo(() => {
    if (!Array.isArray(profesionales)) return [];
    return profesionales.map((p) => ({
      ...p,
      fullNameNormalized: normalizeString(`${p.nombre} ${p.apellido}`),
      especialidadNormalized: normalizeString(p.especialidad),
    }));
  }, [profesionales]);

  const filteredResults = useMemo(() => {
    const query = normalizeString(searchQuery);
    if (searchType === "profesionales") {
      let results = [...processedDocs];
      if (specialty) results = results.filter(d => d.especialidadNormalized === normalizeString(specialty));
      if (query) results = results.filter(d => d.fullNameNormalized.includes(query));
      return results.sort((a, b) => a.apellido.localeCompare(b.apellido));
    } else {
      let results = [...centrosMedicosFiltrados];
      if (query) results = results.filter(c => normalizeString(c.nombre).includes(query));
      return results.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }, [searchType, processedDocs, centrosMedicosFiltrados, specialty, searchQuery]);

  const displayedItems = filteredResults.slice(0, page * itemsPerPage);

  return (
    <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-slate-50 w-full h-screen flex flex-col relative overflow-hidden">
        
        {/* Botón Cerrar más visible */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-6 right-8 text-slate-400 hover:text-indigo-600 text-5xl font-light transition-all z-50 p-2"
        >
          ×
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Header con más aire */}
          <div className="text-center p-8 pt-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              Encuentra tu Atención Médica
            </h2>
            <p className="text-slate-500 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
              Gestiona tus turnos con profesionales de la salud y centros especializados.
            </p>
            
            {/* Selectores de tipo más grandes */}
            <div className="flex justify-center mt-12">
              <div className="bg-slate-200/60 p-2 rounded-3xl flex gap-2 border border-slate-200">
                <button
                  onClick={() => { setSearchType("profesionales"); setPage(1); }}
                  className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-lg transition-all duration-300 ${searchType === "profesionales" ? "bg-white shadow-xl text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <FaUserDoctor className="text-xl" /> Profesionales
                </button>
                <button
                  onClick={() => { setSearchType("centros"); setPage(1); }}
                  className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-lg transition-all duration-300 ${searchType === "centros" ? "bg-white shadow-xl text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <BiBuildingHouse className="text-xl" /> Centros Médicos
                </button>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda expandida */}
          <div className="px-8 mb-12 max-w-6xl mx-auto w-full">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row gap-6">
              {searchType === "profesionales" && (
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none flex-1 text-lg text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                >
                  <option value="">Todas las especialidades</option>
                  {[...new Set(profesionales?.map(p => p.especialidad))].sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
              <div className="relative flex-[2]">
                <BiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl" />
                <input
                  type="text"
                  placeholder={searchType === "profesionales" ? "Buscar por nombre de médico..." : "Buscar por nombre del centro..."}
                  className="w-full pl-14 pr-6 p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 text-lg transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Grid de resultados */}
          <div className="px-10 pb-20">
            <div className={searchType === "profesionales" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 place-" : "flex flex-col gap-6 max-w-6xl mx-auto"}>
              {displayedItems.map((item) => (
                searchType === "profesionales" ? (
                  <DoctorCard key={item.id} doctor={item} navigate={navigate} />
                ) : (
                  <CentroExpandible key={item.id} centro={item} navigate={navigate} />
                )
              ))}
            </div>
            
            {filteredResults.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 text-2xl font-medium">No se encontraron resultados para tu búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CentroExpandible = ({ centro, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { profesional: staff, isLoading } = useProfesionalxIdConsultorio(isOpen ? centro.id : null);

  return (
    <div className={`bg-white rounded-[2rem] border transition-all duration-500 ${isOpen ? 'border-indigo-400 ring-8 ring-indigo-500/5' : 'border-slate-200 shadow-sm'}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-7 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors rounded-[2rem]"
      >
        <div className="flex items-center gap-6">
          <div className={`p-5 rounded-2xl transition-all duration-300 ${isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-600'}`}>
            <FaHospital className="text-3xl" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-2xl tracking-tight">{centro.nombre}</h3>
            
            <div className="flex items-center gap-2 mt-1.5 text-slate-500">
              <p className="text-sm font-medium">
                {centro.direccion} 
                <span className="mx-2 text-slate-300">|</span> 
                <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest">
                  {centro.localidad}, {centro.provincia}
                </span>
              </p>
            </div>
            
            {!isOpen && (
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <p className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.15em] opacity-80">
                  Tocá para ver profesionales
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          {isOpen ? <FaChevronUp className="text-indigo-600 text-xl" /> : <FaChevronDown className="text-slate-300 text-xl" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 rounded-b-[2rem] animate-fade-in">
          <p className="text-slate-400 text-xs font-black mb-6 px-2 uppercase tracking-[0.2em]">Profesionales en este centro</p>
          
          {isLoading ? (
            <div className="p-8 text-center text-lg text-indigo-600 animate-pulse font-medium">Cargando staff profesional...</div>
          ) : staff?.length > 0 ? (
            /* Grid de DoctorCards dentro del centro */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staff.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} navigate={navigate} />
              ))}
            </div>
          ) : (
            <p className="p-10 text-center text-lg text-slate-400 italic font-light">Actualmente no hay profesionales registrados en esta sede.</p>
          )}
        </div>
      )}
    </div>
  );
};

const DoctorCard = ({ doctor, navigate }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 group flex flex-col justify-between h-full">
    <div className="flex flex-col gap-4 mb-8">
      <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
        <FaUserDoctor className="text-4xl" />
      </div>
      
      <div>
        <h3 className="font-black text-slate-800 text-xl capitalize leading-snug group-hover:text-indigo-800 transition-colors">
          {doctor.apellido}, {doctor.nombre}
        </h3>
        
        <p className="text-slate-400 text-sm font-bold mt-1 tracking-tight">
          M.P. <span className="text-slate-600">{doctor.matricula}</span>
        </p>

        <p className="text-indigo-600 text-sm font-black mt-3 tracking-wider uppercase bg-indigo-50 inline-block px-3 py-1 rounded-lg">
          {doctor.especialidad}
        </p>
      </div>
    </div>

    <button 
      onClick={(e) => {
        e.stopPropagation(); // Evita que el clic propague al acordeón del centro
        navigate(`/turnos/${doctor.slug || 'id-'+doctor.id}`);
      }} 
      className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold tracking-widest hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
    >
      VER AGENDA
    </button>
  </div>
);

export default SearchModal;