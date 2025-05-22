const express = require('express');
const { getPerfil, updatePerfil, getFilters} = require('../controllers/perfilMedicoController');
const { authMiddleware, roleMiddleware } = require('../middlewares');

const router = express.Router();

router.get('/filters', getFilters);

// GET  /api/perfiles_medicos/:id_usuario
router.get('/:id_usuario',
  authMiddleware,
  roleMiddleware(['medico']),
  getPerfil
);

// PUT  /api/perfiles_medicos/:id_usuario
router.put('/:id_usuario',
  authMiddleware,
  roleMiddleware(['medico']),
  updatePerfil
);

module.exports = router;
