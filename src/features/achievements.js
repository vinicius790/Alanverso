/**
 * ALANVERSO v5.0.0 - SISTEMA DE CONQUISTAS, ESTATÍSTICAS E BACKUP JSON
 */

import { announceA11y, showToast } from '../core/a11y.js';
import { createProfileBackup, validateProfileBackup } from '../core/backup.js';
import { clearElement, h } from '../core/dom.js';
import { formatDatePtBr } from '../core/format.js';
import { STORAGE_KEYS, readJson, readText, writeJson, writeText } from '../core/storage.js';
import { ACHIEVEMENTS_DATA, ACHIEVEMENT_IDS, getRankTitle } from '../data/achievements.js';

export function loadAchievements() {
  const parsed = readJson(STORAGE_KEYS.ACHIEVEMENTS, null);
  if (parsed && Array.isArray(parsed.unlocked)) {
    return {
      unlocked: [...new Set(parsed.unlocked)].filter((id) => ACHIEVEMENT_IDS.has(id)),
      timestamps:
        parsed.timestamps && typeof parsed.timestamps === 'object' ? { ...parsed.timestamps } : {},
    };
  }
  return { unlocked: [], timestamps: {} };
}

export function saveAchievements(data) {
  return writeJson(STORAGE_KEYS.ACHIEVEMENTS, data);
}

export function loadUserStats() {
  const parsed = readJson(STORAGE_KEYS.STATS, null);
  return {
    soundsPlayed: Math.max(0, Number(parsed?.soundsPlayed) || 0),
    memesCreated: Math.max(0, Number(parsed?.memesCreated) || 0),
    clipsWatched: Math.max(0, Number(parsed?.clipsWatched) || 0),
  };
}

