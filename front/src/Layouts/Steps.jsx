import React from 'react';
import Step from './components/Step';

const Steps = () => {

    const contenidoSteps = [
        {
            titulo: 'Busca a tu médico',
            contenido: 'Usa el buscador para filtrar por especialidad, nombre o fecha y encuentra al profesional ideal.',
            referencia: 'medico'
        },
        {
            titulo: 'Elige un horario',
            contenido: 'Selecciona el turno que mejor se adapte a tu agenda de los horarios disponibles.',
            referencia: 'dia'
        },
        {
            titulo: 'Confirma y listo',
            contenido: 'Completa tus datos y recibe la confirmación de tu turno al instante.',
            referencia: 'ok'
        }
    ];

    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-white/70 rounded-2xl" id='info'>
            <div className="container mx-auto px-4">
                <div className="text-center mb-14 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                        Agenda tu turno en <span className="text-blue-600">3 simples pasos</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Rápido, fácil y sin complicaciones. Tu salud merece lo mejor.
                    </p>
                </div>
                
                <div className="relative">
                    {/* Línea horizontal decorativa (solo en escritorio) */}
                    <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 -translate-y-1/2 z-0"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                        {contenidoSteps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Número de paso (solo visible en escritorio) */}
                                
                                <Step 
                                    key={index} 
                                    referencia={step.referencia} 
                                    titulo={step.titulo} 
                                    contenido={step.contenido} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Steps;
