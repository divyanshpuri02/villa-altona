FROM node:18

WORKDIR /app

# Install build dependencies first (improves layer caching)
COPY package*.json ./
RUN npm ci && npm i -g serve@14

# Copy rest of the source
COPY . .

# Build the app
RUN npm run build

# Expose port 8080
EXPOSE 8080
ENV PORT=8080

# Run with serve
CMD ["serve", "-s", "dist", "-l", "8080"]