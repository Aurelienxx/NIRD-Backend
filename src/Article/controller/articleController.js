const articleService = require('../service/articleService');

exports.getArticles = async (req, res) => {
  try {
    const articles = await articleService.getAll();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des articles" });
  }
};

exports.getPublishedArticles = async (req, res) => {
  try {
    const articles = await articleService.getPublished();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des articles publiés" });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await articleService.getById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article non trouvé" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'article" });
  }
};

exports.getArticlesByAuthor = async (req, res) => {
  try {
    const articles = await articleService.getByAuthorId(req.params.authorId);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des articles de l'auteur" });
  }
};

exports.searchArticles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Paramètre de recherche requis" });
    
    const articles = await articleService.search(q);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, description, content, mediaUrl, mediaType, authorId } = req.body;
    
    // Validation des champs requis
    if (!title || !description || !authorId) {
      return res.status(400).json({ error: "Titre, description et authorId sont requis" });
    }

    const article = await articleService.create({
      title,
      description,
      content,
      mediaUrl,
      mediaType: mediaType || 'IMAGE',
      authorId
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await articleService.update(req.params.id, req.body);
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await articleService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
