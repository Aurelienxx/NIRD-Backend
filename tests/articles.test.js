const request = require('supertest');
const express = require('express');
const articleRoutes = require('../src/Article/route/articleRoute');

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    article: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

// Mock articleService
jest.mock('../src/Article/service/articleService', () => ({
  getAll: jest.fn(),
  getPublished: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/articles', articleRoutes);

describe('Article Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/articles', () => {
    it('devrait retourner tous les articles', async () => {
      const articleService = require('../src/Article/service/articleService');
      const mockArticles = [
        { id: 1, title: 'Article 1', content: 'Contenu 1', published: true },
        { id: 2, title: 'Article 2', content: 'Contenu 2', published: false },
      ];

      articleService.getAll.mockResolvedValue(mockArticles);

      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArticles);
      expect(articleService.getAll).toHaveBeenCalled();
    });

    it('devrait retourner une erreur 500 en cas de problème', async () => {
      const articleService = require('../src/Article/service/articleService');
      articleService.getAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/articles/published', () => {
    it('devrait retourner uniquement les articles publiés', async () => {
      const articleService = require('../src/Article/service/articleService');
      const mockPublishedArticles = [
        { id: 1, title: 'Article 1', content: 'Contenu 1', published: true },
      ];

      articleService.getPublished.mockResolvedValue(mockPublishedArticles);

      const response = await request(app).get('/api/articles/published');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPublishedArticles);
    });
  });

  describe('GET /api/articles/:id', () => {
    it('devrait retourner un article par ID', async () => {
      const articleService = require('../src/Article/service/articleService');
      const mockArticle = { id: 1, title: 'Article 1', content: 'Contenu 1', published: true };

      articleService.getById.mockResolvedValue(mockArticle);

      const response = await request(app).get('/api/articles/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArticle);
    });

    it('devrait retourner 404 si l\'article n\'existe pas', async () => {
      const articleService = require('../src/Article/service/articleService');
      articleService.getById.mockResolvedValue(null);

      const response = await request(app).get('/api/articles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Article non trouvé');
    });
  });
});
