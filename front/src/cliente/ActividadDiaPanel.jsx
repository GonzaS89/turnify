// src/components/ActividadDiaPanel.jsx
import { FaUserMd, FaClock, FaCalendarDay, FaWhatsapp } from 'react-icons/fa';

const ActividadDiaPanel = ({ turnos, profesionales }) => {
  const today = new Date().toISOString().split('T')[0];

  // Agrupamos los turnos usando el nombre completo del profesional que ya viene en el objeto
  const turnosPorMedico = turnos?.reduce((acc, t) => {
    const nombreCompleto = `${t.nombreProfesional} ${t.apellidoProfesional}`;
    if (!acc[nombreCompleto]) {
      acc[nombreCompleto] = [];
    }
    acc[nombreCompleto].push(t);
    return acc;
  }, {});

  

  return (
    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-200">
            <FaCalendarDay className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">
              Actividad del Día
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
              Seguimiento de turnos por profesional
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Iteramos sobre las llaves del objeto agrupado (los nombres de los médicos) */}
        {turnosPorMedico && Object.keys(turnosPorMedico).map((medicoNombre) => (
          <ProfesionalActividadCard 
            key={medicoNombre} 
            nombreMedico={medicoNombre} 
            turnos={turnosPorMedico[medicoNombre]} 
            today={today}
          />
        ))}

        {(!turnos || turnos.length === 0) && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest italic">
              No hay turnos reservados para el día de hoy
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfesionalActividadCard = ({ nombreMedico, turnos, today }) => {
  // Filtramos para asegurarnos de mostrar solo lo de hoy (por seguridad)
  const turnosHoy = turnos.filter(t => {
    const fechaTurno = t.fecha.includes('T') ? t.fecha.split('T')[0] : t.fecha;
    return fechaTurno === today;
  }).sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
            <FaUserMd size={20} />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm uppercase tracking-tighter leading-none">
              {nombreMedico}
            </p>
            <p className="text-indigo-400 font-bold text-[9px] uppercase tracking-widest mt-1">
              {turnos[0]?.especialidad || 'Especialista'}
            </p>
          </div>
        </div>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black text-[10px] uppercase shadow-lg shadow-indigo-200">
          {turnosHoy.length} Turnos
        </span>
      </div>

      <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar space-y-3">
        {turnosHoy.map((turno) => (
          <div key={turno.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center bg-slate-900 px-3 py-2 rounded-xl min-w-[60px]">
                <span className="text-white font-black text-xs leading-none">
                  {turno.hora.slice(0, 5)}
                </span>
              </div>
              <div>
                <p className="text-slate-800 font-black text-xs uppercase tracking-tighter leading-none mb-1">
                  {turno.apellido_paciente}, {turno.nombre_paciente}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                    DNI: {turno.DNI}
                  </p>
                  <span className="text-slate-200">•</span>
                  <p className="text-emerald-600 font-bold text-[9px] uppercase tracking-widest">
                    {turno.cobertura}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones rápidas: WhatsApp */}
            {turno.telefono && (
              <a 
                href={`https://wa.me/${turno.telefono}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              >
                <FaWhatsapp size={18} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};