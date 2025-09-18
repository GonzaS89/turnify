import { useState, useEffect } from "react";
import LoginAdmin from "./LoginAdmin";
import EnviarRecordatorios from "./EnviarRecordatorios";

const PanelAdmin = () => {
  const [openLoginModal, setOpenLoginModal] = useState(true); // por defecto lo abrimos... pero lo cerraremos si ya hay sesión

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const perfil = localStorage.getItem('perfil');

    // Si existen ambos, asumimos que la sesión es válida
    if (token && perfil) {
      try {
        const parsedPerfil = JSON.parse(perfil);
        // Opcional: verifica que el perfil tenga la estructura mínima
        if (parsedPerfil && parsedPerfil.usuario) {
          setOpenLoginModal(false); // ✅ ¡Ya está logueado! No mostrar modal
        }
      } catch (e) {
        console.error("Perfil corrupto en localStorage", e);
        // Opcional: limpiar localStorage si está corrupto
        localStorage.removeItem('authToken');
        localStorage.removeItem('perfil');
      }
    }
    // Si no hay token o perfil, openLoginModal sigue siendo true → muestra login
  }, []); // Solo se ejecuta al montar el componente

  return (
    <section className="flex justify-center">
      {openLoginModal && <LoginAdmin closeLogin={() => setOpenLoginModal(false)} />}
      {!openLoginModal && <EnviarRecordatorios />} {/* Solo mostrar si ya cerró login o ya estaba logueado */}
    </section>
  );
};

export default PanelAdmin;