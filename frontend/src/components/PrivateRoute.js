// frontend/src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  // 1) Si no está autenticado, lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2) Si hay roles definidos y el rol del usuario NO coincide,
  //    lo mandamos a la página pública (Home)
  if (roles.length > 0 && (!user || !roles.includes(user.rol))) {
    return <Navigate to="/" replace />;
  }

  // 3) Si pasa todas las comprobaciones, renderizamos el children
  return children;
}
