const roleService = require('../service/roleService');

exports.getRoles = async (req, res) => {
  try {
    const roles = await roleService.getAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des rôles" });
  }
};

exports.createRole = async (req, res) => {
  try {
    const role = await roleService.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: "Ce nom de rôle est déjà utilisé" });
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await roleService.update(req.params.id, req.body);
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await roleService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};