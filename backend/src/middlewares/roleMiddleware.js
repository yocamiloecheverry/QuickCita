const verifyRole = (roles) => {
  return (req, res, next) => {
    const { rol } = req.user;

    if (!roles.includes(rol)) {
      return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
    }

    next();
  };
};

module.exports = verifyRole;
