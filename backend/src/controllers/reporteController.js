const Reporte = require('../models/Reporte');

const createReporte = async (req, res) => {
  const { id_medico, tipo } = req.body;

  try {
    const newReporte = await Reporte.create({ id_medico, tipo });

    res.status(201).json(newReporte);
  } catch (error) {
    console.error('Error en createReporte:', error.message);
    res.status(500).json({ message: 'Error al crear reporte' });
  }
};

const getReportesByMedico = async (req, res) => {
  const { id_medico } = req.params;

  try {
    const reportes = await Reporte.findAll({ where: { id_medico } });

    res.json(reportes);
  } catch (error) {
    console.error('Error en getReportesByMedico:', error.message);
    res.status(500).json({ message: 'Error al obtener reportes' });
  }
};

module.exports = {
  createReporte,
  getReportesByMedico,
};
