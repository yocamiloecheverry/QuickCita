const express = require('express');
const router = express.Router();
const { citaController } = require('../controllers');

// Rutas de citas
router.post('/create', citaController.createCita);
router.get('/user/:id_usuario', citaController.getCitasByUser);

module.exports = router;
