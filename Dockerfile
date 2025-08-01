FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Set default port
ENV PORT=8080

# Start the app
CMD ["npm", "run", "preview"]