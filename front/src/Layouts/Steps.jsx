import React from 'react';
import Step from './components/Step';

const Steps = () => {

    const contenidoSteps = 
    [
            {
                titulo: 'Busca a tu médico',
                contenido: 'Usa el buscador para filtrar por especialidad, nombre o fecha y encuentra al profesional ideal.',
                referencia:'medico'
            },
            {
                titulo: 'Elige un horario',
                contenido: 'Selecciona el turno que mejor se adapte a tu agenda de los horarios disponibles.',
                referencia:'dia'
            },
            {
                titulo: 'Confirma y listo',
                contenido: 'Completa tus datos y recibe la confirmación de tu turno al instante.',
                referencia:'ok'
            }
    ]

  return (
    <section className="py-12">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Cómo funciona TurniFy?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {contenidoSteps.map((step, index) => (
            <Step key={index} referencia={step.referencia} titulo={step.titulo} contenido={step.contenido} />
        ))}
       
    </div>
</section>
  )
}

export default Steps

