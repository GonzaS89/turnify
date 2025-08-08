import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Componentes
import UserDashboard from "./Layouts/UserDashboard";
import { Footer } from "./Footer";
import Login from "./Layouts/Login";
import Main from "./Layouts/Main";
import CrearConsultorio from "./Layouts/CrearConsultorio";
import CrearProfesional from "./Layouts/CrearProfesionalModal";
import CancelarTurno from "./Layouts/CancelarTurno";



const App = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [password, setPassword] = useState("");

  const closeLogin = () => setOpenLoginModal(false);
  const openLogin = (value = true) => setOpenLoginModal(value);
  const recibirPass = (pass) => setPassword(pass);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">

          {/* Modal de Login con glassmorphism */}
          {openLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={closeLogin}
              ></div>
              
                <Login closeLogin={closeLogin} enviarPassword={recibirPass} />
          
            </div>
          )}

          {/* Contenido principal */}
          <main className="relative flex-grow">
            <Routes>
              <Route path="/" element={<Main openLogin={openLogin} />} />

              <Route
                path="/micuenta"
                element={<UserDashboard  />}
              />

              <Route path="/crearconsultorio" element={<CrearConsultorio />} />
              <Route path="/crearprofesional" element={<CrearProfesional />} />
              <Route path="/cancelar-turno/:turnoId" element={<CancelarTurno />} />

            </Routes>
          </main>

          <Footer />
  
      </div>
    </BrowserRouter>
  );
};

export default App;