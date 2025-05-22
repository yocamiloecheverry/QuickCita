import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <Container fluid className="bg-light vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="text-center p-5">
              <Card.Title as="h1" className="mb-3 text-primary">
                Bienvenido a QuickCita
              </Card.Title>
              <Card.Text className="mb-4 lead">
                Tu sistema de gestión de citas médicas
              </Card.Text>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="lg"
                  className="me-sm-3"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-primary"
                  size="lg"
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