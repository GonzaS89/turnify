import useProfessionalConsultorios from '../../../customHooks/useProfessionalConsultorios';
import Turnosdisponibles from './Turnosdisponibles';
import { useNavigate } from 'react-router';

const BotonesConsultorios = ({ idProfesional: profesionalId }) => {
  const { consultorios, isLoading, error } = useProfessionalConsultorios(profesionalId);

  const navigate = useNavigate();



  const tapButtonConsultorio = ( consultorio ) => {
    navigate(`/seleccionfecha/${consultorio}/${profesionalId}`);
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <div className="flex items-center space-x-2 bg-gray-50 px-5 py-2.5 rounded-full animate-pulse border border-gray-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600 font-medium">Cargando lugares...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-4 px-4">
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 inline-block font-medium">
          🚫 {error.message}
        </p>
      </div>
    );

  if (!consultorios || consultorios.length === 0)
    return (
      <div className="text-center py-4 px-4">
        <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
          No hay lugares de atención disponibles.
        </p>
      </div>
    );

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {consultorios.map((consultorio) => (
        <button
          key={consultorio.id}
          onClick={() => tapButtonConsultorio(consultorio)}
          className={`
            group relative px-5 py-3 rounded-2xl font-medium text-sm
            bg-white border border-gray-200 shadow-sm hover:shadow-lg
            transition-all duration-300 transform hover:-translate-y-1
            hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100
            active:scale-[0.98] flex flex-col min-w-[260px] max-w-xs
           
          `}
        >
          {/* Icono y título */}
          <div className="flex items-center gap-3 w-full mb-2">
            
            <h4 className="font-semibold text-gray-800 truncate flex-1 text-sm capitalize">
              {consultorio.tipo === 'particular'
                ? 'Consultorio Particular'
                : `${consultorio.tipo} ${consultorio.nombre}`
              }
            </h4>
          </div>

          {/* Dirección */}
          <p className="text-gray-600 text-opacity-75 text-xs text-center -mt-1 leading-tight">
            {consultorio.direccion} <br /> {consultorio.localidad}
          </p>

          {/* Badge de disponibilidad */}
          <div className="w-full mt-2">
            <Turnosdisponibles idProfesional={profesionalId} idConsultorio={consultorio.id} />
          </div>

          {/* Flecha de acción */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default BotonesConsultorios;