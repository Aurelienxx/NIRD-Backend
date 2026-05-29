const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

router.get('/', authenticate, authorize(["ADMIN"]), userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), userController.updateUser);
router.delete('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), userController.deleteUser);

module.exports = router;