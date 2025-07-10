import { useState, useEffect} from "react";
import ConsultorioInfo from "./components/ConsultorioInfo";
import useAllProfesionals from "../../customHooks/useAllProfesionals";

const Hero = ( { enviarIds } ) => {

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

    return (
        <section className="min-h-screen">
            {/* Hero Section */}
            <div
                id="hero-section"
                className="
                    relative overflow-hidden
                    bg-gradient-to-br from-blue-600 to-purple-700
                    text-center py-20 sm:py-28 lg:py-32
                    rounded-b-[3rem] shadow-2xl px-4 mb-20
                "
            >
                {/* Decorative background circles */}
                <div className="absolute top-0 left-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-x-32 -translate-y-32 blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-24 translate-y-24 blur-xl"></div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-down">
                    Reserva tu turno médico de forma{" "}
                    <span className="text-blue-200">rápida y sencilla</span>
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-16 drop-shadow-md animate-fade-in-up">
                    Encuentra la especialidad y el profesional que necesitas, y agenda tu
                    cita en segundos.
                </p>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="
                        relative z-20
                        flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8
                        bg-white bg-opacity-95 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-5xl mx-auto
                        transform translate-y-20
                        border border-blue-100 backdrop-blur-sm
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
                            className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
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
                            className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:border-gray-400"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="
                            w-full md:w-auto px-10 py-3
                            bg-green-600 text-white rounded-xl font-bold text-lg
                            hover:bg-green-700 transition-all duration-300 transform hover:scale-105
                            shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300
                        "
                    >
                        Buscar médicos
                    </button>
                </form>
            </div>

            {/* Section for Search Results */}
            <div id="resultados-busqueda" className="mt-28 mb-16 px-4">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-12 text-center">
                    Médicos Disponibles
                </h2>

                {/* Message display */}
                {message && (
                    <div
                        className={`p-4 mb-8 rounded-lg text-white text-center font-semibold transition-all duration-300 ease-in-out transform scale-100 opacity-100 ${
                            message.includes("actualizada")
                                ? "bg-blue-500 shadow-md animate-fade-in"
                                : "bg-red-500 shadow-md animate-fade-in"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Loading, Error, or No Doctors Found messages */}
                {isLoading && (
                    <p className="text-center text-blue-600 text-xl py-16 bg-white rounded-xl shadow-lg border border-blue-100 animate-pulse">
                        Cargando profesionales...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-600 text-xl py-16 bg-white rounded-xl shadow-lg border border-red-100">
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
                                        group flex flex-col justify-between h-full cursor-pointer
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
                                            className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-4 border-blue-400 group-hover:border-purple-400 transition-colors duration-300 flex-shrink-0"
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

                                    <p className="text-gray-700 mb-6 text-base leading-relaxed flex-grow">
                                        {doctor.bio}
                                    </p>
                                    <ConsultorioInfo
                                        professionalId={doctor.id}
                                        enviarIds = {enviarIds}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 text-xl col-span-full py-16 bg-white rounded-xl shadow-lg border border-gray-100">
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