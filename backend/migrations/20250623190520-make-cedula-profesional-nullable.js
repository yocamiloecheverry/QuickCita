'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('perfiles_medicos', 'cedula_profesional', {
      type: Sequelize.STRING,
      allowNull: true,    // ahora sí permitimos NULL
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('perfiles_medicos', 'cedula_profesional', {
      type: Sequelize.STRING,
      allowNull: false,   // lo volvemos no-null al deshacer
    });
  }
};
