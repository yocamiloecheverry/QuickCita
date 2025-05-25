import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { InputGroup } from "react-bootstrap";
import {
  Container,
  Card,
  Form,
  Button,
  Alert
} from "react-bootstrap";

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
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ maxWidth: '400px', width: '100%' }} className="shadow-sm">
        <Card.Body>
          <Card.Title className="text-center mb-4">Iniciar Sesión</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
