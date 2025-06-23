// backend/src/controllers/usuarioController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const PerfilMedico = require('../models/PerfilMedico');

const registerUser = async (req, res) => {
  try {
    const { nombre, email, telefono, red_social, rol, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'La contraseña es obligatoria' });
    }

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Usuario.create({
      nombre,
      email,
      telefono,
      contrasena: hashedPassword,
      red_social,
      rol,
    });

    if (rol === 'medico') {
      // Solo creamos el perfil vacío; el médico lo completará al iniciar sesión
      await PerfilMedico.create({
        id_usuario: newUser.id_usuario
      });
    }

    // Única respuesta de éxito
    return res.status(201).json(newUser);

  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'La contraseña es obligatoria' });
  }

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Error en loginUser:', error.message);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getUserProfile = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const user = await Usuario.findByPk(id_usuario, {
      include: {
        model: PerfilMedico,
        required: false,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error en getUserProfile:', error.message);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const listarMedicos = async (req, res) => {
  const { especialidad, ubicacion, seguro_medico } = req.query;

  try {
    const medicos = await Usuario.findAll({
      where: { rol: 'medico' },
      include: [{
        model: PerfilMedico,
        where: {
          ...(especialidad  && { especialidad }),
          ...(ubicacion     && { ubicacion }),
          ...(seguro_medico && { seguro_medico }),
        }
      }]
    });

    return res.json(medicos);
  } catch (err) {
    console.error('Error en listarMedicos:', err);
    return res.status(500).json({ message: 'Error al buscar médicos' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  listarMedicos,
};
