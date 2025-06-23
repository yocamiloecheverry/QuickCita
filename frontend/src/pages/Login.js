import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  InputGroup,
  Alert 
} from "react-bootstrap";
import { FaEye, FaEyeSlash, FaSignInAlt, FaStethoscope } from "react-icons/fa";
import loginImg from '../images/360_F_541445149_jgB6YUw2O22FPldJ8DXOvzTuSblq8GJ7.jpg'; // Agrega una imagen aquí
import '../styles/Auth.css';

export default function Login() {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const decodedUser = await handleLogin(credentials);
      if (decodedUser.rol === "administrador") {
        navigate("/admin", { replace: true });
      } else if (decodedUser.rol === "medico") {
        navigate("/medico", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
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
                    src={loginImg} 
                    alt="Iniciar sesión QuickCita" 
                    className="img-fluid"
                  />
                </Col>

                {/* Formulario */}
                <Col lg={7}>
                  <div className="auth-form-container">
                    <div className="text-center mb-4">
                      <FaStethoscope size={48} className="text-primary mb-3" />
                      <h2 className="auth-title">Bienvenido de vuelta</h2>
                      <p className="auth-subtitle">Inicia sesión en tu cuenta de QuickCita</p>
                    </div>

                    {error && (
                      <Alert className="auth-alert auth-alert-danger">
                        {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-muted mb-2">
                          Correo electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Ingresa tu email"
                          name="email"
                          value={credentials.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="modern-input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-muted mb-2">
                          Contraseña
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
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

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="auth-btn auth-btn-primary w-100 mb-4"
                      >
                        <FaSignInAlt className="me-2" />
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                      </Button>
                    </Form>

                    <div className="text-center">
                      <span className="text-muted">¿No tienes una cuenta? </span>
                      <Link to="/register" className="auth-link">
                        Regístrate aquí
                      </Link>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-4 pt-3 border-top">
                      <div className="text-center">
                        <small className="text-muted">
                          ¿Olvidaste tu contraseña? 
                          <a href="#" className="auth-link ms-1">Recuperar aquí</a>
                        </small>
                      </div>
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