// frontend/src/components/LogoutButton.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

export default function LogoutButton() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/', { replace: true });
  };

  return (
    <Button variant="outline-danger" onClick={onLogout} className="ms-auto">
      Cerrar sesión
    </Button>
  );
}
