import React from "react";
import { Alert } from "react-bootstrap";

export default function CustomAlert({
  show,
  variant = "info",
  message,
  onClose,
}) {
  if (!show) return null;
  return (
    <Alert
      variant={variant}
      dismissible
      onClose={onClose}
      className="shadow-sm"
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1050,
        minWidth: 320,
        maxWidth: 400,
      }}
    >
      {message}
    </Alert>
  );
}
