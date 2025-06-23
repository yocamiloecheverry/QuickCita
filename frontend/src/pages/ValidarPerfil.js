import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Container,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaUserMd, FaCheckCircle, FaEdit } from "react-icons/fa";
import CustomAlert from "../components/CustomAlert";
import CustomModal from "../components/CustomModal";
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
  "Psiquiatría",
];

const SEGUROS = ["Sura", "Nueva EPS", "EPS Sanitas", "Salud Total EPS"];

const UBICACIONES = ["Norte", "Sur", "Oriente", "Occidente", "Centro"];

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

  // Estados para alertas y modales personalizados
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "info",
  });
  const [modal, setModal] = useState({
    show: false,
    title: "",
    body: "",
    onConfirm: null,
  });

  // Funciones para manejar alertas y modales
  const showAlert = (message, variant = "info") => {
    setAlert({ show: true, message, variant });
    setTimeout(
      () => setAlert({ show: false, message: "", variant: "info" }),
      4000
    );
  };

  const showModal = ({ title, body, onConfirm }) => {
    setModal({ show: true, title, body, onConfirm });
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  const handleModalCancel = () => {
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  useEffect(() => {
    api
      .get(`/perfiles_medicos/${user.id_usuario}`)
      .then((res) => {
        const data = res.data;
        setForm({
          cedula_profesional: data.cedula_profesional || "",
          especialidad: data.especialidad || "",
          ubicacion: data.ubicacion || "",
          seguro_medico: data.seguro_medico || "",
        });
        // Si ya existe un perfil completo, deshabilitar campos
        if (data.cedula_profesional && data.especialidad) {
          setDisabled(true);
          showAlert("Tu perfil ya está validado y completo", "success");
        }
      })
      .catch(() => {
        showAlert("No se pudo cargar el perfil. Intenta nuevamente.", "danger");
      })
      .finally(() => setLoading(false));
  }, [user.id_usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mostrar modal de confirmación
    showModal({
      title: "Confirmar actualización",
      body: "¿Estás seguro de que deseas guardar los cambios en tu perfil médico?",
      onConfirm: () => saveProfile(),
    });
  };

  const saveProfile = () => {
    setSaving(true);
    api
      .put(`/perfiles_medicos/${user.id_usuario}`, form)
      .then((res) => {
        showAlert(
          "¡Perfil actualizado con éxito! Tu información ha sido validada.",
          "success"
        );
        setDisabled(true);
      })
      .catch((err) => {
        console.error(err);
        const msg = err.response?.data?.message || "Error al guardar el perfil";
        showAlert(msg, "danger");
      })
      .finally(() => setSaving(false));
  };

  const handleEdit = () => {
    showModal({
      title: "Editar perfil",
      body: "¿Deseas habilitar la edición de tu perfil? Algunos campos podrían requerir nueva validación.",
      onConfirm: () => {
        setDisabled(false);
        showAlert("Modo de edición habilitado", "info");
      },
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando tu perfil médico...</p>
      </Container>
    );
  }

  return (
    <>
      {/* Alertas personalizadas */}
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant}
        onClose={() => setAlert({ show: false, message: "", variant: "info" })}
      />

      {/* Modal personalizado */}
      <CustomModal
        show={modal.show}
        title={modal.title}
        body={modal.body}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <Container className="py-4" style={{ maxWidth: 700 }}>
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light border-0 py-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaUserMd className="text-success me-2" size={24} />
                <h4 className="mb-0 text-success">Validar Perfil Médico</h4>
              </div>
              {disabled && (
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="text-success me-2" />
                  <span className="text-success fw-semibold">
                    Perfil Validado
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-3"
                    onClick={handleEdit}
                  >
                    <FaEdit className="me-1" /> Editar
                  </Button>
                </div>
              )}
            </div>
          </Card.Header>

          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Cédula profesional
                    </Form.Label>
                    <Form.Control
                      name="cedula_profesional"
                      value={form.cedula_profesional}
                      onChange={handleChange}
                      required
                      disabled={saving || disabled}
                      className="modern-input"
                      placeholder="Ingresa tu cédula profesional"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Especialidad
                    </Form.Label>
                    <Form.Select
                      name="especialidad"
                      value={form.especialidad}
                      onChange={handleChange}
                      required
                      disabled={saving || disabled}
                      className="modern-select"
                    >
                      <option value="">-- Selecciona especialidad --</option>
                      {ESPECIALIDADES.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Ubicación</Form.Label>
                    <Form.Select
                      name="ubicacion"
                      value={form.ubicacion}
                      onChange={handleChange}
                      required
                      disabled={saving || disabled}
                      className="modern-select"
                    >
                      <option value="">-- Selecciona ubicación --</option>
                      {UBICACIONES.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Seguro médico
                    </Form.Label>
                    <Form.Select
                      name="seguro_medico"
                      value={form.seguro_medico}
                      onChange={handleChange}
                      required
                      disabled={saving || disabled}
                      className="modern-select"
                    >
                      <option value="">-- Selecciona seguro --</option>
                      {SEGUROS.map((sg) => (
                        <option key={sg} value={sg}>
                          {sg}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {!disabled && (
                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="auth-btn auth-btn-primary px-4"
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Perfil"
                    )}
                  </Button>
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
