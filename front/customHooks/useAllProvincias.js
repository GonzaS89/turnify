import { useState, useEffect } from "react";
import axios from "axios";


const useAllProivincias = () => {

    const [provincias, setProvincias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const serverLocal = 'http://localhost:3006';
    const serverExterno = 'https://turnogol.site';

    useEffect(() => {
        const obtenerProvincias = async () => {
            try {
                const res = await axios.get(`${serverLocal}/api/provincias`);
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
