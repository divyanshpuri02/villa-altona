##################################
# Stage 1: Build TypeScript/React #
##################################
FROM --platform=linux/amd64 node:18-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies and set production mode
ENV NODE_ENV=development
ENV PLATFORM=linux/amd64

# Copy package files and install dependencies
COPY package*.json ./
RUN echo "Installing dependencies..." && \
    if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

# Copy application source
COPY . .

# Build React application
RUN echo "Building application..." && \
    npm run build && \
    ls -la dist/

################################
# Stage 2: Production Runtime  #
################################
FROM --platform=linux/amd64 node:18-slim AS runner

# Set working directory
WORKDIR /app

# Set production mode and port
ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies only
COPY package*.json ./
RUN echo "Installing production dependencies..." && \
    npm install --omit=dev --no-optional express && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY server.js ./server.js

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Expose the port
EXPOSE 8080

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/healthz || exit 1

# Start the server
CMD ["node", "server.js"]