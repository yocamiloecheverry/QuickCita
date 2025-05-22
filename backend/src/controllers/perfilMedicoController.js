const PerfilMedico = require('../models/PerfilMedico');
const { Op, Sequelize } = require('sequelize');

exports.getPerfil = async (req, res) => {
  const { id_usuario } = req.params;
  const perfil = await PerfilMedico.findOne({ where: { id_usuario } });
  if (!perfil) return res.status(404).json({ message: 'Perfil no encontrado' });
  res.json(perfil);
};

exports.updatePerfil = async (req, res) => {
  const { id_usuario } = req.params;
  const { cedula_profesional, especialidad, ubicacion, seguro_medico } = req.body;

  try {
    // 1) Buscamos si ya existe
    let perfil = await PerfilMedico.findOne({ where: { id_usuario } });

    if (!perfil) {
      // 2a) No existe → lo creamos
      perfil = await PerfilMedico.create({
        id_usuario,
        cedula_profesional,
        especialidad,
        ubicacion,
        seguro_medico
      });
      return res.status(201).json(perfil);
    }

    // 2b) Existe → lo actualizamos
    await PerfilMedico.update(
      { cedula_profesional, especialidad, ubicacion, seguro_medico },
      { where: { id_usuario } }
    );
    // 3) Volvemos a buscar para devolver la versión actualizada
    perfil = await PerfilMedico.findOne({ where: { id_usuario } });
    res.json(perfil);

  } catch (err) {
    console.error('Error en updatePerfil:', err);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};
// GET /api/perfiles_medicos/filters
exports.getFilters = async (req, res) => {
  try {
    // Distinct especialidades
    const especialidades = await PerfilMedico.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('especialidad')), 'especialidad']
      ],
      where: { especialidad: { [Op.ne]: null } }
    });
    // Distinct ubicaciones
    const ubicaciones = await PerfilMedico.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('ubicacion')), 'ubicacion']
      ],
      where: { ubicacion: { [Op.ne]: null } }
    });
    // Distinct seguros médicos
    const seguros = await PerfilMedico.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('seguro_medico')), 'seguro_medico']
      ],
      where: { seguro_medico: { [Op.ne]: null } }
    });

    res.json({
      especialidades: especialidades.map(e => e.especialidad),
      ubicaciones:    ubicaciones   .map(u => u.ubicacion),
      seguros:        seguros       .map(s => s.seguro_medico),
    });
  } catch (err) {
    console.error('Error en getFilters:', err);
    res.status(500).json({ message: 'Error al obtener filtros' });
  }
};
