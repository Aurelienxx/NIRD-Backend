const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleController');
const authenticate = require('../../Middleware/Authenticate');
const authorize = require('../../Middleware/Authorize');

router.get('/', articleController.getArticles);
router.get('/published', articleController.getPublishedArticles);
router.get('/search', articleController.searchArticles);
router.get('/author/:authorId', articleController.getArticlesByAuthor);
router.get('/:id', articleController.getArticle);
router.post('/', authenticate, authorize(["ADMIN", "MEMBRE"]), articleController.createArticle);
router.put('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), articleController.updateArticle);
router.delete('/:id', authenticate, authorize(["ADMIN", "MEMBRE"]), articleController.deleteArticle);

module.exports = router;
