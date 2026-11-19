/**
 * ALANVERSO v5.0.0 - GERENCIADOR DE MODAIS ACESSÍVEIS (LIGHTBOX & ATALHOS)
 */

import { announceA11y, showToast } from '../core/a11y.js';
import { safeUrl } from '../core/format.js';

export function initModalsFeature() {
  const modalOverlay = document.getElementById('fan-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const modalImage = document.getElementById('modal-preview-img');
  const modalTitle = document.getElementById('modal-meme-title');
  const modalDescription = document.getElementById('modal-meme-desc');
  const fanForm = document.getElementById('fan-submission-form');

  const shortcutsToggle = document.getElementById('shortcuts-toggle');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const shortcutsCloseBtn = document.getElementById('shortcuts-modal-close-btn');

  let lastActiveElement = null;

  function openFanModal(title, desc, imgSrc) {
    if (!modalOverlay) return;
    lastActiveElement = document.activeElement;

    if (modalTitle && title) modalTitle.textContent = title;
    if (modalDescription && desc) modalDescription.textContent = desc;

    const validImg = safeUrl(imgSrc);
    if (modalImage && validImg) {
      modalImage.src = validImg;
      modalImage.alt = title || 'Preview do Meme';
      modalImage.style.display = 'block';
    } else if (modalImage) {
      modalImage.style.display = 'none';
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    modalCloseBtn?.focus();
    announceA11y(`Janela modal aberta: ${title || 'Galeria do Alanverso'}`);
  }

  function closeFanModal() {
    if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
    announceA11y('Janela modal fechada.');
  }

  function openShortcutsModal() {
    if (!shortcutsModal) return;
    lastActiveElement = document.activeElement;
    shortcutsModal.classList.add('active');
    shortcutsModal.setAttribute('aria-hidden', 'false');
    shortcutsCloseBtn?.focus();
    announceA11y('Guia de atalhos de teclado aberto.');
  }

  function closeShortcutsModal() {
    if (!shortcutsModal || !shortcutsModal.classList.contains('active')) return;
    shortcutsModal.classList.remove('active');
    shortcutsModal.setAttribute('aria-hidden', 'true');
    (shortcutsToggle || lastActiveElement)?.focus?.();
    announceA11y('Guia de atalhos fechado.');
  }

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openFanModal(
        btn.getAttribute('data-title') || 'Galeria do Alanverso',
        btn.getAttribute('data-desc') || 'Um dos momentos mais clássicos das lives do Alanzoka.',
        btn.getAttribute('data-img') || '',
      );
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeFanModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeFanModal();
    });
  }

  if (fanForm) {
    fanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nickname = document.getElementById('fan-nickname')?.value.trim() || 'Amigo do Alan';
      closeFanModal();
      fanForm.reset();
      const msg = `Obrigado, ${nickname}! Momento enviado com sucesso para o Alanverso! 🚀`;
      showToast(msg);
      announceA11y(msg);
    });
  }

  if (shortcutsToggle) shortcutsToggle.addEventListener('click', openShortcutsModal);
  if (shortcutsCloseBtn) shortcutsCloseBtn.addEventListener('click', closeShortcutsModal);
  if (shortcutsModal) {
    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) closeShortcutsModal();
    });
  }

  return {
    openFanModal,
    closeFanModal,
    openShortcutsModal,
    closeShortcutsModal,
    isShortcutsOpen: () => Boolean(shortcutsModal?.classList.contains('active')),
  };
}
