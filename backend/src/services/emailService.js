// backend/src/services/emailService.js
const nodemailer = require("nodemailer");

// Configuración del transporter (usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
  service: "gmail", // o 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // tu email
    pass: process.env.EMAIL_PASS, // tu contraseña de aplicación
  },
});

// Función para enviar email
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"QuickCita" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html:
        html ||
        `<div style="font-family: Arial, sans-serif;">${text.replace(
          /\n/g,
          "<br>"
        )}</div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado exitosamente:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { success: false, error: error.message };
  }
};

// Función para verificar la configuración
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("✅ Configuración de email verificada correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error en configuración de email:", error);
    return false;
  }
};

module.exports = {
  sendEmail,
  verifyEmailConfig,
};
