import { useState, useEffect } from 'react';
import axios from 'axios'; 

const useProfessionalConsultorioTurnos = (profesionalId, consultorioId) => {
    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurnos = async () => {
            // Solo intentamos cargar si ambos IDs son válidos (números y no nulos/indefinidos)
            if (profesionalId === null || consultorioId === null || isNaN(profesionalId) || isNaN(consultorioId)) {
                setTurnos([]); // Limpiar turnos si los IDs no son válidos
                setIsLoading(false);
                setError(null);
                return;
            }

            setIsLoading(true); // Indicar que la carga ha comenzado
            setError(null);     // Limpiar cualquier error previo

            try {
                // Construye la URL de la API con los IDs proporcionados
                // Asegúrate de que 'http://localhost:3001' coincida con la URL de tu backend
                const response = await axios.get(`http://localhost:3006/api/turnos-profesional/${profesionalId}/${consultorioId}`);
                
                // Axios automáticamente parsea el JSON y maneja los errores HTTP en el catch
                setTurnos(response.data); // Los datos están en response.data con Axios

            } catch (err) {
                console.error("Error en useProfessionalConsultorioTurnos:", err);
                // Axios proporciona más detalles de error en err.response
                if (err.response) {
                    // El servidor respondió con un estado fuera del rango 2xx
                    setError(new Error(`Error al cargar turnos: ${err.response.status} ${err.response.statusText} - ${err.response.data.message || 'Error del servidor'}`));
                } else if (err.request) {
                    // La petición fue hecha pero no se recibió respuesta
                    setError(new Error("Error de red: No se recibió respuesta del servidor."));
                } else {
                    // Algo más ocurrió al configurar la petición
                    setError(new Error(`Error desconocido: ${err.message}`));
                }
            } finally {
                setIsLoading(false); // Indicar que la carga ha terminado (con éxito o con error)
            }
        };

        fetchTurnos(); // Llama a la función de carga cuando el componente se monta o los IDs cambian
    }, [profesionalId, consultorioId]); // Dependencias del useEffect: se re-ejecuta si cambian los IDs

    return { turnos, isLoading, error }; // Retorna los estados
};

export default useProfessionalConsultorioTurnos;
