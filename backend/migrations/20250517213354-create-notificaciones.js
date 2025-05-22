'use strict';
module.exports = {
  up: async (qi, Sequelize) => {
    await qi.sequelize.query(`
      CREATE TYPE "enum_notificaciones_tipo" AS ENUM('recordatorio','alerta');
    `);

    await qi.createTable('notificaciones', {
      id_notificacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_cita: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'citas', key: 'id_cita' },
        onDelete: 'CASCADE',
      },
      tipo: {
        type: 'enum_notificaciones_tipo',
        allowNull: false,
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total: {
        type: Sequelize.INTEGER,
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
    await qi.dropTable('notificaciones');
    await qi.sequelize.query(`DROP TYPE "enum_notificaciones_tipo";`);
  }
};
