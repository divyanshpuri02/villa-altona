import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 8080);
const distPath = join(__dirname, 'dist');

console.log('[startup] node', process.version);
console.log('[startup] cwd', process.cwd());
console.log('[startup] PORT', process.env.PORT);
console.log('[startup] dist', distPath);
try {
  const s = fs.statSync(distPath);
  console.log('[startup] dist exists:', s.isDirectory());
} catch (e) {
  console.error('[startup] dist missing', e);
}

// Health endpoint for Cloud Run
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Serve static files from dist
app.use(express.static(distPath));

// For SPA: serve index.html for any unknown route
app.get(/.*/, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[startup] listening on 0.0.0.0:${port}`);
});