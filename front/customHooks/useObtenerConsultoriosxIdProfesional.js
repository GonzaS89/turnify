import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useObtenerConsultoriosxIdProfesional = (profesionalId) => {
    const [consultorios, setConsultorios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // Usamos useCallback para que la función sea estable
    const fetchConsultorio = useCallback(async () => {
        if (!profesionalId) return;

        setIsLoading(true);
        setError(null);

        try {
            // AJUSTE: La URL debe coincidir con tu app.get de Express
            const response = await axios.get(`${API_URL}/api/consultorioxidprofesional/${profesionalId}`);
            setConsultorios(response.data);
        } catch (err) {
            console.error("Error al obtener consultorios:", err);
            const serverMessage = err.response?.data?.message || err.response?.data;
            setError(new Error(serverMessage || err.message || "Error de red"));
            setConsultorios([]);
        } finally {
            setIsLoading(false);
        }
    }, [profesionalId, API_URL]); // Dependencias de la función

    useEffect(() => {
        if (!profesionalId) {
            setConsultorios([]);
            setIsLoading(false);
            return;
        }

        fetchConsultorio();
    }, [profesionalId, fetchConsultorio]); // Añadimos fetchConsultorio aquí

    return { consultorios, isLoading, error, refresh: fetchConsultorio };
};

export default useObtenerConsultoriosxIdProfesional;