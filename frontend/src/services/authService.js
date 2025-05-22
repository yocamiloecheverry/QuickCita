import api from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/usuarios/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/usuarios/login", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
