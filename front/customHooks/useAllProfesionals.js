// customHooks/useAllProfesionals.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAllProfesionals = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para recargar los profesionales
  const actualizarProfesionales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3006/api/profesionales');
      setProfesionales(response.data);
    } catch (err) {
      setError('No se pudieron cargar los profesionales');
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
    actualizarProfesionales, // ← Exponemos esta función
  };
};

export default useAllProfesionals;