/**
 * ALANVERSO v5.0.0 - ORQUESTRADOR PRINCIPAL (ES MODULES)
 * Conecta todos os domínios funcionais, atalhos globais livres de conflito e PWA offline.
 */

import { initAppearanceControls } from './core/a11y.js';
import { debounce } from './core/format.js';
import { ACHIEVEMENTS_DATA } from './data/achievements.js';
import { QUIZ_QUESTIONS } from './data/quiz.js';
import { SOUND_HOTKEYS } from './data/sounds.js';
import { initAchievementsFeature } from './features/achievements.js';
import { initClipsFeature } from './features/clips.js';
import { I18nManager } from './features/i18n.js';
import { initMemeGeneratorFeature } from './features/meme-generator.js';
import { initModalsFeature } from './features/modals.js';
import { initNavigationFeature } from './features/navigation.js';
import { initQuizFeature } from './features/quiz.js';
import { initSoundboardFeature } from './features/soundboard.js';

export function bootstrapAlanverso() {
  const i18n = new I18nManager(true);
  const achievements = initAchievementsFeature();

  initAppearanceControls(achievements.unlockAchievement);
  initNavigationFeature();
  const modals = initModalsFeature();
  const soundboard = initSoundboardFeature(
    achievements.unlockAchievement,
    achievements.incrementStat,
  );
  const clips = initClipsFeature(achievements.unlockAchievement, achievements.incrementStat);
  initMemeGeneratorFeature(achievements.unlockAchievement, achievements.incrementStat);
  initQuizFeature(achievements.unlockAchievement, achievements.renderAchievementsUI);

  // Registro do Service Worker PWA
  if (
    'serviceWorker' in navigator &&
    (window.location.protocol.startsWith('http') || window.location.hostname === 'localhost')
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('[Alanverso PWA] Erro ao registrar Service Worker:', err);
      });
    });
  }

  // Atalhos de Teclado Globais livres de conflito (WCAG AAA)
  window.addEventListener('keydown', (e) => {
    const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    if (e.key === 'Escape') {
      modals.closeShortcutsModal();
      modals.closeFanModal();
      clips.closeVideoModal();
      return;
    }

    if (isEditing || e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;
    const upper = key.toUpperCase();

    if (key === '?') {
      e.preventDefault();
      if (modals.isShortcutsOpen()) modals.closeShortcutsModal();
      else modals.openShortcutsModal();
      return;
    }

    if (key === '/') {
      e.preventDefault();
      const searchInput = document.getElementById('clips-search-input');
      searchInput?.focus();
      searchInput?.select?.();
      return;
    }

    if (upper === 'T') {
      e.preventDefault();
      document.getElementById('theme-toggle')?.click();
      return;
    }

    if (upper === 'C') {
      e.preventDefault();
      document.getElementById('contrast-toggle')?.click();
      return;
    }

    if (upper === 'L') {
      e.preventDefault();
      document.getElementById('lang-toggle')?.click();
      return;
    }

    const mappedSound = SOUND_HOTKEYS[upper] || SOUND_HOTKEYS[key];
    if (mappedSound) {
      const targetBtn = document.querySelector(`.sound-btn[data-sound="${mappedSound}"]`);
      if (targetBtn) {
        targetBtn.click();
        targetBtn.focus();
      }
    }
  });

  if (typeof window !== 'undefined') {
    window.alanversoI18n = i18n;
    window.alanverso = {
      version: '5.0.0',
      unlockAchievement: achievements.unlockAchievement,
      loadAchievements: achievements.loadAchievements,
      saveAchievements: achievements.saveAchievements,
      exportProfileJson: achievements.exportProfileJson,
      ACHIEVEMENTS_DATA,
      QUIZ_QUESTIONS,
      debounce,
      filterAndSortClips: clips.filterAndSortClips,
      soundboard,
    };
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapAlanverso);
  } else {
    bootstrapAlanverso();
  }
}
