const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.get('/', authenticate, authorize(["ADMIN"]), userController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son identifiant
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', authenticate, userController.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: utilisateur@example.com
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *               password:
 *                 type: string
 *                 example: MotDePasse123
 *               roleId:
 *                 type: integer
 *                 example: 3
 *               placeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *                 example: utilisateur@example.com
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *               password:
 *                 type: string
 *                 example: NouveauMotDePasse123
 *               placeId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), userController.deleteUser);

module.exports = router;