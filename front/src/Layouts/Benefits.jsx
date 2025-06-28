import React from 'react'
import Benefit from './components/Benefit';
import { FcCalendar, FcSmartphoneTablet, FcBullish, FcSms, FcLeave } from "react-icons/fc";

const Benefits = () => {
    return (
        <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beneficios de Afiliarte a TurniFy</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                Para médicos y centros de salud, nuestra plataforma es la herramienta clave para optimizar tu gestión.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Benefit icono={<FcCalendar />} titulo={'Todo organizado'} contenido={'Reduce la carga administrativa y evita sobrecargas con un sistema de turnos 24/7.'} />
                <Benefit icono={<FcBullish />} titulo={'Mayor Visibilidad'} contenido={'Atrae nuevos pacientes y expande tu práctica profesional apareciendo en nuestro directorio.'} />
                <Benefit icono={<FcSms />} titulo={'Comunicación Fluida'} contenido={'Envía recordatorios automáticos y mantén a tus pacientes informados sin esfuerzo.'} />
                <Benefit icono={<FcSmartphoneTablet/>} titulo={'Acceso móvil'} contenido={'Tus pacientes pueden reservar, reprogramar o cancelar turnos desde su celular en cualquier momento.'} />
                <Benefit icono={<FcLeave />} titulo={'Reduce Ausencias'} contenido={'Disminuí el ausentismo de pacientes con recordatorios de turno por WhatsApp.'} />


            </div>
        </section>
    )
}

export default Benefits
