import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchDoctors } from "../services/doctorService";
import {
  createAppointment,
  getAvailableSlots,
} from "../services/appointmentService";
import { getPerfilFilters } from "../services/filterService";
import socket from "../socket";            
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomAlert from "../components/CustomAlert";
import CustomModal from "../components/CustomModal";
import "../App.css";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    especialidad: "",
    ubicacion: "",
    seguro_medico: "",
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsByDoctor, setSlotsByDoctor] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [fechaHora, setFechaHora] = useState("");
  const [notiMethod, setNotiMethod] = useState("email");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "info" });
  const [modal, setModal] = useState({ show: false, title: "", body: "", onConfirm: null });

  // Conexión a socket y escucha de 'appointmentCreated'
  useEffect(() => {
    if (!user?.id_usuario) return;

    // Nos unimos al room en AuthContext, aquí solo escuchamos
    socket.on("appointmentCreated", ({ fecha_hora, medico }) => {
      const msg = `📅 Tu cita con Dr(a). ${medico} para el ${fecha_hora} ha sido creada.`;
      showAlert(msg, "success");
    });

    return () => {
      socket.off("appointmentCreated");
    };
  }, [user]);

  // Funciones de alertas y modales
  const showAlert = (message, variant = "info") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "info" }), 4000);
  };
  const showConfirmModal = ({ title, body, onConfirm }) => {
    setModal({ show: true, title, body, onConfirm });
  };
  const handleModalConfirm = () => {
    modal.onConfirm?.();
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };
  const handleModalCancel = () => {
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  // Carga inicial de filtros
  useEffect(() => {
    getPerfilFilters()
      .then(({ especialidades: esp, ubicaciones: ubi, seguros: seg }) => {
        setEspecialidades(esp);
        setUbicaciones(ubi);
        setSeguros(seg);
      })
      .catch((err) => {
        console.error("Error cargando filtros:", err);
        showAlert("Error al cargar los filtros de búsqueda", "danger");
      });
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Manejar búsqueda de médicos
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docs = await searchDoctors(filters);
      setDoctors(docs);
      if (docs.length === 0) {
        showAlert("No se encontraron médicos con esos filtros", "warning");
        setSlotsByDoctor({});
        return;
      }
      const map = {};
      await Promise.all(
        docs.map(async (doc) => {
          map[doc.id_usuario] = await getAvailableSlots(doc.id_usuario);
        })
      );
      setSlotsByDoctor(map);
      showAlert(`Se encontraron ${docs.length} médicos disponibles`, "success");
    } catch (err) {
      console.error("Error buscando médicos:", err);
      showAlert(err.message || "Error al buscar médicos", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de agendamiento
  const openModal = (doctor, slot) => {
    setSelectedDoctor(doctor);
    setFechaHora(slot);
    setShowModal(true);
  };

  // Manejar agendamiento de cita
  const handleAppointment = () => {
    if (!fechaHora) {
      showAlert("Selecciona fecha y hora", "warning");
      return;
    }
    showConfirmModal({
      title: "Confirmar cita médica",
      body: `¿Agendar cita con Dr(a). ${selectedDoctor.nombre} el ${new Date(fechaHora).toLocaleString()}?`,
      onConfirm: confirmAppointment,
    });
  };

  // Confirmar agendamiento de cita
  const confirmAppointment = async () => {
    try {
      await createAppointment({
        id_paciente: user.id_usuario,
        id_medico: selectedDoctor.id_usuario,
        fecha_hora: fechaHora,
        metodo_notificacion: notiMethod,
        seguro_medico: selectedDoctor.PerfilMedico?.seguro_medico || "",
      });
      setShowModal(false);
      showAlert("¡Cita agendada! - Revisa tu correo electronico", "success");
      // actualizar slots
      const updated = await getAvailableSlots(selectedDoctor.id_usuario);
      setSlotsByDoctor((prev) => ({
        ...prev,
        [selectedDoctor.id_usuario]: updated,
      }));
    } catch (err) {
      console.error("Error agendando cita:", err);
      showAlert(err.message || "Error al agendar cita", "danger");
    }
  };

  return (
    <>
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant}
        onClose={() => setAlert({ show: false, message: "", variant: "info" })}
      />
      <CustomModal
        show={modal.show}
        title={modal.title}
        body={modal.body}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <div className="app-layout">
        <AppNavbar />
        <div className="app-content">
          <Container className="py-5 d-flex flex-column">
            {/* Form de filtros */}
            <Form onSubmit={handleSearch}>
              <Row className="g-3">
                <Col md>
                  <Form.Select
                    name="especialidad"
                    value={filters.especialidad}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Especialidad --</option>
                    {especialidades.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md>
                  <Form.Select
                    name="ubicacion"
                    value={filters.ubicacion}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Ubicación --</option>
                    {ubicaciones.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md>
                  <Form.Select
                    name="seguro_medico"
                    value={filters.seguro_medico}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Seguro médico --</option>
                    {seguros.map((sg) => (
                      <option key={sg} value={sg}>{sg}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md="auto">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Lista de doctores y sus slots */}
            <Row className="mt-4 g-3">
              {doctors.map((doc) => (
                <Col key={doc.id_usuario} xs={12} md={6} lg={4}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{doc.nombre}</Card.Title>
                      <Card.Text>
                        <strong>Especialidad:</strong> {doc.PerfilMedico?.especialidad}<br />
                        <strong>Ubicación:</strong> {doc.PerfilMedico?.ubicacion}
                      </Card.Text>
                      <div style={{ maxHeight: 120, overflowY: "auto" }}>
                        {slotsByDoctor[doc.id_usuario]?.length > 0 ? (
                          slotsByDoctor[doc.id_usuario].map((slot) => (
                            <div
                              key={slot}
                              className="d-flex justify-content-between align-items-center mb-1"
                            >
                              <small>{new Date(slot).toLocaleString()}</small>
                              <Button size="sm" onClick={() => openModal(doc, slot)}>
                                Reservar
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No hay horarios disponibles</p>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Modal inline para agendar */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Agendar con {selectedDoctor?.nombre}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha y hora</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={new Date(fechaHora).toLocaleString()}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Método de notificación</Form.Label>
                  <Form.Select
                    value={notiMethod}
                    onChange={(e) => setNotiMethod(e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Email y SMS</option>
                  </Form.Select>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleAppointment}>
                  Confirmar Cita
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
}
