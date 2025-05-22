import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ESPECIALIDADES = [
  "Medicina General",
  "Cardiología",
  "Dermatología",
  "Pediatría",
  "Neurología",
  "Oncología",
  "Ginecología",
  "Oftalmología",
  "Psiquiatría"
];

const SEGUROS = [
  "Sura",
  "Nueva EPS",
  "EPS Sanitas",
  "Salud Total EPS"
];

const UBICACIONES = [
  "Norte",
  "Sur",
  "Oriente",
  "Occidente",
  "Centro"
];

export default function ValidarPerfil() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    cedula_profesional: "",
    especialidad: "",
    ubicacion: "",
    seguro_medico: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/perfiles_medicos/${user.id_usuario}`)
      .then(res => {
        const data = res.data;
        setForm({
          cedula_profesional: data.cedula_profesional || "",
          especialidad:       data.especialidad       || "",
          ubicacion:          data.ubicacion          || "",
          seguro_medico:      data.seguro_medico      || "",
        });
        // Si ya existe un perfil completo, deshabilitar campos
        if (data.cedula_profesional && data.especialidad) {
          setDisabled(true);
        }
      })
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, [user.id_usuario]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    api.put(`/perfiles_medicos/${user.id_usuario}`, form)
      .then(res => {
        alert("Perfil actualizado con éxito");
        setError("");
        setDisabled(true);
      })
      .catch(err => {
        console.error(err);
        const msg = err.response?.data?.message || "Error al guardar";
        setError(msg);
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 600 }}>
      <h3>Validar/Completar Perfil Médico</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Cédula profesional</Form.Label>
          <Form.Control
            name="cedula_profesional"
            value={form.cedula_profesional}
            onChange={handleChange}
            required
            disabled={saving || disabled}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Especialidad</Form.Label>
          <Form.Select
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            required
            disabled={saving || disabled}
          >
            <option value="">-- Selecciona especialidad --</option>
            {ESPECIALIDADES.map(sp => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <Form.Select
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            required
            disabled={saving || disabled}
          >
            <option value="">-- Selecciona ubicación --</option>
            {UBICACIONES.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Seguro médico</Form.Label>
          <Form.Select
            name="seguro_medico"
            value={form.seguro_medico}
            onChange={handleChange}
            required
            disabled={saving || disabled}
          >
            <option value="">-- Selecciona seguro --</option>
            {SEGUROS.map(sg => (
              <option key={sg} value={sg}>{sg}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {!disabled && (
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Perfil"}
          </Button>
        )}
      </Form>
    </Container>
  );
}
