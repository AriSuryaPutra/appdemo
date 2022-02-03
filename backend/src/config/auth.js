const jwt = require('jsonwebtoken');

module.exports = {
  jwt,
  type: 'Bearer ',
  secret: process.env.JWT_SECRET || 'rahasiadunia',
  expiresIn: '8h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshkehidupan',
  refreshExpiresIn: '30d'
};
