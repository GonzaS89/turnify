import axios from 'axios';
import { useState, useEffect } from 'react'

const useAllEspecialidades = () => {

    const [especialidades, setEspecialidades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtenerEspecialidades = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/especialidades`);
                setEspecialidades(res.data);
            } catch (err) {
                console.error("Error al obtener especialidades", err);
                setError(err.message || "Hubo un error al cargar las especialidades");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerEspecialidades();
    }, []);

  return {especialidades, isLoading, error}
    
}

export default useAllEspecialidades
