/**
 * ALANVERSO v5.0.0 - EXPORTAÇÃO E VALIDAÇÃO DE BACKUP DE PERFIL JSON
 */

import { ACHIEVEMENT_IDS } from '../data/achievements.js';

export const PROFILE_SCHEMA_VERSION = '5.0.0';
const SUPPORTED_VERSIONS = new Set(['3.0.0', '4.0.0', '5.0.0']);

/**
 * Monta o payload padronizado de backup do perfil do Alanverso.
 */
export function createProfileBackup({
  theme = 'dark',
  contrast = 'normal',
  language = 'pt-BR',
  quizHighScore = 0,
  quizBestStreak = 0,
  clipFavorites = [],
  stats = {},
  achievements = { unlocked: [], timestamps: {} },
} = {}) {
  return {
    app: 'Alanverso',
    version: PROFILE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    theme: theme === 'light' ? 'light' : 'dark',
    contrast: contrast === 'high' ? 'high' : 'normal',
    language: language === 'en' ? 'en' : 'pt-BR',
    quizHighScore: Math.max(0, Number(quizHighScore) || 0),
    quizBestStreak: Math.max(0, Number(quizBestStreak) || 0),
    clipFavorites: Array.isArray(clipFavorites) ? clipFavorites.filter((x) => typeof x === 'string') : [],
    stats: {
      soundsPlayed: Math.max(0, Number(stats.soundsPlayed) || 0),
      memesCreated: Math.max(0, Number(stats.memesCreated) || 0),
      clipsWatched: Math.max(0, Number(stats.clipsWatched) || 0),
    },
    achievements: {
      unlocked: Array.isArray(achievements?.unlocked) ? [...achievements.unlocked] : [],
      timestamps:
        achievements?.timestamps && typeof achievements.timestamps === 'object'
          ? { ...achievements.timestamps }
          : {},
    },
  };
}

/**
 * Valida e normaliza um JSON de backup (string ou objeto já parseado).
 * Recusa arquivos corrompidos, versões incompatíveis ou apps diferentes.
 */
export function validateProfileBackup(input) {
  let parsed = input;
  if (typeof input === 'string') {
    try {
      parsed = JSON.parse(input);
    } catch {
      return { ok: false, error: 'JSON malformado ou ilegível.' };
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'Estrutura de backup inválida.' };
  }

  if (parsed.app !== 'Alanverso') {
    return { ok: false, error: 'Arquivo não pertence ao portal Alanverso.' };
  }

  const version = typeof parsed.version === 'string' ? parsed.version : '3.0.0';
  if (!SUPPORTED_VERSIONS.has(version)) {
    return { ok: false, error: `Versão de backup não suportada: ${version}` };
  }

  if (!parsed.achievements || !Array.isArray(parsed.achievements.unlocked)) {
    return { ok: false, error: 'Lista de conquistas ausente no arquivo JSON.' };
  }

  const validUnlocked = [...new Set(parsed.achievements.unlocked)].filter(
    (id) => typeof id === 'string' && ACHIEVEMENT_IDS.has(id),
  );

  const validTimestamps = {};
  if (parsed.achievements.timestamps && typeof parsed.achievements.timestamps === 'object') {
    for (const id of validUnlocked) {
      const rawDate = parsed.achievements.timestamps[id];
      if (typeof rawDate === 'string' && !Number.isNaN(new Date(rawDate).getTime())) {
        validTimestamps[id] = rawDate;
      }
    }
  }

  const clipFavorites = Array.isArray(parsed.clipFavorites)
    ? [...new Set(parsed.clipFavorites)].filter((c) => typeof c === 'string' && c.length <= 120)
    : [];

  return {
    ok: true,
    data: {
      app: 'Alanverso',
      version: PROFILE_SCHEMA_VERSION,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      contrast: parsed.contrast === 'high' ? 'high' : 'normal',
      language: parsed.language === 'en' ? 'en' : 'pt-BR',
      quizHighScore: Math.max(0, Math.min(100, Number(parsed.quizHighScore) || 0)),
      quizBestStreak: Math.max(0, Math.min(100, Number(parsed.quizBestStreak) || 0)),
      clipFavorites,
      stats: {
        soundsPlayed: Math.max(0, Number(parsed.stats?.soundsPlayed) || 0),
        memesCreated: Math.max(0, Number(parsed.stats?.memesCreated) || 0),
        clipsWatched: Math.max(0, Number(parsed.stats?.clipsWatched) || 0),
      },
      achievements: {
        unlocked: validUnlocked,
        timestamps: validTimestamps,
      },
    },
  };
}
