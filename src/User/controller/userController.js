const userService = require('../service/userService');

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error('Erreur lors de la récupération par email:', err);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    if (err.code === 'P2002') return res.status(400).json({ error: "Email déjà utilisé" });
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};