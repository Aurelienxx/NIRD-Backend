const userService = require('../service/userService');

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    // On retire le mot de passe des objets avant de les envoyer au front
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getByEmail(req.params.email);
    const safeUser = user.map(({ password, ...user }) => user);
    res.json(safeUser);
} catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: "Email déjà utilisé" });
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};