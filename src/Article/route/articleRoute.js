const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gestion des articles
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 *       500:
 *         description: Erreur serveur
 */
router.get('/', articleController.getArticles);

/**
 * @swagger
 * /api/articles/published:
 *   get:
 *     summary: Récupérer les articles publiés
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles publiés
 *       500:
 *         description: Erreur serveur
 */
router.get('/published', articleController.getPublishedArticles);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: intelligence artificielle
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *       500:
 *         description: Erreur serveur
 */
router.get('/search', articleController.searchArticles);

/**
 * @swagger
 * /api/articles/author/{authorId}:
 *   get:
 *     summary: Récupérer les articles d'un auteur
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des articles de l'auteur
 *       500:
 *         description: Erreur serveur
 */
router.get('/author/:authorId', articleController.getArticlesByAuthor);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article introuvable
 */
router.get('/:id', articleController.getArticle);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un article
 *     tags: [Articles]
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
 *               - description
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mon premier article
 *               description:
 *                 type: string
 *                 example: Description de l'article
 *               content:
 *                 type: string
 *                 example: "<p>Contenu HTML</p>"
 *               mediaUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/image.jpg
 *               mediaType:
 *                 type: string
 *                 enum:
 *                   - IMAGE
 *                   - VIDEO
 *                 example: IMAGE
 *               authorId:
 *                 type: integer
 *                 example: 1
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Article créé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.post('/', authenticate, authorize(["ADMIN", "MEMBRE"]), articleController.createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     tags: [Articles]
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
 *               content:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *               mediaType:
 *                 type: string
 *                 enum:
 *                   - IMAGE
 *                   - VIDEO
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article introuvable
 */
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), articleController.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
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
 *         description: Article supprimé
 *       404:
 *         description: Article introuvable
 */
router.delete('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), articleController.deleteArticle);


module.exports = router;
