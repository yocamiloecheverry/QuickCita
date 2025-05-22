const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');
const errorHandler = require('./errorHandler');

module.exports = {
  authMiddleware,
  roleMiddleware,
  errorHandler,
};
