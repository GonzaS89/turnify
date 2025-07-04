// customHooks/useProfessionalConsultorios.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useProfessionalConsultorios = (professionalId) => {
    const [consultorios, setConsultorios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define las URLs de los servidores
    const serverLocal = 'http://localhost:3006';
    const serverExterno = 'https://turnogol.site';

    // Determina la URL base según el entorno
    // Para simplificar, si estamos en localhost, usamos serverLocal; de lo contrario, serverExterno.
    // Una solución más robusta usaría process.env.NODE_ENV para diferenciar.
    const baseUrl = window.location.hostname === 'localhost' ? serverLocal : serverExterno;

    useEffect(() => {
        // Si no hay un professionalId válido (es null, undefined o 0),
        // reseteamos los estados y salimos de la función.
        if (!professionalId) {
            setConsultorios([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        const fetchConsultorios = async () => {
            setIsLoading(true); // Inicia el estado de carga
            setError(null);    // Limpia cualquier error anterior

            try {
                // Realizamos la petición GET usando Axios
                // Axios devuelve la respuesta en un objeto con una propiedad 'data'
                const response = await axios.get(`${baseUrl}/api/consultorios/${professionalId}`);

                // Los datos de la respuesta ya están disponibles y parseados en `response.data`
                setConsultorios(response.data);

            } catch (err) {
                // Captura y maneja los errores de la petición
                console.error("Error al obtener consultorios del profesional:", err);

                // Determina el mensaje de error según el tipo de error de Axios
                if (axios.isAxiosError(err)) {
                    // Si el error es de Axios (ej. respuesta 4xx/5xx del servidor, error de red)
                    // Intentamos obtener el mensaje de error del cuerpo de la respuesta del servidor
                    setError(new Error(err.response?.data || err.message || `Error de red o servidor: ${err.code}`));
                } else {
                    // Otros tipos de errores no relacionados con Axios
                    setError(new Error("Ocurrió un error inesperado al cargar los consultorios."));
                }
                setConsultorios([]); // Asegura que no haya datos si hubo un error
            } finally {
                setIsLoading(false); // Finaliza el estado de carga (ya sea éxito o error)
            }
        };

        // Llama a la función de fetching cuando el componente se monta o professionalId cambia
        fetchConsultorios();
    }, [professionalId, baseUrl]); // Dependencias del efecto: re-ejecutar si professionalId o baseUrl cambian

    // El hook devuelve los datos, el estado de carga y el error
    return { consultorios, isLoading, error };
};

export default useProfessionalConsultorios;