const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Usuario = require('./Usuario');

const PerfilMedico = sequelize.define('PerfilMedico', {
  id_perfil: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
    allowNull: false,
  },
  cedula_profesional: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  especialidad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seguro_medico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  aprobado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  timestamps: true,
  tableName: 'perfiles_medicos',
});

Usuario.hasOne(PerfilMedico, { foreignKey: 'id_usuario' });
PerfilMedico.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = PerfilMedico;
