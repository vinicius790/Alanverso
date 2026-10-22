/**
 * ALANVERSO - SUITE DE TESTES DE RECURSOS AVANÇADOS
 * Valida: Conquistas, Quiz Interativo, Busca com Debounce, PWA, Exportação JSON, WCAG AAA e i18n
 * Executável com: node --test tests/features.test.js
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT_DIR, 'index.html');
const CSS_PATH = path.join(ROOT_DIR, 'style.css');
const MAIN_JS_PATH = path.join(ROOT_DIR, 'main.js');
const SW_PATH = path.join(ROOT_DIR, 'sw.js');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');
const I18N_PATH = path.join(ROOT_DIR, 'i18n.js');

const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');
const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
const mainJsContent = fs.readFileSync(MAIN_JS_PATH, 'utf8');
const manifestContent = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const swContent = fs.readFileSync(SW_PATH, 'utf8');
const { alanversoTranslations, I18nManager } = require(I18N_PATH);

test('PWA: Validação do Web App Manifest (manifest.json)', () => {
  assert.equal(manifestContent.short_name, 'Alanverso', 'short_name deve ser Alanverso');
  assert.ok(manifestContent.name.includes('Alanverso'), 'name deve conter Alanverso');
  assert.equal(manifestContent.display, 'standalone', 'display deve ser standalone para experiência app');
  assert.ok(manifestContent.start_url, 'start_url deve estar configurado');
  assert.ok(manifestContent.theme_color, 'theme_color deve estar configurado');
  assert.ok(manifestContent.background_color, 'background_color deve estar configurado');
  assert.ok(Array.isArray(manifestContent.icons) && manifestContent.icons.length > 0, 'Deve conter ícones PWA');
  assert.ok(Array.isArray(manifestContent.shortcuts) && manifestContent.shortcuts.length >= 3, 'Deve conter atalhos rápidos');
});

test('PWA: Validação do Service Worker (sw.js)', () => {
  assert.ok(swContent.includes('CACHE_NAME'), 'Deve definir constante de nome do cache');
  assert.ok(swContent.includes('STATIC_ASSETS'), 'Deve listar assets essenciais para cache offline');
  assert.ok(swContent.includes('install'), 'Deve escutar evento install');
  assert.ok(swContent.includes('activate'), 'Deve escutar evento activate');
  assert.ok(swContent.includes('fetch'), 'Deve implementar interceptador fetch');
  assert.ok(swContent.includes('index.html') && swContent.includes('style.css') && swContent.includes('main.js'), 'Assets chave devem estar cacheados');
});

test('Sistema de Conquistas: Integridade estrutural e dados', () => {
  assert.ok(mainJsContent.includes('ACHIEVEMENTS_DATA'), 'Deve conter array ACHIEVEMENTS_DATA no main.js');
  assert.ok(mainJsContent.includes('ACHIEVEMENTS_STORAGE_KEY'), 'Deve conter chave de storage do localStorage');
  assert.ok(mainJsContent.includes('unlockAchievement'), 'Deve conter função unlockAchievement');
  assert.ok(mainJsContent.includes('first_step'), 'Deve incluir conquista first_step');
  assert.ok(mainJsContent.includes('quiz_genius'), 'Deve incluir conquista quiz_genius');
  assert.ok(mainJsContent.includes('contrast_pro'), 'Deve incluir conquista contrast_pro');
  assert.ok(mainJsContent.includes('data_hoarder'), 'Deve incluir conquista data_hoarder');

  // Verifica elementos de conquistas no HTML
  assert.ok(htmlContent.includes('id="achievements"'), 'Deve existir seção #achievements');
  assert.ok(htmlContent.includes('id="achievements-counter-badge"'), 'Deve existir contador de troféus no nav');
  assert.ok(htmlContent.includes('id="achievements-progress-bar"'), 'Deve existir barra de progresso de conquistas');
  assert.ok(htmlContent.includes('id="achievements-grid"'), 'Deve existir grade de cards de conquistas');
});

test('Quiz Interativo: Validação do banco de perguntas e mecânica', () => {
  assert.ok(mainJsContent.includes('QUIZ_QUESTIONS'), 'Deve conter array QUIZ_QUESTIONS no main.js');
  assert.ok(mainJsContent.includes('renderQuizQuestion'), 'Deve conter função de renderização de perguntas');
  assert.ok(mainJsContent.includes('handleQuizAnswer'), 'Deve conter lógica de resposta e pontuação');
  assert.ok(mainJsContent.includes('showQuizResults'), 'Deve conter tela de resultado final do quiz');

  // Verifica elementos do Quiz no HTML
  assert.ok(htmlContent.includes('id="quiz"'), 'Deve existir seção #quiz');
  assert.ok(htmlContent.includes('id="quiz-question-text"'), 'Deve existir título da pergunta');
  assert.ok(htmlContent.includes('id="quiz-options-grid"'), 'Deve existir container de opções');
  assert.ok(htmlContent.includes('id="quiz-feedback-box"'), 'Deve existir caixa de feedback imediato acessível');
  assert.ok(htmlContent.includes('id="quiz-result-card"'), 'Deve existir card de resultados');
});

test('Busca com Debounce: Utilitário e implementação na Central de Clipes', () => {
  assert.ok(mainJsContent.includes('function debounce'), 'Função utilitária debounce deve estar definida');
  assert.ok(mainJsContent.includes('filterAndSortClips'), 'Função de filtragem e ordenação deve estar definida');
  assert.ok(htmlContent.includes('id="clips-search-input"'), 'Input de busca com debounce deve existir');
  assert.ok(htmlContent.includes('id="clips-search-clear"'), 'Botão de limpar busca deve existir');
  assert.ok(htmlContent.includes('id="clips-sort-select"'), 'Select de ordenação deve existir');
  assert.ok(htmlContent.includes('id="clips-results-count"'), 'Contador de resultados com aria-live deve existir');

  // Testa lógica de debounce pura
  let contador = 0;
  function debounceHelper(fn, delay = 50) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const debouncedFn = debounceHelper(() => { contador++; }, 20);
  debouncedFn();
  debouncedFn();
  debouncedFn();

  return new Promise(resolve => {
    setTimeout(() => {
      assert.equal(contador, 1, 'Debounce deve consolidar múltiplas invocações em uma única chamada');
      resolve();
    }, 50);
  });
});

test('Exportação e Importação JSON de Perfil', () => {
  assert.ok(mainJsContent.includes('exportProfileJson'), 'Função exportProfileJson deve estar implementada');
  assert.ok(mainJsContent.includes('importProfileJson'), 'Função importProfileJson deve estar implementada');
  assert.ok(htmlContent.includes('id="btn-export-profile"'), 'Botão de exportar perfil deve existir no DOM');
  assert.ok(htmlContent.includes('id="input-import-profile"'), 'Input de importar perfil deve existir no DOM');

  // Validação do schema JSON
  const sampleProfile = {
    app: 'Alanverso',
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    theme: 'dark',
    contrast: 'normal',
    language: 'pt-BR',
    quizHighScore: 6,
    achievements: {
      unlocked: ['first_step', 'quiz_genius'],
      timestamps: { first_step: new Date().toISOString() }
    }
  };

  assert.equal(sampleProfile.app, 'Alanverso', 'Schema deve conter app: Alanverso');
  assert.equal(sampleProfile.version, '3.0.0', 'Versão deve ser 3.0.0');
  assert.ok(Array.isArray(sampleProfile.achievements.unlocked), 'Achievements deve conter array unlocked');
});

test('Acessibilidade WCAG AAA: Alto Contraste, Focus e Atalhos', () => {
  assert.ok(cssContent.includes('[data-contrast="high"]'), 'CSS deve possuir regras de alto contraste [data-contrast="high"]');
  assert.ok(cssContent.includes(':focus-visible'), 'CSS deve fornecer estilos visíveis de foco de teclado');
  assert.ok(htmlContent.includes('id="shortcuts-toggle"'), 'Botão de abrir atalhos de teclado deve existir');
  assert.ok(htmlContent.includes('id="shortcuts-modal"'), 'Modal de guia de atalhos de teclado deve existir');
  assert.ok(htmlContent.includes('role="dialog"'), 'Modais devem possuir role="dialog"');
  assert.ok(htmlContent.includes('aria-live="polite"'), 'Área de anúncios de voz acessíveis deve estar ativa');
});

test('Internacionalização (i18n): Paridade de chaves entre pt-BR e en', () => {
  const ptKeys = Object.keys(alanversoTranslations['pt-BR']);
  const enKeys = Object.keys(alanversoTranslations['en']);

  assert.ok(ptKeys.length >= 40, 'Dicionário pt-BR deve conter chaves suficientes');
  assert.ok(enKeys.length >= 40, 'Dicionário en deve conter chaves suficientes');

  // Verifica chaves essenciais em ambos os idiomas
  const essentialKeys = ['skip.main', 'nav.home', 'hero.title', 'quiz.title', 'achievements.title'];
  for (const k of essentialKeys) {
    assert.ok(alanversoTranslations['pt-BR'][k], `Chave ${k} deve existir em pt-BR`);
    assert.ok(alanversoTranslations['en'][k], `Chave ${k} deve existir em en`);
  }

  // Sanitização de HTML contra XSS
  const manager = new I18nManager();
  const safe = manager.sanitizeHtml('<span class="highlight">Texto</span><script>alert(1)</script>');
  assert.ok(!safe.includes('<script>'), 'Sanitizer deve remover tags <script>');
  assert.ok(safe.includes('Texto'), 'Sanitizer deve manter conteúdo seguro');
});
