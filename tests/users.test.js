const request = require('supertest');
const express = require('express');

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

// Mock userService
jest.mock('../src/User/service/userService', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  getByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

// Mock middlewares
jest.mock('../src/Middleware/Authenticate', () => {
  return (req, res, next) => {
    // Simuler un utilisateur authentifié
    req.user = {
      id: 1,
      email: 'admin@example.com',
      roles: ['ADMIN']
    };
    next();
  };
});

jest.mock('../src/Middleware/Authorize', () => {
  return (roles) => {
    return (req, res, next) => {
      // Vérifier si l'utilisateur a un des rôles requis
      if (roles && roles.length > 0 && !roles.some(role => req.user?.roles?.includes(role))) {
        return res.status(403).json({ error: 'Accès refusé' });
      }
      next();
    };
  };
});

const userRoutes = require('../src/User/route/userRoute');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users (PROTÉGÉ - Require ADMIN)', () => {
    it('devrait retourner tous les utilisateurs sans les mots de passe', async () => {
      const userService = require('../src/User/service/userService');
      const mockUsers = [
        { id: 1, email: 'user1@example.com', name: 'User 1', password: 'hashed_pwd' },
        { id: 2, email: 'user2@example.com', name: 'User 2', password: 'hashed_pwd' },
      ];

      userService.getAll.mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).not.toHaveProperty('password');
      expect(response.body[0]).toEqual({ id: 1, email: 'user1@example.com', name: 'User 1' });
    });

    it('devrait retourner une erreur 500 en cas de problème serveur', async () => {
      const userService = require('../src/User/service/userService');
      userService.getAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/users (PUBLIC)', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const userService = require('../src/User/service/userService');
      const mockUser = { id: 3, email: 'newuser@example.com', name: 'New User', password: 'hashed_pwd' };

      userService.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({ email: 'newuser@example.com', name: 'New User', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body.email).toBe('newuser@example.com');
    });

    it('devrait retourner une erreur si email déjà utilisé', async () => {
      const userService = require('../src/User/service/userService');
      const error = new Error('Email déjà utilisé');
      error.code = 'P2002';

      userService.create.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/users')
        .send({ email: 'existing@example.com', name: 'User', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email déjà utilisé');
    });
  });

  describe('PUT /api/users/:id (PROTÉGÉ - Require ADMIN ou MEMBRE)', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      const userService = require('../src/User/service/userService');
      const updatedUser = { id: 1, email: 'user1@example.com', name: 'Updated User' };

      userService.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/users/1')
        .send({ name: 'Updated User' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated User');
    });

    it('devrait retourner une erreur 500 en cas de problème', async () => {
      const userService = require('../src/User/service/userService');
      userService.update.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/users/1')
        .send({ name: 'Updated User' });

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/users/:id (PROTÉGÉ - Require ADMIN ou MEMBRE)', () => {
    it('devrait supprimer un utilisateur', async () => {
      const userService = require('../src/User/service/userService');
      userService.delete.mockResolvedValue();

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(204);
    });

    it('devrait retourner une erreur 500 en cas de problème', async () => {
      const userService = require('../src/User/service/userService');
      userService.delete.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(500);
    });
  });
});
