import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.DEFAULT_APP_PORT || (process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : 3000));

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent((urlPath || '/').split('?')[0]);
  const cleaned = normalize(decoded).replace(/^([.][.][/\\])+/, '');
  return cleaned === '/' ? '/index.html' : cleaned;
}

const server = http.createServer(async (req, res) => {
  try {
    let rel = safePath(req.url);
    let filePath = join(root, rel.replace(/^[/\\]+/, ''));

    try {
      const s = await stat(filePath);
      if (s.isDirectory()) filePath = join(filePath, 'index.html');
    } catch {
      // Single-page fallback. The original app itself is not modified.
      filePath = join(root, 'index.html');
    }

    const data = await readFile(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', mime[extname(filePath).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', extname(filePath).toLowerCase() === '.html' ? 'no-cache' : 'public, max-age=3600');
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Unable to serve application.');
    console.error(err);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`GVCN PRO running on http://0.0.0.0:${port}`);
});
