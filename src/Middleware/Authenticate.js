const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Aucun token fourni" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decodedToken.id,
      email: decodedToken.email,
      roles: decodedToken.roles
    };

    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expirée" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide" });
    }

    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = authenticate
