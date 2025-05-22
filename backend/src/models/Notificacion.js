const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Cita = require('./Cita');

const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cita: {
    type: DataTypes.INTEGER,
    references: {
      model: Cita,
      key: 'id_cita',
    },
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('recordatorio', 'alerta'),
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'notificaciones',
});

Cita.hasMany(Notificacion, { foreignKey: 'id_cita' });
Notificacion.belongsTo(Cita, { foreignKey: 'id_cita' });

module.exports = Notificacion;
