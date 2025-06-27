import React from 'react'

const Testimonial = ( { testimonio, persona, causa } ) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
    <p className="text-gray-700 italic mb-4">
        {testimonio}
    </p>
    <p className="font-bold text-blue-600">- {persona}, (consulta {causa})</p>
</div>
  )
}

export default Testimonial
