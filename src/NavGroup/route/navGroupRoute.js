const express = require('express');
const router = express.Router();
const navGroupController = require('../controller/navGroupController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

router.get('/', authenticate, authorize(["ADMIN"]), navGroupController.getNavGroups);
router.get('/:id', authenticate, authorize(["ADMIN"]), navGroupController.getNavGroup);
router.post('/', authenticate, authorize(["ADMIN"]), navGroupController.createNavGroup);
router.put('/:id', authenticate, authorize(["ADMIN"]), navGroupController.updateNavGroup);
router.delete('/:id', authenticate, authorize(["ADMIN"]), navGroupController.deleteNavGroup);

module.exports = router;
