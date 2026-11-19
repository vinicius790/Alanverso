/**
 * ALANVERSO v5.0.0 - CENTRAL DE VÍDEOS, CLIPES, BUSCA COM DEBOUNCE, FAVORITOS E PLAYER MODAL
 */

import { announceA11y, showToast } from '../core/a11y.js';
import { h } from '../core/dom.js';
import { debounce, formatDuration, parseDurationSeconds, parseViewsCount } from '../core/format.js';
import { STORAGE_KEYS, readJson, writeJson } from '../core/storage.js';

/**
 * Extrai metadados estruturados de um elemento `.clip-card` do DOM.
 */
export function extractClipCardMeta(card) {
  const trigger = card.querySelector('.clip-play-overlay-btn');
  const title = (card.querySelector('h3')?.textContent || trigger?.getAttribute('data-clip-title') || '').trim();
  const desc = (card.querySelector('p')?.textContent || trigger?.getAttribute('data-clip-desc') || '').trim();
  const game = (card.querySelector('.clip-game')?.textContent || trigger?.getAttribute('data-clip-game') || '').trim();
  const rawViews = trigger?.getAttribute('data-clip-views') || card.querySelector('.clip-views')?.textContent || '0';
  const rawDuration = card.querySelector('.clip-duration')?.textContent || trigger?.getAttribute('data-clip-duration') || '0:00';
  const category = card.getAttribute('data-category') || '';

  return {
    title,
    desc,
    game,
    category,
    views: parseViewsCount(rawViews),
    durationSeconds: parseDurationSeconds(rawDuration),
  };
}

/**
 * Inicializa a Central de Clipes, busca com debounce, ordenação, favoritos e modal de player.
 */
