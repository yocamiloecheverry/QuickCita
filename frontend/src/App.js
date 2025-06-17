import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'

import MedicoHome from './pages/MedicoHome'
import ValidarPerfil from './pages/ValidarPerfil'
import Calendario from './pages/Calendario'
import Alertas from './pages/Alertas'

import AdminHome from './pages/AdminHome'
import ApproveDoctors from './pages/ApproveDoctors'
import ConfigureRoles from './pages/ConfigureRoles'

export default function App() {
  return (
    <BrowserRouter>          
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard paciente */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['paciente']}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Médico: rutas anidadas bajo /medico */}
          <Route
            path="/medico/*"
            element={
              <PrivateRoute roles={['medico']}>
                <MedicoHome />
              </PrivateRoute>
            }
          >
            <Route index    element={<ValidarPerfil />} />
            <Route path="validar"   element={<ValidarPerfil />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="alertas"    element={<Alertas />} />
          </Route>

          {/* Administrador: rutas anidadas bajo /admin */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['administrador']}>
                <AdminHome />
              </PrivateRoute>
            }
          >
            <Route index         element={<ApproveDoctors />} />
            <Route path="medicos"   element={<ApproveDoctors />} />
            <Route path="configurar" element={<ConfigureRoles />} />
          </Route>

          {/* Cualquier otra → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
