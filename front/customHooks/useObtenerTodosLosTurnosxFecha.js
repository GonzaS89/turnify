import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


const useObtenerTodosLosTurnosxFecha = (fecha,idProf) => {

    const [turnos, setTurnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/todoslosturnosxfecha/${fecha}/${idProf}`);
                setTurnos(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnos();
    },[]);
  return {turnos, loading, error}
}

export default useObtenerTodosLosTurnosxFecha
