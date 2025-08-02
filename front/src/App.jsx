import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Make sure BrowserRouter, Routes, Route are imported

// Import your components
import UserDashboard from "./Layouts/UserDashboard";
import { Footer } from "./Footer";
import Login from "./Layouts/Login";
import Main from "./Layouts/Main";


const App = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false); 


  // Function to close the login modal
  const closeLogin = () => {
    setOpenLoginModal(false);
  };

  // Function to open/close the login modal
  const openLogin = (value) => {
    setOpenLoginModal(value);
  };


  return (
    <BrowserRouter>
      {/*
        The main container for your entire application.
        All routes, header, and footer should be within this to
        ensure consistent styling and proper layout.
      */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-teal-100
 font-sans text-gray-800">

    

        {/* The Login modal should be rendered conditionally based on state */}
        {openLoginModal && <Login closeLogin={closeLogin} />}

        {/*
          Routes should be rendered within the main layout div
          so they benefit from the shared background, font, etc.
          Also, `flex-grow` on the main content area will push the footer down.
        */}
        <main className="flex-grow"> {/* Use a <main> tag for semantic correctness and apply flex-grow */}
          <Routes>
            <Route path="/" element={<Main openLogin={openLogin}/>} />
            <Route path="/micuenta" element={<UserDashboard />} />
            {/* Add more routes here as needed */}
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;