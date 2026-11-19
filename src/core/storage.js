/**
 * ALANVERSO v5.0.0 - CAMADA DE PERSISTÊNCIA SEGURA EM LOCALSTORAGE
 * Envelopes JSON tolerantes a falhas de cota, modo privado ou dados corrompidos.
 */

export const STORAGE_KEYS = {
  THEME: 'alanverso-theme',
  CONTRAST: 'alanverso-contrast',
  LANGUAGE: 'alanverso-lang',
  ACHIEVEMENTS: 'alanverso-achievements',
  QUIZ_HIGHSCORE: 'alanverso-quiz-highscore',
  QUIZ_BEST_STREAK: 'alanverso-quiz-best-streak',
  CLIPS_FAVORITES: 'alanverso-clips-favorites',
  SOUND_FAVORITES: 'alanverso-sound-favorites',
  STATS: 'alanverso-stats',
};

/** Resolve instância segura de Storage ou usa memória como fallback em testes Node. */
function getStorage(customStorage) {
  if (customStorage) return customStorage;
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // Storage bloqueado pelo navegador
  }
  return null;
}

export function readText(key, fallback = '', storage = undefined) {
  const store = getStorage(storage);
  if (!store) return fallback;
  try {
    const val = store.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}

export function writeText(key, value, storage = undefined) {
  const store = getStorage(storage);
  if (!store) return false;
  try {
    store.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function readJson(key, fallback = null, storage = undefined) {
  const raw = readText(key, '', storage);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value, storage = undefined) {
  try {
    return writeText(key, JSON.stringify(value), storage);
  } catch {
    return false;
  }
}

/** Cria um store em memória compatível com a interface Storage para testes automatizados. */
export function createMemoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    clear: () => data.clear(),
  };
}
