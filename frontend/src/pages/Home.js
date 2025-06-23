import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import heroImg from "../images/Background1.jpg";
import logoImg from "../images/Logo.png"; 
import "../styles/Home.css";

export default function Home() {
  return (
    <Container fluid className="home-bg">
      <Row className="gx-0 flex-grow-1 w-100">
        {/* Imagen a la izquierda (oculta en mobile) */}
        <Col md={6} className="hero-img-col d-none d-md-flex">
          <img
            src={heroImg}
            alt="Ilustración gestión citas"
            className="hero-img"
          />
        </Col>

        {/* Bloque de bienvenida centrado */}
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center p-0"
          style={{ minHeight: "100vh" }}
        >
          <Card className="border-0 shadow-lg welcome-card">
            <Card.Body className="d-flex flex-column justify-content-center text-center">
              <img
                src={logoImg}
                alt="Logo QuickCita"
                className="logo-img mx-auto"
                draggable="false"
              />
              <Card.Title as="h1" className="mb-2 welcome-title">
                Bienvenido a QuickCita
              </Card.Title>
              <Card.Text className="welcome-text">
                Tu Salud, Tu Tiempo, Tu Cita en un clic
              </Card.Text>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Button
                  as={Link}
                  to="/login"
                  size="lg"
                  variant="primary"
                  className="px-4 shadow-sm"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  size="lg"
                  variant="outline-primary"
                  className="px-4 shadow-sm"
                >
                  Registro
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
