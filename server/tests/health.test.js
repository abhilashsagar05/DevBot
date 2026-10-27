const request = require('supertest');
const app = require('../src/app');

describe('Health API Endpoint - GET /api/health', () => {
  it('should return 200 OK with health status and metadata', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('service', 'DevBot AI Backend');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('geminiConfigured');
    // Ensure secrets are NOT leaked in response
    expect(res.body).not.toHaveProperty('geminiApiKey');
    expect(res.body).not.toHaveProperty('apiKey');
  });

  it('should return 200 OK on root path /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'online');
  });

  it('should return 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toContain('Route not found');
  });
});

