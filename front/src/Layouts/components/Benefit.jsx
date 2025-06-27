import React from 'react'

const Benefit = ( { icono, titulo, contenido }) => {
    return (
      <div className="
      bg-white
      p-8
      rounded-3xl
      shadow-xl
      border-2 border-gray-100
      transform
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:shadow-2xl
      hover:border-blue-400
      cursor-pointer
      flex flex-col items-center
    ">
      <div className="
        text-7xl
        mb-4
        text-blue-600
      ">
        {icono}
      </div>
      <h3 className="
        text-2xl
        font-bold
        text-gray-900
        mb-2
      ">
        {titulo}
      </h3>
      <p className="
        text-gray-700
        text-base
      ">
        {contenido}
      </p>
    </div>
    )
}

export default Benefit
