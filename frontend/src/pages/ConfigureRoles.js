import React, { useEffect, useState } from "react";
import { Table, Form, Button, Spinner, Card, Badge } from "react-bootstrap";
import { FaTrash, FaUserCog, FaUsers } from "react-icons/fa";
import CustomAlert from "../components/CustomAlert";
import CustomModal from "../components/CustomModal";
import api from "../services/api";
import "../styles/Admin.css";

export default function ConfigureRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para alertas y modales personalizados
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "info",
  });
  const [modal, setModal] = useState({
    show: false,
    title: "",
    body: "",
    onConfirm: null,
  });

  // Funciones para manejar alertas y modales
  const showAlert = (message, variant = "info") => {
    setAlert({ show: true, message, variant });
    setTimeout(
      () => setAlert({ show: false, message: "", variant: "info" }),
      3000
    );
  };

  const showModal = ({ title, body, onConfirm }) => {
    setModal({ show: true, title, body, onConfirm });
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  const handleModalCancel = () => {
    setModal({ show: false, title: "", body: "", onConfirm: null });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/usuarios");
      setUsers(data);
    } catch (error) {
      showAlert("Error al cargar los usuarios", "danger");
    }
    setLoading(false);
  };

  const changeRole = async (id, rol) => {
    try {
      await api.put(`/admin/usuarios/${id}/rol`, { rol });
      showAlert("Rol actualizado correctamente", "success");
      setUsers((u) => u.map((x) => (x.id_usuario === id ? { ...x, rol } : x)));
    } catch (error) {
      showAlert("Error al actualizar el rol", "danger");
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/usuarios/${id}`);
      showAlert("Usuario eliminado correctamente", "success");
      setUsers((u) => u.filter((x) => x.id_usuario !== id));
    } catch (error) {
      showAlert("Error al eliminar el usuario", "danger");
    }
  };

  const handleDeleteClick = (user) => {
    showModal({
      title: "Eliminar Usuario",
      body: `¿Estás seguro de que deseas eliminar al usuario "${user.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: () => deleteUser(user.id_usuario),
    });
  };

  const getRoleBadge = (rol) => {
    const variants = {
      administrador: "danger",
      medico: "success",
      paciente: "primary",
    };
    return <Badge bg={variants[rol] || "secondary"}>{rol}</Badge>;
  };

  return (
    <>
      {/* Alertas personalizadas */}
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant}
        onClose={() => setAlert({ show: false, message: "", variant: "info" })}
      />

      {/* Modal personalizado */}
      <CustomModal
        show={modal.show}
        title={modal.title}
        body={modal.body}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />

      <div className="approve-doctors-container">
        <div className="approve-doctors-title">
          <FaUserCog className="me-2" />
          Configurar Roles de Usuario
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted">Cargando usuarios...</p>
          </div>
        ) : (
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light border-0 py-3">
              <div className="d-flex align-items-center">
                <FaUsers className="text-success me-2" />
                <span className="fw-semibold text-success">
                  Total de usuarios: {users.length}
                </span>
              </div>
            </Card.Header>

            <Table responsive className="approve-doctors-table mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol Actual</th>
                  <th>Cambiar Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id_usuario}>
                      <td className="fw-semibold">{u.nombre}</td>
                      <td className="text-muted">{u.email}</td>
                      <td>{getRoleBadge(u.rol)}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={u.rol}
                          onChange={(e) =>
                            changeRole(u.id_usuario, e.target.value)
                          }
                          className="modern-select"
                          style={{ minWidth: "140px" }}
                        >
                          <option value="paciente">Paciente</option>
                          <option value="medico">Médico</option>
                          <option value="administrador">Administrador</option>
                        </Form.Select>
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          className="btn-reject"
                          onClick={() => handleDeleteClick(u)}
                          title="Eliminar usuario"
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    </>
  );
}
