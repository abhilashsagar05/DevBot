const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🤖 DevBot AI Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🩺 Health: http://localhost:${config.port}/api/health`);
  console.log(`💬 Chat: POST http://localhost:${config.port}/api/chat`);
  console.log(`🧠 Gemini Model: ${config.geminiModel}`);
  console.log(`🔑 Gemini Key Configured: ${Boolean(config.geminiApiKey)}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log('====================================================');
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\n[${signal}] Initiating graceful shutdown...`);
  server.close(() => {
    console.log('[SHUTDOWN] HTTP server closed cleanly. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections refuse to close
  setTimeout(() => {
    console.error('[SHUTDOWN] Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;

