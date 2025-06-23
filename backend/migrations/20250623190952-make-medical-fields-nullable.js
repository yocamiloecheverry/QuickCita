'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hacemos nullable las columnas que antes eran NOT NULL
    await queryInterface.changeColumn('perfiles_medicos', 'cedula_profesional', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('perfiles_medicos', 'especialidad', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('perfiles_medicos', 'ubicacion', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('perfiles_medicos', 'seguro_medico', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // En el rollback los volvemos NOT NULL otra vez
    await queryInterface.changeColumn('perfiles_medicos', 'cedula_profesional', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('perfiles_medicos', 'especialidad', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('perfiles_medicos', 'ubicacion', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('perfiles_medicos', 'seguro_medico', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
