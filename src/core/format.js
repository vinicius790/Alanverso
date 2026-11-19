/**
 * ALANVERSO v5.0.0 - UTILITÁRIOS DE FORMATAÇÃO, PARSING E DEBOUNCE
 */

/**
 * Consolida chamadas consecutivas de uma função, executando somente após a pausa definida.
 */
export function debounce(fn, delay = 250) {
  let timer = null;
  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}

/**
 * Converte strings abreviadas de visualizações (ex: "1.4M visualizações", "890K views")
 * em números absolutos para ordenação precisa.
 */
export function parseViewsCount(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return 0;
  const match = raw.match(/([\d.,]+)\s*([kmbt])?/i);
  if (!match) return 0;

  const base = parseFloat(match[1].replace(',', '.'));
  if (!Number.isFinite(base)) return 0;

  const unit = (match[2] || '').toUpperCase();
  const multipliers = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
  return Math.round(base * (multipliers[unit] || 1));
}

/**
 * Converte duração "mm:ss" ou "hh:mm:ss" para total de segundos inteiros.
 */
export function parseDurationSeconds(durationStr) {
  if (typeof durationStr !== 'string') return 0;
  const parts = durationStr
    .trim()
    .split(':')
    .map((p) => Number.parseInt(p, 10));

  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/**
 * Formata quantidade de segundos no padrão mm:ss.
 */
export function formatDuration(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

/**
 * Formata uma data ISO no padrão brasileiro dd/mm/aaaa.
 */
export function formatDatePtBr(isoString) {
  if (typeof isoString !== 'string' || !isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Valida URL para prevenir protocolos inseguros como javascript: ou vbscript:.
 */
export function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith('data:image/')) return trimmed;
  if (trimmed.startsWith('./') || trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}
