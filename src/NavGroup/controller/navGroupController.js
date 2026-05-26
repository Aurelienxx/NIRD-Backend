const navGroupService = require('../service/navGroupService');

exports.getNavGroups = async (req, res) => {
  try {
    const navGroups = await navGroupService.getAll();
    res.json(navGroups);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des groupes de navigation" });
  }
};

exports.getNavGroup = async (req, res) => {
  try {
    const navGroup = await navGroupService.getById(req.params.id);
    if (!navGroup) return res.status(404).json({ error: "Groupe non trouvé" });
    res.json(navGroup);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du groupe" });
  }
};

exports.createNavGroup = async (req, res) => {
  try {
    const navGroup = await navGroupService.create(req.body);
    res.status(201).json(navGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNavGroup = async (req, res) => {
  try {
    const navGroup = await navGroupService.update(req.params.id, req.body);
    res.json(navGroup);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deleteNavGroup = async (req, res) => {
  try {
    await navGroupService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
