const jwt = require('jsonwebtoken');

function generateToken(id, email, roles, duration) {
  const jwtSecret = process.env.JWT_SECRET;

  const payload = {
    id,
    email,
    roles
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: duration
  }); 
}

module.exports = {
  generateToken
};