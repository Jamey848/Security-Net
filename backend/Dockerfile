# Build stage
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

#RUN npm run build => Only if this is defined in script!

# Final build does not need production dependencies
RUN npm prune --production

# Production stage
FROM node:22-alpine
WORKDIR /app

# None-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

RUN apk --no-cache add curl

# Copy only essential files
COPY --from=builder --chown=appuser:nodejs /app/src ./src
COPY --from=builder --chown=appuser:nodejs /app/package*.json ./
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules

USER appuser

EXPOSE 3000
CMD ["node", "src/server.js"]