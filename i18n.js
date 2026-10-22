/**
 * ALANVERSO - INTERNATIONALIZATION (i18n) MODULE
 * Suporte bilíngue dinâmico: Português (pt-BR) e Inglês (en)
 * Compatível com navegador (DOM) e Node.js (Test Runner).
 */
'use strict';

const alanversoTranslations = {
  'pt-BR': {
    // Accessibility & Navigation
    'skip.main': 'Pular para o conteúdo principal',
    'skip.memes': 'Pular para a galeria de memes',
    'skip.soundboard': 'Pular para o soundboard interativo',
    'skip.clips': 'Pular para a central de clipes',
    'skip.generator': 'Pular para o gerador de memes',
    'skip.quiz': 'Pular para o quiz interativo',
    'skip.achievements': 'Pular para conquistas e perfil',
    'skip.about': 'Pular para o multiverso do Alan',
    'skip.characters': 'Pular para personagens',
    'skip.testimonials': 'Pular para depoimentos da comunidade',
    'skip.contact': 'Pular para canais oficiais',
    'nav.home': 'Início',
    'nav.memes': 'Memes',
    'nav.soundboard': 'Soundboard',
    'nav.clips': 'Clipes',
    'nav.generator': 'Gerador de Memes',
    'nav.quiz': 'Quiz',
    'nav.achievements': 'Conquistas',
    'nav.about': 'Multiverso',
    'nav.characters': 'Personagens',
    'nav.testimonials': 'Depoimentos',
    'nav.contact': 'Canais',
    'nav.lang_label': 'Mudar idioma para Inglês',
    'nav.lang_badge': 'EN',
    'nav.theme_toggle': 'Alternar modo escuro ou claro',
    'nav.contrast_toggle': 'Alternar modo de alto contraste',
    'nav.shortcuts_toggle': 'Abrir guia de atalhos de teclado',
    'nav.menu_toggle': 'Abrir menu de navegação',

    // Hero Section
    'hero.title': 'O Multiverso Absoluto do <span>Alanzoka</span>',
    'hero.subtitle':
      'De jogatinas memoráveis a reações épicas que marcaram a internet brasileira. Prepare-se para reviver as melhores fases, caretas e lendas da live!',
    'hero.btn_memes': 'Explorar Memes',
    'hero.btn_submit': 'Enviar Momento',
    'hero.card_caption': 'Modo Full Metralhadora',
    'hero.card_badge': 'AO VIVO',

    // Memes Section
    'memes.tag': 'Momentos de Ouro',
    'memes.title': 'Reações Que Viraram História',
    'memes.subtitle':
      'Seja na paquera com a cremosa ou levando o susto do século no jogo de terror.',
    'memes.card1.title': 'A Chegada da Cremosa',
    'memes.card1.desc':
      'Aquele instante sutil em que a presença da morena é detectada no raio de 50 metros.',
    'memes.card1.badge': 'Classificação: Lendário',
    'memes.card2.title': 'Convite Aceito!',
    'memes.card2.desc':
      'A dança da vitória absoluta quando ela aceita comer aquele podrão na esquina.',
    'memes.card2.badge': 'Classificação: Vitória',
    'memes.card3.title': 'O Sedutor da Quebrada',
    'memes.card3.desc':
      'A imponência rústica do maior galã das noites de streaming da América Latina.',
    'memes.card3.badge': 'Classificação: Charme',
    'memes.card4.title': 'Coração Partido',
    'memes.card4.desc':
      "Quando a resposta foi um sonoro 'te vejo só como amigo' após meses de dedicação.",
    'memes.card4.badge': 'Classificação: Drama',
    'memes.btn_expand': 'Ampliar 🔍',

    // Soundboard Section
    'soundboard.tag': 'Áudio & Efeitos',
    'soundboard.title': 'Soundboard Interativo do <span>Alanzoka</span>',
    'soundboard.subtitle':
      'Efeitos sintetizados em tempo real com Web Audio API, frases épicas e visualizador osciloscópio dinâmico em Canvas.',

    // Clips Section
    'clips.tag': 'Galeria Multimídia',
    'clips.title': 'Central de Vídeos & <span>Clipes Lendários</span>',
    'clips.subtitle':
      'Reviva os melhores momentos da carreira do Alan com filtros temáticos, busca instantânea e player multimídia interativo.',
    'clips.search_placeholder': 'Buscar clipe por título, jogo ou momento (Atalho: /)...',
    'clips.sort_label': 'Ordenar por:',
    'clips.sort_views': 'Mais Vistos',
    'clips.sort_duration': 'Maior Duração',
    'clips.sort_alpha': 'Ordem Alfabética (A-Z)',

    // Meme Generator Section
    'generator.tag': 'Fábrica de Memes',
    'generator.title': 'Gerador de Memes do <span>Alanzoka</span>',
    'generator.subtitle':
      'Crie memes lendários com renderização direta no Canvas HTML5, personalize legendas, escolha as caretas mais icônicas e baixe o PNG em alta resolução!',

    // Quiz Section
    'quiz.tag': 'Desafio Interativo',
    'quiz.title': 'Quiz Oficial do <span>Alanverso</span>',
    'quiz.subtitle':
      'Teste seus conhecimentos sobre a história, bordões, jogos de terror e variantes dimensionais do Alanzoka!',

    // Achievements & Profile Section
    'achievements.tag': 'Gamificação & Perfil',
    'achievements.title': 'Galeria de Troféus & <span>Conquistas</span>',
    'achievements.subtitle':
      'Explore o Alanverso para desbloquear medalhas exclusivas salvas automaticamente no seu navegador ou exporte seu perfil JSON.',

    // Multiverse Section
    'about.caption_title': 'Arquivo Confidencial #007',
    'about.caption_sub': 'Variantes em Convergência',
    'about.tag': 'A Teoria do Multiverso',
    'about.title': 'Quem é o Verdadeiro Alanzoka?',
    'about.p1':
      'Segundo os maiores físicos quânticos da Twitch, Alan não é apenas um indivíduo, mas uma anomalia temporal que se manifesta de múltiplas formas ao redor do mundo.',
    'about.p2':
      'Cada transmissão ao vivo abre fendas dimensionais onde variantes de diferentes realidades assumem o microfone:',
    'about.variant.normal': '⭐ Alan Normal',
    'about.variant.mexican': '🌮 Alan Mexicano',
    'about.variant.female': '👑 Alan Mulher',
    'about.variant.cross': '👀 Alan Vesgo',
    'about.variant.cry': '😭 Alan Chorão',
    'about.variant.rage': '⚡ Alan Full Pistola',
    'about.variant.intellectual': '🧠 Alan Intelectual',
    'about.variant.romantic': '🌹 Alan Romântico',
    'about.variant.emo': '🎸 Alan Emo',
    'about.variant.hood': '🍕 Alan da Quebrada',

    // Characters / Social Section
    'characters.tag': 'Presença Digital',
    'characters.title': 'Alanzoka Pelas Redes Sociais',
    'characters.subtitle': 'Como cada rede social interpreta a essência mística do Alan.',
    'characters.badge.family': 'Foto de Família',
    'characters.badge.influencer': 'Influencer Top',
    'characters.badge.rants': 'Reclamações & Rants',
    'characters.badge.ceo': 'CEO de Barulhos',

    // Testimonials Section
    'testimonials.tag': 'Testemunhos Oficiais',
    'testimonials.title': 'O Que Dizem Sobre o Alan',
    'testimonials.subtitle':
      'Relatos reais de quem convive ou acompanha de perto essa entidade.',
    'testimonials.t1.text':
      '"Lindo, maravilhoso, companheiro de todas as horas! O único detalhe é que ele faz barulho até dormindo, mas a gente ama mesmo assim."',
    'testimonials.t1.role': 'Companheira de Aventuras',
    'testimonials.t2.text':
      '"Só estamos na casa pela ração premium e pelos sachês. Quando ele começa a gritar no joguinho de terror, a gente simplesmente vai dormir no outro quarto."',
    'testimonials.t2.role': 'Críticos Felinos',
    'testimonials.t3.text':
      '"Eu não sei que horas ele dorme. São três da manhã e eu ouço ele rindo e atirando de metralhadora virtual. Mas pelo menos anima o prédio."',
    'testimonials.t3.role': 'Testemunha Ocular',
    'testimonials.t4.text':
      '"O melhor criador de conteúdo do Brasil! Acompanho desde o começo e até hoje não descobrimos quantos anos ele tem de verdade."',
    'testimonials.t4.role': 'Chat Mais Rápido do Oeste',

    // Channels Section
    'contact.tag': 'Onde Encontrar',
    'contact.title': 'Canais Oficiais do Alanzoka',
    'contact.subtitle': 'Conecte-se e assista às transmissões nas principais plataformas.',
    'contact.twitch.desc':
      'Lives diárias com gameplays insanas, bate-papo e risadas garantidas.',
    'contact.twitch.btn': 'Assistir na Twitch',
    'contact.yt.desc':
      'Melhores momentos, vídeos editados e cortes dos jogos mais jogados.',
    'contact.yt.btn': 'Inscrever-se no YouTube',
    'contact.ig.desc':
      'Bastidores da vida real, fotos com a Maethe e novidades exclusivas.',
    'contact.ig.btn': 'Seguir no Instagram',

    // Footer
    'footer.tagline':
      'Um tributo carinhoso da comunidade para o Alanzoka e todos os clipes que trazem sorrisos diários para milhões de pessoas.',
    'footer.quick_links': 'Navegação Rápida',
    'footer.community': 'Comunidade',
    'footer.rights':
      '© 2026 Alanverso Showcase. Desenvolvido com carinho para os fãs do Alanzoka.',

    // Modal & Form
    'modal.default_title': 'Galeria do Alanverso',
    'modal.form_title': 'Envie sua Sugestão de Meme ou Clipe',
    'modal.lbl_nick': 'Seu Nick / Nome:',
    'modal.ph_nick': 'Ex: TijolinhoGamer',
    'modal.lbl_cat': 'Categoria do Momento:',
    'modal.opt_scare': 'Susto em Jogo de Terror',
    'modal.opt_machinegun': 'Grito / Metralhadora',
    'modal.opt_romance': 'Paquera com a Cremosa',
    'modal.opt_lore': 'Outra Variante do Multiverso',
    'modal.lbl_link': 'Link do Clipe ou Descrição:',
    'modal.ph_link': 'Cole o link da Twitch/YouTube ou descreva o momento épico...',
    'modal.btn_submit': 'Enviar para o Alanverso 🚀',
    'modal.close_label': 'Fechar janela modal',
    'back_to_top': 'Voltar ao topo da página',
    'a11y.lang_switched': 'Idioma alterado para Português.'
  },
  en: {
    // Accessibility & Navigation
    'skip.main': 'Skip to main content',
    'skip.memes': 'Skip to meme gallery',
    'skip.soundboard': 'Skip to interactive soundboard',
    'skip.clips': 'Skip to clips hub',
    'skip.generator': 'Skip to meme generator',
    'skip.quiz': 'Skip to interactive quiz',
    'skip.achievements': 'Skip to achievements and profile',
    'skip.about': 'Skip to Alan multiverse',
    'skip.characters': 'Skip to characters',
    'skip.testimonials': 'Skip to community testimonials',
    'skip.contact': 'Skip to official channels',
    'nav.home': 'Home',
    'nav.memes': 'Memes',
    'nav.soundboard': 'Soundboard',
    'nav.clips': 'Clips',
    'nav.generator': 'Meme Maker',
    'nav.quiz': 'Quiz',
    'nav.achievements': 'Trophies',
    'nav.about': 'Multiverse',
    'nav.characters': 'Characters',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Channels',
    'nav.lang_label': 'Switch language to Portuguese',
    'nav.lang_badge': 'PT',
    'nav.theme_toggle': 'Toggle dark or light theme',
    'nav.contrast_toggle': 'Toggle high contrast mode',
    'nav.shortcuts_toggle': 'Open keyboard shortcuts guide',
    'nav.menu_toggle': 'Open navigation menu',

    // Hero Section
    'hero.title': 'The Absolute Multiverse of <span>Alanzoka</span>',
    'hero.subtitle':
      'From legendary gameplay sessions to epic reactions that shaped Brazilian internet culture. Relive the best eras, funny faces, and stream lore!',
    'hero.btn_memes': 'Explore Memes',
    'hero.btn_submit': 'Submit Moment',
    'hero.card_caption': 'Full Machine Gun Mode',
    'hero.card_badge': 'LIVE NOW',

    // Memes Section
    'memes.tag': 'Golden Moments',
    'memes.title': 'Reactions That Made History',
    'memes.subtitle':
      'From smooth flirting with the crush to the fright of the century in horror games.',
    'memes.card1.title': 'The Crush Arrives',
    'memes.card1.desc':
      'That subtle moment when her presence is detected within a 50-meter radius.',
    'memes.card1.badge': 'Rating: Legendary',
    'memes.card2.title': 'Invitation Accepted!',
    'memes.card2.desc':
      'The ultimate victory dance when she agrees to grab a midnight snack together.',
    'memes.card2.badge': 'Rating: Victory',
    'memes.card3.title': 'The Neighborhood Seducer',
    'memes.card3.desc': 'The rustic charisma of Latin America streaming night idol.',
    'memes.card3.badge': 'Rating: Charm',
    'memes.card4.title': 'Heartbroken',
    'memes.card4.desc':
      "When the answer was a resounding 'I only see you as a friend' after months of effort.",
    'memes.card4.badge': 'Rating: Drama',
    'memes.btn_expand': 'Zoom In 🔍',

    // Soundboard Section
    'soundboard.tag': 'Audio & Effects',
    'soundboard.title': 'Interactive <span>Alanzoka</span> Soundboard',
    'soundboard.subtitle':
      'Real-time Web Audio API synthesized effects, iconic catchphrases, and dynamic Canvas oscilloscope visualizer.',

    // Clips Section
    'clips.tag': 'Multimedia Hub',
    'clips.title': 'Legendary Videos & <span>Clips Hub</span>',
    'clips.subtitle':
      "Relive the greatest moments of Alan's career with thematic filters, instant search, and an interactive media player.",
    'clips.search_placeholder': 'Search clips by title, game, or moment (Shortcut: /)...',
    'clips.sort_label': 'Sort by:',
    'clips.sort_views': 'Most Viewed',
    'clips.sort_duration': 'Longest Duration',
    'clips.sort_alpha': 'Alphabetical (A-Z)',

    // Meme Generator Section
    'generator.tag': 'Meme Factory',
    'generator.title': '<span>Alanzoka</span> Meme Generator',
    'generator.subtitle':
      'Create legendary memes rendered directly on HTML5 Canvas, customize captions, pick iconic faces, and download high-res PNGs!',

    // Quiz Section
    'quiz.tag': 'Interactive Challenge',
    'quiz.title': 'Official <span>Alanverso</span> Quiz',
    'quiz.subtitle':
      'Test your knowledge about Alanzoka lore, catchphrases, horror games, and dimensional variants!',

    // Achievements & Profile Section
    'achievements.tag': 'Gamification & Profile',
    'achievements.title': 'Trophy Room & <span>Achievements</span>',
    'achievements.subtitle':
      'Explore the Alanverso to unlock exclusive badges saved in your browser or export your profile as JSON.',

    // Multiverse Section
    'about.caption_title': 'Confidential File #007',
    'about.caption_sub': 'Variants in Convergence',
    'about.tag': 'The Multiverse Theory',
    'about.title': 'Who is the Real Alanzoka?',
    'about.p1':
      'According to top quantum physicists on Twitch, Alan is not just a person, but a temporal anomaly manifesting in myriad forms worldwide.',
    'about.p2':
      'Every livestream opens dimensional rifts where variants from alternate realities take the mic:',
    'about.variant.normal': '⭐ Regular Alan',
    'about.variant.mexican': '🌮 Mexican Alan',
    'about.variant.female': '👑 Female Alan',
    'about.variant.cross': '👀 Cross-eyed Alan',
    'about.variant.cry': '😭 Crybaby Alan',
    'about.variant.rage': '⚡ Rage Alan',
    'about.variant.intellectual': '🧠 Intellectual Alan',
    'about.variant.romantic': '🌹 Romantic Alan',
    'about.variant.emo': '🎸 Emo Alan',
    'about.variant.hood': '🍕 Hood Alan',

    // Characters / Social Section
    'characters.tag': 'Digital Presence',
    'characters.title': 'Alanzoka Across Social Media',
    'characters.subtitle': 'How each platform interprets the mystical essence of Alan.',
    'characters.badge.family': 'Family Photo',
    'characters.badge.influencer': 'Top Influencer',
    'characters.badge.rants': 'Rants & Complaints',
    'characters.badge.ceo': 'CEO of Noise',

    // Testimonials Section
    'testimonials.tag': 'Official Testimonials',
    'testimonials.title': 'What They Say About Alan',
    'testimonials.subtitle':
      'Real accounts from those who live alongside or closely follow this entity.',
    'testimonials.t1.text':
      '"Handsome, wonderful, partner for all times! The only detail is that he makes noise even while sleeping, but we love him anyway."',
    'testimonials.t1.role': 'Adventure Partner',
    'testimonials.t2.text':
      '"We are only here for the premium cat food and snacks. When he starts screaming at horror games, we simply go sleep in the other bedroom."',
    'testimonials.t2.role': 'Feline Critics',
    'testimonials.t3.text':
      '"I have no idea what time he sleeps. It is 3 AM and I hear him laughing and firing a virtual machine gun. But hey, it livens up the building."',
    'testimonials.t3.role': 'Eyewitness',
    'testimonials.t4.text':
      '"The best content creator in Brazil! Followed him from the very start and to this day nobody knows his actual age."',
    'testimonials.t4.role': 'Fastest Chat in the West',

    // Channels Section
    'contact.tag': 'Where to Find',
    'contact.title': 'Alanzoka Official Channels',
    'contact.subtitle': 'Connect and watch live broadcasts on the main platforms.',
    'contact.twitch.desc':
      'Daily livestreams with insane gameplay, fun chat, and guaranteed laughs.',
    'contact.twitch.btn': 'Watch on Twitch',
    'contact.yt.desc':
      'Best moments, edited highlights, and playthroughs of trending games.',
    'contact.yt.btn': 'Subscribe on YouTube',
    'contact.ig.desc':
      'Behind-the-scenes life, photos with Maethe, and exclusive updates.',
    'contact.ig.btn': 'Follow on Instagram',

    // Footer
    'footer.tagline':
      'A loving tribute from the community to Alanzoka and every clip that brings smiles to millions every single day.',
    'footer.quick_links': 'Quick Navigation',
    'footer.community': 'Community',
    'footer.rights':
      '© 2026 Alanverso Showcase. Crafted with care for Alanzoka fans.',

    // Modal & Form
    'modal.default_title': 'Alanverso Gallery',
    'modal.form_title': 'Submit Your Meme or Clip Suggestion',
    'modal.lbl_nick': 'Your Nickname / Name:',
    'modal.ph_nick': 'E.g.: TijolinhoGamer',
    'modal.lbl_cat': 'Moment Category:',
    'modal.opt_scare': 'Jump scare in Horror Game',
    'modal.opt_machinegun': 'Scream / Machine Gun',
    'modal.opt_romance': 'Flirting with the Crush',
    'modal.opt_lore': 'Other Multiverse Variant',
    'modal.lbl_link': 'Clip Link or Description:',
    'modal.ph_link': 'Paste the Twitch/YouTube link or describe the epic moment...',
    'modal.btn_submit': 'Submit to the Alanverso 🚀',
    'modal.close_label': 'Close modal window',
    'back_to_top': 'Back to top of page',
    'a11y.lang_switched': 'Language switched to English.'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = this.getSavedLanguage();
    if (typeof document !== 'undefined') {
      this.init();
    }
  }

  getSavedLanguage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('alanverso-lang');
        if (saved && (saved === 'en' || saved === 'pt-BR')) {
          return saved;
        }
      }
    } catch {
      // Storage indisponível
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
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
    if (!alanversoTranslations[lang]) {
      lang = 'pt-BR';
    }
    this.currentLang = lang;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('alanverso-lang', lang);
      }
    } catch {
      // Storage indisponível
    }
    this.applyLanguage(lang, true);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent('alanverso:language-changed', { detail: { lang } }));
      } catch {
        // Fallback para ambientes sem CustomEvent
      }
    }
  }

  sanitizeHtml(dirty) {
    if (typeof dirty !== 'string') return '';
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(dirty, 'text/html');
      const allowedTags = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR', 'SMALL']);
      const nodes = doc.body.querySelectorAll('*');
      nodes.forEach(node => {
        if (!allowedTags.has(node.tagName)) {
          node.remove();
        } else {
          Array.from(node.attributes).forEach(attr => {
            if (!['class', 'title', 'aria-hidden'].includes(attr.name.toLowerCase())) {
              node.removeAttribute(attr.name);
            }
          });
        }
      });
      return doc.body.innerHTML;
    }
    // Fallback seguro em ambiente sem DOMParser (ex.: Node.js test runner)
    return dirty
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<(?!\/?(?:span|strong|em|b|i|br|small)\b)[^>]+>/gi, '')
      .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  }

  applyLanguage(lang, announce = true) {
    if (typeof document === 'undefined') return;
    const dict = alanversoTranslations[lang] || alanversoTranslations['pt-BR'];
    document.documentElement.lang = lang;

    // Translate elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (dict[key].includes('<') && dict[key].includes('>')) {
          el.innerHTML = this.sanitizeHtml(dict[key]);
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Translate attributes like placeholder, title, aria-label
    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(el => {
      const mappings = el.getAttribute('data-i18n-attr').split(',');
      mappings.forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (attr && key && dict[key]) {
          el.setAttribute(attr, dict[key]);
        }
      });
    });

    // Update toggle button visuals
    const currentLangSpan = document.getElementById('current-lang');
    const toggleBtn = document.getElementById('lang-toggle');
    if (currentLangSpan) {
      currentLangSpan.textContent = dict['nav.lang_badge'];
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', dict['nav.lang_label']);
      toggleBtn.setAttribute('title', dict['nav.lang_label']);
    }

    // Accessibility announcement
    if (announce) {
      const liveRegion = document.getElementById('a11y-live-region');
      if (liveRegion) {
        liveRegion.textContent = '';
        setTimeout(() => {
          liveRegion.textContent = dict['a11y.lang_switched'];
        }, 50);
      }
    }
  }
}

let alanversoI18n = null;

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      alanversoI18n = new I18nManager();
      if (typeof window !== 'undefined') window.alanversoI18n = alanversoI18n;
    });
  } else {
    alanversoI18n = new I18nManager();
    if (typeof window !== 'undefined') window.alanversoI18n = alanversoI18n;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { alanversoTranslations, I18nManager };
}
