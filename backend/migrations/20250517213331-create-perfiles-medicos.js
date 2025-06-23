'use strict';
module.exports = {
  up: async (qi, Sequelize) => {
    await qi.createTable('perfiles_medicos', {
      id_perfil: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onDelete: 'CASCADE',
      },
      cedula_profesional: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      especialidad: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      seguro_medico: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (qi) => {
    await qi.dropTable('perfiles_medicos');
  }
};
