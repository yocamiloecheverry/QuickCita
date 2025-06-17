// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import heroImg from '../images/medical-hero-image-1024x576.jpg';

const Wrapper = styled(Container).attrs({ fluid: true })`
  width: 100%;
  height: 100vh;
  padding: 0 !important;
  margin: 0 !important;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function Home() {
  return (
    <Wrapper className="d-flex">
      <Row className="h-100 gx-0 w-100">
        {/* Imagen totalmente a la izquierda */}
        <Col md={6} className="p-0 h-100">
          <Img src={heroImg} alt="Ilustración gestión citas" />
        </Col>

        {/* Bloque de bienvenida centrado */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center p-0"
        >
          {/* Le quitamos h-100 y w-100 y le damos max-width */}
          <Card className="border-0" style={{ width: '90%', maxWidth: '400px' }}>
            <Card.Body className="d-flex flex-column justify-content-center text-center">
              <Card.Title as="h1" className="mb-3">
                Bienvenido a QuickCita
              </Card.Title>
              <Card.Text className="mb-4">
                Tu sistema de gestión de citas médicas
              </Card.Text>
              <div className="d-flex justify-content-center gap-2">
                <Button as={Link} to="/login" variant="primary">
                  Iniciar Sesión
                </Button>
                <Button as={Link} to="/register" variant="outline-primary">
                  Registro
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Wrapper>
  );
}
