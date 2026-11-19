import assert from 'node:assert/strict';
import test from 'node:test';

import { installFakeDom } from '../helpers/fake-dom.js';

installFakeDom();

const { h, buildSafeRichFragment } = await import('../../src/core/dom.js');
const { debounce, parseViewsCount, parseDurationSeconds, formatDuration, safeUrl } = await import(
  '../../src/core/format.js'
);
const { createMemoryStorage, readJson, writeJson } = await import('../../src/core/storage.js');
const { createProfileBackup, validateProfileBackup } = await import('../../src/core/backup.js');
const { ACHIEVEMENTS_DATA, getRankTitle } = await import('../../src/data/achievements.js');
const { QUIZ_QUESTIONS, evaluateQuizResult } = await import('../../src/data/quiz.js');
const { MEME_CANVAS_FILTERS, MEME_STICKERS, SOUND_HOTKEYS } = await import('../../src/data/sounds.js');
const { ALANVERSO_TRANSLATIONS } = await import('../../src/data/i18n-dict.js');
const { I18nManager } = await import('../../src/features/i18n.js');
const { extractClipCardMeta } = await import('../../src/features/clips.js');

const HOSTILE = '<img src=x onerror="alert(1)"><script>alert(2)</script>';

test('DOM seguro: h() trata payloads hostis como texto puro (anti-XSS)', () => {
  const card = h('div', { class: 'test-card' }, h('h3', {}, HOSTILE));
  assert.equal(card.findAll('script').length, 0);
  assert.equal(card.findAll('img').length, 0);
  assert.ok(card.textContent.includes('<script>alert(2)</script>'));
});

test('DOM seguro: buildSafeRichFragment aceita <span> seguro e descarta <script>', () => {
  const frag = buildSafeRichFragment(
    'O Multiverso do <span class="hl">Alanzoka</span><script>evil()</script>',
  );
  assert.ok(frag.textContent.includes('Alanzoka'));
  assert.ok(!frag.textContent.includes('evil()'));
  assert.equal(frag.children.length, 2);
  assert.equal(frag.children[1].tagName, 'span');
});

test('Format: parseViewsCount ordena milhões acima de milhares corretamente', () => {
  assert.equal(parseViewsCount('1.4M visualizações'), 1400000);
  assert.equal(parseViewsCount('890K views'), 890000);
  assert.ok(parseViewsCount('1.4M') > parseViewsCount('890K'));
  assert.equal(parseViewsCount('invalido'), 0);
});

test('Format: parseDurationSeconds e formatDuration operam de forma consistente', () => {
  assert.equal(parseDurationSeconds('0:48'), 48);
  assert.equal(parseDurationSeconds('1:15'), 75);
  assert.equal(parseDurationSeconds('1:02:05'), 3725);
  assert.equal(formatDuration(75), '01:15');
  assert.equal(formatDuration(-5), '00:00');
});

test('Format: safeUrl bloqueia protocolos inseguros como javascript:', () => {
  assert.equal(safeUrl('https://twitch.tv/alanzoka'), 'https://twitch.tv/alanzoka');
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('vbscript:msgbox'), null);
  assert.equal(safeUrl('data:image/png;base64,abc'), 'data:image/png;base64,abc');
});

test('Format: debounce agrupa múltiplos disparos em uma única execução', async () => {
  let count = 0;
  const fn = debounce(() => {
    count += 1;
  }, 20);
  fn();
  fn();
  fn();
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(count, 1);
});

test('Storage: readJson / writeJson recuperam de dados corrompidos com segurança', () => {
  const mem = createMemoryStorage();
  mem.setItem('broken', '{invalid-json');
  assert.deepEqual(readJson('broken', { ok: false }, mem), { ok: false });
  writeJson('valid', { level: 5 }, mem);
  assert.deepEqual(readJson('valid', null, mem), { level: 5 });
});

test('Conquistas v5.0.0: catálogo com 12 medalhas e cálculo progressivo de patentes', () => {
  assert.equal(ACHIEVEMENTS_DATA.length, 12);
  const ids = new Set(ACHIEVEMENTS_DATA.map((a) => a.id));
  assert.equal(ids.size, 12);
  assert.ok(ids.has('audio_alchemist'));
  assert.ok(ids.has('clip_collector'));
  assert.match(getRankTitle(12), /Entidade Cósmica/);
  assert.match(getRankTitle(10), /Lenda Suprema/);
  assert.equal(getRankTitle(0), 'Explorador Iniciante');
});

test('Quiz v5.0.0: 10 perguntas válidas e avaliador de resultados', () => {
  assert.equal(QUIZ_QUESTIONS.length, 10);
  for (const q of QUIZ_QUESTIONS) {
    assert.ok(q.question.length > 10);
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
    assert.ok(q.explanation.length > 10);
  }
  const genius = evaluateQuizResult(10, 10);
  assert.equal(genius.percent, 100);
  assert.equal(genius.isGenius, true);
  assert.equal(evaluateQuizResult(2, 10).isGenius, false);
});

