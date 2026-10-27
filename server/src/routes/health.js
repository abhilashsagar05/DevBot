const express = require('express');
const config = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'DevBot AI Backend',
    version: config.appVersion,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(config.geminiApiKey)
  });
});

module.exports = router;
