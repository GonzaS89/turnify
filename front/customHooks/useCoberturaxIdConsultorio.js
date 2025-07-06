// customHooks/useProfessionalConsultorios.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCoberturaxIdConsultorio = (consultorioId) => {
    const [coberturas, setCoberturas] = useState([]);
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
        if (!consultorioId) {
            setCoberturas([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        const fetchCoberturas = async () => {
            setIsLoading(true); // Inicia el estado de carga
            setError(null);    // Limpia cualquier error anterior

            try {
           
                const response = await axios.get(`${baseUrl}/api/coberturas/${consultorioId}`);
                setCoberturas(response.data);

            } catch (err) {
                console.error("Error al obtener coberturas:", err);


                if (axios.isAxiosError(err)) {
      
                    setError(new Error(err.response?.data || err.message || `Error de red o servidor: ${err.code}`));
                } else {
                    // Otros tipos de errores no relacionados con Axios
                    setError(new Error("Ocurrió un error inesperado al cargar las coberturas."));
                }
                setCoberturas([]); // Asegura que no haya datos si hubo un error
            } finally {
                setIsLoading(false); // Finaliza el estado de carga (ya sea éxito o error)
            }
        };

        // Llama a la función de fetching cuando el componente se monta o professionalId cambia
        fetchCoberturas();
    }, [consultorioId, baseUrl]); // Dependencias del efecto: re-ejecutar si professionalId o baseUrl cambian

    // El hook devuelve los datos, el estado de carga y el error
    return { coberturas, isLoading, error };
};

export default useCoberturaxIdConsultorio;