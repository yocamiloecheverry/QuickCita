import React from "react";
import "../styles/Medico.css";

export default function MedicoFooter() {
  return (
    <footer className="medico-footer">
      © {new Date().getFullYear()} QuickCita · Panel Médico
    </footer>
  );
}
