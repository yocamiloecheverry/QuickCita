  import React, { useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import { registerUser, loginUser } from "../services/authService";
  import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
    Alert,
  } from "react-bootstrap";
  import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
  import registerImg from "../images/istockphoto-1249742518-612x612.jpg";
  import "../styles/Auth.css";

  // Regex para validar contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

  export default function Register() {
    const navigate = useNavigate();

    // datos del registro nuevo
    const [form, setForm] = useState({
      nombre: "",
      email: "",
      telefono: "+57",
      password: "",
      confirmPassword: "",
      red_social: "",
      rol: "paciente",
    });

    // credenciales del admin existente
    const [adminCreds, setAdminCreds] = useState({
      adminEmail: "",
      adminPassword: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    const onChange = (e) => {
      const { name, value } = e.target;
      if (name === "adminEmail" || name === "adminPassword") {
        setAdminCreds((c) => ({ ...c, [name]: value }));
      } else {
        setForm((f) => ({ ...f, [name]: value }));
      }
      setError("");
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      setError("");

      // 1) Validar contraseña
      if (!passwordRegex.test(form.password)) {
        setError(
          "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un carácter especial."
        );
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("La confirmación de contraseña no coincide.");
        return;
      }

      setSubmitting(true);

      // 2) Si quieren crear un Admin, primero autenticamos al Admin existente
      if (form.rol === "administrador") {
        if (!adminCreds.adminEmail || !adminCreds.adminPassword) {
          setError(
            "Debes ingresar email y contraseña de un Administrador existente."
          );
          setSubmitting(false);
          return;
        }
        try {
          await loginUser({
            email: adminCreds.adminEmail,
            password: adminCreds.adminPassword,
          });
        } catch (err) {
          setError(err.message || "Autenticación de Admin fallida.");
          setSubmitting(false);
          return;
        }
      }

      // 3) Ya validado (o rol != admin), procedemos a registrar
      try {
        await registerUser({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          password: form.password,
          red_social: form.red_social,
          rol: form.rol,
        });

        setSuccess(
          "Registro creado con éxito. En breve serás redirigido al inicio de sesión..."
        );
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      } catch (err) {
        setError(err.message || "Ocurrió un error al registrar.");
        setSubmitting(false);
      }
    };

    return (
      <Container fluid className="auth-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <Card className="auth-card">
                <Row className="g-0">
                  {/* Imagen lateral */}
                  <Col lg={5} className="auth-image d-none d-lg-flex">
                    <img
                      src={registerImg}
                      alt="Registro QuickCita"
                      className="img-fluid"
                    />
                  </Col>

                  {/* Formulario */}
                  <Col lg={7}>
                    <div className="auth-form-container">
                      <div className="text-center mb-4">
                        <FaUserPlus size={48} className="text-primary mb-3" />
                        <h2 className="auth-title">Crear Cuenta</h2>
                        <p className="auth-subtitle">
                          Únete a QuickCita y gestiona tus citas médicas
                        </p>
                      </div>

                      {error && (
                        <Alert className="auth-alert auth-alert-danger">
                          {error}
                        </Alert>
                      )}

                      {success && (
                        <Alert className="auth-alert auth-alert-success">
                          {success}
                        </Alert>
                      )}

                      {!success && (
                        <Form onSubmit={onSubmit}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Control
                                  name="nombre"
                                  placeholder="Nombre completo"
                                  value={form.nombre}
                                  onChange={onChange}
                                  disabled={submitting}
                                  required
                                  className="modern-input"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Control
                                  name="telefono"
                                  type="tel"
                                  value={form.telefono.replace("+57", "")}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      telefono:
                                        "+57" + e.target.value.replace(/\D/g, ""), // Solo números
                                    }))
                                  }
                                  required
                                  placeholder="3001234567"
                                  maxLength={10}
                                  className="modern-input"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Control
                              name="email"
                              type="email"
                              placeholder="Correo electrónico"
                              value={form.email}
                              onChange={onChange}
                              disabled={submitting}
                              required
                              className="modern-input"
                            />
                          </Form.Group>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <InputGroup>
                                  <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={onChange}
                                    disabled={submitting}
                                    required
                                    className="modern-input password-input"
                                  />
                                  <InputGroup.Text
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                  </InputGroup.Text>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <InputGroup>
                                  <Form.Control
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    value={form.confirmPassword}
                                    onChange={onChange}
                                    disabled={submitting}
                                    required
                                    className="modern-input password-input"
                                  />
                                  <InputGroup.Text
                                    className="password-toggle"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                  >
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                  </InputGroup.Text>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Control
                                  name="red_social"
                                  placeholder="Red social (opcional)"
                                  value={form.red_social}
                                  onChange={onChange}
                                  disabled={submitting}
                                  className="modern-input"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Select
                                  name="rol"
                                  value={form.rol}
                                  onChange={onChange}
                                  disabled={submitting}
                                  required
                                  className="modern-select"
                                >
                                  <option value="paciente">Paciente</option>
                                  <option value="medico">Médico</option>
                                  <option value="administrador">
                                    Administrador
                                  </option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>

                          {form.rol === "administrador" && (
                            <div className="admin-section">
                              <h6>Verificación de Administrador</h6>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Control
                                      name="adminEmail"
                                      type="email"
                                      placeholder="Email del admin existente"
                                      value={adminCreds.adminEmail}
                                      onChange={onChange}
                                      disabled={submitting}
                                      required
                                      className="modern-input"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <InputGroup>
                                      <Form.Control
                                        type={
                                          showAdminPassword ? "text" : "password"
                                        }
                                        name="adminPassword"
                                        placeholder="Contraseña del admin"
                                        value={adminCreds.adminPassword}
                                        onChange={onChange}
                                        disabled={submitting}
                                        required
                                        className="modern-input password-input"
                                      />
                                      <InputGroup.Text
                                        className="password-toggle"
                                        onClick={() =>
                                          setShowAdminPassword(!showAdminPassword)
                                        }
                                      >
                                        {showAdminPassword ? (
                                          <FaEyeSlash />
                                        ) : (
                                          <FaEye />
                                        )}
                                      </InputGroup.Text>
                                    </InputGroup>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={submitting}
                            className="auth-btn auth-btn-primary w-100 mb-3"
                          >
                            {submitting ? "Procesando..." : "Crear Cuenta"}
                          </Button>
                        </Form>
                      )}

                      <div className="text-center">
                        <span className="text-muted">
                          ¿Ya tienes una cuenta?{" "}
                        </span>
                        <Link to="/login" className="auth-link">
                          Inicia sesión aquí
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
