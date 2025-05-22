const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Usuario = require('./Usuario');

const Cita = sequelize.define('Cita', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
    allowNull: false,
  },
  id_medico: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
    allowNull: false,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
    defaultValue: 'pendiente',
  },
  metodo_notificacion: {
    type: DataTypes.ENUM('sms', 'push', 'email'),
    allowNull: false,
  },
  seguro_medico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'citas',
});

Usuario.hasMany(Cita, { foreignKey: 'id_paciente', as: 'CitasPaciente' });
Usuario.hasMany(Cita, { foreignKey: 'id_medico', as: 'CitasMedico' });
Cita.belongsTo(Usuario, { foreignKey: 'id_paciente', as: 'Paciente' });
Cita.belongsTo(Usuario, { foreignKey: 'id_medico', as: 'Medico' });

module.exports = Cita;
