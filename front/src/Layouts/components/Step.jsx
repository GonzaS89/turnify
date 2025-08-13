import React from 'react';
import { FaBriefcaseMedical, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const Step = ({ referencia, titulo, contenido, index, isActive = false }) => {
  // Mapeo de íconos
  const getIcon = () => {
    switch (referencia) {
      case 'medico':
        return <FaBriefcaseMedical className="w-7 h-7" />;
      case 'dia':
        return <FaCalendarAlt className="w-7 h-7" />;
      case 'confirmacion':
        return <FaCheckCircle className="w-7 h-7" />;
      default:
        return <FaCheckCircle className="w-7 h-7" />;
    }
  };

  // Color del fondo del ícono según referencia
  const getBgColor = () => {
    switch (referencia) {
      case 'medico':
        return 'bg-indigo-50 text-indigo-600';
      case 'dia':
        return 'bg-amber-50 text-amber-600';
      case 'confirmacion':
        return 'bg-emerald-50 text-emerald-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  // Color del borde en hover
  const getHoverBorderColor = () => {
    switch (referencia) {
      case 'medico':
        return 'hover:border-indigo-200 hover:shadow-indigo-100';
      case 'dia':
        return 'hover:border-amber-200 hover:shadow-amber-100';
      case 'confirmacion':
        return 'hover:border-emerald-200 hover:shadow-emerald-100';
      default:
        return 'hover:border-gray-200';
    }
  };

  return (
    <div
      className="
        group
        flex flex-col items-center
        p-8
        bg-white
        rounded-3xl
        shadow-lg
        border border-gray-100
        transition-all duration-300
        hover:scale-105
        hover:shadow-2xl
        cursor-default
        max-w-xs
        w-full
        mx-auto
        relative
        overflow-hidden
        text-center
      "
      role="article"
      aria-label={`Paso ${index}: ${titulo}`}
    >
      {/* Número del paso (decorativo, en esquina superior) */}
      <span
        className="
          absolute -top-3 -left-3 w-10 h-10
          bg-white text-gray-400
          rounded-full
          flex items-center justify-center
          font-bold text-sm
          shadow-md
          border border-gray-200
          z-10
          group-hover:scale-110
          transition-transform duration-300
        "
      >
        {index}
      </span>

      {/* Contenedor del ícono */}
      <div
        className={`
          w-16 h-16
          rounded-full
          flex items-center justify-center
          mb-6
          transition-all duration-300
          ${getBgColor()}
          group-hover:scale-110
          group-hover:shadow-md
          transform
        `}
      >
        {getIcon()}
      </div>

      {/* Título */}
      <h3
        className="
          text-xl
          font-bold
          text-gray-900
          mb-3
          leading-tight
          group-hover:text-indigo-700
          transition-colors duration-300
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
          opacity-90
        "
      >
        {contenido}
      </p>

      {/* Efecto de brillo sutil al hacer hover */}
      <div
        className="
          absolute inset-0 rounded-3xl
          bg-gradient-to-tr from-transparent via-white/30 to-transparent
          -rotate-45
          scale-0
          group-hover:scale-150
          transition-transform duration-700
          pointer-events-none
        "
      ></div>
    </div>
  );
};

export default Step;