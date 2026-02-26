// src/components/GestionProfesionales.jsx
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Iconos
import {
  FaCalendarAlt,
  FaTrashAlt,
  FaUserMd,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
  FaSpinner,
  FaUserPlus,
  FaList,
  FaThLarge,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";

// Hook personalizado
import useProfesionalxIdConsultorio from "../../customHooks/useProfesionalxIdConsultorio";

// Componentes
import AsociarProfesionalAConsultorio from "./AsociarProfesionalAConsultorio";

const GestionProfesionales = ({ profesionalVinculado, consultorioTipo,  }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { consultorioId } = useParams();
  const navigate = useNavigate();

  const [refreshProfesionales, setRefreshProfesionales] = useState(0);
  const [idsProfesionalesVinculados, setIdsProfesionalesVinculados] = useState([]);
  const [orden, setOrden] = useState("nombre");
  const [direccion, setDireccion] = useState("asc");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");
  const [viewMode, setViewMode] = useState("table"); 
  const [showModalAsociarProfesional, setShowModalAsociarProfesional] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const {
    profesional: profesionales,
    isLoading,
    error,
  } = useProfesionalxIdConsultorio(consultorioId, refreshProfesionales);


  useEffect(() => {
    if (profesionales) {
      setIdsProfesionalesVinculados(profesionales.map((p) => p.id));
    }
  }, [profesionales]);


  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 1024 ? "cards" : "table");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refrescarListaProfesionales = () => setRefreshProfesionales((prev) => prev + 1);

  const especialidades = [
    ...new Set(profesionales?.map((p) => p.especialidad).filter(Boolean) || []),
  ].sort();

  const profesionalesFiltradosYOrdenados = profesionales
    ? profesionales
        .filter((p) => !filtroEspecialidad || p.especialidad === filtroEspecialidad)
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
    if (!profesionalId) return;
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
      <FaSortAmountDown className="inline ml-2 text-indigo-600" />
    ) : (
      <FaSortAmountUp className="inline ml-2 text-indigo-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[500]">
        <FaSpinner className="animate-spin text-indigo-600 mb-4" size={50} />
        <p className="text-slate-800 font-black tracking-widest uppercase text-xs">Sincronizando Staff...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col h-screen w-full bg-slate-50 overflow-hidden animate-fade-in font-sans">
      <ToastContainer position="bottom-right" autoClose={1500} hideProgressBar />
      
      {/* HEADER PREMIUM */}
      <header className="bg-slate-900 text-white p-6 md:px-12 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/micuenta")} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <FaArrowLeft className="text-2xl" />
          </button>
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <FaUserMd className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">Staff Médico</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-2">Gestión de profesionales del centro</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/micuenta")} className="text-slate-400 hover:text-white text-4xl font-light p-2">
          <FaTimes />
        </button>
      </header>

      {/* BARRA DE ACCIONES Y FILTROS */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
        <button
          onClick={() => setShowModalAsociarProfesional(true)}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <FaUserPlus size={18} /> Vincular Profesional
        </button>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <select
              value={filtroEspecialidad}
              onChange={(e) => setFiltroEspecialidad(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm text-slate-700 focus:border-indigo-500 outline-none appearance-none transition-all"
            >
              <option value="">Todas las especialidades</option>
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 rounded-lg transition-all ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <FaList size={18} />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2.5 rounded-lg transition-all ${viewMode === "cards" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <FaThLarge size={18} />
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          {profesionalesFiltradosYOrdenados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <FaUserMd size={100} className="opacity-10 mb-6" />
              <p className="text-2xl font-black opacity-20 tracking-tighter uppercase">No hay profesionales registrados</p>
            </div>
          ) : viewMode === "cards" ? (
            /* VISTA DE CARDS */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-up">
              {profesionalesFiltradosYOrdenados.map((prof) => (
                <div key={prof.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-600 transition-all duration-500 z-0 opacity-20 group-hover:opacity-10"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <FaUserMd size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-tight">{prof.apellido}, {prof.nombre}</h3>
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">{prof.especialidad}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Matrícula</p>
                        <p className="text-sm font-black text-slate-700">{prof.matricula}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Teléfono</p>
                        <p className="text-sm font-black text-slate-700">{prof.telefono}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBotonTurnos(prof.id)}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                      >
                        Gestionar Turnos
                      </button>
                      <button
                        onClick={() => handleDesvincularProfesional(prof.id)}
                        disabled={deletingIds.has(prof.id)}
                        className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        {deletingIds.has(prof.id) ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VISTA DE TABLA */
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-8 text-left font-black text-[10px] uppercase tracking-widest cursor-pointer" onClick={() => cambiarOrden("nombre")}>
                      Profesional {getSortIcon("nombre")}
                    </th>
                    <th className="p-8 text-left font-black text-[10px] uppercase tracking-widest cursor-pointer" onClick={() => cambiarOrden("especialidad")}>
                      Especialidad {getSortIcon("especialidad")}
                    </th>
                    <th className="p-8 text-left font-black text-[10px] uppercase tracking-widest">Matrícula</th>
                    <th className="p-8 text-left font-black text-[10px] uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profesionalesFiltradosYOrdenados.map((prof) => (
                    <tr key={prof.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <FaUserMd />
                          </div>
                          <span className="font-black text-slate-800 uppercase tracking-tight">{prof.apellido}, {prof.nombre}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-black text-[10px] uppercase tracking-widest">
                          {prof.especialidad}
                        </span>
                      </td>
                      <td className="p-8 font-bold text-slate-500">{prof.matricula}</td>
                      <td className="p-8">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleBotonTurnos(prof.id)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl font-black text-[10px] tracking-widest uppercase transition-all"
                          >
                            <FaCalendarAlt /> Agenda
                          </button>
                          <button
                            onClick={() => handleDesvincularProfesional(prof.id)}
                            disabled={deletingIds.has(prof.id)}
                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            {deletingIds.has(prof.id) ? <FaSpinner className="animate-spin" /> : <FaTrashAlt size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER RESUMEN */}
      <footer className="bg-white border-t border-slate-200 px-12 py-6 flex justify-between items-center">
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Mostrando <span className="text-indigo-600">{profesionalesFiltradosYOrdenados.length}</span> profesionales
        </p>
      </footer>

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
    </div>
  );
};

export default GestionProfesionales;