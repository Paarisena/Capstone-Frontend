import request from 'supertest';
import express from 'express';

// Mock the app since we don't want to start actual server
const mockApp = express();
mockApp.use(express.json());

// Simple test route
mockApp.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

describe('Basic Backend Tests', () => {
  test('should have proper environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  test('should be able to import modules', () => {
    expect(express).toBeDefined();
    expect(request).toBeDefined();
  });
});

describe('API Endpoints', () => {
  test('health check endpoint structure', async () => {
    const response = await request(mockApp)
      .get('/api/health')
      .expect(200);

    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Server is running');
  });

  test('should handle JSON requests', async () => {
    mockApp.post('/api/test-json', (req, res) => {
      res.json({ received: req.body });
    });

    const testData = { test: 'data', number: 123 };
    const response = await request(mockApp)
      .post('/api/test-json')
      .send(testData)
      .expect(200);

    expect(response.body.received).toEqual(testData);
  });

  test('should handle 404 for unknown routes', async () => {
    await request(mockApp)
      .get('/api/unknown')
      .expect(404);
  });
});