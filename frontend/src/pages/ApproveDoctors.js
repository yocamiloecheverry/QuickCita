import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Card } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import api from "../services/api";
import "../styles/Admin.css";

export default function ApproveDoctors() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch();
  }, []);

  // Función para cargar la lista de médicos pendientes
  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/medicos/pendientes");
      setList(data);
    } catch (e) {
      setMsg("Error al cargar la lista");
    }
    setLoading(false);
  };

  // Función para manejar la aprobación o rechazo de un médico
  const handle = async (id_perfil, action) => {
    try {
      if (action === "aprobar") {
        await api.put(`/admin/medicos/${id_perfil}/aprobar`);
        setMsg("Médico aprobado");
      } else {
        await api.delete(`/admin/medicos/${id_perfil}/rechazar`);
        setMsg("Médico rechazado");
      }
      fetch();
    } catch (e) {
      console.error(e);
      setMsg("Error al procesar");
    }
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="approve-doctors-container">
      <div className="approve-doctors-title">
        Aprobación de Médicos Pendientes
      </div>
      {msg && (
        <Alert variant="info" className="mb-4 text-center">
          {msg}
        </Alert>
      )}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <Card className="shadow-sm border-0">
          <Table responsive className="approve-doctors-table mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    No hay médicos pendientes por aprobar.
                  </td>
                </tr>
              ) : (
                list.map((p) => (
                  <tr key={p.id_perfil}>
                    <td>{p.Usuario.nombre}</td>
                    <td>{p.Usuario.email}</td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        className="btn-approve me-2"
                        onClick={() => handle(p.id_perfil, "aprobar")}
                        title="Aprobar"
                      >
                        <FaCheck /> Aprobar
                      </Button>
                      <Button
                        size="sm"
                        className="btn-reject"
                        onClick={() => handle(p.id_perfil, "rechazar")}
                        title="Rechazar"
                      >
                        <FaTimes /> Rechazar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
