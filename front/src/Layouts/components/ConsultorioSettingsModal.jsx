import React, { useState } from 'react';
import { FaPencilAlt, FaUserEdit } from 'react-icons/fa'; // Cambiamos FaUser por FaUserEdit para el nuevo botón
import { IoIosClose } from "react-icons/io";
import EditConsultorioModal from './EditConsultorioModal ';
import EditCredentialsModal from './EditCredentialsModal';
// **Necesitarás crear este nuevo componente de modal por separado**
// import EditCredentialsModal from './EditCredentialsModal';

const ConsultorioSettingsModal = ({ isOpen, onClose, consultorio }) => {
  const [isEditConsultorioModalOpen, setIsEditConsultorioModalOpen] = useState(false);
  const [isEditCredentialsModalOpen, setIsEditCredentialsModalOpen] = useState(false); // Nuevo estado para el modal de credenciales

  if (!isOpen) return null;

  // Funciones para el modal de edición de consultorio
  const handleOpenEditConsultorioModal = () => {
    setIsEditConsultorioModalOpen(true);
  };

  const handleCloseEditConsultorioModal = () => {
    setIsEditConsultorioModalOpen(false);
  };

  const handleSaveEditedConsultorio = (updatedData) => {
    console.log('Datos actualizados del consultorio:', updatedData);
    // Aquí enviar a la API para actualizar los datos del consultorio
    setIsEditConsultorioModalOpen(false);
    // Puedes llamar a una función de refresco de datos del consultorio si es necesario
  };

  // Funciones para el nuevo modal de edición de credenciales
  const handleOpenEditCredentialsModal = () => {
    setIsEditCredentialsModalOpen(true);
  };

  const handleCloseEditCredentialsModal = () => {
    setIsEditCredentialsModalOpen(false);
  };

  // Esta función recibirá los datos actualizados del modal EditCredentialsModal
  const handleSaveEditedCredentials = (updatedCredentials) => {
    console.log('Credenciales actualizadas:', updatedCredentials);
    // Aquí es donde deberías enviar los datos actualizados (usuario/email y contraseña) a tu API
    // Por ejemplo: updateUserCredentials(updatedCredentials);
    setIsEditCredentialsModalOpen(false); // Cierra el modal de credenciales después de guardar
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
        <div className={`
          bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full
          max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl
          flex flex-col gap-6 relative
          max-h-[90vh] overflow-hidden
        `}>
          {/* Botón de cerrar del modal de ajustes principal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
            aria-label="Cerrar modal de ajustes"
          >
            <IoIosClose className="w-6 h-6" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-800 text-center mb-4 leading-tight">
            Ajustes del Consultorio
          </h2>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {consultorio ? (
              // Contenedor principal para las dos columnas en escritorio
              <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12 text-gray-700">

                {/* --- Columna Izquierda: Datos Generales del Consultorio --- */}
                <div className="lg:w-1/2 pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-8 mb-6 lg:mb-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Datos Generales</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Nombre del Consultorio:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.nombre || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Tipo:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.tipo === 'propio' ? 'Consultorio Particular' : `Centro Médico: ${consultorio.nombre}`}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Dirección:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.direccion || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Localidad:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.localidad || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Provincia:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.provincia || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Horario de Atención:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.inicio || 'N/A'} - {consultorio.cierre || 'N/A'} Hs.</p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleOpenEditConsultorioModal}
                      className="py-2.5 px-7 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md flex items-center justify-center text-base sm:text-lg"
                      aria-label="Editar datos generales del consultorio"
                    >
                      <FaPencilAlt className="mr-2" />
                      Editar Datos
                    </button>
                  </div>
                </div>

                {/* --- Columna Derecha: Cuenta de Usuario --- */}
                <div className="lg:w-1/2 pt-6 lg:pt-0 lg:pl-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Mi Cuenta</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Usuario:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.usuario || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Contraseña:</p>
                      <p className="text-lg sm:text-xl text-gray-900">{consultorio.contrasena}</p> {/* Siempre ocultar la contraseña */}
                    </div>
                  </div>
                  <div className="flex justify-center mt-6"> {/* Eliminar gap si solo hay un botón */}
                    <button
                      onClick={handleOpenEditCredentialsModal} // Llama al nuevo handler
                      className="py-2.5 px-7 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-md flex items-center justify-center text-base sm:text-lg"
                      aria-label="Cambiar usuario y contraseña"
                    >
                      <FaUserEdit className="mr-2" /> {/* Icono más genérico para "editar usuario" */}
                      Cambiar Credenciales
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-red-500 text-center py-4">No se pudieron cargar los datos del consultorio.</p>
            )}
          </div>

          {/* Botón de cerrar ajustes principal */}
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="py-3 px-8 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md text-base sm:text-lg"
            >
              Cerrar Ajustes
            </button>
          </div>
        </div>
      </div>

      {/* Modales secundarios (renderizados condicionalmente) */}

      {/* Modal de Edición de Datos del Consultorio */}
      <EditConsultorioModal
        isOpen={isEditConsultorioModalOpen}
        onClose={handleCloseEditConsultorioModal}
        consultorio={consultorio}
        onSave={handleSaveEditedConsultorio}
      />

<EditCredentialsModal
  consultorioId={consultorio.id}
  isOpen={isEditCredentialsModalOpen}
  onClose={handleCloseEditCredentialsModal}
  currentUsername={consultorio.usuario} // Pasa el usuario/email actual desde `consultorio`
  onSave={handleSaveEditedCredentials} // La función que manejará el guardado en ConsultorioSettingsModal
/>

      {/* Nuevo Modal de Edición de Credenciales (Usuario y Contraseña) */}
      {/* Debes crear este componente: */}
      {/*
      <EditCredentialsModal
        isOpen={isEditCredentialsModalOpen}
        onClose={handleCloseEditCredentialsModal}
        currentUsername={consultorio.usuario} // Pasa el usuario/email actual
        onSave={handleSaveEditedCredentials} // Recibe { username, newPassword } o similar
      />
      */}
    </>
  );
};

export default ConsultorioSettingsModal;