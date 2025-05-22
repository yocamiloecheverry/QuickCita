'use strict';
module.exports = {
  up: async (qi, Sequelize) => {
    // crear tipos ENUM primero
    await qi.sequelize.query(`
      CREATE TYPE "enum_citas_estado" AS ENUM('pendiente','confirmada','cancelada');
    `);
    await qi.sequelize.query(`
      CREATE TYPE "enum_citas_metodo_notificacion" AS ENUM('sms','push','email');
    `);

    // luego la tabla
    await qi.createTable('citas', {
      id_cita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_paciente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onDelete: 'CASCADE',
      },
      id_medico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onDelete: 'CASCADE',
      },
      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estado: {
        type: 'enum_citas_estado',
        allowNull: false,
        defaultValue: 'pendiente',
      },
      metodo_notificacion: {
        type: 'enum_citas_metodo_notificacion',
        allowNull: false,
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
    await qi.dropTable('citas');
    await qi.sequelize.query(`DROP TYPE "enum_citas_metodo_notificacion";`);
    await qi.sequelize.query(`DROP TYPE "enum_citas_estado";`);
  }
};
