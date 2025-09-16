###########
# Builder #
###########
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Use npm ci when lockfile present, else fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

############
#  Runner  #
############
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install only prod deps
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY server.js ./server.js

EXPOSE 8080

CMD ["node", "server.js"]