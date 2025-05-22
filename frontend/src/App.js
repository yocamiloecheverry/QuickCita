// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";        // <-- crea este archivo
import PrivateRoute from "./components/PrivateRoute";
import MedicoHome from "./pages/MedicoHome";
import ValidarPerfil from "./pages/ValidarPerfil";
import Calendario from "./pages/Calendario";
import Alertas from "./pages/Alertas";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública principal */}
          <Route path="/" element={<Home />} />

          {/* Rutas públicas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta privada: solo accesible si estás logueado */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/medico"
            element={
              <PrivateRoute roles={['medico']}>
                <MedicoHome />
              </PrivateRoute>
            }
          >
            <Route index element={<ValidarPerfil />} />
            <Route path="validar" element={<ValidarPerfil />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="alertas" element={<Alertas />} />
          </Route>

          {/* Cualquier otra ruta redirige a Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
