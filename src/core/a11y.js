/**
 * ALANVERSO v5.0.0 - MOTOR DE ACESSIBILIDADE WCAG 2.2 AAA, TEMAS E TOASTS
 */

import { h } from './dom.js';
import { STORAGE_KEYS, readText, writeText } from './storage.js';

let liveTimer = null;
let toastTimer = null;

/**
 * Anuncia uma mensagem na região live `#a11y-live-region` para leitores de tela.
 */
export function announceA11y(message) {
  if (typeof document === 'undefined' || !message) return;
  const liveRegion = document.getElementById('a11y-live-region');
  if (!liveRegion) return;

  liveRegion.textContent = '';
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => {
    liveRegion.textContent = String(message);
  }, 50);
}

/**
 * Exibe notificação Toast visual não-intrusiva e acessível (`role="status"`).
 */
export function showToast(message, durationMs = 4000) {
  if (typeof document === 'undefined' || !message) return;
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = h('div', {
      id: 'toast-notification',
      class: 'toast',
      role: 'status',
      'aria-live': 'polite',
    });
    document.body.appendChild(toast);
  }

  toast.textContent = String(message);
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, durationMs);
}

/**
 * Resolve o tema preferido (localStorage -> sistema -> light).
 */
export function getPreferredTheme() {
  const saved = readText(STORAGE_KEYS.THEME, '');
  if (saved === 'dark' || saved === 'light') return saved;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

/**
 * Resolve o modo de contraste preferido (localStorage -> sistema -> normal).
 */
export function getPreferredContrast() {
  const saved = readText(STORAGE_KEYS.CONTRAST, '');
  if (saved === 'high' || saved === 'normal') return saved;
  try {
    return window.matchMedia('(prefers-contrast: more)').matches ? 'high' : 'normal';
  } catch {
    return 'normal';
  }
}

/**
 * Inicializa gerenciadores de Tema Escuro/Claro e Alto Contraste WCAG AAA.
 */
export function initAppearanceControls(onUnlockAchievement) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const contrastToggleBtn = document.getElementById('contrast-toggle');

  function applyTheme(theme) {
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', validTheme);
    writeText(STORAGE_KEYS.THEME, validTheme);

    if (validTheme === 'dark') {
      if (themeIconSun) themeIconSun.style.display = 'block';
      if (themeIconMoon) themeIconMoon.style.display = 'none';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Alternar para tema claro');
        themeToggleBtn.setAttribute('title', 'Alternar para tema claro');
      }
    } else {
      if (themeIconSun) themeIconSun.style.display = 'none';
      if (themeIconMoon) themeIconMoon.style.display = 'block';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Alternar para tema escuro');
        themeToggleBtn.setAttribute('title', 'Alternar para tema escuro');
      }
    }
  }

  function applyContrast(contrast) {
    const valid = contrast === 'high' ? 'high' : 'normal';
    document.documentElement.setAttribute('data-contrast', valid);
    writeText(STORAGE_KEYS.CONTRAST, valid);

    if (contrastToggleBtn) {
      const isHigh = valid === 'high';
      contrastToggleBtn.setAttribute('aria-pressed', String(isHigh));
      contrastToggleBtn.setAttribute(
        'aria-label',
        isHigh ? 'Desativar modo de alto contraste' : 'Ativar modo de alto contraste',
      );
      contrastToggleBtn.setAttribute(
        'title',
        isHigh ? 'Desativar alto contraste' : 'Ativar alto contraste',
      );
    }
  }

  applyTheme(getPreferredTheme());
  applyContrast(getPreferredContrast());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      const msg = `Tema alterado para modo ${nextTheme === 'dark' ? 'escuro' : 'claro'}! 🌓`;
      showToast(msg);
      announceA11y(msg);
      onUnlockAchievement?.('dark_knight');
    });
  }

  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-contrast') || 'normal';
      const next = current === 'high' ? 'normal' : 'high';
      applyContrast(next);
      const msg =
        next === 'high'
          ? 'Modo de alto contraste ativado! 👁️'
          : 'Modo de alto contraste desativado.';
      showToast(msg);
      announceA11y(msg);
      if (next === 'high') {
        onUnlockAchievement?.('contrast_pro');
      }
    });
  }

  try {
    window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
      if (!readText(STORAGE_KEYS.CONTRAST, '')) {
        applyContrast(e.matches ? 'high' : 'normal');
      }
    });
  } catch {
    // Fallback silencioso para ambientes sem matchMedia.addEventListener
  }

  return { applyTheme, applyContrast };
}
