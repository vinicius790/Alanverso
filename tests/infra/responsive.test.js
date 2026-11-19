import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const STYLES_DIR = path.join(ROOT, 'styles');

test('CSS Modular: existência das camadas de estilo e balanceamento de chaves', () => {
  const expectedFiles = [
    'tokens.css',
    'base.css',
    'components.css',
    'sections/hero-showcase.css',
    'sections/soundboard-clips.css',
    'sections/interactive-labs.css',
    'sections/lore-footer.css',
    'responsive.css',
  ];
  for (const name of expectedFiles) {
    const filePath = path.join(STYLES_DIR, name);
    assert.ok(fs.existsSync(filePath), `Folha de estilo ausente: styles/${name}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const open = (content.match(/\{/g) || []).length;
    const close = (content.match(/\}/g) || []).length;
    assert.equal(open, close, `Chaves desbalanceadas em styles/${name}`);
  }
});

test('CSS Responsivo & WCAG AAA: media queries, reduced-motion, forced-colors e alto contraste', () => {
  const tokensCss = fs.readFileSync(path.join(STYLES_DIR, 'tokens.css'), 'utf8');
  const baseCss = fs.readFileSync(path.join(STYLES_DIR, 'base.css'), 'utf8');
  const responsiveCss = fs.readFileSync(path.join(STYLES_DIR, 'responsive.css'), 'utf8');

  assert.match(tokensCss, /\[data-contrast='high'\]/, 'tokens.css deve definir alto contraste AAA');
  assert.match(baseCss, /:focus-visible/, 'base.css deve estilizar foco de teclado');
  assert.match(responsiveCss, /@media\s*\(max-width:\s*992px\)/);
  assert.match(responsiveCss, /@media\s*\(max-width:\s*768px\)/);
  assert.match(responsiveCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(responsiveCss, /@media\s*\(forced-colors:\s*active\)/);
});
