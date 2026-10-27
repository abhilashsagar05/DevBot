const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const requestLogger = require('./middleware/logger');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./routes/health');
const chatRoutes = require('./routes/chat');

const app = express();

// Trust reverse proxy (Nginx) headers for accurate rate limiting and IP logging
app.set('trust proxy', 1);

// Security & Parsing Middleware
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// CORS configuration
const corsOptions = {
  origin: config.clientOrigin === '*' ? '*' : config.clientOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Request logging (skip during testing to keep test output clean)
if (config.nodeEnv !== 'test') {
  app.use(requestLogger);
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'DevBot AI API',
    status: 'online',
    version: config.appVersion,
    docs: 'Endpoints available at /api/health and /api/chat'
  });
});

// 404 and Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;

