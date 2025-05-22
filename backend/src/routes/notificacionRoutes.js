const express = require('express');
const router = express.Router();
const { notificacionController } = require('../controllers');

// Rutas de notificaciones
router.post('/create', notificacionController.createNotificacion);
router.get('/cita/:id_cita', notificacionController.getNotificacionesByCita);

module.exports = router;
