// src/pages/AdminHome.js
import React from 'react'
import { Nav, Row, Col } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'

export default function AdminHome() {
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                as={NavLink}
                to="/admin"       // ruta absoluta al index de Admin
                end               // marca activo solo en /admin exacto
              >
                Aprobar Médicos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={NavLink}
                to="/admin/configurar"  // ruta absoluta a configurar
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

      {/* Aquí renderiza la subruta correspondiente */}
      <Outlet />
    </>
  )
}
