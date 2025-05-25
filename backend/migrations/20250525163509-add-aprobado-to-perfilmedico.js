'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'perfiles_medicos',     // <–– el nombre de la tabla en tu base de datos (plural)
      'aprobado',            // <–– la nueva columna
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('perfiles_medicos', 'aprobado');
  }
};
