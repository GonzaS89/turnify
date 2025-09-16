import useObtenerTurnosxFecha from "../../customHooks/useObtenerTurnosxFecha"

const EnviarRecordatorios = () => {

    const {turnos, loading, error} = useObtenerTurnosxFecha('2025-09-16');

    console.log(turnos)

    const formatearHora = (hora) => {
        if (!hora) return "N/A";
        const [h, m] = hora.split(":");
        return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
      };

      const formatearFechaSQL = (fecha) => {
        if (!fecha) return "N/A";
        const date = new Date(fecha);
        let fechaFormateada = date.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
      };
    
      const definirTitulo = (value) => {
        switch (value) {
          case 'doctor':
            return 'Dr.';
          case 'doctora':
            return 'Dra.';
          case 'licenciado':
          case 'licenciada':
            return 'Lic.';
          default:
            return '';
        }
      };

    

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1>Envío de recordartorios</h1>
        {loading && <p>Cargando turnos...</p>}
        {error && <p className="text-red-600">Error al cargar turnos: {error.message}</p>}
        {!loading && !error && (
            <div>
                <h2 className="text-xl font-semibold mb-4">Turnos para el 16 de Septiembre de 2025</h2>
                {turnos.length === 0 ? (
                    <p>No hay turnos programados para esta fecha.</p>
                ) : (
                    <ul className="space-y-3">
                        {turnos.map((turno) => (
                            <li key={turno.id} className="bg-white p-4 rounded-lg shadow">
                                <p>{formatearHora(turno.hora)}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
    </section>
  )
}

export default EnviarRecordatorios
