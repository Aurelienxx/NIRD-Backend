const { } = require('express');


const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const roles = req.user.roles || [];

    const ok = roles.some(role =>
      allowedRoles.includes(role)
    );

    if (!ok) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    next();
  };
};

module.exports = authorize;