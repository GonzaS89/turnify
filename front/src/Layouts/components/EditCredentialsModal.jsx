import React, { useState, useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios'; // Importa Axios


const EditCredentialsModal = ({ isOpen, onClose, currentUsername, onSave, consultorioId }) => {
  const [newUsername, setNewUsername] = useState(currentUsername || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Sincroniza el nombre de usuario actual cuando la prop cambia
  useEffect(() => {
    setNewUsername(currentUsername || '');
    // Limpiar mensajes y campos al abrir el modal (o al cambiar currentUsername)
    setErrorMessage('');
    setSuccessMessage('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }, [currentUsername, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    setErrorMessage('');
    if (!newUsername.trim()) {
      setErrorMessage('El campo de usuario (email) no puede estar vacío.');
      return false;
    }
    if (!currentPassword.trim()) {
      setErrorMessage('Debes ingresar tu contraseña actual para realizar cambios.');
      return false;
    }
    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
        return false;
      }
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('La nueva contraseña y su confirmación no coinciden.');
        return false;
      }
    }
    return true;
  };

  // --- Lógica para interactuar con el backend (usando Axios) ---
  const updateCredentialsInBackend = async (credentials) => {
    // **REEMPLAZA ESTA URL CON LA DE TU ENDPOINT DE BACKEND REAL**
    const API_URL = 'http://localhost:3006/api/cambiarcredenciales';

    try {
      const response = await axios.put(API_URL, credentials, { // Usamos axios.put()
        headers: {
          // **IMPORTANTE**: Si usas tokens de autenticación (JWT), deberías enviarlo aquí:
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Axios automáticamente lanza un error para respuestas 4xx/5xx,
      // así que no necesitamos verificar response.ok
      return { success: true, message: response.data.message || 'Credenciales actualizadas con éxito.' };

    } catch (error) {
      console.error('Error al enviar credenciales al backend con Axios:', error);
      // Axios coloca los detalles del error en error.response.data
      const message = error.response?.data?.message || 'Ha ocurrido un error inesperado al actualizar.';
      return { success: false, message };
    }
  };
  // --- Fin de la Lógica de Backend con Axios ---


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const credentialsToUpdate = {
      id : consultorioId,  
      currentUsuario: currentUsername,
      newUsuario: newUsername,
      currentContrasena: currentPassword,
      newContrasena: newPassword.trim() ? newPassword : null,
    };

    console.log(credentialsToUpdate)

    const result = await updateCredentialsInBackend(credentialsToUpdate);

    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      onSave({ username: newUsername, passwordChanged: !!credentialsToUpdate.newPassword });

      setTimeout(() => {
        onClose();
      }, 1500);

    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative flex flex-col gap-6 max-h-[90vh] overflow-hidden">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
          aria-label="Cerrar modal"
          disabled={isLoading}
        >
          <IoIosClose className="w-6 h-6" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-800 text-center mb-4 leading-tight">
          Cambiar Credenciales
        </h2>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-5">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {/* Campo de Usuario (Email) */}
          <div>
            <label htmlFor="newUsername" className="block text-gray-700 text-base font-semibold mb-2">
              Nuevo Usuario:
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-base"
              placeholder="Nuevo usuario"
              required
              disabled={isLoading}
            />
          </div>

          {/* Campo de Contraseña Actual */}
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700 text-base font-semibold mb-2">
              Contraseña Actual:
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-base pr-10"
                placeholder="Ingresa tu contraseña actual"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                aria-label={showCurrentPassword ? "Ocultar contraseña actual" : "Mostrar contraseña actual"}
                disabled={isLoading}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Campo de Nueva Contraseña */}
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 text-base font-semibold mb-2">
              Nueva Contraseña (opcional):
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-base pr-10"
                placeholder="Deja vacío para no cambiar"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                aria-label={showNewPassword ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
                disabled={isLoading}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres si la cambias.</p>
          </div>

          {/* Campo de Confirmar Nueva Contraseña */}
          <div>
            <label htmlFor="confirmNewPassword" className="block text-gray-700 text-base font-semibold mb-2">
              Confirmar Nueva Contraseña:
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-base pr-10"
                placeholder="Confirma tu nueva contraseña"
                disabled={!newPassword.trim() || isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                aria-label={showConfirmNewPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                disabled={!newPassword.trim() || isLoading}
              >
                {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 shadow-md text-base"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-md text-base flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCredentialsModal;