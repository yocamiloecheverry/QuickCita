const express = require('express');
const router = express.Router();
const { reporteController } = require('../controllers');
const { authMiddleware, roleMiddleware } = require('../middlewares');

// Solo los médicos pueden crear reportes
router.post('/create', authMiddleware, roleMiddleware(['medico']), reporteController.createReporte);

// Administradores pueden ver todos los reportes
router.get('/medico/:id_medico', authMiddleware, roleMiddleware(['administrador']), reporteController.getReportesByMedico);

module.exports = router;
