import axios from 'axios';
import { useState, useEffect } from 'react';
const useObtenerTurnoxID = (id) => {

    const [turno, setTurno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
    useEffect(() => {
        const fetchTurno = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3006/api/todoslosturnos/${id}`);
                setTurno(response.data);
                setMensaje({ tipo: 'exito', texto: 'Turno obtenido correctamente.' });
            } catch (err) {
                setError(err);
                setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al obtener el turno.' });
            }   
            finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchTurno();
        } else {
            setMensaje({ tipo: 'error', texto: 'ID de turno no válido.' });
            setLoading(false);
        }
    }, [id]);

    return { turno, loading, error, mensaje };
}



export default useObtenerTurnoxID