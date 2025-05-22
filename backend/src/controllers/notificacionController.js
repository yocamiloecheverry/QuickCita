const Notificacion = require('../models/Notificacion');
const Cita = require('../models/Cita');

const createNotificacion = async (req, res) => {
  const { id_cita, tipo, fecha_inicio, fecha_fin, total } = req.body;

  try {
    const newNotificacion = await Notificacion.create({
      id_cita,
      tipo,
      fecha_inicio,
      fecha_fin,
      total,
    });

    res.status(201).json(newNotificacion);
  } catch (error) {
    console.error('Error en createNotificacion:', error.message);
    res.status(500).json({ message: 'Error al crear notificación' });
  }
};

const getNotificacionesByCita = async (req, res) => {
  const { id_cita } = req.params;

  try {
    const notificaciones = await Notificacion.findAll({ where: { id_cita } });

    res.json(notificaciones);
  } catch (error) {
    console.error('Error en getNotificacionesByCita:', error.message);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

module.exports = {
  createNotificacion,
  getNotificacionesByCita,
};
