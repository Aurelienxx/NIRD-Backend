const documentService = require('../service/documentService');

exports.getDocuments = async (req, res) => {
  try {
    const documents = await documentService.getAll();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des documents" });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await documentService.getById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document non trouvé" });
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du document" });
  }
};

exports.getDocumentsByAuthor = async (req, res) => {
  try {
    const documents = await documentService.getByAuthorId(req.params.authorId);
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des documents de l'auteur" });
  }
};

exports.getDocumentsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    if (!['TUTORIEL', 'GUIDE', 'LETTRE'].includes(tag)) {
      return res.status(400).json({ error: "Tag invalide. Doit être: TUTORIEL, GUIDE ou LETTRE" });
    }
    
    const documents = await documentService.getByTag(tag);
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des documents par tag" });
  }
};

exports.searchDocuments = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Paramètre de recherche requis" });
    
    const documents = await documentService.search(q);
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
};


exports.downloadDocument = async (req, res) => {
  try {
    const document = await documentService.getById(req.params.id);

    if (!document || !document.fileData) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }

    const buffer = Buffer.isBuffer(document.fileData)
      ? document.fileData
      : Buffer.from(document.fileData);

    res.setHeader("Content-Type", document.fileType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.fileName}"`
    );

    return res.send(buffer);

  } catch (err) {
    return res.status(500).json({ error: "Erreur téléchargement" });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const { title, description, fileData, fileName, fileType, authorId, tags } = req.body;
    
    // Validation des champs requis
    if (!title || !description || !fileData || !fileName || !fileType || !authorId) {
      return res.status(400).json({ error: "Tous les champs (title, description, fileData, fileName, fileType, authorId) sont requis" });
    }

    // Validation des tags si fournis
    if (tags && Array.isArray(tags)) {
      const validTags = ['TUTORIEL', 'GUIDE', 'LETTRE'];
      for (const tag of tags) {
        if (!validTags.includes(tag)) {
          return res.status(400).json({ error: "Tag invalide. Tags valides: TUTORIEL, GUIDE, LETTRE" });
        }
      }
    }

    const document = await documentService.create({
      title,
      description,
      fileData,
      fileName,
      fileType,
      authorId,
      tags: tags || []
    });
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { title, description, fileData, fileName, fileType, tags } = req.body;

    // Validation des tags si fournis
    if (tags && Array.isArray(tags)) {
      const validTags = ['TUTORIEL', 'GUIDE', 'LETTRE'];
      for (const tag of tags) {
        if (!validTags.includes(tag)) {
          return res.status(400).json({ error: "Tag invalide. Tags valides: TUTORIEL, GUIDE, LETTRE" });
        }
      }
    }

    const document = await documentService.update(req.params.id, {
      title,
      description,
      fileData,
      fileName,
      fileType,
      tags
    });
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await documentService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
