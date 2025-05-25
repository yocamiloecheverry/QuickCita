import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';

export default function ConfigureRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async ()=>{
      setLoading(true);
      const { data } = await api.get('/admin/usuarios');
      setUsers(data);
      setLoading(false);
    })();
  },[]);

  const changeRole = async (id, rol) => {
    await api.put(`/admin/usuarios/${id}/rol`, { rol });
    setMsg('Rol actualizado');
    setTimeout(()=>setMsg(''),2000);
    setUsers(u => u.map(x => x.id_usuario===id?{...x,rol}:x));
  };

  const del = async id => {
    if(!window.confirm('Eliminar usuario?')) return;
    await api.delete(`/admin/usuarios/${id}`);
    setMsg('Usuario eliminado');
    setUsers(u=>u.filter(x=>x.id_usuario!==id));
  };

  return (
    <>
      {msg && <Alert variant="info">{msg}</Alert>}
      {loading ? <Spinner animation="border" /> : (
        <Table bordered hover>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Eliminar</th></tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id_usuario}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={u.rol}
                    onChange={e=>changeRole(u.id_usuario,e.target.value)}
                  >
                    <option value="paciente">Paciente</option>
                    <option value="medico">Médico</option>
                    <option value="administrador">Administrador</option>
                  </Form.Select>
                </td>
                <td>
                  <Button size="sm" variant="danger" onClick={()=>del(u.id_usuario)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
