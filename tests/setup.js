// Setup file for Jest tests
// Mock environment variables
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/nird_test';
process.env.JWT_SECRET = 'test-secret-key-for-testing';

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
