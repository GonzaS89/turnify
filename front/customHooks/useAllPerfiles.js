import { useState, useEffect } from "react";
import axios from "axios";


const useAllPerfiles = () => {

    const [perfiles, setPerfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtenerPerfiles = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/perfiles`);
                setPerfiles(res.data);
            } catch (err) {
                console.error("Error al obtener perfiles:", err);
                setError(err.message || "Hubo un error al cargar los perfiles");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerPerfiles();
    }, []);


  return { perfiles, isLoading, error}
}

export default useAllPerfiles
