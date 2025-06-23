import React, { useState, useEffect, useContext } from "react";
import { Table, Container, Spinner, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaCalendarAlt } from "react-icons/fa";
import api from "../services/api";

export default function Calendario() {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/citas/medico/${user.id_usuario}`)
      .then((res) => setCitas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id_usuario]);

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light border-0 py-3">
          <div className="d-flex align-items-center">
            <FaCalendarAlt className="text-primary me-2" size={22} />
            <h4 className="mb-0 text-primary">Mi Calendario de Citas</h4>
          </div>
        </Card.Header>
        <Card.Body>
          {citas.length === 0 ? (
            <div className="text-center text-muted py-4">
              No tienes citas programadas.
            </div>
          ) : (
            <Table responsive striped hover className="mb-0">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Fecha y hora</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id_cita}>
                    <td>{c.Paciente?.nombre}</td>
                    <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
