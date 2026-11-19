// Servidor estático mínimo em Node.js para o Alanverso v5.0.0, sem dependências externas.
// Módulos ES não carregam por file://, então a página deve ser servida por HTTP.
//
// Uso: npm start            (porta 8080)
//      PORT=3000 npm start

import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const PUBLIC_FILES = new Set(['/index.html', '/manifest.json', '/sw.js']);
const PUBLIC_PREFIXES = ['/src/', '/styles/', '/assets/'];

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

/**
 * Converte o caminho da URL em um arquivo público seguro dentro de `root`.
 * Bloqueia path traversal, bytes nulos e arquivos privados do repositório (package.json, tests/, etc.).
 */
export function resolveFile(root, requestUrl) {
  if (typeof requestUrl !== 'string' || requestUrl.includes('..') || requestUrl.includes('\0')) {
    return null;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  } catch {
    return null;
  }

  if (pathname.includes('..') || pathname.includes('\0')) return null;

  const normalized = pathname === '/' ? '/index.html' : pathname;
  const isAllowed =
    PUBLIC_FILES.has(normalized) || PUBLIC_PREFIXES.some((prefix) => normalized.startsWith(prefix));
  if (!isAllowed) return null;

  const base = resolve(root);
  const file = resolve(base, `.${normalized}`);
  return file.startsWith(base + sep) ? file : null;
}

async function handle(request, response) {
  const file =
    request.method === 'GET' || request.method === 'HEAD' ? resolveFile(ROOT, request.url) : null;

  try {
    if (!file) throw new Error('Acesso negado');
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Não encontrado');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 8080;
  const server = createServer(handle);
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`A porta ${port} já está em uso. Escolha outra com a variável PORT.`);
    } else {
      console.error(`Não foi possível iniciar o servidor: ${error.message}`);
    }
    process.exit(1);
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Alanverso v5.0.0 em http://localhost:${port}/  —  Ctrl+C para parar`);
  });
}
