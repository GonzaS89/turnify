import axios from 'axios';
import { useState, useEffect } from 'react'

const useAllEspecialidades = () => {

    const [especialidades, setEspecialidades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const serverLocal = 'http://localhost:3006';
    const serverExterno = 'https://turnogol.site';

    useEffect(() => {
        const obtenerEspecialidades = async () => {
            try {
                const res = await axios.get(`${serverLocal}/api/especialidades`);
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
