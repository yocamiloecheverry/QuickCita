// frontend/src/context/AuthContext.js
import React, { createContext, useReducer, useEffect } from "react";
import { loginUser, logoutUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import socket from "../socket"; 

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

  // Cuando cambie el user, (des)conectamos el socket
  useEffect(() => {
    if (state.user?.id_usuario) {
      // Configurar token si lo necesitas en el handshake
      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();
      socket.emit("joinRoom", `user_${state.user.id_usuario}`);
    }
    return () => {
      socket.disconnect();
    };
  }, [state.user]);

  const handleLogin = async (credentials) => {
    try {
      const { token } = await loginUser(credentials);
      localStorage.setItem("token", token);

      // Decodificar JWT para extraer id y rol
      const decoded = jwtDecode(token);
      const { id_usuario } = decoded;

      // Obtener perfil completo
      const perfilRes = await api.get(
        `/usuarios/profile/${id_usuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const perfil = perfilRes.data;

      dispatch({ type: "LOGIN_SUCCESS", payload: perfil });
      return perfil;
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logoutUser(); 
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        handleLogin,
        handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
