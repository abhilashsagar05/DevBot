const request = require('supertest');
const app = require('../src/app');
const geminiService = require('../src/services/geminiService');

describe('Chat API Endpoint - POST /api/chat', () => {
  beforeEach(() => {
    // Reset mock client before each test
    geminiService.__setMockClient(null);
  });

  describe('Input Validation', () => {
    it('should reject request when message property is missing', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: 'Message field is required.'
      });
    });

    it('should reject request when message is not a string (e.g. number/boolean)', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 12345 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: 'Message must be a text string.'
      });
    });

    it('should reject empty message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: 'Message cannot be empty.'
      });
    });

    it('should reject whitespace-only message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '     ' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: 'Message cannot be empty.'
      });
    });

    it('should reject oversized message exceeding 4000 characters', async () => {
      const longMessage = 'A'.repeat(4001);
      const res = await request(app)
        .post('/api/chat')
        .send({ message: longMessage });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('exceeds the maximum limit');
    });

    it('should return 405 Method Not Allowed on GET /api/chat', async () => {
      const res = await request(app).get('/api/chat');
      expect(res.statusCode).toBe(405);
      expect(res.body).toEqual({
        success: false,
        error: 'Method GET not allowed on this endpoint.'
      });
    });
  });

  describe('AI Generation & Error Handling', () => {
    it('should return 200 with generated reply when Gemini succeeds', async () => {
      // Mock client that returns a valid reply
      const mockGemini = {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'Hello! I am DevBot AI, powered by Google Gemini. How can I assist you today?'
          })
        }
      };
      geminiService.__setMockClient(mockGemini);

      const res = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello DevBot',
          history: [
            { role: 'user', content: 'Hi' },
            { role: 'assistant', content: 'Hello there' }
          ]
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        reply: 'Hello! I am DevBot AI, powered by Google Gemini. How can I assist you today?'
      });
      expect(mockGemini.models.generateContent).toHaveBeenCalledTimes(1);
    });

    it('should handle Gemini upstream failure gracefully without crashing', async () => {
      const mockGemini = {
        models: {
          generateContent: jest.fn().mockRejectedValue(new Error('Upstream AI service timeout'))
        }
      };
      geminiService.__setMockClient(mockGemini);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Trigger error test' });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Upstream AI service timeout');
    });

    it('should handle unconfigured API key gracefully', async () => {
      // Force null client and empty API key simulation
      geminiService.__setMockClient(null);
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' });

      // Restore key
      if (originalKey) process.env.GEMINI_API_KEY = originalKey;

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('GEMINI_API_KEY');
    });
  });
});
