// const twilio = require('twilio');
// require('dotenv').config();

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// async function sendSMS({ to, body }) {
//   return client.messages.create({
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to,
//     body,
//   });
// }

// module.exports = { sendSMS };

// backend/src/services/smsService.js
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async ({ to, body }) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to, // Debe ser en formato internacional, ej: +573001234567
    });
    console.log("✅ SMS enviado:", message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("❌ Error enviando SMS:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
