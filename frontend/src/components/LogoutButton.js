import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import CustomModal from './CustomModal';
import CustomAlert from './CustomAlert';

export default function LogoutButton() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para modal y alerta
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  const onLogout = () => {
    handleLogout();
    setShowModal(false);
    setAlert({ show: true, message: "Sesión cerrada correctamente", variant: "success" });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
      navigate('/', { replace: true });
    }, 1200);
  };

  return (
    <>
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant}
        onClose={() => setAlert({ show: false, message: "", variant: "success" })}
      />
      <CustomModal
        show={showModal}
        title="Cerrar sesión"
        body="¿Estás seguro de que deseas cerrar tu sesión?"
        onConfirm={onLogout}
        onCancel={() => setShowModal(false)}
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
      />
      <Button
        variant="outline-danger"
        onClick={() => setShowModal(true)}
        className="ms-auto d-flex align-items-center"
      >
        <FaSignOutAlt className="me-2" />
        Cerrar sesión
      </Button>
    </>
  );
}