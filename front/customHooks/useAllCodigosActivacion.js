import { useEffect, useState } from "react";
import axios from "axios";

const useAllCodigosActivacion = () => {
  const [codigosActivacion, setCodigosActivacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerCodigos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/codigosdisponibles`);
        setCodigosActivacion(response.data);
      } catch (err) {
        console.error("Error al obtener los codigos", err);
        setError(err.message || "Hubo un error al cargar los codigos");
      } finally {
        setIsLoading(false);
      }
    };
    obtenerCodigos();
  }, []);

  return { codigosActivacion, isLoading, error };
};

export default useAllCodigosActivacion;
