const express = require('express');
const router = express.Router();
const pageController = require('../controller/pageController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Gestion des pages CMS
 */

/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Récupérer toutes les pages
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Liste des pages
 *       500:
 *         description: Erreur serveur
 */
router.get('/', pageController.getPages);


/**
 * @swagger
 * /api/pages/slugs:
 *   get:
 *     summary: Récupérer les pages accessibles sous forme de menu
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Liste des slugs disponibles
 *       500:
 *         description: Erreur serveur
 */
router.get('/slugs', pageController.getPageSlugs);

/**
 * @swagger
 * /api/pages/slugs:
 *   post:
 *     summary: Récupérer les pages accessibles selon les rôles envoyés
 *     tags: [Pages]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Liste des pages accessibles
 *       500:
 *         description: Erreur serveur
 */
router.post('/slugs', pageController.getPageSlugs);

/**
 * @swagger
 * /api/pages/slug/{slug}:
 *   get:
 *     summary: Récupérer une page par son slug
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page trouvée
 *       404:
 *         description: Page introuvable
 */
router.get('/slug/:slug', pageController.getPageBySlug);

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Récupérer une page par son identifiant
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Page trouvée
 *       404:
 *         description: Page introuvable
 */
router.get('/:id', pageController.getPage);

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Créer une page
 *     tags: [Pages]
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
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *                 example: Accueil
 *               slug:
 *                 type: string
 *                 example: accueil
 *               location:
 *                 type: string
 *                 example: HEADER
 *               order:
 *                 type: integer
 *                 example: 1
 *               navGroupId:
 *                 type: integer
 *                 example: 2
 *               type:
 *                 type: string
 *                 example: SIMPLE
 *               layout:
 *                 type: string
 *                 example: "[]"
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2]
 *     responses:
 *       201:
 *         description: Page créée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.post('/', authenticate, authorize(["ADMIN"]), pageController.createPage);

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     summary: Modifier une page
 *     tags: [Pages]
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
 *               slug:
 *                 type: string
 *               location:
 *                 type: string
 *               order:
 *                 type: integer
 *               navGroupId:
 *                 type: integer
 *               type:
 *                 type: string
 *               layout:
 *                 type: string
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Page modifiée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Page introuvable
 */
router.put('/:id', authenticate, authorize(["ADMIN"]), pageController.updatePage);

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     summary: Supprimer une page
 *     tags: [Pages]
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
 *         description: Page supprimée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Page introuvable
 */
router.delete('/:id', authenticate, authorize(["ADMIN"]), pageController.deletePage);


module.exports = router;
