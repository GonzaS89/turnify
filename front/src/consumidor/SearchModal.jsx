import { useState, useMemo } from "react";
import { FaUserDoctor, FaHospital, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { BiSearch, BiBuildingHouse } from "react-icons/bi";
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
    <div className="fixed inset-0 w-screen h-screen bg-slate-50 z-50 overflow-hidden flex flex-col">
      <div className="bg-slate-50 w-full h-full flex flex-col relative overflow-hidden">
        
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-4 right-4 md:top-8 md:right-8 text-slate-400 hover:text-indigo-600 text-4xl md:text-5xl font-light transition-all z-50 p-2"
        >
          ×
        </button>

        <div className="overflow-y-auto flex-1 p-4 md:p-8">
          <div className="text-center pt-8 md:pt-8">
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Atención Médica
            </h2>
            <p className="text-slate-500 text-base md:text-lg mt-2 max-w-lg mx-auto">
              Gestiona tus turnos con profesionales y centros especializados.
            </p>
            
            <div className="flex justify-center mt-8">
              <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 border border-slate-200">
                <button
                  onClick={() => { setSearchType("profesionales"); setPage(1); }}
                  className={`flex items-center gap-2 px-4 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-lg transition-all ${searchType === "profesionales" ? "bg-white shadow-xl text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <FaUserDoctor /> Profesionales
                </button>
                <button
                  onClick={() => { setSearchType("centros"); setPage(1); }}
                  className={`flex items-center gap-2 px-4 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-lg transition-all ${searchType === "centros" ? "bg-white shadow-xl text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <BiBuildingHouse /> Centros
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 mb-8 max-w-4xl mx-auto w-full">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row gap-4">
              {searchType === "profesionales" && (
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none flex-1 text-sm md:text-base cursor-pointer"
                >
                  <option value="">Todas las especialidades</option>
                  {[...new Set(profesionales?.map(p => p.especialidad))].sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
              <div className="relative flex-[2]">
                <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-12 pr-4 p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pb-20">
            <div className={searchType === "profesionales" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4 max-w-4xl mx-auto"}>
              {displayedItems.map((item) => (
                searchType === "profesionales" ? (
                  <DoctorCard key={item.id} doctor={item} navigate={navigate} />
                ) : (
                  <CentroExpandible key={item.id} centro={item} navigate={navigate} />
                )
              ))}
            </div>
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
    <div className={`bg-white rounded-2xl border transition-all ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-500/5' : 'border-slate-200'}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
            <FaHospital className="text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{centro.nombre}</h3>
            <p className="text-xs text-slate-400">{centro.direccion}</p>
            <p className="text-xs text-slate-400 font-bold uppercase">{centro.localidad}</p>
          </div>
        </div>
        {isOpen ? <FaChevronUp className="text-indigo-600" /> : <FaChevronDown className="text-slate-300" />}
      </div>

      {isOpen && (
        <div className="p-5 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
          {isLoading ? (
            <div className="text-center text-sm text-indigo-600">Cargando staff...</div>
          ) : staff?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {staff.map(doc => (
                <DoctorCard 
                  key={doc.id} 
                  doctor={doc} 
                  navigate={navigate} 
                  consultorioId={centro.id} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-400">Sin profesionales.</p>
          )}
        </div>
      )}
    </div>
  );
};

const DoctorCard = ({ doctor, navigate, consultorioId }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-slate-100 w-14 h-14 rounded-xl flex items-center justify-center text-slate-400">
        <FaUserDoctor className="text-2xl" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 truncate">{doctor.apellido}, {doctor.nombre}</h3>
        <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block">{doctor.especialidad}</p>
      </div>
    </div>
    <button 
      onClick={(e) => { 
        e.stopPropagation(); 
        const slug = doctor.slug || 'id-' + doctor.id;
        navigate(`/turnos/${slug}`, { state: { initialConsultorioId: consultorioId } }); 
      }} 
      className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all"
    >
      VER AGENDA
    </button>
  </div>
);

export default SearchModal;