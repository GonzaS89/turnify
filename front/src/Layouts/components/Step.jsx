import React from 'react';
import { FaBriefcaseMedical, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const Step = ({ referencia, titulo, contenido }) => {
  const obtenerIcono = () => {
    switch (referencia) {
      case 'medico':
        return <FaBriefcaseMedical className="text-indigo-600" />;
      case 'dia':
        return <FaCalendarAlt className="text-amber-500" />;
      case 'confirmacion':
        return <FaCheckCircle className="text-emerald-500" />;
      default:
        return <FaCheckCircle className="text-emerald-500" />;
    }
  };

  return (
    <div className="
      flex flex-col items-center
      p-6
      bg-white
      rounded-2xl
      shadow-lg
      border border-gray-100
      transform transition-all duration-300
      hover:scale-105
      hover:shadow-xl
      hover:border-indigo-200
      cursor-pointer
      w-full
      max-w-xs
      mx-auto
    ">
      <div className="
        w-16 h-16
        bg-indigo-50
        rounded-full
        flex items-center justify-center
        mb-5
        transition-colors duration-300
        group-hover:bg-indigo-100
      ">
        <div className="text-2xl">
          {obtenerIcono()}
        </div>
      </div>
      <h3 className="
        text-xl
        font-bold
        text-gray-800
        mb-2
        text-center
      ">
        {titulo}
      </h3>
      <p className="
        text-gray-600
        text-center
        text-sm
        leading-relaxed
      ">
        {contenido}
      </p>
    </div>
  );
};

export default Step;