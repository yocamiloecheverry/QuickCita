const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por el middleware:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error en el servidor';

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
