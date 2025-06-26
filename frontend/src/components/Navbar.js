import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaStethoscope, FaUserMd, FaUserShield, FaUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

// Función para obtener los enlaces de navegación según el rol del usuario
function getRoleNav(role) {
  switch (role) {
    case "paciente":
      return [
        { to: "/dashboard", label: "Buscar Médicos", icon: <FaStethoscope /> },
      ];
    case "medico":
      return [
        { to: "/medico/validar", label: "Mi Perfil", icon: <FaUserMd /> },
        {
          to: "/medico/calendario",
          label: "Calendario",
          icon: <FaStethoscope />,
        },
        { to: "/medico/alertas", label: "Alertas", icon: <FaUser /> },
      ];
    case "administrador":
      return [
        { to: "/admin/medicos", label: "Aprobar Médicos", icon: <FaUserMd /> },
        {
          to: "/admin/configurar",
          label: "Configurar Roles",
          icon: <FaUserShield />,
        },
      ];
    default:
      return [];
  }
}

export default function AppNavbar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const role = user?.rol;
  const navLinks = getRoleNav(role);

  return (
    <Navbar bg="light" expand="md" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center"
        >
          <FaStethoscope className="me-2 text-primary" />
          QuickCita
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {user ? (
              navLinks.map((link) => (
                <Nav.Link
                  as={Link}
                  to={link.to}
                  key={link.to}
                  active={location.pathname.startsWith(link.to)}
                >
                  {link.icon} <span className="ms-1">{link.label}</span>
                </Nav.Link>
              ))
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
          {/* Seccion de perfil logueado */}
          {user && (
            <div className="d-flex align-items-center">
              <FaUserCircle className="me-2 text-primary" size={20} />
              <span className="me-3 fw-semibold text-primary">
                {user.nombre || user.email || "Usuario"}
              </span>
              <LogoutButton />
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
