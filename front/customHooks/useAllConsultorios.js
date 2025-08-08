import { useState, useEffect } from "react";
import axios from "axios";


const useAllConsultorios = () => {

    const [consultorios, setConsultorios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtenerConsultorios = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/consultorios`);
                setConsultorios(res.data);
            } catch (err) {
                console.error("Error al obtener turnos:", err);
                setError(err.message || "Hubo un error al cargar los turnos");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerConsultorios();
    }, []);


  return { consultorios, isLoading, error}
}

export default useAllConsultorios
