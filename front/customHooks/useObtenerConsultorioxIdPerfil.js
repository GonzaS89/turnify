// customHooks/useProfessionalConsultorios.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useObtenerConsultorioxIdPerfil = (perfilId) => {
    const [consultorios, setConsultorios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!perfilId) {
            setConsultorios([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        const fetchConsultorio = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_URL}/api/consultoriosxidperfil/${perfilId}`);
                setConsultorios(response.data);
            } catch (err) {
                console.error("Error al obtener consultorios x id perfil:", err);

                if (axios.isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message || err.response?.data;
                    setError(new Error(serverMessage || err.message || `Error de red: ${err.code}`));
                } else {
                    setError(new Error("Ocurrió un error inesperado al cargar los consultorios."));
                }
                setConsultorios([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsultorio();
    }, [perfilId]);

    return { consultorios, isLoading, error };
};

export default useObtenerConsultorioxIdPerfil;