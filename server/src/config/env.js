const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file if available
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local server/.env

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 60,
  maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH, 10) || 4000,
  appVersion: process.env.npm_package_version || '1.0.0'
};

function validateConfig() {
  if (!config.geminiApiKey && config.nodeEnv === 'production') {
    console.warn('[CONFIG WARNING] GEMINI_API_KEY is not defined in production environment!');
  }
}

validateConfig();

module.exports = config;
