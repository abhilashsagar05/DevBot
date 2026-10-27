const express = require('express');
const config = require('../config/env');
const { chatRateLimiter } = require('../middleware/rateLimiter');
const { generateChatResponse } = require('../services/geminiService');

const router = express.Router();

router.post('/', chatRateLimiter, async (req, res, next) => {
  try {
    const { message, history } = req.body;

    // 1. Validation: Presence and type check
    if (message === undefined || message === null) {
      return res.status(400).json({
        success: false,
        error: 'Message field is required.'
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message must be a text string.'
      });
    }

    // 2. Validation: Empty / Whitespace check
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty.'
      });
    }

    // 3. Validation: Length limit check
    if (trimmedMessage.length > config.maxMessageLength) {
      return res.status(400).json({
        success: false,
        error: `Message exceeds the maximum limit of ${config.maxMessageLength} characters.`
      });
    }

    // 4. Validate history if provided
    let safeHistory = [];
    if (Array.isArray(history)) {
      safeHistory = history
        .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
        .slice(-10); // Keep last 10 turns to avoid excessive context
    }

    // 5. Call Gemini Service
    const reply = await generateChatResponse(trimmedMessage, safeHistory);

    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('[CHAT ERROR]', error.message);
    const statusCode = error.statusCode || (error.message.includes('configured') ? 503 : 500);
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to generate response from AI service.'
    });
  }
});

// Reject unsupported methods on /api/chat
router.all('/', (req, res) => {
  res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed on this endpoint.`
  });
});

module.exports = router;

