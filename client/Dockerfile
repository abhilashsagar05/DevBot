# ==========================================
# DevBot AI - Client Dockerfile (Multi-stage)
# ==========================================

# Stage 1: Build React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy source code
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.27-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

