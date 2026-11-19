import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { resolveFile } from '../../scripts/serve.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

test('Servidor: resolveFile entrega arquivos válidos de dentro da raiz', () => {
  assert.equal(resolveFile(ROOT, '/'), path.join(ROOT, 'index.html'));
  assert.equal(resolveFile(ROOT, '/src/main.js'), path.join(ROOT, 'src', 'main.js'));
  assert.equal(resolveFile(ROOT, '/styles/tokens.css'), path.join(ROOT, 'styles', 'tokens.css'));
  assert.equal(resolveFile(ROOT, '/assets/icons/favicon.svg'), path.join(ROOT, 'assets', 'icons', 'favicon.svg'));
});

test('Servidor: resolveFile bloqueia path traversal, bytes nulos e arquivos privados', () => {
  assert.equal(resolveFile(ROOT, '/../package.json'), null);
  assert.equal(resolveFile(ROOT, '/package.json'), null);
  assert.equal(resolveFile(ROOT, '/tests/unit/dom.test.js'), null);
  assert.equal(resolveFile(ROOT, '/%2e%2e/secret'), null);
  assert.equal(resolveFile(ROOT, '/index.html%00.js'), null);
});
