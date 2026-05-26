const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

router.get('/', authenticate, authorize(["ADMIN"]), roleController.getRoles);
router.post('/', authenticate, authorize(["ADMIN"]), roleController.createRole);
router.put('/:id', authenticate, authorize(["ADMIN"]), roleController.updateRole);
router.delete('/:id', authenticate, authorize(["ADMIN"]), roleController.deleteRole);

module.exports = router;