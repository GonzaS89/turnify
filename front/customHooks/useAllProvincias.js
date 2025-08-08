import { useState, useEffect } from "react";
import axios from "axios";


const useAllProivincias = () => {

    const [provincias, setProvincias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtenerProvincias = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/provincias`);
                setProvincias(res.data);
            } catch (err) {
                console.error("Error al obtener coberturas", err);
                setError(err.message || "Hubo un error al cargar las provincias");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerProvincias();
    }, []);


  return { provincias, isLoading, error}
}

export default useAllProivincias
