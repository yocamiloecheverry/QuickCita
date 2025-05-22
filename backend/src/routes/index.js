const express = require('express');
const router = express.Router();

// Importa TODAS tus rutas:
const usuarioRoutes      = require('./usuarioRoutes');
const citaRoutes         = require('./citaRoutes');
const notificacionRoutes = require('./notificacionRoutes');
const reporteRoutes      = require('./reporteRoutes');
const perfilMedicoRoutes = require('./perfilMedicoRoutes');  // <–– aquí

// Usa el prefijo /api en server.js: app.use('/api', router)
router.use('/usuarios',       usuarioRoutes);
router.use('/citas',          citaRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/reportes',       reporteRoutes);
router.use('/perfiles_medicos', perfilMedicoRoutes);       // <–– y aquí

module.exports = router;
