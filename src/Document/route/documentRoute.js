const express = require('express');
const router = express.Router();
const documentController = require('../controller/documentController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

// Routes publiques
router.get('/', documentController.getDocuments);
router.get('/search', documentController.searchDocuments);
router.get('/author/:authorId', documentController.getDocumentsByAuthor);
router.get('/tag/:tag', documentController.getDocumentsByTag);
router.get('/:id/download', documentController.downloadDocument);
router.get('/:id', documentController.getDocument);

// Routes protégées
router.post('/', authenticate, authorize(["ADMIN", "MEMBRE"]), documentController.createDocument);
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), documentController.updateDocument);
router.delete('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), documentController.deleteDocument);

module.exports = router;
