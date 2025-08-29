// customHooks/useProfessionalConsultorios.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useObtenerProfesionalxIdPerfil = (perfilId) => {
    const [profesional, setProfesional] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!perfilId) {
            setProfesional([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        const fetchProfesional = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_URL}/api/profesionalxidperfil/${perfilId}`);
                setProfesional(response.data);
            } catch (err) {
                console.error("Error al obtener profesional x id perfil:", err);

                if (axios.isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message || err.response?.data;
                    setError(new Error(serverMessage || err.message || `Error de red: ${err.code}`));
                } else {
                    setError(new Error("Ocurrió un error inesperado al cargar profesional."));
                }
                setProfesional([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfesional();
    }, [perfilId]);

    return { profesional, isLoading, error };
};

export default useObtenerProfesionalxIdPerfil;