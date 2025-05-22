require('dotenv').config();
const { Sequelize } = require('sequelize');

// Crear la instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Desactivar logging en modo desarrollo
    define: {
      underscored: true,
      // opcional: fuerza que Sequelize no pluralice automáticamente la tabla
      // freezeTableName: true,
    },
  }
);

// Verificar la conexión
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1); // Salir del proceso en caso de error
  }
};

module.exports = { sequelize, connectDB };
