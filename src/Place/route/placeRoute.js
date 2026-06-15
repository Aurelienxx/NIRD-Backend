const express = require('express');
const router = express.Router();

const placeController = require('../controller/placeController');

const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Gestion des lieux
 */

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Récupérer tous les lieux inclus les utilisateurs associés
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: Liste des lieux
 *       500:
 *         description: Erreur serveur
 */
router.get('/', placeController.getPlaces);

/**
 * @swagger
 * /api/places/locations:
 *   get:
 *     summary: Récupérer toutes les locations
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: Liste des locations
 *       500:
 *         description: Erreur serveur
 */
router.get('/locations', placeController.getAllLocations);

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Récupérer un lieu par son identifiant
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lieu trouvé
 *       404:
 *         description: Lieu non trouvé
 */
router.get('/:id', placeController.getPlace);


/**
 * @swagger
 * /api/places/user/{userId}:
 *   get:
 *     summary: Récupérer tous les lieux d'un utilisateur
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des lieux de l'utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId', placeController.getPlacesByUser);


/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Créer un lieu
 *     tags: [Places]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - type
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: IUT Calais
 *               description:
 *                 type: string
 *                 example: Campus universitaire
 *               address:
 *                 type: string
 *                 example: 19 Rue Louis David, 62100 Calais
 *               type:
 *                 type: string
 *                 example: UNIVERSITE
 *               latitude:
 *                 type: number
 *                 example: 50.9515
 *               longitude:
 *                 type: number
 *                 example: 1.8586
 *     responses:
 *       201:
 *         description: Lieu créé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', placeController.createPlace);

/**
 * @swagger
 * /api/places/{id}:
 *   put:
 *     summary: Mettre à jour un lieu
 *     tags: [Places]
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
 *                 example: IUT Calais
 *               description:
 *                 type: string
 *                 example: Campus universitaire
 *               address:
 *                 type: string
 *                 example: 19 Rue Louis David, 62100 Calais
 *               type:
 *                 type: string
 *                 example: UNIVERSITE
 *               latitude:
 *                 type: number
 *                 example: 50.9515
 *               longitude:
 *                 type: number
 *                 example: 1.8586
 *     responses:
 *       200:
 *         description: Lieu mis à jour avec succès
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       404:
 *         description: Lieu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), placeController.updatePlace);

/**
* @swagger
* /api/places/{id}:
*   delete:
*     summary: Supprimer un lieu
*     tags: [Places]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     responses:
*       204:
*         description: Lieu supprimé
*       404:
*         description: Lieu non trouvé
*/
router.delete('/:id', authenticate, authorize(["ADMIN"]), placeController.deletePlace);

module.exports = router;