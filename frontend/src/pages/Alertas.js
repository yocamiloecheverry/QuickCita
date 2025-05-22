import React, { useState, useEffect, useContext } from "react";
import { ListGroup, Container, Spinner, Badge } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function Alertas() {
  const { user } = useContext(AuthContext);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/citas/medico/${user.id_usuario}`)
      .then(res => {
        const now = new Date();
        const inOneHour = new Date(now.getTime() + 60*60*1000);
        const próximas = res.data.filter(c => {
          const citaDate = new Date(c.fecha_hora);
          return citaDate > now && citaDate <= inOneHour;
        });
        setAlertas(próximas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id_usuario]);

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5">
      <h3>Alertas (Próximas en 1 hora)</h3>
      {alertas.length === 0 && <p>No tienes citas en la próxima hora.</p>}
      <ListGroup>
        {alertas.map(c => (
          <ListGroup.Item key={c.id_cita}>
            <strong>{new Date(c.fecha_hora).toLocaleString()}</strong>{" "}
            <Badge bg="warning">Próxima</Badge><br/>
            Paciente: {c.Paciente?.nombre}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
