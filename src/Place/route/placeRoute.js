const express = require('express');
const router = express.Router();

const placeController = require('../controller/placeController');

const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

router.get('/', placeController.getPlaces);
router.get('/locations', placeController.getAllLocations);
router.get('/:id', placeController.getPlace);
router.get('/user/:userId', placeController.getPlacesByUser);
router.post('/',authenticate, authorize(["ADMIN", "MEMBRE"]), placeController.createPlace);
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), placeController.updatePlace);
router.delete('/:id', authenticate, authorize(["ADMIN"]), placeController.deletePlace);

module.exports = router;