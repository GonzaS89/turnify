import { useState, useEffect} from "react";
import ConsultorioInfo from "./components/ConsultorioInfo";
import useAllProfesionals from "../../customHooks/useAllProfesionals";

const Hero = ( { enviarIds }) => {

    // CARGA DE CUSTOM HOOKS
     const { profesionales, isLoading, error } = useAllProfesionals();

    const [specialty, setSpecialty] = useState("");
    const [date, setDate] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [message, setMessage] = useState("");


    // FUNCIONES //

    useEffect(() => {
        // Solo actualizamos filteredDoctors una vez que 'profesionales' tenga datos
        if (profesionales && profesionales.length > 0) {
            let currentFilteredDoctors = profesionales;

            if (specialty) {
                currentFilteredDoctors = currentFilteredDoctors.filter(doc => doc.especialidad === specialty);
            }
            setFilteredDoctors(currentFilteredDoctors);
        } else if (!isLoading && !error) {
            setFilteredDoctors([]);
        }
    }, [specialty, profesionales, isLoading, error]); 
    
    //ENVIAR DATOS FUERA DEL COMPONENTE
        


     const handleSearch = (e) => {
        e.preventDefault();
        setMessage("Búsqueda actualizada.");
        setTimeout(() => setMessage(''), 2000);
        const resultsSection = document.getElementById('resultados-busqueda');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const recibirIdConsultorio = (id) => {
        setIdConsultorio(id);
    }

    const recibirIdProfesional = (id) => {
        setIdProfesional(id);
    }
     





  return (
    <section>
      <div
        id="hero-section"
        className="
                    bg-gradient-to-r from-blue-500 to-purple-600
                    text-center py-16 sm:py-24 rounded-3xl shadow-xl px-4 mb-16
                    relative overflow-hidden
                "
      >
        <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-16 translate-y-16"></div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
          Reserva tu turno médico de forma{" "}
          <span className="text-blue-200">rápida y sencilla</span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-12 drop-shadow-sm">
          Encuentra la especialidad y el profesional que necesitas, y agenda tu
          cita en segundos.
        </p>

        <form
          onSubmit={handleSearch}
          className="
                        flex flex-col md:flex-row justify-center items-end gap-4 md:gap-6
                        bg-white bg-opacity-90 p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto
                        transform translate-y-16 relative z-10 mb-24 md:mb-0
                    "
        >
          <div className="flex flex-col items-start w-full md:w-1/3">
            <label
              htmlFor="specialty"
              className="text-base font-semibold text-gray-700 mb-2"
            >
              Especialidad
            </label>
            <select
              id="specialty"
              name="specialty"
              className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="">Todas las especialidades</option>
              {/* Obtener especialidades únicas de todos los doctores */}
              {[...new Set(profesionales?.map((doc) => doc.especialidad))]
                .sort()
                .map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col items-start w-full md:w-1/3">
            <label
              htmlFor="date"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              Fecha (opcional)
            </label>
            <input
              type="date"
              id="date"
              className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="
                            w-full md:w-auto px-8 py-3
                            bg-green-500 text-white rounded-lg font-bold text-lg
                            hover:bg-green-600 transition-all duration-300 transform hover:scale-105
                            shadow-md hover:shadow-lg
                        "
          >
            Buscar médicos
          </button>
        </form>
      </div>

      {/* Sección de Resultados de Búsqueda: Solo para doctores ahora */}
      <div id="resultados-busqueda" className="mt-28 mb-16">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Médicos Disponibles
        </h2>

        {message && (
          <div
            className={`p-4 mb-8 rounded-lg text-white text-center font-semibold transition-all duration-300 ${
              message.includes("éxito")
                ? "bg-green-500 shadow-md"
                : "bg-red-500 shadow-md"
            }`}
          >
            {message}
          </div>
        )}

        {/* Muestra mensajes de carga, error o si no hay médicos */}
        {isLoading && (
          <p className="text-center text-blue-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-blue-100">
            Cargando profesionales...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-red-100">
            Error:{" "}
            {error.message ||
              "No se pudo cargar la información de los profesionales."}
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors?.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="
                                        bg-white rounded-2xl shadow-xl p-6 border border-gray-100
                                        transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-300
                                        group flex flex-col justify-between h-full
                                    "
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                    <img
                      src={`https://placehold.co/96x96/007bff/ffffff?text=${
                        doctor.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "MD"
                      }`}
                      alt={`Foto de ${doctor.name || "Médico"}`}
                      className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-4 border-blue-400 group-hover:border-purple-400 transition-colors duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/96x96/cccccc/000000?text=MD";
                      }}
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                        Dr. {doctor.apellido}, {doctor.nombre}
                      </h3>
                      <p className="text-blue-600 font-semibold text-lg mt-1">
                        {doctor.especialidad}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    {doctor.bio}
                  </p>
                  <ConsultorioInfo
                    professionalId={doctor.id}
                    enviarIds = {enviarIds}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-md border border-gray-100">
                No se encontraron médicos con los criterios de búsqueda. Por
                favor, intenta con otra especialidad, nombre o fecha.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
