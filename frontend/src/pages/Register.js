// frontend/src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;
const Select = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;
const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #0056b3; }
`;
const Message = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  text-align: center;
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
`;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    red_social: "",
    rol: "paciente",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerUser(form);
      // Mostrar mensaje de éxito
      setMessage("Registro creado con éxito. En un momento será redirigido al inicio de sesión.");
      // Tras 3 segundos, redirigir a /login
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (err) {
      // Mostrar error
      setMessage(err.message || "Ocurrió un error al registrar.");
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Registro de Usuario</Title>

      {message && <Message>{message}</Message>}

      {!message && (
        <Form onSubmit={onSubmit}>
          <Input
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={onChange}
            required
            disabled={submitting}
          />
          <Input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={onChange}
            required
            disabled={submitting}
          />
          <Input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={onChange}
            required
            disabled={submitting}
          />
          <Input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={onChange}
            required
            disabled={submitting}
          />
          <Input
            name="red_social"
            placeholder="Red social (opcional)"
            value={form.red_social}
            onChange={onChange}
            disabled={submitting}
          />
          <Select
            name="rol"
            value={form.rol}
            onChange={onChange}
            required
            disabled={submitting}
          >
            <option value="paciente">Paciente</option>
            <option value="medico">Médico</option>
            <option value="administrador">Administrador</option>
          </Select>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrarse"}
          </Button>
        </Form>
      )}
      <p>
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
    </p>
    </Container>
  );
}
