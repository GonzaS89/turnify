import React from 'react'

const Benefit = ({ icono, titulo, contenido }) => {
    return (
        <div className="
            group
            bg-white
            p-8
            rounded-2xl
            shadow-lg
            border border-gray-100
            transform
            transition-all
            duration-500
            ease-out
            hover:scale-105
            hover:shadow-xl
            hover:border-indigo-300
            hover:shadow-indigo-50
            cursor-pointer
            flex flex-col items-center
            text-center
            h-full
            relative
            overflow-hidden
        ">
            {/* Efecto de fondo hover */}
            <div className="
                absolute
                inset-0
                bg-gradient-to-br
                from-indigo-50
                to-purple-50
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-500
                -z-10
            "></div>

            {/* Icono container con mejor diseño */}
            <div className="
                relative
                w-20 h-20
                bg-gradient-to-br
                from-indigo-100
                to-blue-100
                rounded-2xl
                flex items-center justify-center
                mb-6
                text-4xl
                text-indigo-600
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:shadow-lg
                group-hover:from-indigo-200
                group-hover:to-blue-200
            ">
                {icono}
            </div>

            {/* Título con mejor tipografía */}
            <h3 className="
                text-xl
                font-bold
                text-gray-800
                mb-4
                leading-tight
            ">
                {titulo}
            </h3>

            {/* Contenido con mejor legibilidad */}
            <p className="
                text-gray-600
                text-sm
                leading-relaxed
                flex-grow
            ">
                {contenido}
            </p>

            {/* Elemento decorativo opcional */}
            <div className="
                w-12
                h-1
                bg-gradient-to-r
                from-indigo-400
                to-purple-400
                rounded-full
                mt-6
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
            "></div>
        </div>
    )
}

export default Benefit