const Cita = require('../models/Cita');
const Usuario = require('../models/Usuario');

const createCita = async (req, res) => {
  const { id_paciente, id_medico, fecha_hora, metodo_notificacion, seguro_medico } = req.body;

  try {
    const newCita = await Cita.create({
      id_paciente,
      id_medico,
      fecha_hora,
      metodo_notificacion,
      seguro_medico,
      estado: 'pendiente',
    });

    res.status(201).json(newCita);
  } catch (error) {
    console.error('Error en createCita:', error.message);
    res.status(500).json({ message: 'Error al crear la cita' });
  }
};

const getCitasByUser = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const citas = await Cita.findAll({
      where: { id_paciente: id_usuario },
      include: [
        { model: Usuario, as: 'Medico', attributes: ['nombre', 'email'] },
      ],
    });

    res.json(citas);
  } catch (error) {
    console.error('Error en getCitasByUser:', error.message);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};

module.exports = {
  createCita,
  getCitasByUser,
};
