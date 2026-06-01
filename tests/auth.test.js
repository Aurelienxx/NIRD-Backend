const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/Auth/route/authRoute');
const authController = require('../src/Auth/controller/authController');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findMany: jest.fn(),
    },
  })),
}));

// Mock userService
jest.mock('../src/User/service/userService', () => ({
  getByEmail: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
}));

// Mock GenerateToken
jest.mock('../src/Middleware/GenerateToken', () => ({
  generateToken: jest.fn(() => 'mock-token-12345'),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('devrait retourner une erreur 400 si email ou mot de passe manquent', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email et mot de passe requis');
    });

    it('devrait retourner une erreur 401 si l\'utilisateur n\'existe pas', async () => {
      const userService = require('../src/User/service/userService');
      userService.getByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou mot de passe incorrect');
    });

    it('devrait retourner un token si les identifiants sont corrects', async () => {
      const userService = require('../src/User/service/userService');
      const prisma = require('../src/lib/prisma');
      const bcrypt = require('bcrypt');

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        roles: [{ name: 'USER' }],
      };

      userService.getByEmail.mockResolvedValue(mockUser);
      prisma.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });
  });
});
