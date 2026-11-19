import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const swSource = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');

function walkRelative(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkRelative(full, acc);
    } else {
      acc.push('./' + path.relative(ROOT, full).split(path.sep).join('/'));
    }
  }
  return acc;
}

test('PWA: manifest.json v5.0.0 válido com ícones e shortcuts', () => {
  assert.equal(manifest.short_name, 'Alanverso');
  assert.equal(manifest.id, 'alanverso-pwa-v5');
  assert.equal(manifest.display, 'standalone');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
  assert.ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 4);
});

test('PWA: sw.js lista e cobre todos os módulos JS e CSS da aplicação', () => {
  assert.match(swSource, /CACHE_NAME\s*=\s*'alanverso-cache-v5\.0\.0'/);
  assert.ok(swSource.includes('install') && swSource.includes('activate') && swSource.includes('fetch'));

  const expectedAssets = [
    ...walkRelative(path.join(ROOT, 'styles')),
    ...walkRelative(path.join(ROOT, 'src')),
    './index.html',
    './manifest.json',
    './assets/icons/favicon.svg',
  ];

  for (const asset of expectedAssets) {
    assert.ok(
      swSource.includes(`'${asset}'`),
      `Ativo ${asset} precisa estar listado em STATIC_ASSETS do sw.js para funcionar offline`,
    );
  }
});