export function initAchievementsFeature() {
  let userAchievements = loadAchievements();
  let userStats = loadUserStats();

  const counterBadge = document.getElementById('achievements-counter-badge');
  const progressFill = document.getElementById('achievements-progress-fill');
  const progressBar = document.getElementById('achievements-progress-bar');
  const percentText = document.getElementById('achievements-percentage-text');
  const rankBadge = document.getElementById('profile-rank-badge');
  const grid = document.getElementById('achievements-grid');

  const statSoundsEl = document.getElementById('stat-sounds-played');
  const statClipsEl = document.getElementById('stat-clips-watched');
  const statMemesEl = document.getElementById('stat-memes-created');
  const statHighScoreEl = document.getElementById('stat-quiz-highscore');

  const btnExportProfile = document.getElementById('btn-export-profile');
  const inputImportProfile = document.getElementById('input-import-profile');
  const btnResetAchievements = document.getElementById('btn-reset-achievements');

  function renderStatsUI() {
    if (statSoundsEl) statSoundsEl.textContent = String(userStats.soundsPlayed);
    if (statClipsEl) statClipsEl.textContent = String(userStats.clipsWatched);
    if (statMemesEl) statMemesEl.textContent = String(userStats.memesCreated);
    if (statHighScoreEl) {
      const high = Number.parseInt(readText(STORAGE_KEYS.QUIZ_HIGHSCORE, '0'), 10) || 0;
      statHighScoreEl.textContent = String(high);
    }
  }

  function incrementStat(key) {
    if (!(key in userStats)) return;
    userStats[key] += 1;
    writeJson(STORAGE_KEYS.STATS, userStats);
    renderStatsUI();
  }

  function renderAchievementsUI() {
    const total = ACHIEVEMENTS_DATA.length;
    const unlocked = userAchievements.unlocked.length;
    const percentage = Math.round((unlocked / total) * 100);

    if (counterBadge) counterBadge.textContent = `${unlocked}/${total}`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(unlocked));
      progressBar.setAttribute('aria-valuemax', String(total));
    }
    if (percentText) percentText.textContent = `${percentage}% (${unlocked} de ${total})`;
    if (rankBadge) rankBadge.textContent = getRankTitle(unlocked);

    renderStatsUI();

    if (!grid) return;
    clearElement(grid);

    ACHIEVEMENTS_DATA.forEach((ach) => {
      const isUnlocked = userAchievements.unlocked.includes(ach.id);
      const dateStr = isUnlocked ? formatDatePtBr(userAchievements.timestamps[ach.id]) : '';

      const card = h(
        'article',
        {
          class: `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`,
          role: 'listitem',
        },
        h('div', { class: 'achievement-icon-wrapper', 'aria-hidden': 'true' }, h('span', {}, ach.icon)),
        h(
          'div',
          { class: 'achievement-info' },
          h('h3', {}, ach.title),
          h('p', {}, ach.desc),
          h(
            'div',
            { class: 'achievement-meta' },
            h(
              'span',
              { class: `badge-status ${isUnlocked ? 'unlocked' : 'locked'}` },
              isUnlocked ? 'Desbloqueado 🏆' : 'Bloqueado 🔒',
            ),
            dateStr ? h('span', { class: 'achievement-date' }, `Conquistado em ${dateStr}`) : null,
          ),
        ),
      );

      grid.appendChild(card);
    });
  }

  function unlockAchievement(id) {
    if (userAchievements.unlocked.includes(id)) return false;
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === id);
    if (!ach) return false;

    userAchievements.unlocked.push(id);
    userAchievements.timestamps[id] = new Date().toISOString();
    saveAchievements(userAchievements);
    renderAchievementsUI();

    const toastMsg = `🏆 Nova Conquista Desbloqueada: ${ach.title}!`;
    showToast(toastMsg);
    announceA11y(toastMsg);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('alanverso:achievement-unlocked', { detail: { id, ach } }));
    }
    return true;
  }

  function exportProfileJson() {
    try {
      const clipFavorites = readJson(STORAGE_KEYS.CLIPS_FAVORITES, []);
      const payload = createProfileBackup({
        theme: document.documentElement.getAttribute('data-theme') || 'dark',
        contrast: document.documentElement.getAttribute('data-contrast') || 'normal',
        language: document.documentElement.lang || 'pt-BR',
        quizHighScore: Number.parseInt(readText(STORAGE_KEYS.QUIZ_HIGHSCORE, '0'), 10) || 0,
        quizBestStreak: Number.parseInt(readText(STORAGE_KEYS.QUIZ_BEST_STREAK, '0'), 10) || 0,
        clipFavorites: Array.isArray(clipFavorites) ? clipFavorites : [],
        stats: userStats,
        achievements: userAchievements,
      });

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = h('a', {
        href: url,
        download: `alanverso-perfil-v5-${new Date().toISOString().split('T')[0]}.json`,
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      unlockAchievement('data_hoarder');
      showToast('Perfil v5.0 exportado em JSON com sucesso! 💾');
      announceA11y('Arquivo JSON com dados do perfil baixado.');
      return payload;
    } catch (err) {
      console.warn('Erro ao exportar perfil JSON:', err);
      showToast('Erro ao exportar perfil em JSON.');
      return null;
    }
  }

  function importProfileJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = validateProfileBackup(String(e.target?.result || ''));
      if (!result.ok) {
        showToast(result.error || 'Arquivo JSON inválido para o Alanverso.');
        return;
      }

      const data = result.data;
      userAchievements = {
        unlocked: data.achievements.unlocked,
        timestamps: data.achievements.timestamps,
      };
      saveAchievements(userAchievements);

      writeText(STORAGE_KEYS.QUIZ_HIGHSCORE, String(data.quizHighScore));
      writeText(STORAGE_KEYS.QUIZ_BEST_STREAK, String(data.quizBestStreak));

      if (data.clipFavorites.length > 0) {
        writeJson(STORAGE_KEYS.CLIPS_FAVORITES, data.clipFavorites);
      }
      userStats = { ...data.stats };
      writeJson(STORAGE_KEYS.STATS, userStats);

      renderAchievementsUI();
      showToast('Perfil v5.0 importado e restaurado com sucesso! 🚀');
      announceA11y('Perfil e conquistas restaurados do arquivo JSON.');
      window.dispatchEvent(new CustomEvent('alanverso:profile-imported'));
    };
    reader.readAsText(file);
  }

  if (btnExportProfile) {
    btnExportProfile.addEventListener('click', exportProfileJson);
  }

  if (inputImportProfile) {
    inputImportProfile.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        importProfileJson(file);
        e.target.value = '';
      }
    });
  }

  if (btnResetAchievements) {
    btnResetAchievements.addEventListener('click', () => {
      if (window.confirm('Tem certeza de que deseja resetar suas conquistas e estatísticas salvas?')) {
        userAchievements = {
          unlocked: ['first_step'],
          timestamps: { first_step: new Date().toISOString() },
        };
        saveAchievements(userAchievements);
        userStats = { soundsPlayed: 0, memesCreated: 0, clipsWatched: 0 };
        writeJson(STORAGE_KEYS.STATS, userStats);
        renderAchievementsUI();
        showToast('Conquistas resetadas com sucesso.');
        announceA11y('Conquistas do perfil resetadas.');
      }
    });
  }

  window.addEventListener('alanverso:language-changed', () => {
    unlockAchievement('polyglot');
  });

  renderAchievementsUI();

  // Desbloqueia primeiro passo automaticamente na entrada
  setTimeout(() => {
    unlockAchievement('first_step');
  }, 400);

  return {
    unlockAchievement,
    incrementStat,
    renderAchievementsUI,
    exportProfileJson,
    importProfileJson,
    loadAchievements,
    saveAchievements,
  };
}
