import React, { useState, useEffect, useContext } from "react";
import { ListGroup, Container, Spinner, Card, Badge } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaBell } from "react-icons/fa";
import api from "../services/api";

export default function Alertas() {
  const { user } = useContext(AuthContext);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/citas/medico/${user.id_usuario}`)
      .then((res) => {
        const now = new Date();
        const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
        const próximas = res.data.filter((c) => {
          const citaDate = new Date(c.fecha_hora);
          return citaDate > now && citaDate <= inOneHour;
        });
        setAlertas(próximas);
      })
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
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light border-0 py-3">
          <div className="d-flex align-items-center">
            <FaBell className="text-warning me-2" size={22} />
            <h4 className="mb-0 text-warning">Alertas (Próximas en 1 hora)</h4>
          </div>
        </Card.Header>
        <Card.Body>
          {alertas.length === 0 ? (
            <div className="text-center text-muted py-4">
              No tienes citas en la próxima hora.
            </div>
          ) : (
            <ListGroup>
              {alertas.map((c) => (
                <ListGroup.Item
                  key={c.id_cita}
                  className="d-flex flex-column flex-md-row align-items-md-center justify-content-between"
                >
                  <div>
                    <strong>{new Date(c.fecha_hora).toLocaleString()}</strong>{" "}
                    <Badge bg="warning" text="dark" className="ms-2">
                      Próxima
                    </Badge>
                  </div>
                  <div>
                    Paciente:{" "}
                    <span className="fw-semibold">{c.Paciente?.nombre}</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
