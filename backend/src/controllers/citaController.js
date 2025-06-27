// backend/src/controllers/citaController.js
const Cita    = require("../models/Cita");
const Usuario = require("../models/Usuario");
const { Op }  = require("sequelize");

// Servicios de notificación
const { sendEmail } = require("../services/emailService");
const { sendSMS   } = require("../services/smsService");

/**
 * Crea una cita, lanza email/SMS en background y emite un evento vía Socket.IO
 */
const createAppointment = async (req, res) => {
  const {
    id_paciente,
    id_medico,
    fecha_hora,
    metodo_notificacion,
    seguro_medico,
  } = req.body;

  try {
    // 1) Crear la cita en BD
    const newCita = await Cita.create({
      id_paciente,
      id_medico,
      fecha_hora,
      metodo_notificacion,
      seguro_medico,
      estado: "pendiente",
    });

    // 2) Obtenemos paciente y médico para notificaciones
    const paciente = await Usuario.findByPk(id_paciente);
    const medico   = await Usuario.findByPk(id_medico);
    const nombreMedico = medico?.nombre || "Médico";

    // 3) Formatear la fecha para mensajes
    const fechaFormateada = new Date(fecha_hora).toLocaleString("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Bogota",
    });

    // 4) Lanzar notificaciones en background (no bloquea)
    sendNotifications(paciente, nombreMedico, fechaFormateada, metodo_notificacion);

    // 5) Emitir evento por Socket.IO al room del paciente
    const io = req.app.get("io");
    if (io && paciente) {
      io.to(`user_${paciente.id_usuario}`).emit("appointmentCreated", {
        id_cita:     newCita.id_cita,
        fecha_hora:  fechaFormateada,
        medico:      nombreMedico,
      });
    }

    // 6) Responder inmediatamente
    return res.status(201).json({
      ...newCita.toJSON(),
      message: "Cita creada exitosamente. Se enviarán las notificaciones y recibirás alerta en pantalla.",
    });

  } catch (error) {
    console.error("Error en createAppointment:", error.stack || error);
    return res.status(500).json({ message: "Error al crear la cita" });
  }
};

/**
 * Envía email y/o SMS según el método elegido.
 * Todo dentro de try/catch independientes para no romper la API.
 */
const sendNotifications = async (
  paciente,
  nombreMedico,
  fechaFormateada,
  metodoNotificacion
) => {
  try {
    const asunto = "✅ Confirmación de cita médica • QuickCita";
    const html   = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #198754; text-align: center;">QuickCita</h1>
          <p>Hola <strong>${paciente.nombre}</strong>,</p>
          <p>Tu cita con el Dr(a). <strong>${nombreMedico}</strong> ha sido confirmada para:</p>
          <p style="background-color: #e7f3ff; padding: 10px; border-radius: 5px;">
            <strong>${fechaFormateada}</strong>
          </p>
          <p>Recibirás recordatorios 24h y 1h antes de tu cita.</p>
          <p>¡Gracias por confiar en QuickCita!</p>
        </div>
      </div>
    `;

    // Email
    if (metodoNotificacion === "email" || metodoNotificacion === "both") {
      try {
        await sendEmail({
          to:      paciente.email,
          subject: asunto,
          html,
        });
        console.log(`✅ Email enviado a ${paciente.email}`);
      } catch (err) {
        console.error(`❌ Falló envío de email a ${paciente.email}:`, err.message);
      }
    }

    // SMS
    if (metodoNotificacion === "sms" || metodoNotificacion === "both") {
      try {
        await sendSMS({
          to:   paciente.telefono,
          body: `QuickCita: tu cita con Dr(a). ${nombreMedico} es el ${fechaFormateada}.`,
        });
        console.log(`✅ SMS enviado a ${paciente.telefono}`);
      } catch (err) {
        console.error(`❌ Falló envío de SMS a ${paciente.telefono}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Error en sendNotifications:", error.stack || error);
  }
};

/**
 * Obtiene todas las citas de un paciente
 */
