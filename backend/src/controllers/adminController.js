const Usuario = require('../models/Usuario');
const PerfilMedico = require('../models/PerfilMedico');

exports.getPendingDoctors = async (req, res) => {
  try {
    const docs = await PerfilMedico.findAll({
      where: { aprobado: false },
      include: [{ model: Usuario, attributes: ['id_usuario','nombre','email'] }]
    });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar médicos pendientes' });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const { id_perfil } = req.params;
    const perfil = await PerfilMedico.findByPk(id_perfil);
    if (!perfil) return res.status(404).json({ message: 'Perfil no encontrado' });
    perfil.aprobado = true;
    await perfil.save();
    res.json({ message: 'Médico aprobado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al aprobar médico' });
  }
};

exports.rejectDoctor = async (req, res) => {
  try {
    const { id_perfil } = req.params;
    const perfil = await PerfilMedico.findByPk(id_perfil);
    if (!perfil) return res.status(404).json({ message: 'Perfil no encontrado' });
    // borramos el usuario asociado
    await Usuario.destroy({ where: { id_usuario: perfil.id_usuario } });
    res.json({ message: 'Médico rechazado y eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al rechazar médico' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({ attributes:['id_usuario','nombre','email','rol'] });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rol } = req.body;
    const user = await Usuario.findByPk(id_usuario);
    if(!user) return res.status(404).json({ message:'Usuario no encontrado' });
    user.rol = rol;
    await user.save();
    res.json({ message: 'Rol actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    await Usuario.destroy({ where:{ id_usuario } });
    res.json({ message:'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