export function initClipsFeature(onUnlockAchievement, onIncrementStat) {
  const clipsSearchInput = document.getElementById('clips-search-input');
  const clipsSearchClear = document.getElementById('clips-search-clear');
  const clipsSortSelect = document.getElementById('clips-sort-select');
  const clipsResultsCount = document.getElementById('clips-results-count');
  const clipsGallery = document.getElementById('clips-gallery');
  const clipsEmptyState = document.getElementById('clips-empty-state');
  const clipsResetFilterBtn = document.getElementById('clips-reset-filter');

  const clipFilterBtns = document.querySelectorAll('.clip-filter-btn');
  const clipCards = Array.from(document.querySelectorAll('.clip-card'));
  const clipTriggers = document.querySelectorAll('.clip-play-overlay-btn, .clip-trigger-btn');

  // Player Modal elements
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close-btn');
  const videoModalTitle = document.getElementById('video-modal-title');
  const videoModalBadge = document.getElementById('video-modal-badge');
  const videoModalDesc = document.getElementById('video-modal-desc');
  const videoModalViews = document.getElementById('video-modal-views');
  const videoSceneCanvas = document.getElementById('video-scene-canvas');
  const videoCenterPlay = document.getElementById('video-center-play-trigger');
  const videoBtnPlayPause = document.getElementById('video-btn-play-pause');
  const videoSeekBar = document.getElementById('video-seek-bar');
  const videoCurrentTime = document.getElementById('video-current-time');
  const videoTotalDuration = document.getElementById('video-total-duration');
  const videoBtnMute = document.getElementById('video-btn-mute');
  const videoVolSlider = document.getElementById('video-vol-slider');
  const videoBtnFullscreen = document.getElementById('video-btn-fullscreen');
  const btnShareClip = document.getElementById('btn-share-clip');

  let favoriteClips = new Set(readJson(STORAGE_KEYS.CLIPS_FAVORITES, []));
  let isVideoPlaying = false;
  let videoProgress = 0;
  let videoDurationSec = 48;
  let videoAnimId = null;
  const videoSceneCtx = videoSceneCanvas ? videoSceneCanvas.getContext('2d') : null;
  let currentClipTheme = 'terror';
  let currentClipTitle = 'Clipe do Alanverso';
  let isVideoMuted = false;

  function saveClipFavorites() {
    writeJson(STORAGE_KEYS.CLIPS_FAVORITES, [...favoriteClips]);
  }

  // Adiciona botão de favoritar dinamicamente em cada card de clipe sem alterar o HTML base
  clipCards.forEach((card) => {
    const meta = extractClipCardMeta(card);
    if (!meta.title) return;
    card.setAttribute('data-clip-id', meta.title);

    const thumbWrapper = card.querySelector('.clip-thumb-wrapper');
    if (thumbWrapper && !thumbWrapper.querySelector('.clip-fav-btn')) {
      const isFav = favoriteClips.has(meta.title);
      const favBtn = h(
        'button',
        {
          type: 'button',
          class: 'clip-fav-btn',
          'aria-pressed': String(isFav),
          'aria-label': isFav
            ? `Remover ${meta.title} dos clipes favoritos`
            : `Adicionar ${meta.title} aos clipes favoritos`,
          title: isFav ? 'Remover dos favoritos' : 'Favoritar clipe',
          onClick: (e) => {
            e.stopPropagation();
            if (favoriteClips.has(meta.title)) {
              favoriteClips.delete(meta.title);
              favBtn.setAttribute('aria-pressed', 'false');
              favBtn.textContent = '☆';
              favBtn.setAttribute('aria-label', `Adicionar ${meta.title} aos clipes favoritos`);
              showToast(`"${meta.title}" removido dos favoritos.`);
            } else {
              favoriteClips.add(meta.title);
              favBtn.setAttribute('aria-pressed', 'true');
              favBtn.textContent = '⭐';
              favBtn.setAttribute('aria-label', `Remover ${meta.title} dos clipes favoritos`);
              showToast(`"${meta.title}" favoritado! ⭐`);
              if (favoriteClips.size >= 2) {
                onUnlockAchievement?.('clip_collector');
              }
            }
            saveClipFavorites();
            filterAndSortClips(false);
          },
        },
        isFav ? '⭐' : '☆',
      );
      thumbWrapper.appendChild(favBtn);
    }
  });

  function refreshFavoriteButtons() {
    favoriteClips = new Set(readJson(STORAGE_KEYS.CLIPS_FAVORITES, []));
    clipCards.forEach((card) => {
      const clipId = card.getAttribute('data-clip-id');
      const favBtn = card.querySelector('.clip-fav-btn');
      if (clipId && favBtn) {
        const isFav = favoriteClips.has(clipId);
        favBtn.setAttribute('aria-pressed', String(isFav));
        favBtn.textContent = isFav ? '⭐' : '☆';
      }
    });
  }

  window.addEventListener('alanverso:profile-imported', () => {
    refreshFavoriteButtons();
    filterAndSortClips(false);
  });

  function filterAndSortClips(shouldAnnounce = true) {
    const searchTerm = clipsSearchInput ? clipsSearchInput.value.trim().toLowerCase() : '';
    const activeFilterBtn = document.querySelector('.clip-filter-btn.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const sortMode = clipsSortSelect ? clipsSortSelect.value : 'views';

    if (clipsSearchClear) {
      clipsSearchClear.style.display = searchTerm.length > 0 ? 'flex' : 'none';
    }

    if (searchTerm.length >= 2) {
      onUnlockAchievement?.('clip_scout');
    }

    let visibleCount = 0;
    const enriched = clipCards.map((card) => ({
      card,
      meta: extractClipCardMeta(card),
    }));

    enriched.forEach(({ card, meta }) => {
      const matchesSearch =
        !searchTerm ||
        meta.title.toLowerCase().includes(searchTerm) ||
        meta.desc.toLowerCase().includes(searchTerm) ||
        meta.game.toLowerCase().includes(searchTerm);

      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'favorites'
          ? favoriteClips.has(meta.title)
          : meta.category === activeCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount += 1;
      } else {
        card.style.display = 'none';
      }
    });

    enriched.sort((a, b) => {
      if (sortMode === 'views') return b.meta.views - a.meta.views;
      if (sortMode === 'duration') return b.meta.durationSeconds - a.meta.durationSeconds;
      if (sortMode === 'alpha') return a.meta.title.localeCompare(b.meta.title, 'pt-BR');
      return 0;
    });

    if (clipsGallery) {
      enriched.forEach(({ card }) => clipsGallery.appendChild(card));
    }

    if (clipsEmptyState) {
      clipsEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (clipsResultsCount) {
      const msg =
        visibleCount === 0
          ? searchTerm
            ? `Nenhum clipe encontrado para "${searchTerm}".`
            : 'Nenhum clipe nesta categoria.'
          : `Exibindo ${visibleCount} de ${clipCards.length} clipes`;
      clipsResultsCount.textContent = msg;
      if (shouldAnnounce) announceA11y(msg);
    }

    return visibleCount;
  }

  const debouncedFilterClips = debounce(() => filterAndSortClips(true), 250);

  if (clipsSearchInput) {
    clipsSearchInput.addEventListener('input', debouncedFilterClips);
  }

  if (clipsSearchClear) {
    clipsSearchClear.addEventListener('click', () => {
      if (clipsSearchInput) {
        clipsSearchInput.value = '';
        clipsSearchInput.focus();
      }
      filterAndSortClips(true);
    });
  }

  if (clipsResetFilterBtn) {
    clipsResetFilterBtn.addEventListener('click', () => {
      if (clipsSearchInput) clipsSearchInput.value = '';
      if (clipsSortSelect) clipsSortSelect.value = 'views';
      clipFilterBtns.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
      filterAndSortClips(true);
      showToast('Filtros de clipes restaurados! 🔄');
    });
  }

  if (clipsSortSelect) {
    clipsSortSelect.addEventListener('change', () => filterAndSortClips(true));
  }

  clipFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      clipFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterAndSortClips(true);
    });
  });

  function updateVideoTimeDisplay() {
    const currentSec = Math.floor((videoProgress / 100) * videoDurationSec);
    if (videoCurrentTime) videoCurrentTime.textContent = formatDuration(currentSec);
  }

  function setVideoPlayingState(playing) {
    isVideoPlaying = playing;
    if (videoBtnPlayPause) videoBtnPlayPause.textContent = isVideoPlaying ? '⏸' : '▶';
    if (videoCenterPlay) videoCenterPlay.classList.toggle('playing', isVideoPlaying);
    if (isVideoPlaying && !videoAnimId) runVideoCanvasLoop();
  }

  function openVideoModal(title, game, desc, duration, views, theme) {
    if (!videoModal) return;

    currentClipTitle = title;
    currentClipTheme = theme;
    videoDurationSec = parseDurationSeconds(duration) || 48;
    videoProgress = 0;

    if (videoModalTitle) videoModalTitle.textContent = title;
    if (videoModalBadge) videoModalBadge.textContent = `🎮 ${game}`;
    if (videoModalDesc) videoModalDesc.textContent = desc;
    if (videoModalViews) videoModalViews.textContent = `👁 ${views}`;
    if (videoTotalDuration) videoTotalDuration.textContent = duration;
    if (videoSeekBar) videoSeekBar.value = '0';
    if (videoCurrentTime) videoCurrentTime.textContent = '00:00';

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    onIncrementStat?.('clipsWatched');
    setVideoPlayingState(true);
    announceA11y(`Reproduzindo clipe: ${title}`);
  }

  function closeVideoModal() {
    if (!videoModal || !videoModal.classList.contains('active')) return;
    setVideoPlayingState(false);
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    announceA11y('Player de vídeo fechado.');
  }

  clipTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openVideoModal(
        btn.getAttribute('data-clip-title') || 'Clipe Lendário',
        btn.getAttribute('data-clip-game') || 'Alanzoka Games',
        btn.getAttribute('data-clip-desc') || 'Momento épico transmitido ao vivo.',
        btn.getAttribute('data-clip-duration') || '0:48',
        btn.getAttribute('data-clip-views') || '1.2M visualizações',
        btn.getAttribute('data-clip-theme') || 'terror',
      );
    });
  });

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
  if (videoBtnPlayPause) {
    videoBtnPlayPause.addEventListener('click', () => setVideoPlayingState(!isVideoPlaying));
  }
  if (videoCenterPlay) {
    videoCenterPlay.addEventListener('click', () => setVideoPlayingState(true));
  }
  if (videoSeekBar) {
    videoSeekBar.addEventListener('input', (e) => {
      videoProgress = Number.parseFloat(e.target.value) || 0;
      updateVideoTimeDisplay();
    });
  }
  if (videoBtnMute) {
    videoBtnMute.addEventListener('click', () => {
      isVideoMuted = !isVideoMuted;
      videoBtnMute.textContent = isVideoMuted ? '🔇' : '🔊';
    });
  }
  if (videoVolSlider) {
    videoVolSlider.addEventListener('input', (e) => {
      isVideoMuted = Number.parseFloat(e.target.value) === 0;
      if (videoBtnMute) videoBtnMute.textContent = isVideoMuted ? '🔇' : '🔊';
    });
  }
  if (videoBtnFullscreen) {
    videoBtnFullscreen.addEventListener('click', () => {
      const screen = document.getElementById('video-screen');
      if (!screen) return;
      if (!document.fullscreenElement) screen.requestFullscreen?.().catch(() => {});
      else document.exitFullscreen?.().catch(() => {});
    });
  }

  if (btnShareClip) {
    btnShareClip.addEventListener('click', async () => {
      const shareUrl = `${window.location.href.split('#')[0]}#clips`;
      const shareData = {
        title: `${currentClipTitle} · Alanverso`,
        text: `Assista a esse momento épico do Alanzoka no Alanverso: ${currentClipTitle}`,
        url: shareUrl,
      };
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share(shareData);
          showToast('Clipe compartilhado com sucesso! 🚀');
          return;
        } catch {
          // Usuário cancelou ou fallback abaixo
        }
      }
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => showToast('Link do clipe copiado com sucesso! 🔗'))
          .catch(() => showToast(`Link: ${shareUrl}`));
      } else {
        showToast(`Link do clipe: ${shareUrl}`);
      }
    });
  }

  function runVideoCanvasLoop() {
    if (!videoSceneCanvas || !videoSceneCtx) return;
    let tick = 0;

    function renderFrame() {
      if (!isVideoPlaying || !videoModal?.classList.contains('active')) {
        videoAnimId = null;
        return;
      }

      videoAnimId = requestAnimationFrame(renderFrame);
      tick += 1;

      videoProgress += 100 / (videoDurationSec * 60);
      if (videoProgress >= 100) videoProgress = 0;
      if (videoSeekBar) videoSeekBar.value = String(videoProgress);
      updateVideoTimeDisplay();

      const w = videoSceneCanvas.width;
      const h = videoSceneCanvas.height;

      videoSceneCtx.fillStyle = '#080c14';
      videoSceneCtx.fillRect(0, 0, w, h);

      const grad = videoSceneCtx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
      if (currentClipTheme === 'terror') {
        grad.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
        grad.addColorStop(0.6, 'rgba(239, 68, 68, 0.15)');
        grad.addColorStop(1, '#05070d');
      } else if (currentClipTheme === 'comedia') {
        grad.addColorStop(0, 'rgba(234, 179, 8, 0.35)');
        grad.addColorStop(0.6, 'rgba(147, 51, 234, 0.2)');
        grad.addColorStop(1, '#05070d');
      } else {
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
        grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.2)');
        grad.addColorStop(1, '#05070d');
      }
      videoSceneCtx.fillStyle = grad;
      videoSceneCtx.fillRect(0, 0, w, h);

      videoSceneCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      videoSceneCtx.lineWidth = 2;
      videoSceneCtx.strokeRect(30, 30, w - 60, h - 60);

      const camW = 160;
      const camH = 100;
      const camX = w - camW - 40;
      const camY = 40;

      videoSceneCtx.fillStyle = '#1e1b4b';
      videoSceneCtx.fillRect(camX, camY, camW, camH);
      videoSceneCtx.strokeStyle = '#9333ea';
      videoSceneCtx.strokeRect(camX, camY, camW, camH);

      const faceX = camX + camW / 2;
      const faceY = camY + camH / 2;
      const bobbing = Math.sin(tick * 0.1) * 3;

      videoSceneCtx.fillStyle = '#fbcfe8';
      videoSceneCtx.beginPath();
      videoSceneCtx.arc(faceX, faceY + bobbing, 24, 0, Math.PI * 2);
      videoSceneCtx.fill();

      videoSceneCtx.strokeStyle = '#9333ea';
      videoSceneCtx.lineWidth = 5;
      videoSceneCtx.beginPath();
      videoSceneCtx.arc(faceX, faceY + bobbing - 4, 26, Math.PI, 0);
      videoSceneCtx.stroke();
      videoSceneCtx.fillStyle = '#9333ea';
      videoSceneCtx.fillRect(faceX - 28, faceY + bobbing - 10, 6, 16);
      videoSceneCtx.fillRect(faceX + 22, faceY + bobbing - 10, 6, 16);

      videoSceneCtx.fillStyle = '#0f172a';
      if (currentClipTheme === 'terror') {
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX - 8, faceY + bobbing - 4, 3, 0, Math.PI * 2);
        videoSceneCtx.arc(faceX + 8, faceY + bobbing - 4, 3, 0, Math.PI * 2);
        videoSceneCtx.fill();
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX, faceY + bobbing + 10, 6, 0, Math.PI * 2);
        videoSceneCtx.fill();
      } else {
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX - 8, faceY + bobbing - 4, 2.5, 0, Math.PI * 2);
        videoSceneCtx.arc(faceX + 8, faceY + bobbing - 4, 2.5, 0, Math.PI * 2);
        videoSceneCtx.fill();
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX, faceY + bobbing + 4, 8, 0, Math.PI);
        videoSceneCtx.stroke();
      }

      videoSceneCtx.fillStyle = '#ffffff';
      videoSceneCtx.font = 'bold 11px system-ui';
      videoSceneCtx.fillText('🔴 ALANZOKA AO VIVO', camX + 8, camY + camH - 8);

      videoSceneCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      videoSceneCtx.font = '13px monospace';
      videoSceneCtx.fillText('HP: [██████████░░] 82%', 45, h - 50);
      videoSceneCtx.fillText('CHAT: "OLHA A PEDRAAAA!"', 45, h - 70);
    }

    renderFrame();
  }

  filterAndSortClips(false);

  return {
    filterAndSortClips,
    openVideoModal,
    closeVideoModal,
  };
}
