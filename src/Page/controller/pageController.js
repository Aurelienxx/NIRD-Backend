const pageService = require('../service/pageService');

exports.getPages = async (req, res) => {
  try {
    const pages = await pageService.getAll();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des pages" });
  }
};

exports.getPage = async (req, res) => {
  try {
    const page = await pageService.getById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page non trouvée" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de la page" });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const page = await pageService.getBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: "Page non trouvée" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de la page" });
  }
};


exports.getPageSlugs = async (req, res) => {
  try {
    // Récupérer les IDs de rôles depuis la requête (body ou query)
    const userRoleIds = req.body?.roleIds || req.query?.roleIds || [];
    // Convertir en entiers si ce sont des strings
    const roleIds = Array.isArray(userRoleIds) 
      ? userRoleIds.map(id => typeof id === 'string' ? parseInt(id) : id)
      : [];
    
    const slugs = await pageService.getSlugs(roleIds);
    res.json(slugs);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des pages" });
  }
};
  
exports.createPage = async (req, res) => {
  try {
    // Vérifier que le slug est unique
    const existing = await pageService.getBySlug(req.body.slug);
    if (existing) return res.status(400).json({ error: "Ce slug est déjà utilisé" });

    const page = await pageService.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const page = await pageService.update(req.params.id, req.body);
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deletePage = async (req, res) => {
  try {
    await pageService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
