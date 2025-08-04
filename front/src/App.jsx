import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Tus componentes existentes
import UserDashboard from "./Layouts/UserDashboard";
import { Footer } from "./Footer";
import Login from "./Layouts/Login";
import Main from "./Layouts/Main";

// 👉 Importamos el nuevo componente de cancelación
import CancelarTurno from "./Layouts/CancelarTurno"; // Ajusta la ruta según donde lo guardes

const App = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // Funciones para manejar el modal
  const closeLogin = () => {
    setOpenLoginModal(false);
  };

  const openLogin = (value) => {
    setOpenLoginModal(value);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-teal-100 font-sans text-gray-800">
        
        {/* Modal de login (condicional) */}
        {openLoginModal && <Login closeLogin={closeLogin} />}

        {/* Contenido principal */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Main openLogin={openLogin} />} />
            <Route path="/micuenta" element={<UserDashboard />} />
            
            {/* ✅ Nueva ruta para cancelar turno */}
            <Route path="/cancelar-turno/:turnoId" element={<CancelarTurno />} />

            {/* Puedes agregar más rutas aquí */}
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;