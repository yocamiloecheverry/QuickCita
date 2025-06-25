import React, { createContext, useReducer } from "react";
import { loginUser, logoutUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const handleLogin = async (credentials) => {
    try {
      const { token } = await loginUser(credentials);
      localStorage.setItem("token", token);

      // Decodificamos el JWT para extraer id_usuario y rol
      const decoded = jwtDecode(token);
      const id_usuario = decoded.id_usuario;

      const perfilResponse = await api.get(`/usuarios/profile/${id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const perfil = perfilResponse.data;

      console.log(perfil);
      // decoded tiene { id_usuario, rol, iat, exp }
      dispatch({ type: "LOGIN_SUCCESS", payload: perfil });
      return perfil; // Retornamos el usuario decodificado
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      throw err;
    }
  };

  const handleLogout = () => {
    logoutUser();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
