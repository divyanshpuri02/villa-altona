FROM node:18-alpine
WORKDIR /app

# Install dependencies and serve
COPY package*.json ./
RUN npm install && npm install -g serve@14

# Copy source
COPY . .

# Build static files
RUN npm run build

# Expose port 8080 for Cloud Run
EXPOSE 8080
ENV PORT=8080

# Start static server
CMD ["serve", "-s", "dist", "-l", "8080"]