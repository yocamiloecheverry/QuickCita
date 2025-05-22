const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const PerfilMedico = require('../models/PerfilMedico');

const registerUser = async (req, res) => {
  try {
    // 1) Extraer TODOS los campos del body, incluyendo password
    const { nombre, email, telefono, red_social, rol, password } = req.body;

    // 2) Verificar que password venga
    if (!password) {
      return res.status(400).json({ message: 'La contraseña es obligatoria' });
    }

    // 3) Revisar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // 4) Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5) Crear el usuario en la BD (campo 'contrasena' en tu modelo)
    const newUser = await Usuario.create({
      nombre,
      email,
      telefono,
      contrasena: hashedPassword,
      red_social,
      rol,
    });

    // 5.1) Si el rol es 'medico', crear un perfil médico
    if (rol === 'medico') {
      await PerfilMedico.create({
        id_usuario: newUser.id_usuario,
        especialidad: req.body.especialidad,
        ubicacion: req.body.ubicacion,
        seguro_medico: req.body.seguro_medico,
      });
    }
    res.status(201).json(newUser);
    
    // 6) Responder
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

    res.json(user);
  } catch (error) {
    console.error('Error en getUserProfile:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