test('Atalhos do Soundboard não conflitam com atalhos globais T, C, L', () => {
  assert.equal(SOUND_HOTKEYS.T, undefined);
  assert.equal(SOUND_HOTKEYS.C, undefined);
  assert.equal(SOUND_HOTKEYS.L, undefined);
  assert.equal(SOUND_HOTKEYS.Q, 'speech-pedra');
  assert.equal(SOUND_HOTKEYS.W, 'speech-tijolo');
  assert.equal(SOUND_HOTKEYS.E, 'speech-respira');
});

test('Backup JSON v5.0.0: criação, validação, compatibilidade v3.0.0 e rejeição de adulteração', () => {
  const payload = createProfileBackup({
    quizHighScore: 9,
    quizBestStreak: 6,
    clipFavorites: ['Clipe A'],
    stats: { soundsPlayed: 12, memesCreated: 3, clipsWatched: 5 },
    achievements: { unlocked: ['first_step', 'audio_alchemist'], timestamps: {} },
  });
  assert.equal(payload.app, 'Alanverso');
  assert.equal(payload.version, '5.0.0');

  const validated = validateProfileBackup(JSON.stringify(payload));
  assert.equal(validated.ok, true);
  assert.equal(validated.data.quizHighScore, 9);
  assert.deepEqual(validated.data.clipFavorites, ['Clipe A']);

  // Compatibilidade retroativa com backup v3.0.0 e remoção de IDs inexistentes
  const legacyV3 = validateProfileBackup({
    app: 'Alanverso',
    version: '3.0.0',
    achievements: { unlocked: ['first_step', 'id_inventado_falso'] },
  });
  assert.equal(legacyV3.ok, true);
  assert.deepEqual(legacyV3.data.achievements.unlocked, ['first_step']);

  assert.equal(validateProfileBackup('{bad').ok, false);
  assert.equal(validateProfileBackup({ app: 'OutroApp' }).ok, false);
});

test('i18n: paridade exata de chaves entre pt-BR e en e sanitização XSS', () => {
  const ptKeys = Object.keys(ALANVERSO_TRANSLATIONS['pt-BR']).sort();
  const enKeys = Object.keys(ALANVERSO_TRANSLATIONS.en).sort();
  assert.deepEqual(ptKeys, enKeys, 'Dicionários pt-BR e en devem ter exatamente as mesmas chaves');

  const manager = new I18nManager(false);
  const clean = manager.sanitizeHtml('<span>Ok</span><script>alert(1)</script>');
  assert.ok(clean.includes('Ok'));
  assert.ok(!clean.includes('<script>'));
});

test('DOM seguro: buildSafeRichFragment bloqueia atributos onclick/onerror dentro de <span>', () => {
  const frag = buildSafeRichFragment('<span onclick="evil()" class="ok">Seguro</span>');
  const span = frag.children[0];
  assert.equal(span.tagName, 'span');
  assert.equal(span.getAttribute('class'), 'ok');
  assert.equal(span.getAttribute('onclick'), null);
});

test('Gerador de Memes v5.0.0: catálogo de filtros e stickers disponível', () => {
  assert.ok(MEME_CANVAS_FILTERS.bw.includes('grayscale'));
  assert.ok(MEME_CANVAS_FILTERS.gamer.includes('contrast'));
  assert.ok(MEME_STICKERS.aovivo.includes('AO VIVO'));
  assert.ok(MEME_STICKERS.pistola.includes('PISTOLA'));
});

test('Backup v5.0.0: sanitiza timestamps inválidos e limites negativos de estatísticas', () => {
  const res = validateProfileBackup({
    app: 'Alanverso',
    version: '5.0.0',
    quizHighScore: -10,
    stats: { soundsPlayed: -5, memesCreated: 'abc', clipsWatched: 7 },
    achievements: {
      unlocked: ['first_step'],
      timestamps: { first_step: 'data-invalida-xyz' },
    },
  });
  assert.equal(res.ok, true);
  assert.equal(res.data.quizHighScore, 0);
  assert.equal(res.data.stats.soundsPlayed, 0);
  assert.equal(res.data.stats.memesCreated, 0);
  assert.equal(res.data.stats.clipsWatched, 7);
  assert.equal(res.data.achievements.timestamps.first_step, undefined);
});

test('Clipes: extractClipCardMeta suporta seletores reais do card (h3, p, .clip-game)', () => {
  const mockCard = {
    getAttribute: (k) => (k === 'data-category' ? 'terror' : null),
    querySelector: (sel) => {
      if (sel === 'h3') return { textContent: 'Susto Mortal' };
      if (sel === 'p') return { textContent: 'Descrição épica' };
      if (sel === '.clip-game') return { textContent: 'Resident Evil' };
      if (sel === '.clip-duration') return { textContent: '1:25' };
      if (sel === '.clip-views') return { textContent: '1.4M views' };
      return null;
    },
  };
  const meta = extractClipCardMeta(mockCard);
  assert.equal(meta.title, 'Susto Mortal');
  assert.equal(meta.game, 'Resident Evil');
  assert.equal(meta.views, 1400000);
  assert.equal(meta.durationSeconds, 85);
});
