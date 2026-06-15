const express = require('express');
const router = express.Router();
const navGroupController = require('../controller/navGroupController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: NavGroups
 *   description: Gestion des groupes de navigation
 */

/**
 * @swagger
 * /api/navgroups:
 *   get:
 *     summary: Récupérer tous les groupes de navigation
 *     tags: [NavGroups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des groupes
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, authorize(["ADMIN"]), navGroupController.getNavGroups);

/**
 * @swagger
 * /api/navgroups/{id}:
 *   get:
 *     summary: Récupérer un groupe de navigation
 *     tags: [NavGroups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Groupe trouvé
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       404:
 *         description: Groupe non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authenticate, authorize(["ADMIN"]), navGroupController.getNavGroup);


/**
 * @swagger
 * /api/navgroups:
 *   post:
 *     summary: Créer un groupe de navigation
 *     tags: [NavGroups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Services
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Groupe créé
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticate, authorize(["ADMIN"]), navGroupController.createNavGroup);

/**
 * @swagger
 * /api/navgroups/{id}:
 *   put:
 *     summary: Modifier un groupe de navigation
 *     tags: [NavGroups]
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
 *               name:
 *                 type: string
 *                 example: Services
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Groupe mis à jour
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       404:
 *         description: Groupe non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', authenticate, authorize(["ADMIN"]), navGroupController.updateNavGroup);


/**
 * @swagger
 * /api/navgroups/{id}:
 *   delete:
 *     summary: Supprimer un groupe de navigation
 *     tags: [NavGroups]
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
 *         description: Groupe supprimé
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       404:
 *         description: Groupe non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authenticate, authorize(["ADMIN"]), navGroupController.deleteNavGroup);

module.exports = router;
