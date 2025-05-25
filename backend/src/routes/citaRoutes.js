// backend/src/routes/citaRoutes.js
const express = require('express');
const router  = express.Router();

const {
  getAvailableSlots,
  createAppointment,
  getCitasByMedico,
  // si tienes más: getCitasByPaciente, cancelarCita, etc.
} = require('../controllers/citaController');

const { authMiddleware, roleMiddleware } = require('../middlewares');

// 1) Obtener slots libres para un médico (próximos 7 días)
router.get(
  '/:id_medico/slots',
  authMiddleware,
  roleMiddleware(['paciente','medico']),  // quien sea autenticado puede consultarlos
  getAvailableSlots                       // debe ser una función exportada en citaController
);

// 2) Crear nueva cita
router.post(
  '/create',
  authMiddleware,
  createAppointment                        // idem, función en el controlador
);

// 3) Listar todas las citas de un médico
router.get(
  '/medico/:id_medico',
  authMiddleware,
  roleMiddleware(['medico']),
  getCitasByMedico
);

// 4) (Opcional) listar citas de un paciente
// router.get('/paciente/:id_paciente', authMiddleware, getCitasByPaciente);

// exporta el router
module.exports = router;
