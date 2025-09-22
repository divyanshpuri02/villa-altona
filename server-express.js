// Simple Express server with health check and diagnostics
const express = require('express');
const path = require('path');
const fs = require('fs');

// Configure server
const app = express();
const PORT = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist');

// Logging for diagnostics
console.log('[server] Starting server...');
console.log('[server] Node version:', process.version);
console.log('[server] PORT:', PORT);
console.log('[server] Current directory:', __dirname);
console.log('[server] Dist path:', distPath);

// Check if dist exists
try {
  const stat = fs.statSync(distPath);
  console.log('[server] Dist directory exists:', stat.isDirectory());
  
  // List files in dist for debugging
  const files = fs.readdirSync(distPath);
  console.log('[server] Dist contents:', files);
} catch (err) {
  console.error('[server] ERROR: dist directory not found!', err.message);
}

// Health check endpoint for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Static file serving with proper caching
app.use(express.static(distPath, {
  setHeaders: (res, filepath) => {
    // Cache assets but not HTML
    if (filepath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(filepath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
  }
}));

// SPA routing - all other routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[server] Error:', err);
  res.status(500).send('Server error');
});

// Start server with explicit host binding
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Server running at http://0.0.0.0:${PORT}`);
});

// Handle termination gracefully
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down...');
  process.exit(0);
});