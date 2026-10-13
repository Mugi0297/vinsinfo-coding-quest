const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = Number(process.env.PORT || 8000);

const apiHandlers = new Map([
  ['leaderboard', './api/leaderboard'],
  ['student-progress', './api/student-progress'],
  ['student/auth', './api/student/auth'],
  ['admin/auth', './api/admin/auth'],
  ['admin/dashboard', './api/admin/dashboard'],
  ['admin/students', './api/admin/students']
]);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        resolve(raw);
      }
    });
    req.on('error', reject);
  });
}

async function serveApi(req, res) {
  const pathname = req.url.split('?')[0];
  const route = pathname.replace(/^\/api\//, '').replace(/\/$/, '');
  const handlerPath = apiHandlers.get(route);

  if (!handlerPath) {
    return sendJson(res, 404, { error: 'API route not found.' });
  }

  try {
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      req.body = await readRequestBody(req);
    }
    const handler = require(path.resolve(rootDir, handlerPath));
    await handler(req, res);
  } catch (error) {
    console.error(`API error for ${route}:`, error);
    sendJson(res, 500, { error: 'Server error while processing the request.' });
  }
}

function serveStatic(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let targetPath = url.pathname === '/' ? '/index.html' : url.pathname;
  let safePath = decodeURIComponent(targetPath).replace(/^\/+/, '');
  let resolved = path.resolve(rootDir, safePath);

  if (!resolved.startsWith(rootDir)) {
    res.writeHead(403); res.end('Forbidden');
    return;
  }

  fs.stat(resolved, (error, stats) => {
    if (error || !stats.isFile()) {
      if (targetPath.endsWith('/')) {
        const fallback = path.join(rootDir, targetPath, 'index.html');
        fs.stat(fallback, (fallbackError, fallbackStats) => {
          if (fallbackError || !fallbackStats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
          }
          return serveFile(fallback, res);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    serveFile(resolved, res);
  });
}

function serveFile(filePath, res) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[extension] || 'application/octet-stream';
  fs.readFile(filePath, (error, fileBuffer) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Unable to read file.');
      return;
    }
    // Question data is paired with a server-side answer key by bank index.
    // Revalidate every static response so a browser cannot keep old questions
    // after a deployment updates the answer key (or vice versa).
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache, must-revalidate'
    });
    res.end(fileBuffer);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      await serveApi(req, res);
      return;
    }
    serveStatic(req, res);
  } catch (error) {
    console.error('Request failed:', error);
    sendJson(res, 500, { error: 'Unhandled server error.' });
  }
});

server.listen(port, () => {
  console.log(`Local app server running at http://localhost:${port}`);
});
