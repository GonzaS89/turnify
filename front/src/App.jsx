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
      <>

      

      
     

       
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50"></div>

    
          {/* Capa de profundidad: degradado vertical para mejorar texto */}
          <div className="fixed inset-0 -z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/60"></div>
          </div>

          {/* Formas flotantes difuminadas (blobs azules) */}
          <div
            className="fixed w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-60 -z-10 animate-float"
            style={{ left: "10%", top: "15%" }}
          ></div>

          <div
            className="fixed w-80 h-80 bg-cyan-100 rounded-full blur-2xl opacity-70 -z-10 animate-float-delayed"
            style={{ right: "5%", top: "60%" }}
          ></div>

          <div
            className="fixed w-72 h-72 bg-blue-100 rounded-full blur-xl opacity-50 -z-10"
            style={{ right: "15%", bottom: "10%" }}
          ></div>

          {/* Overlay final para contraste */}
          <div className="fixed inset-0 -z-10 bg-white/10 backdrop-blur-[1px] pointer-events-none"></div>

          {/* ======================== FIN DEL FONDO ======================== */}

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
  
      </>
    </BrowserRouter>
  );
};

export default App;