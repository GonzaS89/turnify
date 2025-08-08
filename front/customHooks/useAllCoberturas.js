import { useState, useEffect } from "react";
import axios from "axios";


const useAllCoberturas = () => {

    const [coberturas, setCoberturas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtenerCoberturas = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/coberturas`);
                setCoberturas(res.data);
            } catch (err) {
                console.error("Error al obtener coberturas", err);
                setError(err.message || "Hubo un error al cargar las coberturas");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerCoberturas();
    }, []);


  return { coberturas, isLoading, error}
}

export default useAllCoberturas
