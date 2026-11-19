import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('../..', import.meta.url));
const HTML_PATH = path.join(ROOT_DIR, 'index.html');
const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

function parseTags(html) {
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  const tags = [];
  const tagRegex =
    /<([a-zA-Z][\w-]*)((?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>]+))?)*)\s*\/?>/g;
  const attrRegex = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>]+)))?/g;

  for (const match of clean.matchAll(tagRegex)) {
    const tagName = match[1].toLowerCase();
    const rawAttrs = match[2];
    const attrs = {};
    for (const attrMatch of rawAttrs.matchAll(attrRegex)) {
      const key = attrMatch[1].toLowerCase();
      const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
      attrs[key] = val;
    }
    tags.push({ name: tagName, attrs });
  }
  return tags;
}

const tags = parseTags(htmlContent);
const allIds = tags.filter((t) => t.attrs.id).map((t) => t.attrs.id);

test('HTML: estrutura básica, idioma pt-BR e metadados SEO', () => {
  assert.match(htmlContent, /<!DOCTYPE\s+html>/i);
  const htmlTag = tags.find((t) => t.name === 'html');
  assert.equal(htmlTag?.attrs.lang, 'pt-BR');

  const charsetMeta = tags.find((t) => t.name === 'meta' && t.attrs.charset);
  assert.equal(charsetMeta?.attrs.charset.toLowerCase(), 'utf-8');

  const viewportMeta = tags.find((t) => t.name === 'meta' && t.attrs.name === 'viewport');
  assert.ok(viewportMeta, 'Deve possuir metatag viewport');

  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
  assert.ok(titleMatch && titleMatch[1].trim().length > 5);
});

test('HTML: unicidade absoluta de IDs e ausência de estilos/handlers inline', () => {
  const duplicates = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);
  assert.deepEqual(duplicates, [], `IDs duplicados encontrados: ${duplicates.join(', ')}`);

  assert.doesNotMatch(
    htmlContent,
    /\son(click|submit|change|load|error)\s*=/i,
    'HTML não pode conter event handlers inline',
  );
  assert.doesNotMatch(
    htmlContent,
    /\sstyle\s*=/i,
    'HTML modular não deve usar atributos style="" inline',
  );
});

test('HTML: presença de elementos e IDs vitais v5.0.0', () => {
  const requiredIds = [
    'header',
    'main-content',
    'theme-toggle',
    'contrast-toggle',
    'lang-toggle',
    'shortcuts-toggle',
    'fan-modal',
    'video-modal',
    'shortcuts-modal',
    'soundboard-canvas',
    'btn-fx-echo',
    'btn-fx-bass',
    'btn-fx-turbo',
    'clips-search-input',
    'clips-search-clear',
    'clips-sort-select',
    'clips-empty-state',
    'clips-reset-filter',
    'meme-canvas',
    'meme-filter-select',
    'meme-sticker-select',
    'quiz-card',
    'quiz-hint-btn',
    'quiz-streak-pill',
    'achievements-grid',
    'profile-stats-strip',
    'btn-export-profile',
    'input-import-profile',
  ];
  const missingIds = requiredIds.filter((id) => !allIds.includes(id));
  assert.deepEqual(missingIds, [], `IDs vitais ausentes: ${missingIds.join(', ')}`);
});

test('HTML: integridade de links internos, folhas de estilo e módulos ES', () => {
  const anchorHrefs = tags
    .filter((t) => t.name === 'a' && t.attrs.href && t.attrs.href.startsWith('#'))
    .map((t) => t.attrs.href.slice(1))
    .filter((id) => id.length > 0);
  const brokenAnchors = anchorHrefs.filter((id) => !allIds.includes(id));
  assert.deepEqual(brokenAnchors, [], `Links para âncoras inexistentes: ${brokenAnchors.join(', ')}`);

  const localCss = tags
    .filter(
      (t) =>
        t.name === 'link' &&
        t.attrs.rel === 'stylesheet' &&
        t.attrs.href &&
        !t.attrs.href.startsWith('http'),
    )
    .map((t) => t.attrs.href);
  assert.ok(localCss.length >= 4, 'Deve carregar folhas CSS modulares em styles/');
  for (const rel of localCss) {
    assert.ok(fs.existsSync(path.join(ROOT_DIR, rel)), `CSS não encontrado: ${rel}`);
  }

  const moduleScript = tags.find(
    (t) => t.name === 'script' && t.attrs.type === 'module' && t.attrs.src === 'src/main.js',
  );
  assert.ok(moduleScript, 'Deve carregar o entrypoint ES module src/main.js');
  assert.ok(fs.existsSync(path.join(ROOT_DIR, 'src/main.js')));
});

test('Acessibilidade HTML (a11y) e hierarquia de headings', () => {
  const skipLink = tags.find(
    (t) => t.name === 'a' && typeof t.attrs.class === 'string' && t.attrs.class.includes('skip-link'),
  );
  assert.equal(skipLink?.attrs.href, '#main-content');

  const imagesWithoutAlt = tags.filter((t) => t.name === 'img' && typeof t.attrs.alt !== 'string');
  assert.deepEqual(imagesWithoutAlt, [], 'Todas as <img> devem declarar atributo alt');

  const buttonsWithoutType = tags.filter((t) => t.name === 'button' && !t.attrs.type);
  assert.deepEqual(buttonsWithoutType, [], 'Todos os <button> devem declarar type');

  const h1Count = tags.filter((t) => t.name === 'h1').length;
  assert.equal(h1Count, 1, 'Documento deve ter exatamente 1 elemento <h1>');
  assert.ok(tags.filter((t) => t.name === 'h2').length >= 4);
  assert.ok(documentHasLiveRegion(tags));
});

function documentHasLiveRegion(allTags) {
  const live = allTags.find((t) => t.attrs.id === 'a11y-live-region');
  return Boolean(live && live.attrs['aria-live'] === 'polite');
}
