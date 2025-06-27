import React from 'react';

import { FaBriefcaseMedical, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";


const Step = ({ referencia, titulo, contenido }) => {

  let icono;

  function obtenerIcono() {
    icono =
      referencia === 'medico' ? <FaBriefcaseMedical /> :
        referencia === 'dia' ? <FaCalendarAlt className='text-red-400' /> : <FaCheckCircle className='text-green-500' />

    return icono
  }


  return (
    <div className="
    flex flex-col items-center
    p-8
    bg-white
    rounded-3xl
    shadow-xl
    border-2 border-transparent
    transform transition-all duration-500
    hover:scale-105
    hover:shadow-2xl
    hover:border-blue-400
    cursor-pointer
  ">
    <div className="
      w-20 h-20
      bg-blue-100
      text-blue-700
      rounded-full
      flex items-center justify-center
      font-bold text-4xl
      mb-6
      transition-all duration-500
      group-hover:bg-blue-200
    ">
      {obtenerIcono()}
    </div>
    <h3 className="
      text-2xl
      font-extrabold
      text-gray-900
      mb-3
      text-center
    ">
      {titulo}
    </h3>
    <p className="
      text-gray-700
      text-center
      text-base
      leading-relaxed
    ">
      {contenido}
    </p>
  </div>
  )
}

export default Step
