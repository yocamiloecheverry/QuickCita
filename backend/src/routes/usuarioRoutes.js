const express = require('express');
const router = express.Router();
const { usuarioController } = require('../controllers');

// Rutas de usuario
router.post('/register', usuarioController.registerUser);
router.post('/login', usuarioController.loginUser);
router.get('/profile/:id_usuario', usuarioController.getUserProfile);

module.exports = router;
