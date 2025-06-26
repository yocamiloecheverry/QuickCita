import api from "./api";

// Servicio para  manejar la autenticación de usuarios
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/usuarios/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Servicio para iniciar sesión de usuarios
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/usuarios/login", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Servicio para obtener el usuario autenticado
export const logoutUser = () => {
  localStorage.removeItem("token");
};
