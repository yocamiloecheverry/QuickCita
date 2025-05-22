'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) crear ENUM
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_usuarios_rol" AS ENUM('paciente','medico','administrador');
    `);
    // 2) crear tabla
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre:       { type: Sequelize.STRING, allowNull: false },
      email:        { type: Sequelize.STRING, allowNull: false, unique: true },
      telefono:     { type: Sequelize.STRING, allowNull: false },
      contrasena:   { type: Sequelize.STRING, allowNull: false },
      red_social:   { type: Sequelize.STRING, allowNull: true },
      rol: {
        type: 'enum_usuarios_rol',
        allowNull: false,
        defaultValue: 'paciente'
      },
      created_at:   { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at:   { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios');
    await queryInterface.sequelize.query(`DROP TYPE "enum_usuarios_rol";`);
  }
};
