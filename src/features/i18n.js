/**
 * ALANVERSO v5.0.0 - MOTOR DE INTERNACIONALIZAÇÃO (i18n) BILÍNGUE (DOM SEGURO / ANTI-XSS)
 */

import { announceA11y } from '../core/a11y.js';
import { buildSafeRichFragment, clearElement } from '../core/dom.js';
import { STORAGE_KEYS, readText, writeText } from '../core/storage.js';
import { ALANVERSO_TRANSLATIONS } from '../data/i18n-dict.js';

export class I18nManager {
  constructor(autoInit = true) {
    this.currentLang = this.getSavedLanguage();
    if (autoInit && typeof document !== 'undefined') {
      this.init();
    }
  }

  getSavedLanguage() {
    const saved = readText(STORAGE_KEYS.LANGUAGE, '');
    if (saved === 'en' || saved === 'pt-BR') {
      return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('en')) {
        return 'en';
      }
    }
    return 'pt-BR';
  }

  init() {
    this.applyLanguage(this.currentLang, false);

    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextLang = this.currentLang === 'pt-BR' ? 'en' : 'pt-BR';
        this.setLanguage(nextLang);
      });
    }
  }

  setLanguage(lang) {
    const validLang = ALANVERSO_TRANSLATIONS[lang] ? lang : 'pt-BR';
    this.currentLang = validLang;
    writeText(STORAGE_KEYS.LANGUAGE, validLang);
    this.applyLanguage(validLang, true);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent('alanverso:language-changed', { detail: { lang: validLang } }),
      );
    }
  }

  /**
   * Remove tags e atributos inseguros em strings i18n preservando apenas marcação inline segura.
   */
  sanitizeHtml(dirty) {
    if (typeof dirty !== 'string') return '';
    return dirty
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/<(?!\/?(?:span|strong|em|b|i|br|small)\b)[^>]+>/gi, '')
      .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  }

  applyLanguage(lang, announce = true) {
    if (typeof document === 'undefined') return;
    const dict = ALANVERSO_TRANSLATIONS[lang] || ALANVERSO_TRANSLATIONS['pt-BR'];
    document.documentElement.lang = lang;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translation = dict[key];
      if (!translation) return;

      if (translation.includes('<') && translation.includes('>')) {
        clearElement(el);
        el.appendChild(buildSafeRichFragment(translation));
      } else {
        el.textContent = translation;
      }
    });

    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach((el) => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key && dict[key]) {
          el.setAttribute(attr, dict[key]);
        }
      });
    });

    const currentLangSpan = document.getElementById('current-lang');
    const toggleBtn = document.getElementById('lang-toggle');
    if (currentLangSpan) {
      currentLangSpan.textContent = dict['nav.lang_badge'];
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', dict['nav.lang_label']);
      toggleBtn.setAttribute('title', dict['nav.lang_label']);
    }

    if (announce) {
      announceA11y(dict['a11y.lang_switched']);
    }
  }
}
