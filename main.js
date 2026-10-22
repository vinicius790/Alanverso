/**
 * ALANVERSO - SCRIPT PRINCIPAL
 * Funcionalidades: Dark/Light Mode, Acessibilidade, Modal de Fã, Lightbox,
 * Menu Responsivo, Scroll Suave e Notificações Toast.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. TEMA DARK / LIGHT COM PERSISTÊNCIA NO LOCALSTORAGE
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('alanverso-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('alanverso-theme', theme);

    if (theme === 'dark') {
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

  function announceA11y(message) {
    const liveRegion = document.getElementById('a11y-live-region');
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 50);
    }
  }

  // Inicializa tema
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      const msg = `Tema alterado para modo ${newTheme === 'dark' ? 'escuro' : 'claro'}! 🌓`;
      showToast(msg);
      announceA11y(msg);
      if (typeof unlockAchievement === 'function') unlockAchievement('dark_knight');
    });
  }

  /* ==========================================================================
     1.1 MODO DE ALTO CONTRASTE (WCAG 2.2 AAA)
     ========================================================================== */
  const contrastToggleBtn = document.getElementById('contrast-toggle');

  function getPreferredContrast() {
    const savedContrast = localStorage.getItem('alanverso-contrast');
    if (savedContrast) {
      return savedContrast;
    }
    return window.matchMedia('(prefers-contrast: more)').matches ? 'high' : 'normal';
  }

  function applyContrast(contrast) {
    document.documentElement.setAttribute('data-contrast', contrast);
    try {
      localStorage.setItem('alanverso-contrast', contrast);
    } catch {
      // storage restrito
    }

    if (contrastToggleBtn) {
      const isHigh = contrast === 'high';
      contrastToggleBtn.setAttribute('aria-pressed', String(isHigh));
      contrastToggleBtn.setAttribute(
        'aria-label',
        isHigh ? 'Desativar modo de alto contraste' : 'Ativar modo de alto contraste'
      );
      contrastToggleBtn.setAttribute(
        'title',
        isHigh ? 'Desativar alto contraste' : 'Ativar alto contraste'
      );
    }
  }

  // Inicializa contraste
  applyContrast(getPreferredContrast());

  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', () => {
      const currentContrast = document.documentElement.getAttribute('data-contrast') || 'normal';
      const newContrast = currentContrast === 'high' ? 'normal' : 'high';
      applyContrast(newContrast);
      const msg = newContrast === 'high' ? 'Modo de alto contraste ativado! 👁️' : 'Modo de alto contraste desativado.';
      showToast(msg);
      announceA11y(msg);
      if (newContrast === 'high' && typeof unlockAchievement === 'function') {
        unlockAchievement('contrast_pro');
      }
    });
  }

  try {
    window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
      if (!localStorage.getItem('alanverso-contrast')) {
        applyContrast(e.matches ? 'high' : 'normal');
      }
    });
  } catch {
    // navegadores antigos
  }

  /* ==========================================================================
     2. NAVEGAÇÃO & MENU MOBILE
     ========================================================================== */
  const nav = document.querySelector('#header nav');
  const navMenu = document.querySelector('nav .menu');
  const toggleMenuBtn = document.querySelector('.toggle-menu-btn');
  const navLinks = document.querySelectorAll('nav .menu ul li a');
  const header = document.querySelector('#header');

  if (toggleMenuBtn && navMenu) {
    toggleMenuBtn.addEventListener('click', () => {
      const isExpanded = toggleMenuBtn.getAttribute('aria-expanded') === 'true';
      toggleMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
    });
  }

  // Fechar menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        if (toggleMenuBtn) toggleMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Header com efeito no scroll
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  }

  /* ==========================================================================
     3. BOTÃO VOLTAR AO TOPO
     ========================================================================== */
  const backToTopBtn = document.querySelector('.back-to-top');

  function handleBackToTopVisibility() {
    if (!backToTopBtn) return;
    if (window.scrollY >= 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     4. DESTAQUE DA SEÇÃO ATIVA NO MENU
     ========================================================================== */
  const sections = document.querySelectorAll('main section[id]');

  function highlightActiveMenu() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`nav .menu a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    handleBackToTopVisibility();
    highlightActiveMenu();
  });

  // Executar uma vez no carregamento
  handleHeaderScroll();
  handleBackToTopVisibility();

  /* ==========================================================================
     5. MODAL INTERATIVO (LIGHTBOX DE MEMES & ENVIO DE MOMENTOS)
     ========================================================================== */
  const modalOverlay = document.getElementById('fan-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const modalImage = document.getElementById('modal-preview-img');
  const modalTitle = document.getElementById('modal-meme-title');
  const modalDescription = document.getElementById('modal-meme-desc');
  const fanForm = document.getElementById('fan-submission-form');

  let lastActiveElement = null;

  function openModal(title, desc, imgSrc) {
    if (!modalOverlay) return;
    lastActiveElement = document.activeElement;

    if (modalTitle && title) modalTitle.textContent = title;
    if (modalDescription && desc) modalDescription.textContent = desc;
    if (modalImage && imgSrc) {
      modalImage.src = imgSrc;
      modalImage.alt = title || 'Preview do Meme';
      modalImage.style.display = 'block';
    } else if (modalImage) {
      modalImage.style.display = 'none';
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foco acessível no modal
    if (modalCloseBtn) modalCloseBtn.focus();
    announceA11y(`Janela modal aberta: ${title || 'Galeria do Alanverso'}`);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Retorna o foco para o elemento disparador
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
    announceA11y('Janela modal fechada.');
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Galeria do Alanverso';
      const desc = btn.getAttribute('data-desc') || 'Um dos momentos mais clássicos das lives do Alanzoka.';
      const img = btn.getAttribute('data-img') || '';
      openModal(title, desc, img);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Tecla ESC para fechar modal (Acessibilidade)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Submissão do formulário de fã com feedback visual
  if (fanForm) {
    fanForm.addEventListener('submit', e => {
      e.preventDefault();
      const nickname = document.getElementById('fan-nickname')?.value || 'Amigo do Alan';
      closeModal();
      fanForm.reset();
      const msg = `Obrigado, ${nickname}! Momento enviado com sucesso para o Alanverso! 🚀`;
      showToast(msg);
      announceA11y(msg);
    });
  }

  /* ==========================================================================
     6. NOTIFICAÇÕES TOAST
     ========================================================================== */
  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  /* ==========================================================================
     7. INICIALIZAÇÃO SEGURA DE LIBS EXTERNAS (SWIPER & SCROLLREVEAL)
     ========================================================================== */
  if (typeof Swiper !== 'undefined') {
    try {
      new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        keyboard: {
          enabled: true,
        },
        mousewheel: false,
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
    } catch (err) {
      console.warn('Swiper init warning:', err);
    }
  }

  if (typeof ScrollReveal !== 'undefined') {
    try {
      const sr = ScrollReveal({
        origin: 'top',
        distance: '24px',
        duration: 650,
        reset: false,
      });

      sr.reveal(
        `#home .hero-text, #home .hero-media-wrapper,
         #memes .section-header, #memes .meme-card,
         #about .lore-content, #about .multiverse-tags,
         #characters .social-profile-card,
         #testimonials .section-header,
         #contact .channel-card,
         footer`,
        { interval: 80 }
      );
    } catch (err) {
      console.warn('ScrollReveal init warning:', err);
    }
  }
  /* ==========================================================================
     8. SOUNDBOARD INTERATIVO COM WEB AUDIO API & CANVAS VISUALIZER
     ========================================================================== */
  let audioCtx = null;
  let masterGain = null;
  let analyser = null;
  let activeNodes = [];
  let currentPitch = 1.0;
  let visualizerMode = 'waves'; // 'waves' | 'bars'
  let isSoundPlaying = false;
  let animFrameId = null;

  const soundCanvas = document.getElementById('soundboard-canvas');
  const soundCanvasCtx = soundCanvas ? soundCanvas.getContext('2d') : null;
  const statusDot = document.getElementById('soundboard-status-dot');
  const statusText = document.getElementById('soundboard-status-text');
  const volSlider = document.getElementById('soundboard-volume');
  const volVal = document.getElementById('soundboard-vol-val');
  const pitchSlider = document.getElementById('soundboard-pitch');
  const pitchVal = document.getElementById('soundboard-pitch-val');
  const stopAllBtn = document.getElementById('soundboard-stop-btn');
  const soundButtons = document.querySelectorAll('.sound-btn');
  const btnVisWaves = document.getElementById('btn-vis-waves');
  const btnVisBars = document.getElementById('btn-vis-bars');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(volSlider ? parseFloat(volSlider.value) : 0.8, audioCtx.currentTime);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      startVisualizerLoop();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Controle de Volume
  if (volSlider && volVal) {
    volSlider.addEventListener('input', e => {
      const val = parseFloat(e.target.value);
      volVal.textContent = `${Math.round(val * 100)}%`;
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
      }
    });
  }

  // Controle de Pitch
  if (pitchSlider && pitchVal) {
    pitchSlider.addEventListener('input', e => {
      currentPitch = parseFloat(e.target.value);
      let desc = 'Normal';
      if (currentPitch < 0.8) desc = 'Monstro / Grave';
      else if (currentPitch > 1.3) desc = 'Esquilo / Agudo';
      pitchVal.textContent = `${currentPitch.toFixed(1)}x (${desc})`;
    });
  }

  // Modos de Visualização
  if (btnVisWaves && btnVisBars) {
    btnVisWaves.addEventListener('click', () => {
      visualizerMode = 'waves';
      btnVisWaves.classList.add('active');
      btnVisBars.classList.remove('active');
    });

    btnVisBars.addEventListener('click', () => {
      visualizerMode = 'bars';
      btnVisBars.classList.add('active');
      btnVisWaves.classList.remove('active');
    });
  }

  // Parar Todos os Sons
  if (stopAllBtn) {
    stopAllBtn.addEventListener('click', () => {
      stopAllSounds();
      showToast('Todos os sons foram interrompidos! ⏹');
    });
  }

  function stopAllSounds() {
    activeNodes.forEach(node => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch (err) {
        // Ignorar nós já terminados
      }
    });
    activeNodes = [];

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    soundButtons.forEach(btn => btn.classList.remove('playing'));
    isSoundPlaying = false;
    updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
  }

  function updateSoundboardStatus(msg, isPlaying) {
    if (statusText) statusText.textContent = msg;
    if (statusDot) {
      if (isPlaying) {
        statusDot.classList.add('active');
      } else {
        statusDot.classList.remove('active');
      }
    }
  }

  // Sintetizador Dinâmico de Efeitos Sonoros Web Audio API
  function playSynthesizedSound(soundType, buttonEl) {
    const ctx = initAudioContext();
    if (!ctx) return;

    if (buttonEl) {
      buttonEl.classList.add('playing');
    }
    isSoundPlaying = true;
    updateSoundboardStatus(`Tocando: ${soundType.toUpperCase()}`, true);

    const now = ctx.currentTime;
    const baseP = currentPitch;

    switch (soundType) {
      case 'jumpscare': {
        // Oscilador dissonante + Ruído filtrado + Sub-bass chocante
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        subOsc.type = 'sine';

        osc1.frequency.setValueAtTime(880 * baseP, now);
        osc1.frequency.exponentialRampToValueAtTime(140 * baseP, now + 0.6);

        osc2.frequency.setValueAtTime(930 * baseP, now);
        osc2.frequency.exponentialRampToValueAtTime(120 * baseP, now + 0.6);

        subOsc.frequency.setValueAtTime(160 * baseP, now);
        subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc1.connect(gain);
        osc2.connect(gain);
        subOsc.connect(gain);
        gain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        subOsc.start(now);

        osc1.stop(now + 0.9);
        osc2.stop(now + 0.9);
        subOsc.stop(now + 0.9);

        activeNodes.push(osc1, osc2, subOsc);
        setTimeout(() => buttonEl?.classList.remove('playing'), 900);
        break;
      }

      case 'metralhadora': {
        // Gargalhada caótica staccato modulada
        const bursts = 8;
        const duration = 0.12;
        for (let i = 0; i < bursts; i++) {
          const startTime = now + i * duration;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const freq = (340 + Math.sin(i * 1.5) * 120) * baseP;
          osc.frequency.setValueAtTime(freq, startTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.75, startTime + duration);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.7, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + duration);
          activeNodes.push(osc);
        }
        setTimeout(() => buttonEl?.classList.remove('playing'), bursts * duration * 1000);
        break;
      }

      case 'pedra': {
        // Sirene rápida de alerta + Drop 808
        const siren = ctx.createOscillator();
        const sirenGain = ctx.createGain();
        siren.type = 'sawtooth';
        siren.frequency.setValueAtTime(700 * baseP, now);
        siren.frequency.linearRampToValueAtTime(950 * baseP, now + 0.15);
        siren.frequency.linearRampToValueAtTime(650 * baseP, now + 0.3);

        sirenGain.gain.setValueAtTime(0.8, now);
        sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        siren.connect(sirenGain);
        sirenGain.connect(masterGain);

        siren.start(now);
        siren.stop(now + 0.35);

        // Boom 808
        const boom = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(180 * baseP, now + 0.3);
        boom.frequency.exponentialRampToValueAtTime(38, now + 1.2);

        boomGain.gain.setValueAtTime(0.001, now);
        boomGain.gain.setValueAtTime(0.95, now + 0.3);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        boom.connect(boomGain);
        boomGain.connect(masterGain);

        boom.start(now + 0.3);
        boom.stop(now + 1.2);

        activeNodes.push(siren, boom);
        setTimeout(() => buttonEl?.classList.remove('playing'), 1200);
        break;
      }

      case 'tijolinho': {
        // Arpeggio 8-bit retro arcade
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(freq * baseP, startTime);

          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.1);
          activeNodes.push(osc);
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), notes.length * 80 + 100);
        break;
      }

      case 'cerebro': {
        // Modem dial-up / carregamento sci-fi
        const steps = 10;
        for (let i = 0; i < steps; i++) {
          const startTime = now + i * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime((600 + (i * 180) % 900) * baseP, startTime);

          gain.gain.setValueAtTime(0.3, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.05);
          activeNodes.push(osc);
        }
        setTimeout(() => buttonEl?.classList.remove('playing'), 650);
        break;
      }

      case 'cremosa': {
        // Acorde suave jazz vibrato
        const chord = [261.63, 329.63, 392.0, 493.88]; // Cmaj7
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * baseP, now);

          // Vibrato sutil
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(5, now);
          lfoGain.gain.setValueAtTime(6 * baseP, now);
          lfo.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + 1.4);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 1.4);
          activeNodes.push(osc, lfo);
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), 1400);
        break;
      }

      case 'puzzle': {
        // Tensão crescente Shepard riser
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220 * baseP, now);
        osc.frequency.exponentialRampToValueAtTime(880 * baseP, now + 1.6);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 1.6);
        activeNodes.push(osc);
        setTimeout(() => buttonEl?.classList.remove('playing'), 1600);
        break;
      }

      case 'vitoria': {
        // Fanfarra triunfal gamer
        const melody = [
          { f: 523.25, d: 0.12 },
          { f: 523.25, d: 0.12 },
          { f: 523.25, d: 0.12 },
          { f: 523.25, d: 0.28 },
          { f: 415.3, d: 0.24 },
          { f: 466.16, d: 0.24 },
          { f: 523.25, d: 0.4 }
        ];
        let offset = 0;
        melody.forEach(item => {
          const startTime = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(item.f * baseP, startTime);

          gain.gain.setValueAtTime(0.35, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + item.d);
          activeNodes.push(osc);
          offset += item.d + 0.04;
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), offset * 1000);
        break;
      }

      case 'rage': {
        // Trombone Womp Womp
        const drops = [440, 415, 392, 330];
        let dropOffset = 0;
        drops.forEach((f, idx) => {
          const startTime = now + dropOffset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f * baseP, startTime);
          osc.frequency.exponentialRampToValueAtTime(f * 0.92 * baseP, startTime + 0.3);

          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.32);
          activeNodes.push(osc);
          dropOffset += 0.35;
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), dropOffset * 1000);
        break;
      }

      // Bordões falados com Web Speech API + FX
      case 'speech-pedra':
        triggerSpeechPhrase('Olha a pedraaa!', 1.2 * baseP, buttonEl, () => playSynthesizedSound('pedra'));
        break;

      case 'speech-tijolo':
        triggerSpeechPhrase('É o tijolinho, moleque!', 1.3 * baseP, buttonEl, () => playSynthesizedSound('tijolinho'));
        break;

      case 'speech-respira':
        triggerSpeechPhrase('Calma, respira, Alanzoka!', 0.9 * baseP, buttonEl, () => playSynthesizedSound('cremosa'));
        break;

      default:
        buttonEl?.classList.remove('playing');
        break;
    }
  }

  function triggerSpeechPhrase(text, pitch, buttonEl, bgSoundFn) {
    if (bgSoundFn) bgSoundFn();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.pitch = Math.min(2.0, Math.max(0.5, pitch));
      utterance.rate = 1.1;

      utterance.onend = () => {
        buttonEl?.classList.remove('playing');
        updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
      };

      utterance.onerror = () => {
        buttonEl?.classList.remove('playing');
        updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        buttonEl?.classList.remove('playing');
        updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
      }, 1000);
    }
  }

  // Click nos botões do soundboard
  soundButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const soundType = btn.getAttribute('data-sound');
      if (soundType) {
        soundsPlayedCount++;
        if (soundsPlayedCount >= 3 && typeof unlockAchievement === 'function') {
          unlockAchievement('sound_master');
        }
        playSynthesizedSound(soundType, btn);
      }
    });
  });

  // Atalhos de teclado (1 a 9, P, T, R)
  window.addEventListener('keydown', e => {
    // Ignorar se estiver digitando em campos de texto
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    const key = e.key.toUpperCase();
    const keyMap = {
      '1': 'jumpscare',
      '2': 'metralhadora',
      '3': 'pedra',
      '4': 'tijolinho',
      '5': 'cerebro',
      '6': 'cremosa',
      '7': 'puzzle',
      '8': 'vitoria',
      '9': 'rage',
      'P': 'speech-pedra',
      'T': 'speech-tijolo',
      'R': 'speech-respira'
    };

    if (keyMap[key]) {
      const targetBtn = document.querySelector(`.sound-btn[data-sound="${keyMap[key]}"]`);
      if (targetBtn) {
        targetBtn.click();
        targetBtn.focus();
      }
    }
  });

  // Visualizador Canvas em tempo real (Ondas / Espectro)
  function startVisualizerLoop() {
    if (!soundCanvas || !soundCanvasCtx) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    function render() {
      animFrameId = requestAnimationFrame(render);
      const width = soundCanvas.width;
      const height = soundCanvas.height;

      soundCanvasCtx.clearRect(0, 0, width, height);

      // Fundo escuro sutil com grade tecnológica
      soundCanvasCtx.fillStyle = '#0f172a';
      soundCanvasCtx.fillRect(0, 0, width, height);

      // Grade sutil
      soundCanvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      soundCanvasCtx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        soundCanvasCtx.beginPath();
        soundCanvasCtx.moveTo(x, 0);
        soundCanvasCtx.lineTo(x, height);
        soundCanvasCtx.stroke();
      }

      if (analyser && isSoundPlaying) {
        if (visualizerMode === 'waves') {
          analyser.getByteTimeDomainData(dataArray);

          soundCanvasCtx.lineWidth = 3;
          soundCanvasCtx.strokeStyle = '#a855f7';
          soundCanvasCtx.shadowBlur = 10;
          soundCanvasCtx.shadowColor = '#9333ea';
          soundCanvasCtx.beginPath();

          const sliceWidth = (width * 1.0) / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
              soundCanvasCtx.moveTo(x, y);
            } else {
              soundCanvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
          }

          soundCanvasCtx.lineTo(width, height / 2);
          soundCanvasCtx.stroke();
          soundCanvasCtx.shadowBlur = 0;
        } else {
          // Modo Barras de Espectro
          analyser.getByteFrequencyData(dataArray);

          const barWidth = (width / (bufferLength / 2)) * 1.8;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength / 2; i++) {
            barHeight = (dataArray[i] / 255) * height * 0.9;

            const gradient = soundCanvasCtx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(1, '#9333ea');

            soundCanvasCtx.fillStyle = gradient;
            soundCanvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

            x += barWidth;
          }
        }
      } else {
        // Onda idle tranquila quando em repouso
        soundCanvasCtx.lineWidth = 2;
        soundCanvasCtx.strokeStyle = 'rgba(147, 51, 234, 0.35)';
        soundCanvasCtx.beginPath();
        const time = Date.now() * 0.003;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 8 + Math.cos(x * 0.01 - time) * 4;
          if (x === 0) soundCanvasCtx.moveTo(x, y);
          else soundCanvasCtx.lineTo(x, y);
        }
        soundCanvasCtx.stroke();
      }
    }

    render();
  }

  // Iniciar loop visual mesmo antes de interagir (em estado repouso)
  startVisualizerLoop();

  /* ==========================================================================
     9. CENTRAL DE VÍDEOS & CLIPES (PLAYER MODAL INTERATIVO)
     ========================================================================== */
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
  const clipFilterBtns = document.querySelectorAll('.clip-filter-btn');
  const clipCards = document.querySelectorAll('.clip-card');
  const clipTriggers = document.querySelectorAll('.clip-play-overlay-btn, .clip-trigger-btn');

  let isVideoPlaying = false;
  let videoProgress = 0;
  let videoDurationSec = 48;
  let videoAnimId = null;
  let videoSceneCtx = videoSceneCanvas ? videoSceneCanvas.getContext('2d') : null;
  let currentClipTheme = 'terror';
  let isVideoMuted = false;

  // Filtros de Categoria de Clipes
  clipFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clipFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (typeof filterAndSortClips === 'function') {
        filterAndSortClips();
      }
    });
  });

  // Abertura do Modal de Vídeo
  clipTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const title = btn.getAttribute('data-clip-title') || 'Clipe Lendário';
      const game = btn.getAttribute('data-clip-game') || 'Alanzoka Games';
      const desc = btn.getAttribute('data-clip-desc') || 'Momento épico da live transmitido ao vivo.';
      const duration = btn.getAttribute('data-clip-duration') || '0:48';
      const views = btn.getAttribute('data-clip-views') || '1.2M views';
      const theme = btn.getAttribute('data-clip-theme') || 'terror';

      openVideoModal(title, game, desc, duration, views, theme);
    });
  });

  function openVideoModal(title, game, desc, duration, views, theme) {
    if (!videoModal) return;

    if (videoModalTitle) videoModalTitle.textContent = title;
    if (videoModalBadge) videoModalBadge.textContent = `🎮 ${game}`;
    if (videoModalDesc) videoModalDesc.textContent = desc;
    if (videoModalViews) videoModalViews.textContent = `👁 ${views}`;
    if (videoTotalDuration) videoTotalDuration.textContent = duration;

    currentClipTheme = theme;
    const parts = duration.split(':');
    if (parts.length === 2) {
      videoDurationSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } else {
      videoDurationSec = 48;
    }

    videoProgress = 0;
    if (videoSeekBar) videoSeekBar.value = 0;
    if (videoCurrentTime) videoCurrentTime.textContent = '00:00';

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Iniciar reprodução do clipe
    setVideoPlayingState(true);
    announceA11y(`Reproduzindo clipe: ${title}`);
  }

  function closeVideoModal() {
    if (!videoModal) return;
    setVideoPlayingState(false);
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    announceA11y('Player de vídeo fechado.');
  }

  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', e => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  function setVideoPlayingState(playing) {
    isVideoPlaying = playing;
    if (videoBtnPlayPause) {
      videoBtnPlayPause.textContent = isVideoPlaying ? '⏸' : '▶';
    }
    if (videoCenterPlay) {
      if (isVideoPlaying) {
        videoCenterPlay.classList.add('playing');
      } else {
        videoCenterPlay.classList.remove('playing');
      }
    }

    if (isVideoPlaying && !videoAnimId) {
      runVideoCanvasLoop();
    }
  }

  if (videoBtnPlayPause) {
    videoBtnPlayPause.addEventListener('click', () => {
      setVideoPlayingState(!isVideoPlaying);
    });
  }

  if (videoCenterPlay) {
    videoCenterPlay.addEventListener('click', () => {
      setVideoPlayingState(true);
    });
  }

  // Seek bar
  if (videoSeekBar) {
    videoSeekBar.addEventListener('input', e => {
      videoProgress = parseFloat(e.target.value);
      updateVideoTimeDisplay();
    });
  }

  function updateVideoTimeDisplay() {
    const currentSec = Math.floor((videoProgress / 100) * videoDurationSec);
    const mins = String(Math.floor(currentSec / 60)).padStart(2, '0');
    const secs = String(currentSec % 60).padStart(2, '0');
    if (videoCurrentTime) videoCurrentTime.textContent = `${mins}:${secs}`;
  }

  // Mute e Volume
  if (videoBtnMute) {
    videoBtnMute.addEventListener('click', () => {
      isVideoMuted = !isVideoMuted;
      videoBtnMute.textContent = isVideoMuted ? '🔇' : '🔊';
    });
  }

  if (videoVolSlider) {
    videoVolSlider.addEventListener('input', e => {
      if (parseFloat(e.target.value) === 0) {
        isVideoMuted = true;
        if (videoBtnMute) videoBtnMute.textContent = '🔇';
      } else {
        isVideoMuted = false;
        if (videoBtnMute) videoBtnMute.textContent = '🔊';
      }
    });
  }

  // Fullscreen
  if (videoBtnFullscreen) {
    videoBtnFullscreen.addEventListener('click', () => {
      const screen = document.getElementById('video-screen');
      if (!screen) return;
      if (!document.fullscreenElement) {
        screen.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });
  }

  // Compartilhar Clipe
  if (btnShareClip) {
    btnShareClip.addEventListener('click', () => {
      const url = window.location.href.split('#')[0] + '#clips';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link do clipe copiado com sucesso! 🔗');
        }).catch(() => {
          showToast('Link: ' + url);
        });
      } else {
        showToast('Link do clipe: ' + url);
      }
    });
  }

  // Loop de Renderização do Canvas de Vídeo
  function runVideoCanvasLoop() {
    if (!videoSceneCanvas || !videoSceneCtx) return;

    let tick = 0;
    function renderFrame() {
      if (!isVideoPlaying || !videoModal.classList.contains('active')) {
        videoAnimId = null;
        return;
      }

      videoAnimId = requestAnimationFrame(renderFrame);
      tick++;

      // Atualiza progresso
      videoProgress += (100 / (videoDurationSec * 60));
      if (videoProgress >= 100) {
        videoProgress = 0;
      }
      if (videoSeekBar) videoSeekBar.value = videoProgress;
      updateVideoTimeDisplay();

      const w = videoSceneCanvas.width;
      const h = videoSceneCanvas.height;

      // Desenho do frame animado com tema do clipe
      videoSceneCtx.fillStyle = '#080c14';
      videoSceneCtx.fillRect(0, 0, w, h);

      // Efeito de iluminação / jogo de terror ou comédia
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

      // Simulação gráfica de cena de jogo / streamer cam
      videoSceneCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      videoSceneCtx.lineWidth = 2;
      videoSceneCtx.strokeRect(30, 30, w - 60, h - 60);

      // Webcam box Alanzoka no canto superior direito
      const camW = 160;
      const camH = 100;
      const camX = w - camW - 40;
      const camY = 40;

      videoSceneCtx.fillStyle = '#1e1b4b';
      videoSceneCtx.fillRect(camX, camY, camW, camH);
      videoSceneCtx.strokeStyle = '#9333ea';
      videoSceneCtx.strokeRect(camX, camY, camW, camH);

      // Rosto estilizado animado do Alan reagindo
      const faceX = camX + camW / 2;
      const faceY = camY + camH / 2;
      const bobbing = Math.sin(tick * 0.1) * 3;

      // Cabeça
      videoSceneCtx.fillStyle = '#fbcfe8';
      videoSceneCtx.beginPath();
      videoSceneCtx.arc(faceX, faceY + bobbing, 24, 0, Math.PI * 2);
      videoSceneCtx.fill();

      // Fone de ouvido roxo icônico
      videoSceneCtx.strokeStyle = '#9333ea';
      videoSceneCtx.lineWidth = 5;
      videoSceneCtx.beginPath();
      videoSceneCtx.arc(faceX, faceY + bobbing - 4, 26, Math.PI, 0);
      videoSceneCtx.stroke();
      videoSceneCtx.fillStyle = '#9333ea';
      videoSceneCtx.fillRect(faceX - 28, faceY + bobbing - 10, 6, 16);
      videoSceneCtx.fillRect(faceX + 22, faceY + bobbing - 10, 6, 16);

      // Olhos e boca expressivos
      videoSceneCtx.fillStyle = '#0f172a';
      if (currentClipTheme === 'terror') {
        // Olhos arregalados e boca aberta no grito
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX - 8, faceY + bobbing - 4, 3, 0, Math.PI * 2);
        videoSceneCtx.arc(faceX + 8, faceY + bobbing - 4, 3, 0, Math.PI * 2);
        videoSceneCtx.fill();
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX, faceY + bobbing + 10, 6, 0, Math.PI * 2);
        videoSceneCtx.fill();
      } else {
        // Sorriso largo
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX - 8, faceY + bobbing - 4, 2.5, 0, Math.PI * 2);
        videoSceneCtx.arc(faceX + 8, faceY + bobbing - 4, 2.5, 0, Math.PI * 2);
        videoSceneCtx.fill();
        videoSceneCtx.beginPath();
        videoSceneCtx.arc(faceX, faceY + bobbing + 4, 8, 0, Math.PI);
        videoSceneCtx.stroke();
      }

      // HUD & Nome do Streamer
      videoSceneCtx.fillStyle = '#ffffff';
      videoSceneCtx.font = 'bold 11px system-ui';
      videoSceneCtx.fillText('🔴 ALANZOKA AO VIVO', camX + 8, camY + camH - 8);

      // Efeito de HUD no jogo central
      videoSceneCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      videoSceneCtx.font = '13px monospace';
      videoSceneCtx.fillText(`HP: [██████████░░] 82%`, 45, h - 50);
      videoSceneCtx.fillText(`CHAT: "OLHA A PEDRAAAA!"`, 45, h - 70);
    }

    renderFrame();
  }

  /* ==========================================================================
     10. GERADOR DE MEMES DO ALANZOKA EM CANVAS HTML5
     ========================================================================== */
  const memeCanvas = document.getElementById('meme-canvas');
  const memeCanvasCtx = memeCanvas ? memeCanvas.getContext('2d') : null;
  const memeTopInput = document.getElementById('meme-top-text');
  const memeBottomInput = document.getElementById('meme-bottom-text');
  const memeFontSizeInput = document.getElementById('meme-font-size');
  const memeFontSizeVal = document.getElementById('font-size-val');
  const memeTextColorInput = document.getElementById('meme-text-color');
  const memeStrokeColorInput = document.getElementById('meme-stroke-color');
  const memeUppercaseCheck = document.getElementById('meme-uppercase-check');
  const memePresetBtns = document.querySelectorAll('.meme-preset-btn');
  const memeUploadInput = document.getElementById('meme-upload-input');
  const btnRandomQuote = document.getElementById('btn-random-quote');
  const btnDownloadMeme = document.getElementById('btn-download-meme');
  const btnCopyMeme = document.getElementById('btn-copy-meme');

  let currentMemeImg = new Image();
  currentMemeImg.crossOrigin = 'anonymous';
  currentMemeImg.src = 'https://pbs.twimg.com/media/C-yYloeXoAIJoFF?format=jpg&name=900x900';

  const randomMemeQuotes = [
    { top: 'QUANDO A MORENA PASSA...', bottom: '...E EU TENTO DISFARÇAR O CHARME' },
    { top: 'OLHA A PEDRAAAAA!', bottom: 'RESPEITA O TIJOLINHO, MOLEQUE!' },
    { top: 'EU NO JOGO DE TERROR:', bottom: '"SÓ VOU DAR UMA OLHADINHA NA PORTA"' },
    { top: 'CALMA, TÔ LIGANDO O CÉREBRO...', bottom: '...DEU ERRO 404 NO PENSAMENTO' },
    { top: 'QUANDO O MONSTRO CORRE ATRÁS DE MIM:', bottom: 'MINHA VELOCIDADE SUBIU PRA 500%' },
    { top: 'FOI TUDO CALCULADO!', bottom: 'PENA QUE SOU PÉSSIMO EM MATEMÁTICA' }
  ];

  function drawMeme() {
    if (!memeCanvas || !memeCanvasCtx) return;

    const w = memeCanvas.width;
    const h = memeCanvas.height;

    memeCanvasCtx.clearRect(0, 0, w, h);

    // Fundo escuro fallback
    memeCanvasCtx.fillStyle = '#0f172a';
    memeCanvasCtx.fillRect(0, 0, w, h);

    // Se imagem carregou
    if (currentMemeImg.complete && currentMemeImg.naturalWidth > 0) {
      // Cover crop inteligente
      const imgRatio = currentMemeImg.naturalWidth / currentMemeImg.naturalHeight;
      const canvasRatio = w / h;
      let renderW, renderH, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        renderH = h;
        renderW = h * imgRatio;
        offsetX = (w - renderW) / 2;
        offsetY = 0;
      } else {
        renderW = w;
        renderH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - renderH) / 2;
      }

      memeCanvasCtx.drawImage(currentMemeImg, offsetX, offsetY, renderW, renderH);
    } else {
      // Carregando ou fallback gráfico
      memeCanvasCtx.fillStyle = '#1e293b';
      memeCanvasCtx.fillRect(0, 0, w, h);
      memeCanvasCtx.fillStyle = '#ffffff';
      memeCanvasCtx.font = 'bold 24px Poppins, sans-serif';
      memeCanvasCtx.textAlign = 'center';
      memeCanvasCtx.fillText('Carregando imagem do Alanzoka...', w / 2, h / 2);
    }

    // Configurações de texto
    const fontSize = memeFontSizeInput ? parseInt(memeFontSizeInput.value, 10) : 38;
    const textColor = memeTextColorInput ? memeTextColorInput.value : '#ffffff';
    const strokeColor = memeStrokeColorInput ? memeStrokeColorInput.value : '#000000';
    const isUppercase = memeUppercaseCheck ? memeUppercaseCheck.checked : true;

    let topText = (memeTopInput ? memeTopInput.value : '').trim();
    let bottomText = (memeBottomInput ? memeBottomInput.value : '').trim();

    if (isUppercase) {
      topText = topText.toUpperCase();
      bottomText = bottomText.toUpperCase();
    }

    memeCanvasCtx.font = `900 ${fontSize}px "Impact", "Poppins", sans-serif`;
    memeCanvasCtx.fillStyle = textColor;
    memeCanvasCtx.strokeStyle = strokeColor;
    memeCanvasCtx.lineWidth = Math.max(4, Math.floor(fontSize / 6));
    memeCanvasCtx.lineJoin = 'round';
    memeCanvasCtx.textAlign = 'center';

    // Desenhar texto superior
    if (topText) {
      wrapTextMeme(memeCanvasCtx, topText, w / 2, fontSize + 18, w - 40, fontSize * 1.15);
    }

    // Desenhar texto inferior
    if (bottomText) {
      wrapTextMeme(memeCanvasCtx, bottomText, w / 2, h - fontSize - 24, w - 40, fontSize * 1.15, true);
    }

    // Marca d'água discreta Alanverso
    memeCanvasCtx.font = '700 13px Poppins, sans-serif';
    memeCanvasCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    memeCanvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    memeCanvasCtx.lineWidth = 3;
    memeCanvasCtx.textAlign = 'right';
    memeCanvasCtx.strokeText('ALANVERSO.VERCEL.APP', w - 16, h - 12);
    memeCanvasCtx.fillText('ALANVERSO.VERCEL.APP', w - 16, h - 12);
  }

  function wrapTextMeme(ctx, text, x, y, maxWidth, lineHeight, isBottom = false) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Se for inferior, sobe as linhas para não cortar
    const startY = isBottom ? y - (lines.length - 1) * lineHeight : y;

    lines.forEach((line, index) => {
      const lineY = startY + index * lineHeight;
      ctx.strokeText(line, x, lineY);
      ctx.fillText(line, x, lineY);
    });
  }

  currentMemeImg.onload = drawMeme;

  // Event Listeners nos inputs do Meme
  [memeTopInput, memeBottomInput, memeTextColorInput, memeStrokeColorInput].forEach(inp => {
    if (inp) inp.addEventListener('input', drawMeme);
  });

  if (memeUppercaseCheck) {
    memeUppercaseCheck.addEventListener('change', drawMeme);
  }

  if (memeFontSizeInput && memeFontSizeVal) {
    memeFontSizeInput.addEventListener('input', e => {
      memeFontSizeVal.textContent = `${e.target.value}px`;
      drawMeme();
    });
  }

  // Seletor de Presets de Imagem
  memePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      memePresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const src = btn.getAttribute('data-img-src');
      if (src) {
        currentMemeImg = new Image();
        currentMemeImg.crossOrigin = 'anonymous';
        currentMemeImg.onload = drawMeme;
        currentMemeImg.src = src;
      }
    });
  });

  // Upload de Imagem Própria via FileReader
  if (memeUploadInput) {
    memeUploadInput.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = event => {
          currentMemeImg = new Image();
          currentMemeImg.onload = () => {
            memePresetBtns.forEach(b => b.classList.remove('active'));
            drawMeme();
            showToast('Foto carregada no gerador com sucesso! 📷');
          };
          currentMemeImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Frase Aleatória
  if (btnRandomQuote) {
    btnRandomQuote.addEventListener('click', () => {
      const random = randomMemeQuotes[Math.floor(Math.random() * randomMemeQuotes.length)];
      if (memeTopInput) memeTopInput.value = random.top;
      if (memeBottomInput) memeBottomInput.value = random.bottom;
      drawMeme();
      showToast('Nova frase clássica gerada! 🎲');
    });
  }

  // Baixar Meme (PNG)
  if (btnDownloadMeme && memeCanvas) {
    btnDownloadMeme.addEventListener('click', () => {
      try {
        const dataUrl = memeCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `meme-alanzoka-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Meme baixado com sucesso! Salvo em PNG 📥');
        if (typeof unlockAchievement === 'function') unlockAchievement('meme_maker');
      } catch (err) {
        console.warn('Erro ao baixar via dataURL:', err);
        showToast('Clique com o botão direito no meme e escolha "Salvar imagem como..."');
      }
    });
  }

  // Copiar Imagem do Meme
  if (btnCopyMeme && memeCanvas) {
    btnCopyMeme.addEventListener('click', async () => {
      try {
        if (memeCanvas.toBlob && navigator.clipboard && window.ClipboardItem) {
          memeCanvas.toBlob(async blob => {
            if (!blob) return;
            try {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
              showToast('Meme copiado para a área de transferência! 📋');
              if (typeof unlockAchievement === 'function') unlockAchievement('meme_maker');
            } catch (err) {
              btnDownloadMeme.click();
            }
          }, 'image/png');
        } else {
          btnDownloadMeme.click();
        }
      } catch (err) {
        btnDownloadMeme.click();
      }
    });
  }

  // Inicializar render inicial do meme
  drawMeme();

  /* ==========================================================================
     11. BUSCA COM DEBOUNCE, FILTRAGEM & ORDENAÇÃO DE CLIPES (WCAG AAA)
     ========================================================================== */
  const clipsSearchInput = document.getElementById('clips-search-input');
  const clipsSearchClear = document.getElementById('clips-search-clear');
  const clipsSortSelect = document.getElementById('clips-sort-select');
  const clipsResultsCount = document.getElementById('clips-results-count');
  const clipsGallery = document.getElementById('clips-gallery');

  function debounce(fn, delay = 250) {
    let timer = null;
    const debounced = function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
  }

  function filterAndSortClips() {
    const searchTerm = (clipsSearchInput ? clipsSearchInput.value.trim().toLowerCase() : '');
    const activeFilterBtn = document.querySelector('.clip-filter-btn.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const sortMode = clipsSortSelect ? clipsSortSelect.value : 'views';

    if (clipsSearchClear) {
      clipsSearchClear.style.display = searchTerm.length > 0 ? 'block' : 'none';
    }

    if (searchTerm.length >= 2) {
      unlockAchievement('clip_scout');
    }

    const cardsArray = Array.from(clipCards);
    let visibleCount = 0;

    cardsArray.forEach(card => {
      const title = (card.querySelector('.clip-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.clip-desc')?.textContent || '').toLowerCase();
      const game = (card.querySelector('.clip-game-pill')?.textContent || '').toLowerCase();
      const cat = card.getAttribute('data-category') || '';

      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || game.includes(searchTerm);
      const matchesCat = activeCategory === 'all' || cat === activeCategory;

      if (matchesSearch && matchesCat) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Ordenação dos cards visíveis
    cardsArray.sort((a, b) => {
      if (sortMode === 'views') {
        const vA = parseFloat(a.querySelector('.clip-play-overlay-btn')?.getAttribute('data-clip-views') || '0');
        const vB = parseFloat(b.querySelector('.clip-play-overlay-btn')?.getAttribute('data-clip-views') || '0');
        return vB - vA;
      } else if (sortMode === 'duration') {
        const durA = a.querySelector('.clip-duration')?.textContent || '0:00';
        const durB = b.querySelector('.clip-duration')?.textContent || '0:00';
        return durB.localeCompare(durA);
      } else if (sortMode === 'alpha') {
        const tA = (a.querySelector('.clip-title')?.textContent || '').toLowerCase();
        const tB = (b.querySelector('.clip-title')?.textContent || '').toLowerCase();
        return tA.localeCompare(tB);
      }
      return 0;
    });

    if (clipsGallery) {
      cardsArray.forEach(card => clipsGallery.appendChild(card));
    }

    if (clipsResultsCount) {
      const msg = visibleCount === 0
        ? `Nenhum clipe encontrado para "${searchTerm}".`
        : `Exibindo ${visibleCount} de ${cardsArray.length} clipes`;
      clipsResultsCount.textContent = msg;
      announceA11y(msg);
    }
  }

  const debouncedFilterClips = debounce(filterAndSortClips, 250);

  if (clipsSearchInput) {
    clipsSearchInput.addEventListener('input', debouncedFilterClips);
  }

  if (clipsSearchClear) {
    clipsSearchClear.addEventListener('click', () => {
      if (clipsSearchInput) {
        clipsSearchInput.value = '';
        clipsSearchInput.focus();
      }
      filterAndSortClips();
    });
  }

  if (clipsSortSelect) {
    clipsSortSelect.addEventListener('change', filterAndSortClips);
  }

  // Inicializa filtros e ordenação
  filterAndSortClips();

  /* ==========================================================================
     12. SISTEMA DE CONQUISTAS E GAMIFICAÇÃO (LOCALSTORAGE)
     ========================================================================== */
  const ACHIEVEMENTS_STORAGE_KEY = 'alanverso-achievements';

  const ACHIEVEMENTS_DATA = [
    {
      id: 'first_step',
      icon: '🚪',
      title: 'Primeiro Passo',
      desc: 'Entrou no portal do Alanverso e iniciou sua jornada pelo multiverso.'
    },
    {
      id: 'sound_master',
      icon: '🎧',
      title: 'DJ da Live',
      desc: 'Disparou pelo menos 3 efeitos no soundboard sintetizados em tempo real.'
    },
    {
      id: 'meme_maker',
      icon: '🎨',
      title: 'Memeiro Nato',
      desc: 'Criou, personalizou ou baixou uma obra-prima no Gerador de Memes HTML5.'
    },
    {
      id: 'dark_knight',
      icon: '🌙',
      title: 'Filho da Madrugada',
      desc: 'Alternou com estilo entre os modos Claro e Escuro da interface.'
    },
    {
      id: 'contrast_pro',
      icon: '👁️',
      title: 'Visão Biônica (AAA)',
      desc: 'Ativou o modo de Alto Contraste seguindo as diretrizes WCAG 2.2 AAA.'
    },
    {
      id: 'clip_scout',
      icon: '🎬',
      title: 'Arqueólogo de Clipes',
      desc: 'Utilizou o sistema de busca com debounce para minerar momentos históricos.'
    },
    {
      id: 'quiz_starter',
      icon: '🧠',
      title: 'Desafiante da Lore',
      desc: 'Completou com bravura uma rodada inteira do Quiz Oficial do Alanverso.'
    },
    {
      id: 'quiz_genius',
      icon: '🎓',
      title: 'Doutor em Alanologia',
      desc: 'Gabaritou o Quiz Oficial com aproveitamento perfeito de 100% dos acertos!'
    },
    {
      id: 'polyglot',
      icon: '🌐',
      title: 'Cidadão do Multiverso',
      desc: 'Alternou o idioma do site entre Português e Inglês no motor i18n.'
    },
    {
      id: 'data_hoarder',
      icon: '📦',
      title: 'Guardião do Multiverso',
      desc: 'Exportou seu perfil e dados salvos de conquistas em arquivo JSON padronizado.'
    }
  ];

  function loadAchievements() {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.unlocked)) {
          return {
            unlocked: parsed.unlocked,
            timestamps: parsed.timestamps || {}
          };
        }
      }
    } catch (err) {
      console.warn('Falha ao carregar conquistas do localStorage:', err);
    }
    return { unlocked: [], timestamps: {} };
  }

  function saveAchievements(data) {
    try {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Falha ao salvar conquistas no localStorage:', err);
    }
  }

  let userAchievements = loadAchievements();

  function unlockAchievement(id) {
    if (userAchievements.unlocked.includes(id)) return;
    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (!ach) return;

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
  }

  function getRankTitle(unlockedCount) {
    if (unlockedCount >= 10) return 'Lenda Suprema do Alanverso 👑';
    if (unlockedCount >= 7) return 'Guardião da Lore';
    if (unlockedCount >= 4) return 'Mestre dos Memes';
    if (unlockedCount >= 1) return 'Fã Curioso';
    return 'Explorador Iniciante';
  }

  function renderAchievementsUI() {
    const counterBadge = document.getElementById('achievements-counter-badge');
    const progressFill = document.getElementById('achievements-progress-fill');
    const percentText = document.getElementById('achievements-percentage-text');
    const rankBadge = document.getElementById('profile-rank-badge');
    const grid = document.getElementById('achievements-grid');

    const total = ACHIEVEMENTS_DATA.length;
    const unlocked = userAchievements.unlocked.length;
    const percentage = Math.round((unlocked / total) * 100);

    if (counterBadge) {
      counterBadge.textContent = `${unlocked}/${total}`;
    }
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    if (percentText) {
      percentText.textContent = `${percentage}% (${unlocked} de ${total})`;
    }
    if (rankBadge) {
      rankBadge.textContent = getRankTitle(unlocked);
    }

    if (grid) {
      grid.innerHTML = '';
      ACHIEVEMENTS_DATA.forEach(ach => {
        const isUnlocked = userAchievements.unlocked.includes(ach.id);
        const timestamp = userAchievements.timestamps[ach.id];
        const dateStr = timestamp
          ? new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : '';

        const card = document.createElement('article');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.setAttribute('role', 'listitem');

        card.innerHTML = `
          <div class="achievement-icon-wrapper" aria-hidden="true">
            <span>${ach.icon}</span>
          </div>
          <div class="achievement-info">
            <h3>${ach.title}</h3>
            <p>${ach.desc}</p>
            <div class="achievement-meta">
              <span class="badge-status ${isUnlocked ? 'unlocked' : 'locked'}">
                ${isUnlocked ? 'Desbloqueado 🏆' : 'Bloqueado 🔒'}
              </span>
              ${dateStr ? `<span class="achievement-date">Conquistado em ${dateStr}</span>` : ''}
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    }
  }

  // Ouvir evento de troca de idioma para conquista Poliglota
  window.addEventListener('alanverso:language-changed', () => {
    unlockAchievement('polyglot');
  });

  // Desbloqueia o primeiro passo automaticamente
  setTimeout(() => {
    unlockAchievement('first_step');
  }, 600);

  /* ==========================================================================
     13. QUIZ INTERATIVO OFICIAL DO ALANVERSO (WCAG AAA)
     ========================================================================== */
  const QUIZ_QUESTIONS = [
    {
      category: 'Variantes Dimensionais',
      question: 'Qual é a variante do multiverso do Alanzoka famosa pelo sombrero mexicano, bigode marcante e bordões hispânicos?',
      options: [
        'Alan Normal',
        'Alan Mexicano (Don Ferreira)',
        'Alan da Quebrada',
        'Alan Intelectual'
      ],
      correctIndex: 1,
      explanation: 'Don Ferreira é a variante mexicana lendária, sempre pronta para bailar e tocar maracas nas transmissões.'
    },
    {
      category: 'História & Reações',
      question: 'Quando o Alanzoka toma um susto repentino em um jogo de terror Indie, qual é sua reação clássica instantânea?',
      options: [
        'Fechar os olhos em silêncio absoluto e respirar fundo',
        'Grito estridente de susto seguido da clássica metralhadora de risadas',
        'Desligar o computador da tomada e sair correndo da casa',
        'Permanecer imóvel com expressão de poker face'
      ],
      correctIndex: 1,
      explanation: 'A risada no ritmo de metralhadora após o susto estridente é a marca registrada histórica do canal.'
    },
    {
      category: 'Companhia & Lore',
      question: 'Como é conhecida a companheira de vida e aventuras do Alan, frequentemente homenageada nos clipes da comunidade?',
      options: [
        'Maethe',
        'Cremosa do Além',
        'Dona Florinda',
        'Dona Clotilde'
      ],
      correctIndex: 0,
      explanation: 'Maethe e Alanzoka formam o casal mais querido das streams brasileiras, protagonizando momentos épicos.'
    },
    {
      category: 'Memes & Galanteio',
      question: 'O que o Alan faz quando a "Cremosa" é avistada ou mencionada em suas transmissões ao vivo?',
      options: [
        'Pede ajuda para os moderadores mutarem o chat',
        'Ativa o modo Sedutor da Quebrada com postura elegante e olhar penetrante',
        'Finge desmaio ao vivo',
        'Coloca uma música triste e chora no microfone'
      ],
      correctIndex: 1,
      explanation: 'O lendário meme do Alan Sedutor com camisa social e olhar conquistador é ativado instantaneamente!'
    },
    {
      category: 'Origens do Canal',
      question: 'Qual jogo de terror clássico nos anos 2010 marcou época no canal com os sustos mais icônicos do início da carreira?',
      options: [
        'Slender: The Eight Pages e Amnesia: The Dark Descent',
        'Farming Simulator 2011',
        'Tetris Ultimate Edition',
        'Flight Simulator 2012'
      ],
      correctIndex: 0,
      explanation: 'Slender e Amnesia foram os divisores de águas que consagraram o humor e as reações autênticas do Alan.'
    },
    {
      category: 'Tecnologia do Multiverso',
      question: 'Como os efeitos sonoros do Soundboard interativo do Alanverso são gerados na web?',
      options: [
        'Apenas arquivos de fita cassete analógica',
        'Síntese de áudio em tempo real com Web Audio API e osciladores dinâmicos',
        'Código Morse transmitido via rádio amador',
        'Gravações em disco de vinil de 78 RPM'
      ],
      correctIndex: 1,
      explanation: 'O Alanverso utiliza a moderna Web Audio API do navegador para sintetizar ondas e frequências customizadas.'
    }
  ];

  let currentQuizIndex = 0;
  let quizScore = 0;
  let hasAnsweredCurrent = false;

  const quizCard = document.getElementById('quiz-card');
  const quizResultCard = document.getElementById('quiz-result-card');
  const quizCategoryBadge = document.getElementById('quiz-category-badge');
  const quizCounter = document.getElementById('quiz-counter');
  const quizCurrentScore = document.getElementById('quiz-current-score');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsGrid = document.getElementById('quiz-options-grid');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');
  const quizShareBtn = document.getElementById('quiz-share-btn');

  function renderQuizQuestion() {
    if (!quizCard || currentQuizIndex >= QUIZ_QUESTIONS.length) {
      showQuizResults();
      return;
    }

    const q = QUIZ_QUESTIONS[currentQuizIndex];
    hasAnsweredCurrent = false;

    if (quizCard) quizCard.style.display = 'block';
    if (quizResultCard) quizResultCard.style.display = 'none';

    if (quizCategoryBadge) quizCategoryBadge.textContent = `🧠 ${q.category}`;
    if (quizCounter) quizCounter.textContent = `Pergunta ${currentQuizIndex + 1} de ${QUIZ_QUESTIONS.length}`;
    if (quizCurrentScore) quizCurrentScore.textContent = String(quizScore);
    if (quizQuestionText) quizQuestionText.textContent = q.question;

    const progressPct = ((currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 100;
    if (quizProgressFill) quizProgressFill.style.width = `${progressPct}%`;
    if (quizProgressBar) {
      quizProgressBar.setAttribute('aria-valuenow', String(currentQuizIndex + 1));
      quizProgressBar.setAttribute('aria-valuemax', String(QUIZ_QUESTIONS.length));
    }

    if (quizFeedbackBox) {
      quizFeedbackBox.style.display = 'none';
      quizFeedbackBox.className = 'quiz-feedback-box';
      quizFeedbackBox.textContent = '';
    }

    if (quizNextBtn) quizNextBtn.style.display = 'none';

    if (quizOptionsGrid) {
      quizOptionsGrid.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        btn.setAttribute('data-index', String(idx));
        btn.setAttribute('aria-label', `Opção ${letters[idx]}: ${optText}`);

        btn.innerHTML = `
          <span class="quiz-option-letter" aria-hidden="true">${letters[idx]}</span>
          <span class="quiz-option-label">${optText}</span>
        `;

        btn.addEventListener('click', () => handleQuizAnswer(idx, btn));
        quizOptionsGrid.appendChild(btn);
      });
    }

    announceA11y(`Pergunta ${currentQuizIndex + 1}: ${q.question}`);
  }

  function handleQuizAnswer(selectedIndex, clickedBtn) {
    if (hasAnsweredCurrent) return;
    hasAnsweredCurrent = true;

    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    const optionBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll('.quiz-option-btn') : [];

    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      quizScore++;
      if (quizCurrentScore) quizCurrentScore.textContent = String(quizScore);
      if (quizFeedbackBox) {
        quizFeedbackBox.className = 'quiz-feedback-box correct';
        quizFeedbackBox.textContent = `✔️ Resposta Correta! ${q.explanation}`;
        quizFeedbackBox.style.display = 'block';
      }
      announceA11y(`Resposta correta! ${q.explanation}`);
    } else {
      if (quizFeedbackBox) {
        quizFeedbackBox.className = 'quiz-feedback-box wrong';
        quizFeedbackBox.textContent = `❌ Incorreto! A resposta certa era: "${q.options[q.correctIndex]}". ${q.explanation}`;
        quizFeedbackBox.style.display = 'block';
      }
      announceA11y(`Resposta incorreta! A resposta certa era: ${q.options[q.correctIndex]}. ${q.explanation}`);
    }

    if (quizNextBtn) {
      quizNextBtn.style.display = 'inline-block';
      quizNextBtn.focus();
    }
  }

  function showQuizResults() {
    if (quizCard) quizCard.style.display = 'none';
    if (!quizResultCard) return;

    quizResultCard.style.display = 'block';

    const total = QUIZ_QUESTIONS.length;
    const percent = Math.round((quizScore / total) * 100);

    const scoreEl = document.getElementById('quiz-final-score');
    const percentEl = document.getElementById('quiz-final-percent');
    const recordEl = document.getElementById('quiz-final-record');
    const titleEl = document.getElementById('quiz-result-title');
    const descEl = document.getElementById('quiz-result-desc');
    const iconEl = document.getElementById('quiz-result-icon');

    if (scoreEl) scoreEl.textContent = `${quizScore}/${total}`;
    if (percentEl) percentEl.textContent = `${percent}%`;

    let savedHigh = 0;
    try {
      savedHigh = parseInt(localStorage.getItem('alanverso-quiz-highscore') || '0', 10);
      if (quizScore > savedHigh) {
        savedHigh = quizScore;
        localStorage.setItem('alanverso-quiz-highscore', String(savedHigh));
      }
    } catch {
      // storage restrito
    }

    if (recordEl) recordEl.textContent = String(savedHigh);

    if (percent === 100) {
      if (iconEl) iconEl.textContent = '👑';
      if (titleEl) titleEl.textContent = 'Doutor em Alanologia!';
      if (descEl) descEl.textContent = 'Perfeição absoluta! Você conhece todas as dimensões e lendas do Alanverso.';
      unlockAchievement('quiz_genius');
    } else if (percent >= 66) {
      if (iconEl) iconEl.textContent = '🎓';
      if (titleEl) titleEl.textContent = 'Especialista em Alanverso!';
      if (descEl) descEl.textContent = 'Excelente resultado! Você acompanha as streams há muito tempo.';
    } else if (percent >= 33) {
      if (iconEl) iconEl.textContent = '⭐';
      if (titleEl) titleEl.textContent = 'Iniciado no Multiverso!';
      if (descEl) descEl.textContent = 'Bom começo! Explore mais a galeria de clipes para se tornar um mestre.';
    } else {
      if (iconEl) iconEl.textContent = '🐣';
      if (titleEl) titleEl.textContent = 'Recém-chegado ao Chat!';
      if (descEl) descEl.textContent = 'Você ainda está descobrindo os memes. Vale a pena reviver os clipes épicos!';
    }

    unlockAchievement('quiz_starter');
    announceA11y(`Quiz concluído! Você acertou ${quizScore} de ${total} perguntas (${percent}%).`);
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      currentQuizIndex = 0;
      quizScore = 0;
      renderQuizQuestion();
      showToast('Quiz reiniciado! Boa sorte! 🎯');
    });
  }

  if (quizShareBtn) {
    quizShareBtn.addEventListener('click', () => {
      const text = `Acertei ${quizScore} de ${QUIZ_QUESTIONS.length} perguntas no Quiz Oficial do Alanverso! 🏆`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Resultado copiado para a área de transferência! 📋');
        }).catch(() => {
          showToast(text);
        });
      } else {
        showToast(text);
      }
    });
  }

  // Inicializar primeira pergunta do quiz
  renderQuizQuestion();

  /* ==========================================================================
     14. EXPORTAÇÃO & IMPORTAÇÃO DE PERFIL JSON
     ========================================================================== */
  const btnExportProfile = document.getElementById('btn-export-profile');
  const inputImportProfile = document.getElementById('input-import-profile');
  const btnResetAchievements = document.getElementById('btn-reset-achievements');

  function exportProfileJson() {
    try {
      const exportData = {
        app: 'Alanverso',
        version: '3.0.0',
        exportedAt: new Date().toISOString(),
        theme: document.documentElement.getAttribute('data-theme') || 'dark',
        contrast: document.documentElement.getAttribute('data-contrast') || 'normal',
        language: document.documentElement.lang || 'pt-BR',
        quizHighScore: parseInt(localStorage.getItem('alanverso-quiz-highscore') || '0', 10),
        achievements: userAchievements
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `alanverso-perfil-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      unlockAchievement('data_hoarder');
      showToast('Perfil exportado em JSON com sucesso! 💾');
      announceA11y('Arquivo JSON com dados do perfil baixado.');
    } catch (err) {
      console.warn('Erro ao exportar perfil JSON:', err);
      showToast('Erro ao exportar perfil em JSON.');
    }
  }

  function importProfileJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || data.app !== 'Alanverso' || !data.achievements || !Array.isArray(data.achievements.unlocked)) {
          showToast('Arquivo JSON inválido para o Alanverso.');
          return;
        }

        userAchievements = {
          unlocked: data.achievements.unlocked,
          timestamps: data.achievements.timestamps || {}
        };
        saveAchievements(userAchievements);

        if (typeof data.quizHighScore === 'number') {
          localStorage.setItem('alanverso-quiz-highscore', String(data.quizHighScore));
        }

        renderAchievementsUI();
        showToast('Perfil importado e restaurado com sucesso! 🚀');
        announceA11y('Perfil e conquistas restaurados do arquivo JSON.');
      } catch (err) {
        console.warn('Erro ao ler JSON de perfil:', err);
        showToast('Falha ao processar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  if (btnExportProfile) {
    btnExportProfile.addEventListener('click', exportProfileJson);
  }

  if (inputImportProfile) {
    inputImportProfile.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (file) {
        importProfileJson(file);
        e.target.value = '';
      }
    });
  }

  if (btnResetAchievements) {
    btnResetAchievements.addEventListener('click', () => {
      if (window.confirm('Tem certeza de que deseja resetar suas conquistas salvas?')) {
        userAchievements = { unlocked: ['first_step'], timestamps: { first_step: new Date().toISOString() } };
        saveAchievements(userAchievements);
        renderAchievementsUI();
        showToast('Conquistas resetadas com sucesso.');
        announceA11y('Conquistas do perfil resetadas.');
      }
    });
  }

  // Render inicial de conquistas
  renderAchievementsUI();

  /* ==========================================================================
     15. PWA (SERVICE WORKER REGISTRATION & INSTALL)
     ========================================================================== */
  if ('serviceWorker' in navigator && (window.location.protocol.startsWith('http') || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then(reg => {
          console.log('[Alanverso PWA] Service Worker ativo:', reg.scope);
        })
        .catch(err => {
          console.warn('[Alanverso PWA] Erro ao registrar Service Worker:', err);
        });
    });
  }

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
  });

  /* ==========================================================================
     16. GUIA DE ATALHOS DE TECLADO & ACESSIBILIDADE GLOBAL (WCAG AAA)
     ========================================================================== */
  const shortcutsToggle = document.getElementById('shortcuts-toggle');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const shortcutsCloseBtn = document.getElementById('shortcuts-modal-close-btn');

  function openShortcutsModal() {
    if (shortcutsModal) {
      shortcutsModal.classList.add('active');
      shortcutsModal.setAttribute('aria-hidden', 'false');
      shortcutsCloseBtn?.focus();
      announceA11y('Guia de atalhos de teclado aberto.');
    }
  }

  function closeShortcutsModal() {
    if (shortcutsModal) {
      shortcutsModal.classList.remove('active');
      shortcutsModal.setAttribute('aria-hidden', 'true');
      shortcutsToggle?.focus();
      announceA11y('Guia de atalhos fechado.');
    }
  }

  if (shortcutsToggle) {
    shortcutsToggle.addEventListener('click', openShortcutsModal);
  }

  if (shortcutsCloseBtn) {
    shortcutsCloseBtn.addEventListener('click', closeShortcutsModal);
  }

  if (shortcutsModal) {
    shortcutsModal.addEventListener('click', e => {
      if (e.target === shortcutsModal) closeShortcutsModal();
    });
  }

  // Teclas de Atalho Globais
  window.addEventListener('keydown', e => {
    const isEditingText = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    if (e.key === 'Escape') {
      closeShortcutsModal();
      if (typeof closeVideoModal === 'function') closeVideoModal();
      const fanModal = document.getElementById('fan-modal');
      if (fanModal && fanModal.classList.contains('active')) {
        fanModal.classList.remove('active');
        fanModal.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    if (isEditingText) return;

    if (e.key === '?') {
      e.preventDefault();
      if (shortcutsModal?.classList.contains('active')) {
        closeShortcutsModal();
      } else {
        openShortcutsModal();
      }
    } else if (e.key === '/') {
      e.preventDefault();
      if (clipsSearchInput) {
        clipsSearchInput.focus();
        clipsSearchInput.select();
      }
    } else if (e.key.toLowerCase() === 't') {
      e.preventDefault();
      if (themeToggleBtn) themeToggleBtn.click();
    } else if (e.key.toLowerCase() === 'c') {
      e.preventDefault();
      if (contrastToggleBtn) contrastToggleBtn.click();
    } else if (e.key.toLowerCase() === 'l') {
      e.preventDefault();
      const langToggle = document.getElementById('lang-toggle');
      if (langToggle) langToggle.click();
    }
  });

  // Expor API no window para testes automatizados
  if (typeof window !== 'undefined') {
    window.alanverso = {
      unlockAchievement,
      loadAchievements,
      saveAchievements,
      ACHIEVEMENTS_DATA,
      QUIZ_QUESTIONS,
      debounce,
      filterAndSortClips,
      exportProfileJson
    };
  }
});
