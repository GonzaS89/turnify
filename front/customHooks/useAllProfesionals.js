import { useState, useEffect } from "react";
import axios from "axios";


const useAllProfesionals = () => {

    const [profesionales, setProfesionales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const serverLocal = 'http://localhost:3006';
    const serverExterno = 'https://turnogol.site';

    useEffect(() => {
        const obtenerTurnos = async () => {
            try {
                const res = await axios.get(`${serverLocal}/api/profesionales`);
                setProfesionales(res.data);
            } catch (err) {
                console.error("Error al obtener turnos:", err);
                setError(err.message || "Hubo un error al cargar los turnos");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerTurnos();
    }, []);


  return { profesionales, isLoading, error}
}

export default useAllProfesionals
