import { useState, useEffect } from "react";
import axios from "axios";


const useAllPerfilesProfesionalesVinculados = () => {

    const [perfilesProfesionales, setPerfilesProfesionales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtenerPerfilesProfesionales = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/perfilesyprofesionalesvinculados`);
                setPerfilesProfesionales(res.data);
            } catch (err) {
                console.error("Error al obtener perfiles y profesionales", err);
                setError(err.message || "Hubo un error al cargar los perfiles y profesionales vinculados");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerPerfilesProfesionales();
    }, []);


  return { perfilesProfesionales, isLoading, error}
}

export default useAllPerfilesProfesionalesVinculados