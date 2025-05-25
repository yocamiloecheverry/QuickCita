import React from 'react'
import { Nav, Row, Col } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'

export default function AdminHome() {
  return (
    <>
      {/* Encabezado: tabs a la izquierda, logout a la derecha */}
      <Row className="align-items-center mb-4">
        <Col>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                as={NavLink}
                to="/admin/medicos"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Aprobar Médicos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={NavLink}
                to="/admin/configurar"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Configurar Roles
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col xs="auto">
          <LogoutButton />
        </Col>
      </Row>

      {/* Aquí renderizan las subrutas */}
      <Outlet />
    </>
  )
}
