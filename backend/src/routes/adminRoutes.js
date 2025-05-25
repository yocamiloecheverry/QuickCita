const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middlewares');

// todas protegidas, solo administradores
router.use(authMiddleware, roleMiddleware(['administrador']));

// 1) Aprobación de médicos
router.get('/medicos/pendientes', admin.getPendingDoctors);
router.put('/medicos/:id_perfil/aprobar', admin.approveDoctor);
router.delete('/medicos/:id_perfil/rechazar', admin.rejectDoctor);

// 2) Gestión de usuarios
router.get('/usuarios', admin.getAllUsers);
router.put('/usuarios/:id_usuario/rol', admin.updateUserRole);
router.delete('/usuarios/:id_usuario', admin.deleteUser);

module.exports = router;
