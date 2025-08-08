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

// Estilos globales en línea (para entornos sin CSS modules)
const floatingAnimation = `
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-float {
  animation: float 25s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float 30s ease-in-out infinite 5s;
}
.animate-in {
  animation: fadeIn 0.4s ease-out;
}
.slide-in-from-bottom-8 {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
`;

const App = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [password, setPassword] = useState("");

  const closeLogin = () => setOpenLoginModal(false);
  const openLogin = (value = true) => setOpenLoginModal(value);
  const recibirPass = (pass) => setPassword(pass);

  return (
    <BrowserRouter>
      <>
        {/* Inyectamos estilos globales */}
        <style>{floatingAnimation}</style>

        <div className="min-h-screen flex flex-col font-sans text-gray-800 relative overflow-hidden">
          {/* ===== FONDO PROFESIONAL EN AZUL CLARO ===== */}
          
          {/* Fondo base: gradiente suave azul cielo */}
          <div className="fixed inset-0 -z-30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50"></div>

            {/* Textura de grid sutil en azul */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(100, 160, 220, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100, 160, 220, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

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
        </div>
      </>
    </BrowserRouter>
  );
};

export default App;