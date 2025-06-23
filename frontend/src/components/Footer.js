import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-auto py-3">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span className="text-muted mb-2 mb-md-0">
          © {new Date().getFullYear()} QuickCita. Todos los derechos reservados.
        </span>
        <div>
          <a href="mailto:soporte@quickcita.com" className="text-muted me-3">Soporte</a>
          <a href="#" className="text-muted me-3">Términos</a>
          <a href="#" className="text-muted">Privacidad</a>
        </div>
      </Container>
    </footer>
  );
}