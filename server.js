import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const distPath = join(__dirname, 'dist');

// Simple startup diagnostics
console.log(`[server] Starting on port ${port}...`);
console.log(`[server] Node ${process.version}, ENV: ${process.env.NODE_ENV || 'development'}`);

// Check if dist exists
try {
  const stat = fs.statSync(distPath);
  if (!stat.isDirectory()) {
    throw new Error('dist is not a directory');
  }
  console.log('[server] dist directory found');
} catch (err) {
  console.error('[server] FATAL: dist directory not found!', err);
  process.exit(1);
}

// Health endpoint for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

// Static file serving
app.use(express.static(distPath));

// Catch-all
app.use((req, res) => {
  const indexPath = join(distPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      console.error('[server] Failed to serve index.html:', err);
      res.status(500).send('Server error');
    }
  });
});

// Start server with explicit host binding
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`[server] Ready and listening on 0.0.0.0:${port}`);
});

// Handle server startup errors
server.on('error', (err) => {
  console.error('[server] FATAL: Server startup error:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[server] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[server] SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('[server] Server closed');
    process.exit(0);
  });
});
