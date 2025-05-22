import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Nav } from "react-bootstrap";
import LogoutButton from "../components/LogoutButton";

export default function MedicoHome() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Si el perfil aún no tiene cédula, forzamos a validar perfil
    useEffect(() => {
        // podrías fetch /perfiles_medicos/:user.id_usuario
        // y si perfil.cedula_profesional es null => navigate('/medico/validar')
    }, []);

    return (
        <>
            <div className="d-flex justify-content-end p-3">
                <LogoutButton />
            </div>
            <Nav variant="tabs" className="justify-content-center mt-3">
                <Nav.Item>
                    <Nav.Link as={Link} to="validar">Validar Perfil</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="calendario">Calendario</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="alertas">Alertas</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="p-4">
                <Outlet />
            </div>
        </>
    );
}
