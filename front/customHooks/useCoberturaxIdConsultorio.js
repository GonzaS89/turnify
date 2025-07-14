// customHooks/useCoberturaxIdConsultorio.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useCoberturaxIdConsultorio = (consultorioId) => {
    const [coberturas, setCoberturas] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener los datos
    const fetchData = useCallback(async () => {
        if (!consultorioId) { // No intentar cargar si no hay ID
            setCoberturas([]); // O un estado vacío apropiado
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3006/api/coberturas/${consultorioId}`);
            setCoberturas(response.data);
        } catch (err) {
            console.error("Error fetching coberturas by consultorio ID:", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [consultorioId]); // Dependencia del ID para recargar si cambia

    useEffect(() => {
        fetchData(); // Llama a fetchData cuando el componente se monta o consultorioId cambia
    }, [fetchData]);

    // Asegúrate de devolver 'refetch' aquí
    return {
        coberturas,
        isLoading,
        error,
        refetch: fetchData // Aquí es donde expones la función para recargar
    };
};

export default useCoberturaxIdConsultorio;