import React from "react";
import { Nav, Row, Col, Container, Card } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import AppNavbar from "../components/Navbar";

export default function AdminHome() {
  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4 border-0">
        <AppNavbar />
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Outlet />
        </Card.Body>
      </Card>
    </Container>
  );
}
