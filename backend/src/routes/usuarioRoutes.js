const express = require('express');
const router  = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  listarMedicos
} = require('../controllers/usuarioController');
const { authMiddleware, roleMiddleware } = require('../middlewares');

// Registro y login
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Perfil de usuario (protegido)
router.get(
  '/profile/:id_usuario',
  authMiddleware,
  getUserProfile
);

// Listado de médicos
router.get(
  '/medicos',
  authMiddleware,      // o quítalo si lo quieres público
  listarMedicos
);

module.exports = router;
