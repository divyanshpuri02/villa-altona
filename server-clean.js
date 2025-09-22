import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure server
const app = express();
const port = process.env.PORT || 8080;
const distPath = join(__dirname, 'dist');

// Startup diagnostics
console.log('[server] Starting...');
console.log('[server] Node version:', process.version);
console.log('[server] PORT:', port);
console.log('[server] Current directory:', __dirname);
console.log('[server] Dist path:', distPath);

// Check if dist exists
try {
  const stat = fs.statSync(distPath);
  console.log('[server] Dist exists:', stat.isDirectory());
  // List files in dist for debugging
  const files = fs.readdirSync(distPath);
  console.log('[server] Dist contents:', files);
} catch (err) {
  console.error('[server] ERROR: dist directory not found!', err);
}

// Health endpoint for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Static file serving
app.use(express.static(distPath));

// SPA routing - all routes to index.html
app.get('/', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.get('/:path([^.]*)', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Catch-all
app.use((req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Start server with explicit host binding
app.listen(port, '0.0.0.0', () => {
  console.log(`[server] Server running at http://0.0.0.0:${port}`);
});
