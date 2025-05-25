const express = require('express');
const router = express.Router();

// Importa TODAS tus rutas:
const usuarioRoutes      = require('./usuarioRoutes');
const citaRoutes         = require('./citaRoutes');
const notificacionRoutes = require('./notificacionRoutes');
const reporteRoutes      = require('./reporteRoutes');
const perfilMedicoRoutes = require('./perfilMedicoRoutes');  // <–– aquí
const adminRoutes = require('./adminRoutes');

// Usa el prefijo /api en server.js: app.use('/api', router)
router.use('/usuarios',       usuarioRoutes);
router.use('/citas',          citaRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/reportes',       reporteRoutes);
router.use('/perfiles_medicos', perfilMedicoRoutes);       // <–– y aquí
router.use('/admin', adminRoutes);

module.exports = router;
