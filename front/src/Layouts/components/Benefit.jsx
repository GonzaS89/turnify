import React from 'react';

const Benefit = ({ icono, titulo, contenido, delay = 0 }) => {
  return (
    <div
      className="
        group
        relative
        bg-white
        p-8
        rounded-3xl
        shadow-lg
        border border-gray-100
        transition-all duration-500
        hover:scale-105
        hover:shadow-2xl
        hover:border-indigo-200
        cursor-default
        flex flex-col
        items-center
        text-center
        h-full
        overflow-hidden
        transform
        will-change-transform
      "
      role="article"
      aria-labelledby={`benefit-title-${titulo.replace(/\s+/g, '-').toLowerCase()}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Fondo animado al hacer hover */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br from-indigo-50 via-white to-purple-50
          opacity-0 group-hover:opacity-100
          transition-opacity duration-700 ease-out
          -z-10
        "
      />

      {/* Brillo lateral animado (efecto de luz que pasa) */}
      <div
        className="
          absolute inset-0 -z-5
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          w-full h-full
          transform -skew-x-12 -translate-x-full
          group-hover:translate-x-full
          transition-transform duration-1000 ease-out
          pointer-events-none
        "
      />

      {/* Contenedor del ícono con gradiente y efecto 3D */}
      <div
        className="
          relative
          w-20 h-20
          rounded-2xl
          flex items-center justify-center
          mb-6
          text-4xl
          text-indigo-600
          bg-gradient-to-br from-indigo-50 to-blue-100
          shadow-inner
          transition-all duration-300
          transform
          group-hover:scale-110
          group-hover:shadow-lg
          group-hover:from-indigo-100
          group-hover:to-blue-200
          group-hover:shadow-indigo-200/70
        "
      >
        {icono}
      </div>

      {/* Título */}
      <h3
        id={`benefit-title-${titulo.replace(/\s+/g, '-').toLowerCase()}`}
        className="
          text-xl
          font-bold
          text-gray-900
          mb-4
          leading-tight
          transition-colors duration-300
          group-hover:text-indigo-700
        "
      >
        {titulo}
      </h3>

      {/* Descripción */}
      <p
        className="
          text-gray-600
          text-sm
          leading-relaxed
          flex-grow
          px-1
        "
      >
        {contenido}
      </p>

      {/* Línea decorativa animada en hover */}
      <div
        className="
          w-16 h-0.5
          bg-gradient-to-r from-transparent via-indigo-400 to-transparent
          rounded-full
          mt-6
          opacity-0
          group-hover:opacity-100
          transform scale-x-0
          group-hover:scale-x-100
          transition-all duration-500
          ease-out
        "
      />
    </div>
  );
};

export default Benefit;