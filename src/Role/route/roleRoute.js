const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestion des rôles utilisateurs
 */


/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Récupérer tous les rôles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, authorize(["ADMIN"]), roleController.getRoles);

/**
 * @swagger
 * /api/roles/signup:
 *   get:
 *     summary: Récupérer les rôles disponibles lors de l'inscription
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Liste des rôles d'inscription
 *       500:
 *         description: Erreur serveur
 */
router.get('/signup', roleController.getRoleSignup);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Créer un rôle
 *     tags: [Roles]
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
 *                 example: MODERATEUR
 *     responses:
 *       201:
 *         description: Rôle créé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticate, authorize(["ADMIN"]), roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Modifier un rôle
 *     tags: [Roles]
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
 *                 example: MODERATEUR
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Rôle introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', authenticate, authorize(["ADMIN"]), roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Supprimer un rôle
 *     tags: [Roles]
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
 *         description: Rôle supprimé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Rôle introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authenticate, authorize(["ADMIN"]), roleController.deleteRole);

module.exports = router;