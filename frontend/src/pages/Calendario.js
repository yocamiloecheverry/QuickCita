import React, { useState, useEffect, useContext } from "react";
import { Table, Container, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function Calendario() {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/citas/medico/${user.id_usuario}`)
      .then(res => setCitas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id_usuario]);

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5">
      <h3>Mi Calendario de Citas</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Fecha y hora</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(c => (
            <tr key={c.id_cita}>
              <td>{c.Paciente?.nombre}</td>
              <td>{new Date(c.fecha_hora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
