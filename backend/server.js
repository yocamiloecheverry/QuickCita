// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Tu conexión y la instancia de Sequelize
const { connectDB, sequelize } = require('./src/config/db');

// Middlewares
const { authMiddleware, errorHandler } = require('./src/middlewares');

// Rutas por separado
const usuarioRoutes       = require('./src/routes/usuarioRoutes');
const citaRoutes          = require('./src/routes/citaRoutes');
const notificacionRoutes  = require('./src/routes/notificacionRoutes');
const reporteRoutes       = require('./src/routes/reporteRoutes');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 4000;

// —————— Middlewares Globales ——————
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// —————— Rutas Públicas ——————
// Health check / página principal
app.get('/', (req, res) => {
  res.send('✅ API QuickCita funcionando correctamente');
});

// Registro / Login / Perfil
app.use('/api/usuarios', usuarioRoutes);

// —————— Rutas Protegidas ——————
app.use('/api/citas', authMiddleware, citaRoutes);
app.use('/api/notificaciones', authMiddleware, notificacionRoutes);
app.use('/api/reportes', authMiddleware, reporteRoutes);
app.use('/api', routes);

// —————— Manejador de Errores ——————
app.use(errorHandler);

// —————— Iniciar Servidor ——————
const startServer = async () => {
  try {
    // 1) Conectar a la base de datos
    await connectDB();
    // 2) Sincronizar modelos (no usar force:true en producción)
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // 3) Arrancar Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error arrancando el servidor:', err);
    process.exit(1);
  }
};

startServer();
