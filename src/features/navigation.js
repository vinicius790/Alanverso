/**
 * ALANVERSO v5.0.0 - NAVEGAÇÃO, MENU MOBILE, SCROLL-SPY E BOTÃO VOLTAR AO TOPO
 */

export function initNavigationFeature() {
  const navMenu = document.querySelector('nav .menu');
  const toggleMenuBtn = document.querySelector('.toggle-menu-btn');
  const navLinks = document.querySelectorAll('nav .menu ul li a');
  const header = document.querySelector('#header');
  const backToTopBtn = document.querySelector('.back-to-top');
  const scrollProgressEl = document.querySelector('.scroll-progress');
  const sections = document.querySelectorAll('main section[id]');

  if (toggleMenuBtn && navMenu) {
    toggleMenuBtn.addEventListener('click', () => {
      const isExpanded = toggleMenuBtn.getAttribute('aria-expanded') === 'true';
      toggleMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('show');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        if (toggleMenuBtn) toggleMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  function updateOnScroll() {
    const scrollY = window.scrollY ?? window.pageYOffset ?? 0;

    if (header) {
      header.classList.toggle('scroll', scrollY > 40);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle('show', scrollY >= 400);
    }

    if (scrollProgressEl) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      scrollProgressEl.style.width = `${pct}%`;
    }

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      if (!sectionId) return;
      const targetLink = document.querySelector(`nav .menu a[href="#${sectionId}"]`);
      if (targetLink) {
        targetLink.classList.toggle(
          'active',
          scrollY > sectionTop && scrollY <= sectionTop + sectionHeight,
        );
      }
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  updateOnScroll();

  // Bibliotecas visuais opcionais (Swiper & ScrollReveal) carregadas de forma resiliente
  if (typeof window.Swiper !== 'undefined') {
    try {
      new window.Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: { el: '.swiper-pagination', clickable: true },
        keyboard: { enabled: true },
        mousewheel: false,
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        },
      });
    } catch (err) {
      console.warn('Swiper init warning:', err);
    }
  }

  if (typeof window.ScrollReveal !== 'undefined') {
    try {
      const sr = window.ScrollReveal({
        origin: 'top',
        distance: '24px',
        duration: 650,
        reset: false,
      });
      sr.reveal(
        '#home .hero-text, #home .hero-media-wrapper, #memes .section-header, #memes .meme-card, #about .lore-content, #about .multiverse-tags, #characters .social-profile-card, #testimonials .section-header, #contact .channel-card, footer',
        { interval: 80 },
      );
    } catch (err) {
      console.warn('ScrollReveal init warning:', err);
    }
  }
}
