// backend/src/controllers/citaController.js
const Cita = require('../models/Cita');
const Usuario = require('../models/Usuario');
const { Op } = require('sequelize');

// Importa los servicios
const { sendEmail } = require('../services/emailService');
const { sendSMS }   = require('../services/smsService');

// Crear nueva cita
const createAppointment = async (req, res) => {
  const { id_paciente, id_medico, fecha_hora, metodo_notificacion, seguro_medico } = req.body;

  try {
    // 1) crear la cita en BD
    const newCita = await Cita.create({
      id_paciente,
      id_medico,
      fecha_hora,
      metodo_notificacion,
      seguro_medico,
      estado: 'pendiente',
    });

    // 2) obtener datos del paciente para notificar
    const paciente = await Usuario.findByPk(id_paciente);
    if (!paciente) {
      console.warn(`Paciente ${id_paciente} no encontrado, omitiendo notificaciones`);
      return res.status(201).json(newCita);
    }

    // 3) Formatea la fecha en local
    const fechaFormateada = new Date(fecha_hora)
      .toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

    // 4) Enviar email de confirmación
    const asunto = 'Confirmación de cita QuickCita';
    const cuerpoText = `
Hola ${paciente.nombre},

Tu cita con el médico (ID ${id_medico}) ha quedado agendada para ${fechaFormateada}.

Recibirás recordatorios 24h y 1h antes de la cita.
¡Gracias por usar QuickCita!
    `.trim();

    await sendEmail({
      to: paciente.email,
      subject: asunto,
      text: cuerpoText,
      html: `<pre>${cuerpoText}</pre>`
    });

    // 5) Enviar SMS de confirmación
    await sendSMS({
      to: paciente.telefono,
      body: `QuickCita: tu cita está agendada para ${fechaFormateada}.`
    });

    // 6) Devolver la cita
    return res.status(201).json(newCita);

  } catch (error) {
    console.error('Error en createAppointment:', error);
    return res.status(500).json({ message: 'Error al crear la cita' });
  }
};

// Obtener citas de un paciente
const getCitasByPaciente = async (req, res) => {
  const { id_paciente } = req.params;
  try {
    const citas = await Cita.findAll({
      where: { id_paciente },
      include: [
        { model: Usuario, as: 'Medico', attributes: ['nombre', 'email'] },
      ],
    });
    return res.json(citas);
  } catch (error) {
    console.error('Error en getCitasByPaciente:', error);
    return res.status(500).json({ message: 'Error al obtener citas' });
  }
};

// Obtener citas de un médico
const getCitasByMedico = async (req, res) => {
  const { id_medico } = req.params;
  try {
    const citas = await Cita.findAll({
      where: { id_medico },
      include: [
        { model: Usuario, as: 'Paciente', attributes: ['nombre', 'email'] },
      ],
    });
    return res.json(citas);
  } catch (error) {
    console.error('Error en getCitasByMedico:', error);
    return res.status(500).json({ message: 'Error al obtener citas' });
  }
};

// Calcular slots disponibles para un médico
const getAvailableSlots = async (req, res) => {
  const { id_medico } = req.params;
  try {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);

    const citas = await Cita.findAll({
      where: {
        id_medico,
        fecha_hora: { [Op.between]: [start, end] }
      },
      attributes: ['fecha_hora']
    });
    const booked = citas.map(c => c.fecha_hora.getTime());

    const slots = [];
    let cursor = new Date(start);
    cursor.setHours(9, 0, 0, 0);

    while (cursor < end) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        for (let hour = 9; hour < 17; hour++) {
          const slot = new Date(cursor);
          slot.setHours(hour, 0, 0, 0);
          const t = slot.getTime();
          if (t > Date.now() && !booked.includes(t)) {
            slots.push(slot.toISOString());
          }
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return res.json(slots);
  } catch (err) {
    console.error('Error en getAvailableSlots:', err);
    return res.status(500).json({ message: 'Error al calcular slots' });
  }
};

module.exports = {
  createAppointment,
  getCitasByPaciente,
  getCitasByMedico,
  getAvailableSlots
};
