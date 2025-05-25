import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api'; // instancia axios apuntando a /api

export default function ApproveDoctors() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    fetch();
  },[]);

  const fetch = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/medicos/pendientes');
    setList(data);
    setLoading(false);
  };

  const handle = async (id_perfil, action) => {
    try {
      if(action==='aprobar') {
        await api.put(`/admin/medicos/${id_perfil}/aprobar`);
        setMsg('Médico aprobado');
      } else {
        await api.delete(`/admin/medicos/${id_perfil}/rechazar`);
        setMsg('Médico rechazado');
      }
      fetch();
    } catch(e) {
      console.error(e);
      setMsg('Error al procesar');
    }
    setTimeout(()=>setMsg(''),3000);
  };

  return (
    <>
      {msg && <Alert variant="info">{msg}</Alert>}
      {loading ? <Spinner animation="border" /> : (
        <Table striped hover>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {list.map(p=>(
              <tr key={p.id_perfil}>
                <td>{p.Usuario.nombre}</td>
                <td>{p.Usuario.email}</td>
                <td>
                  <Button size="sm" onClick={()=>handle(p.id_perfil,'aprobar')}>Aprobar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={()=>handle(p.id_perfil,'rechazar')}>Rechazar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
