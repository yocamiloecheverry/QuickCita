import React, { useEffect, useContext } from "react";
import { Nav } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import MedicoFooter from "../components/MedicoFooter";
import { FaUserMd, FaCalendarAlt, FaBell } from "react-icons/fa";
import "../styles/Medico.css";

export default function MedicoHome() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Validación de perfil si lo necesitas
    // fetch(`/api/perfiles_medicos/${user.id_usuario}`)
    //   .then(r => r.json())
    //   .then(perf => {
    //     if (!perf.cedula_profesional) {
    //       navigate("/medico/validar", { replace: true });
    //     }
    //   });
  }, [user.id_usuario, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex justify-content-end p-3">
        <LogoutButton />
      </div>

      <div className="medico-navbar">
        <Nav variant="tabs" className="justify-content-center nav-tabs">
          <Nav.Item>
            <Nav.Link as={NavLink} to="/medico" end>
              <FaUserMd /> Validar Perfil
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/medico/calendario">
              <FaCalendarAlt /> Calendario
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/medico/alertas">
              <FaBell /> Alertas
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div className="flex-grow-1 medico-content-card">
        <Outlet />
      </div>

      <MedicoFooter />
    </div>
  );
}
