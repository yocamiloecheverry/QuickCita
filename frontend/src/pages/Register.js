import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import styled from "styled-components";
import { InputGroup, Form } from "react-bootstrap";

// Regex para validar contraseña
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

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
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;
const Input = styled(Form.Control)`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;
const StyledSelect = styled(Form.Select)`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;
const StyledButton = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #0056b3; }
`;
const SuccessMessage = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  text-align: center;
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
`;
const ErrorMessage = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  text-align: center;
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

const EyeToggle = styled(InputGroup.Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: white;
  border-left: 0;               /* quita la línea divisoria izquierda */
  border-top-right-radius: .25rem;
  border-bottom-right-radius: .25rem;
  cursor: pointer;
`;

// Campo de contraseña sin radios redondeados a la derecha
const PasswordField = styled(Form.Control)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    red_social: "",
    rol: "paciente",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    // Validaciones de contraseña
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
    try {
      await registerUser({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        password: form.password,
        red_social: form.red_social,
        rol: form.rol
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
    <Container>
      <Title>Registro de Usuario</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {!success && (
        <StyledForm onSubmit={onSubmit}>
          <Input
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={onChange}
            disabled={submitting}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={onChange}
            disabled={submitting}
            required
          />
          <Input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={onChange}
            disabled={submitting}
            required
          />

          <InputGroup className="mb-3">
            <PasswordField
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={onChange}
              disabled={submitting}
              required
            />
            <EyeToggle onClick={() => setShowPassword(v => !v)}>
              {showPassword ? "🙈" : "👁️"}
            </EyeToggle>
          </InputGroup>

          <InputGroup className="mb-3">
            <PasswordField
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={onChange}
              disabled={submitting}
              required
            />
            <EyeToggle onClick={() => setShowConfirm(v => !v)}>
              {showConfirm ? "🙈" : "👁️"}
            </EyeToggle>
          </InputGroup>

          <Input
            name="red_social"
            placeholder="Red social (opcional)"
            value={form.red_social}
            onChange={onChange}
            disabled={submitting}
          />
          <StyledSelect
            name="rol"
            value={form.rol}
            onChange={onChange}
            disabled={submitting}
            required
          >
            <option value="paciente">Paciente</option>
            <option value="medico">Médico</option>
            <option value="administrador">Administrador</option>
          </StyledSelect>

          <StyledButton type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrarse"}
          </StyledButton>
        </StyledForm>
      )}

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </Container>
  );
}
