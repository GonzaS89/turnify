import {useState}  from "react";
import LoginAdmin from "./LoginAdmin";



const PanelAdmin = () => {

  const [openLoginModal, setOpenLoginModal] = useState(true);

  return (

    <seccion>
      {openLoginModal && (<LoginAdmin closeLogin={() => setOpenLoginModal(false)} />)}
    </seccion>

  )     
}

export default PanelAdmin
