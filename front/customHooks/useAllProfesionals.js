// customHooks/useAllProfesionals.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAllProfesionals = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const actualizarProfesionales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/profesionales`);
      setProfesionales(response.data);
    } catch (err) {
      setError('No se pudieron cargar los profesionales');
      console.error('Error al cargar profesionales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al inicio
  useEffect(() => {
    actualizarProfesionales();
  }, []);

  return {
    profesionales,
    isLoading,
    error,
    actualizarProfesionales, // para recargar cuando sea necesario (ej: después de crear o eliminar)
  };
};

export default useAllProfesionals;