const getCitasByPaciente = async (req, res) => {
  const { id_paciente } = req.params;
  try {
    const citas = await Cita.findAll({
      where: { id_paciente },
      include: [{ model: Usuario, as: "Medico", attributes: ["nombre", "email"] }],
      order: [["fecha_hora", "ASC"]],
    });
    return res.json(citas);
  } catch (error) {
    console.error("Error en getCitasByPaciente:", error);
    return res.status(500).json({ message: "Error al obtener citas" });
  }
};

/**
 * Obtiene todas las citas de un médico
 */
const getCitasByMedico = async (req, res) => {
  const { id_medico } = req.params;
  try {
    const citas = await Cita.findAll({
      where: { id_medico },
      include: [{ model: Usuario, as: "Paciente", attributes: ["nombre", "email"] }],
      order: [["fecha_hora", "ASC"]],
    });
    return res.json(citas);
  } catch (error) {
    console.error("Error en getCitasByMedico:", error);
    return res.status(500).json({ message: "Error al obtener citas" });
  }
};

/**
 * Calcula slots libres de 9 a 17h (lunes a viernes) para los próximos 7 días
 */
const getAvailableSlots = async (req, res) => {
  const { id_medico } = req.params;
  try {
    const start = new Date();
    const end   = new Date();
    end.setDate(end.getDate() + 7);

    const citas = await Cita.findAll({
      where: {
        id_medico,
        fecha_hora: { [Op.between]: [start, end] }
      },
      attributes: ["fecha_hora"]
    });
    const booked = citas.map(c => c.fecha_hora.getTime());

    const slots = [];
    let cursor = new Date(start);
    cursor.setHours(9,0,0,0);

    while (cursor < end) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        for (let h = 9; h < 17; h++) {
          const slot = new Date(cursor);
          slot.setHours(h,0,0,0);
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
    console.error("Error en getAvailableSlots:", err);
    return res.status(500).json({ message: "Error al calcular slots" });
  }
};

/**
 * Actualiza el estado de una cita
 */
const updateCitaStatus = async (req, res) => {
  const { id_cita } = req.params;
  const { estado }  = req.body;

  try {
    const cita = await Cita.findByPk(id_cita);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    await cita.update({ estado });
    return res.json({ message: "Estado de cita actualizado", cita });
  } catch (error) {
    console.error("Error en updateCitaStatus:", error);
    return res.status(500).json({ message: "Error al actualizar la cita" });
  }
};

/**
 * Cancela una cita y notifica por email
 */
const cancelCita = async (req, res) => {
  const { id_cita } = req.params;

  try {
    const cita = await Cita.findByPk(id_cita, {
      include: [
        { model: Usuario, as: "Paciente", attributes: ["nombre", "email"] },
        { model: Usuario, as: "Medico",   attributes: ["nombre", "email"] },
      ],
    });
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    await cita.update({ estado: "cancelada" });

    // Notificación de cancelación por email
    const fechaFormateada = new Date(cita.fecha_hora).toLocaleString("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Bogota",
    });
    try {
      await sendEmail({
        to:      cita.Paciente.email,
        subject: "❌ Cita cancelada • QuickCita",
        html: `
          <h2 style="color: #dc3545;">Cita Cancelada</h2>
          <p>Hola ${cita.Paciente.nombre},</p>
          <p>Tu cita del <strong>${fechaFormateada}</strong> con Dr(a). ${
          cita.Medico?.nombre || "Médico"
        } ha sido cancelada.</p>
          <p>Puedes reagendar cuando gustes.</p>
        `
      });
    } catch (e) {
      console.error("❌ Error notificando cancelación:", e.message);
    }

    return res.json({ message: "Cita cancelada exitosamente", cita });
  } catch (error) {
    console.error("Error en cancelCita:", error);
    return res.status(500).json({ message: "Error al cancelar la cita" });
  }
};

module.exports = {
  createAppointment,
  getCitasByPaciente,
  getCitasByMedico,
  getAvailableSlots,
  updateCitaStatus,
  cancelCita,
};

