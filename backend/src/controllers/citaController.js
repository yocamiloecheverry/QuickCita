// backend/src/controllers/citaController.js
const Cita = require("../models/Cita");
const Usuario = require("../models/Usuario");
const { Op } = require("sequelize");

// Importa los servicios
const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");

// Crear nueva cita
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

    // 2) Obtener datos del paciente para notificar
    const paciente = await Usuario.findByPk(id_paciente);
    if (!paciente) {
      console.warn(
        `Paciente ${id_paciente} no encontrado, omitiendo notificaciones`
      );
      return res.status(201).json(newCita);
    }

    // 3) Obtener datos del médico (opcional, para mostrar en la notificación)
    const medico = await Usuario.findByPk(id_medico);
    const nombreMedico = medico ? medico.nombre : "Médico";

    // 4) Formatear la fecha
    const fechaFormateada = new Date(fecha_hora).toLocaleString("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Bogota",
    });

    // 5) Enviar notificaciones (sin bloquear la respuesta)
    sendNotifications(
      paciente,
      nombreMedico,
      fechaFormateada,
      metodo_notificacion
    );

    // 6) Responder inmediatamente (no esperar las notificaciones)
    return res.status(201).json({
      ...newCita.toJSON(),
      message: "Cita creada exitosamente. Se enviarán las notificaciones.",
    });
  } catch (error) {
    console.error("Error en createAppointment:", error);
    return res.status(500).json({ message: "Error al crear la cita" });
  }
};

// Función auxiliar para enviar notificaciones (asíncrona, no bloquea)
const sendNotifications = async (
  paciente,
  nombreMedico,
  fechaFormateada,
  metodoNotificacion
) => {
  try {
    // Plantilla de email más profesional
    const asunto = "✅ Confirmación de cita médica - QuickCita";
    const cuerpoHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #198754; margin: 0;">QuickCita</h1>
            <p style="color: #6c757d; margin: 5px 0;">Tu salud, tu tiempo, tu cita en un clic</p>
          </div>
          
          <h2 style="color: #198754;">¡Hola ${paciente.nombre}!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Tu cita médica ha sido <strong>confirmada exitosamente</strong>.
          </p>
          
          <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0066cc; margin-top: 0;">Detalles de tu cita:</h3>
            <p><strong>Médico:</strong> Dr(a). ${nombreMedico}</p>
            <p><strong>Fecha y hora:</strong> ${fechaFormateada}</p>
            <p><strong>Estado:</strong> Confirmada</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>📅 Recordatorio:</strong> Recibirás notificaciones 24 horas y 1 hora antes de tu cita.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d;">¡Gracias por confiar en QuickCita!</p>
          </div>
        </div>
      </div>
    `;

    // Enviar email
    if (metodoNotificacion === "email" || metodoNotificacion === "ambos") {
      const emailResult = await sendEmail({
        to: paciente.email,
        subject: asunto,
        html: cuerpoHTML,
      });

      if (emailResult.success) {
        console.log(`✅ Email enviado a ${paciente.email}`);
      } else {
        console.error(
          `❌ Error enviando email a ${paciente.email}:`,
          emailResult.error
        );
      }
    }

    // Enviar SMS (si tienes el servicio configurado)
    if (metodoNotificacion === "sms" || metodoNotificacion === "ambos") {
      try {
        await sendSMS({
          to: paciente.telefono,
          body: `QuickCita: Tu cita con Dr(a). ${nombreMedico} está confirmada para ${fechaFormateada}. ¡Te esperamos!`,
        });
        console.log(`✅ SMS enviado a ${paciente.telefono}`);
      } catch (smsError) {
        console.error(
          `❌ Error enviando SMS a ${paciente.telefono}:`,
          smsError
        );
      }
    }
  } catch (error) {
    console.error("Error en sendNotifications:", error);
  }
};

// Obtener citas de un paciente
const getCitasByPaciente = async (req, res) => {
  const { id_paciente } = req.params;
  try {
    const citas = await Cita.findAll({
      where: { id_paciente },
      include: [
        { model: Usuario, as: "Medico", attributes: ["nombre", "email"] },
      ],
      order: [["fecha_hora", "ASC"]],
    });
    return res.json(citas);
  } catch (error) {
    console.error("Error en getCitasByPaciente:", error);
    return res.status(500).json({ message: "Error al obtener citas" });
  }
};

// Obtener citas de un médico
const getCitasByMedico = async (req, res) => {
  const { id_medico } = req.params;
  try {
    const citas = await Cita.findAll({
      where: { id_medico },
      include: [
        { model: Usuario, as: "Paciente", attributes: ["nombre", "email"] },
      ],
      order: [["fecha_hora", "ASC"]],
    });
    return res.json(citas);
  } catch (error) {
    console.error("Error en getCitasByMedico:", error);
    return res.status(500).json({ message: "Error al obtener citas" });
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
        fecha_hora: { [Op.between]: [start, end] },
      },
      attributes: ["fecha_hora"],
    });
    const booked = citas.map((c) => c.fecha_hora.getTime());

    const slots = [];
    let cursor = new Date(start);
    cursor.setHours(9, 0, 0, 0);

    while (cursor < end) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        // Excluir domingos (0) y sábados (6)
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
    console.error("Error en getAvailableSlots:", err);
    return res.status(500).json({ message: "Error al calcular slots" });
  }
};

// Actualizar estado de una cita
const updateCitaStatus = async (req, res) => {
  const { id_cita } = req.params;
  const { estado } = req.body;

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

// Cancelar una cita
const cancelCita = async (req, res) => {
  const { id_cita } = req.params;

  try {
    const cita = await Cita.findByPk(id_cita, {
      include: [
        { model: Usuario, as: "Paciente", attributes: ["nombre", "email"] },
        { model: Usuario, as: "Medico", attributes: ["nombre", "email"] },
      ],
    });

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    await cita.update({ estado: "cancelada" });

    // Enviar notificación de cancelación (opcional)
    if (cita.Paciente && cita.Paciente.email) {
      const fechaFormateada = new Date(cita.fecha_hora).toLocaleString(
        "es-CO",
        {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "America/Bogota",
        }
      );

      await sendEmail({
        to: cita.Paciente.email,
        subject: "❌ Cita cancelada - QuickCita",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc3545;">Cita Cancelada</h2>
            <p>Hola ${cita.Paciente.nombre},</p>
            <p>Tu cita programada para <strong>${fechaFormateada}</strong> con Dr(a). ${
          cita.Medico?.nombre || "Médico"
        } ha sido cancelada.</p>
            <p>Si necesitas reagendar, puedes hacerlo desde tu panel de usuario.</p>
            <p>Gracias por usar QuickCita.</p>
          </div>
        `,
      });
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
