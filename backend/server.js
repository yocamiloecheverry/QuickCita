// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

// Tu conexión y la instancia de Sequelize
const { connectDB, sequelize } = require("./src/config/db");

// Middlewares
const { authMiddleware, errorHandler } = require("./src/middlewares");

// Rutas por separado
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const citaRoutes = require("./src/routes/citaRoutes");
const notificacionRoutes = require("./src/routes/notificacionRoutes");
const reporteRoutes = require("./src/routes/reporteRoutes");
const routes = require("./src/routes");

// Importa la función de verificación de email
const { verifyEmailConfig } = require("./src/services/emailService");

const app = express();
const PORT = process.env.PORT || 4000;

// —————— Middlewares Globales ——————
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// —————— Rutas Públicas ——————
app.get("/", (req, res) => {
  res.send("✅ API QuickCita funcionando correctamente");
});

// Registro / Login / Perfil
app.use("/api/usuarios", usuarioRoutes);

// —————— Rutas Protegidas ——————
app.use("/api/citas", authMiddleware, citaRoutes);
app.use("/api/notificaciones", authMiddleware, notificacionRoutes);
app.use("/api/reportes", authMiddleware, reporteRoutes);
app.use("/api", routes);

// —————— Manejador de Errores ——————
app.use(errorHandler);

// 1. Crear HTTP server y socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }    // ajusta tu CORS
});

// 2. Hacer io accesible dentro de req.app
app.set('io', io);

// 3. Configurar eventos de socket.io
server.listen(PORT, () => {
  console.log(`API + sockets corriendo en puerto ${PORT}`);
});

// —————— Iniciar Servidor ——————
const startServer = async () => {
  try {
    // 1) Conectar a la base de datos
    await connectDB();
    // 2) Sincronizar modelos (no usar force:true en producción)
    await sequelize.sync({ force: false });
    console.log("✅ Modelos sincronizados con la base de datos.");

    // 3) Verificar configuración de email
    await verifyEmailConfig();

    // 4) Arrancar Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error arrancando el servidor:", err);
    process.exit(1);
  }
};

startServer();
