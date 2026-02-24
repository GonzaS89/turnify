// customHooks/useProfessionalConsultorios.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useObtenerPacientesxIDConsultorio = (idConsultorio) => {
    const [pacientes, setPacientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Si no hay un professionalId válido (es null, undefined o 0),
        // reseteamos los estados y salimos de la función.
        if (!idConsultorio) {
            setPacientes([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        const fetchPacientes = async () => {
            setIsLoading(true); // Inicia el estado de carga
            setError(null);    // Limpia cualquier error anterior

            try {
           
                const response = await axios.get(`${API_URL}/api/pacientes/${idConsultorio}`);
                setPacientes(response.data);

            } catch (err) {
                console.error("Error al obtener pacientes del consultorio:", err);


                if (axios.isAxiosError(err)) {
      
                    setError(new Error(err.response?.data || err.message || `Error de red o servidor: ${err.code}`));
                } else {
                    // Otros tipos de errores no relacionados con Axios
                    setError(new Error("Ocurrió un error inesperado al cargar los pacientes."));
                }
                setPacientes([]); // Asegura que no haya datos si hubo un error
            } finally {
                setIsLoading(false); // Finaliza el estado de carga (ya sea éxito o error)
            }
        };

        // Llama a la función de fetching cuando el componente se monta o professionalId cambia
        fetchPacientes();
    }, [idConsultorio]); // Dependencias del efecto: re-ejecutar si professionalId o baseUrl cambian

    // El hook devuelve los datos, el estado de carga y el error
    return { pacientes, isLoading, error };
};

export default useObtenerPacientesxIDConsultorio;