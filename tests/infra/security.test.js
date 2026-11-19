import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SKIPPED_DIRS = new Set(['node_modules', '.git', 'coverage']);
const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.html', '.css', '.json', '.md', '.yml', '.svg']);

function collectFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) collectFiles(fullPath, acc);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      const rel = path.relative(ROOT, fullPath).split(path.sep).join('/');
      acc.push({ name: rel, buffer: fs.readFileSync(fullPath) });
    }
  }
  return acc;
}

const files = collectFiles(ROOT).map((f) => ({
  ...f,
  content: f.buffer.toString('utf8'),
}));

test('Segurança: zero usos de innerHTML, outerHTML, insertAdjacentHTML ou document.write em src/', () => {
  const htmlSinks = /\b(innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/;
  const offenders = files
    .filter((f) => f.name.startsWith('src/') && htmlSinks.test(f.content))
    .map((f) => f.name);
  assert.deepEqual(offenders, [], `Sinks HTML inseguros encontrados: ${offenders.join(', ')}`);
});

test('Segurança: nenhuma credencial ou segredo exposto no repositório', () => {
  const secretRegex = /(api[_-]?key|secret|token|password)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/i;
  const offenders = files
    .filter((f) => !f.name.startsWith('tests/') && secretRegex.test(f.content))
    .map((f) => f.name);
  assert.deepEqual(offenders, [], `Possíveis segredos encontrados: ${offenders.join(', ')}`);
});

test('Integridade: todos os arquivos em UTF-8 sem BOM e sem caracteres corrompidos (mojibake)', () => {
  const mojibake = /\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf]|\ufffd/;
  const offenders = files
    .filter((f) => {
      const hasBom =
        f.buffer.length >= 3 &&
        f.buffer[0] === 0xef &&
        f.buffer[1] === 0xbb &&
        f.buffer[2] === 0xbf;
      return hasBom || mojibake.test(f.content);
    })
    .map((f) => f.name);
  assert.deepEqual(offenders, [], `Arquivos com BOM ou mojibake: ${offenders.join(', ')}`);
});

test('Estrutura: raiz organizada sem documentação ou configs Docker soltas', () => {
  const rootEntries = new Set(fs.readdirSync(ROOT));
  for (const requiredDir of ['docs', 'deploy', 'assets', 'scripts', 'src', 'styles', 'tests']) {
    assert.ok(rootEntries.has(requiredDir), `Pasta ausente: ${requiredDir}`);
  }
  for (const moved of ['Dockerfile', 'docker-compose.yml', 'nginx.conf', 'favicon.svg', 'ARCHITECTURE.md', 'ESTRUTURA.md', 'CONTRIBUTING.md', 'SECURITY.md']) {
    assert.equal(rootEntries.has(moved), false, `Deveria estar organizado em subpasta: ${moved}`);
  }
});
