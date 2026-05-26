const express = require('express');
const router = express.Router();
const pageController = require('../controller/pageController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');


router.get('/', pageController.getPages);
router.post('/slugs', pageController.getPageSlugs);
router.get('/slugs', pageController.getPageSlugs);
router.get('/slug/:slug', pageController.getPageBySlug);
router.get('/:id', pageController.getPage);
router.post('/', authenticate, authorize(["ADMIN"]), pageController.createPage);
router.put('/:id', authenticate, authorize(["ADMIN"]), pageController.updatePage);
router.delete('/:id', authenticate, authorize(["ADMIN"]), pageController.deletePage);

module.exports = router;
