import { useState, useEffect } from "react";
import axios from "axios";

const useObtenerTurnosxIdConsultorio = (idConsultorio) => {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTurnos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/api/turnosxidconsultorio/${idConsultorio}`,
        );
        setTurnos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTurnos();
  }, [idConsultorio]);

  return { turnos, isLoading, error };
};

export default useObtenerTurnosxIdConsultorio;