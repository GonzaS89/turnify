// src/dummyData.js

export const dummyDoctors = [
    {
        id: "doc-1",
        name: "Dr. Ana García",
        specialty: "Cardiología",
        location: "Av. Corrientes 123, CABA",
        bio: "Especialista en cardiología clínica y ecocardiografía con más de 15 años de experiencia, brindando atención integral y personalizada a sus pacientes.",
        availableSlots: [
            { date: "2025-07-01", time: "09:00" },
            { date: "2025-07-01", time: "10:00" },
            { date: "2025-07-02", time: "11:00" },
            { date: "2025-07-03", time: "14:00" },
        ],
        clinicId: "clinic-1",
        isIndependent: false
    },
    {
        id: "doc-2",
        name: "Dr. Juan Pérez",
        specialty: "Odontología",
        location: "Calle Falsa 123, CABA",
        bio: "Odontólogo general con enfoque en estética dental y tratamientos de blanqueamiento. Comprometido con la salud bucal y la sonrisa de sus pacientes.",
        availableSlots: [
            { date: "2025-07-01", time: "14:00" },
            { date: "2025-07-02", time: "09:30" },
            { date: "2025-07-02", time: "10:30" },
            { date: "2025-07-04", time: "16:00" },
        ],
        clinicId: "clinic-2",
        isIndependent: false
    },
    {
        id: "doc-3",
        name: "Dra. Laura Sánchez",
        specialty: "Pediatría",
        location: "Rivadavia 456, CABA",
        bio: "Pediatra con amplia experiencia en atención infantil y vacunación. Atiende a niños de todas las edades con un enfoque cariñoso y preventivo.",
        availableSlots: [
            { date: "2025-07-03", time: "09:00" },
            { date: "2025-07-03", time: "10:00" },
            { date: "2025-07-04", time: "11:00" },
            { date: "2025-07-05", time: "12:00" },
        ],
        clinicId: "clinic-1",
        isIndependent: false
    },
    {
        id: "doc-4",
        name: "Dr. Roberto Gómez",
        specialty: "Dermatología",
        location: "Av. Libertador 789, CABA",
        bio: "Dermatólogo especialista en acné, rosácea y tratamientos estéticos de la piel. Ofrece soluciones personalizadas para cada tipo de piel.",
        availableSlots: [
            { date: "2025-07-01", time: "15:00" },
            { date: "2025-07-05", time: "09:00" },
            { date: "2025-07-05", time: "10:00" },
        ],
        isIndependent: true
    },
    {
        id: "doc-5",
        name: "Lic. María Fernández",
        specialty: "Nutrición",
        location: "Santa Fe 1500, CABA",
        bio: "Nutricionista con enfoque en alimentación saludable y planes personalizados para diversas necesidades, desde control de peso hasta nutrición deportiva.",
        availableSlots: [
            { date: "2025-07-02", time: "16:00" },
            { date: "2025-07-03", time: "11:00" },
        ],
        clinicId: "clinic-1",
        isIndependent: false
    },
    {
        id: "doc-6",
        name: "Dr. Carlos Ruiz",
        specialty: "Clínica Médica",
        location: "Juncal 200, CABA",
        bio: "Médico clínico con experiencia en diagnóstico y tratamiento de enfermedades generales, enfocado en la atención integral del paciente adulto.",
        availableSlots: [
            { date: "2025-07-04", time: "09:00" },
            { date: "2025-07-04", time: "10:00" },
            { date: "2025-07-05", time: "14:00" },
        ],
        clinicId: "clinic-1",
        isIndependent: false
    }
];