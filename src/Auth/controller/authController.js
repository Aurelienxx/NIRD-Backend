const userService = require('../../User/service/userService');
const { generateToken } = require('../../Middleware/GenerateToken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Récupérer tous les utilisateurs et chercher celui avec cet email
    const user = await userService.getByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const prisma = require('../../lib/prisma');
    const userWithPassword = await prisma.user.findUnique({
      where: { email },
      include: { roles: true, place: true }
    });

    if (!userWithPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, userWithPassword.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: userPassword, createdAt: userCreatedAt, ...safeUser } = userWithPassword;
    
    // Créer un token 
    const token = generateToken(userWithPassword.id, userWithPassword.email,userWithPassword.roles.map(r => r.name),"2d");

    res.json({
      user: safeUser,
      token: token
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

exports.logout = (req, res) => {
  // Le logout se fait côté client en supprimant le token
  res.json({ message: "Déconnexion réussie" });
};
