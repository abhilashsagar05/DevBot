# ==========================================
# DevBot AI - Server Dockerfile
# ==========================================

FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package manifests
COPY package*.json ./

# Install only production dependencies cleanly
RUN npm ci --only=production

# Copy application source
COPY src/ ./src/

# Run as non-root user for container security
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
