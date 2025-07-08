import React from 'react'

const Separator = () => {
  return (
    <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-24 translate-y-24"></div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                        ¿Listo para reservar tu próximo turno?
                    </h2>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 drop-shadow-sm">
                        Únete a miles de personas que ya disfrutan de la comodidad de agendar sus citas médicas en un solo lugar.
                    </p>
                    <button className="
                        px-12 py-5 bg-white text-blue-700 font-bold text-xl rounded-full
                        hover:bg-blue-100 transition-all duration-300 transform hover:scale-105
                        shadow-lg hover:shadow-xl
                    ">
                        ¡Encuentra tu médico ahora!
                    </button>
                </section>
  )
}

export default Separator