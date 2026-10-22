// Testes de sanidade estrutural e integridade do DOM do Alanverso
// Rodar com: node --test tests/test_dom.js ou node tests/test_dom.js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT_DIR, 'index.html');

function loadHTML() {
  assert.ok(fs.existsSync(HTML_PATH), 'index.html deve existir na raiz do projeto');
  return fs.readFileSync(HTML_PATH, 'utf8');
}

function parseTags(html) {
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  const tags = [];
  const tagRegex = /<([a-zA-Z][\w-]*)((?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>]+))?)*)\s*\/?>/g;
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

const htmlContent = loadHTML();
const tags = parseTags(htmlContent);
const allIds = tags.filter(t => t.attrs.id).map(t => t.attrs.id);

test('Estrutura básica e metadados essenciais do HTML', () => {
  assert.match(htmlContent, /<!DOCTYPE\s+html>/i, 'Deve conter declaração de DOCTYPE html5');

  const htmlTag = tags.find(t => t.name === 'html');
  assert.ok(htmlTag, 'Elemento <html> deve estar presente');
  assert.equal(htmlTag.attrs.lang, 'pt-BR', 'O atributo lang do html deve ser pt-BR');

  const charsetMeta = tags.find(t => t.name === 'meta' && t.attrs.charset);
  assert.ok(charsetMeta, 'Deve conter <meta charset="...">');
  assert.equal(charsetMeta.attrs.charset.toLowerCase(), 'utf-8', 'Charset deve ser UTF-8');

  const viewportMeta = tags.find(t => t.name === 'meta' && t.attrs.name === 'viewport');
  assert.ok(viewportMeta, 'Deve conter meta tag de viewport responsiva');

  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
  assert.ok(titleMatch && titleMatch[1].trim().length > 5, 'Tag <title> deve ter conteúdo descritivo');

  const descMeta = tags.find(t => t.name === 'meta' && t.attrs.name === 'description');
  assert.ok(descMeta && descMeta.attrs.content.length > 20, 'Meta description deve estar presente e detalhada');
});

test('Unicidade de IDs no documento', () => {
  const duplicates = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);
  assert.deepEqual(duplicates, [], `Existem IDs duplicados no documento: ${duplicates.join(', ')}`);
});

test('Presença de elementos e IDs vitais para o main.js', () => {
  const requiredIds = [
    'header',
    'main-content',
    'theme-toggle',
    'theme-icon-sun',
    'theme-icon-moon',
    'fan-modal',
    'modal-close-btn',
    'modal-preview-img',
    'modal-meme-title',
    'modal-meme-desc',
    'fan-submission-form',
    'fan-nickname'
  ];

  const missingIds = requiredIds.filter(id => !allIds.includes(id));
  assert.deepEqual(missingIds, [], `IDs necessários para a lógica do main.js ausentes: ${missingIds.join(', ')}`);
});

test('Integridade das âncoras internas e links de navegação', () => {
  const anchorHrefs = tags
    .filter(t => t.name === 'a' && t.attrs.href && t.attrs.href.startsWith('#'))
    .map(t => t.attrs.href.slice(1))
    .filter(id => id.length > 0);

  const brokenAnchors = anchorHrefs.filter(id => !allIds.includes(id));
  assert.deepEqual(brokenAnchors, [], `Links para âncoras inexistentes: ${brokenAnchors.join(', ')}`);
  assert.ok(anchorHrefs.length >= 5, `Esperava-se ao menos 5 âncoras internas no site, encontradas: ${anchorHrefs.length}`);
});

test('Verificação de referências de arquivos locais (CSS/JS)', () => {
  const localCss = tags
    .filter(t => t.name === 'link' && t.attrs.rel === 'stylesheet' && t.attrs.href && !t.attrs.href.startsWith('http'))
    .map(t => t.attrs.href);

  for (const cssRel of localCss) {
    const cssPath = path.join(ROOT_DIR, cssRel);
    assert.ok(fs.existsSync(cssPath), `Folha de estilo local não encontrada: ${cssRel}`);
  }

  const localJs = tags
    .filter(t => t.name === 'script' && t.attrs.src && !t.attrs.src.startsWith('http'))
    .map(t => t.attrs.src);

  for (const jsRel of localJs) {
    const jsPath = path.join(ROOT_DIR, jsRel);
    assert.ok(fs.existsSync(jsPath), `Script local não encontrado: ${jsRel}`);
  }
});

test('Boas práticas de Acessibilidade (a11y)', () => {
  // 1. Skip link para pular para o conteúdo principal
  const skipLink = tags.find(t => t.name === 'a' && t.attrs.class && t.attrs.class.includes('skip-link'));
  assert.ok(skipLink, 'Deve existir um link acessível .skip-link');
  assert.equal(skipLink.attrs.href, '#main-content', 'Skip link deve apontar para #main-content');

  // 2. Imagens com alt
  const images = tags.filter(t => t.name === 'img');
  const imagesWithoutAlt = images.filter(img => typeof img.attrs.alt !== 'string');
  assert.deepEqual(imagesWithoutAlt, [], 'Todas as tags <img> devem ter o atributo alt definido');

  // 3. Botões com atributo type
  const buttons = tags.filter(t => t.name === 'button');
  const buttonsWithoutType = buttons.filter(btn => !btn.attrs.type);
  assert.deepEqual(buttonsWithoutType, [], 'Todas as tags <button> devem especificar o atributo type');

  // 4. Seção main presente
  const mainElements = tags.filter(t => t.name === 'main');
  assert.equal(mainElements.length, 1, 'Deve existir exatamente uma tag <main> no documento');

  // 5. Botão de alternância de alto contraste
  const contrastBtn = tags.find(t => t.attrs.id === 'contrast-toggle');
  assert.ok(contrastBtn, 'Deve existir um botão #contrast-toggle para modo de alto contraste');
  assert.equal(contrastBtn.attrs.type, 'button', '#contrast-toggle deve ter type="button"');
  assert.ok(contrastBtn.attrs['aria-label'], '#contrast-toggle deve possuir aria-label descritivo');

  // 6. Região live para leitor de tela
  const liveRegion = tags.find(t => t.attrs.id === 'a11y-live-region');
  assert.ok(liveRegion, 'Deve existir uma região live #a11y-live-region para leitor de tela');
  assert.equal(liveRegion.attrs['aria-live'], 'polite', '#a11y-live-region deve declarar aria-live="polite"');
});

test('Hierarquia e semântica de cabeçalhos (headings)', () => {
  const headingTags = tags.filter(t => /^h[1-6]$/.test(t.name));
  assert.ok(headingTags.length > 0, 'O documento deve possuir cabeçalhos');

  const h1Elements = headingTags.filter(t => t.name === 'h1');
  assert.equal(h1Elements.length, 1, 'Deve existir exatamente um cabeçalho <h1> principal no documento');

  // Todas as seções principais devem possuir títulos h2
  const h2Elements = headingTags.filter(t => t.name === 'h2');
  assert.ok(h2Elements.length >= 4, 'As seções principais do site devem possuir cabeçalhos <h2>');

  // Cabeçalhos de apoio (cards, depoimentos, footer) devem usar h3 ou h4
  const subHeadings = headingTags.filter(t => ['h3', 'h4'].includes(t.name));
  assert.ok(subHeadings.length > 0, 'Componentes internos devem utilizar cabeçalhos semânticos (h3/h4)');
});
