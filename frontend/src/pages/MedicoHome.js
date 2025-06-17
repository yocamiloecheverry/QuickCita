import React, { useEffect, useContext } from "react"
import { Nav } from "react-bootstrap"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import LogoutButton from "../components/LogoutButton"

export default function MedicoHome() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Si quieres forzar validación de perfil:
    // fetch(`/api/perfiles_medicos/${user.id_usuario}`)
    //   .then(r => r.json())
    //   .then(perf => {
    //     if (!perf.cedula_profesional) {
    //       navigate("/medico/validar", { replace: true })
    //     }
    //   })
  }, [user.id_usuario, navigate])

  return (
    <>
      <div className="d-flex justify-content-end p-3">
        <LogoutButton />
      </div>

      <Nav variant="tabs" className="justify-content-center mb-3">
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/medico"      // absoluto
            end               // marca activo sólo en /medico exacto
          >
            Validar Perfil
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/medico/calendario"
          >
            Calendario
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/medico/alertas"
          >
            Alertas
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="p-4">
        <Outlet />
      </div>
    </>
  )
}
