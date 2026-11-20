# Multi-stage or lightweight Node alpine image
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port
EXPOSE 5000

ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
