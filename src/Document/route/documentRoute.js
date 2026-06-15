const express = require('express');
const router = express.Router();
const documentController = require('../controller/documentController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestion des documents
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Récupérer tous les documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Liste des documents
 *       500:
 *         description: Erreur serveur
 */
router.get('/', documentController.getDocuments);

/**
 * @swagger
 * /api/documents/search:
 *   get:
 *     summary: Rechercher des documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: rapport
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/search', documentController.searchDocuments);

/**
 * @swagger
 * /api/documents/author/{authorId}:
 *   get:
 *     summary: Récupérer les documents d'un auteur
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Documents de l'auteur
 */
router.get('/author/:authorId', documentController.getDocumentsByAuthor);

/**
 * @swagger
 * /api/documents/tag/{tag}:
 *   get:
 *     summary: Récupérer les documents par tag
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         example: PDF
 *     responses:
 *       200:
 *         description: Documents filtrés
 */
router.get('/tag/:tag', documentController.getDocumentsByTag);

/**
 * @swagger
 * /api/documents/{id}/download:
 *   get:
 *     summary: Télécharger un document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fichier téléchargé
 *       404:
 *         description: Document introuvable
 */
router.get('/:id/download', documentController.downloadDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Récupérer un document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document trouvé
 *       404:
 *         description: Document introuvable
 */
router.get('/:id', documentController.getDocument);


/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Créer un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - fileData
 *               - fileName
 *               - fileType
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Rapport annuel
 *               description:
 *                 type: string
 *                 example: Rapport d'activité 2025
 *               fileData:
 *                 type: string
 *                 example: base64...
 *               fileName:
 *                 type: string
 *                 example: rapport.pdf
 *               fileType:
 *                 type: string
 *                 example: application/pdf
 *               authorId:
 *                 type: integer
 *                 example: 1
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Rapport
 *                   - PDF
 *     responses:
 *       201:
 *         description: Document créé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticate, authorize(["ADMIN", "MEMBRE"]), documentController.createDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Modifier un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fileData:
 *                 type: string
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Document mis à jour
 *       404:
 *         description: Document introuvable
 */
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), documentController.updateDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Supprimer un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Document supprimé
 *       404:
 *         description: Document introuvable
 */
router.delete('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), documentController.deleteDocument);

module.exports = router;
