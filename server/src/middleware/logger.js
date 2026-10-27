function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${originalUrl} ${statusCode} - ${duration}ms (IP: ${ip || 'unknown'})`);
  });

  next();
}

module.exports = requestLogger;
