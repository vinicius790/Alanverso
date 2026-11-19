/**
 * ALANVERSO v5.0.0 - CATÁLOGO DE CONQUISTAS E SISTEMA DE RANKING
 */

export const ACHIEVEMENTS_DATA = [
  {
    id: 'first_step',
    icon: '🚪',
    title: 'Primeiro Passo',
    desc: 'Entrou no portal do Alanverso e iniciou sua jornada pelo multiverso.',
  },
  {
    id: 'sound_master',
    icon: '🎧',
    title: 'DJ da Live',
    desc: 'Disparou pelo menos 3 efeitos no soundboard sintetizados em tempo real.',
  },
  {
    id: 'audio_alchemist',
    icon: '🎛️',
    title: 'Alquimista do Áudio',
    desc: 'Ativou efeitos especiais (Eco/Delay, Bass Boost ou Modo Turbo) no Soundboard v5.0.',
  },
  {
    id: 'meme_maker',
    icon: '🎨',
    title: 'Memeiro Nato',
    desc: 'Criou, personalizou ou baixou uma obra-prima no Gerador de Memes HTML5.',
  },
  {
    id: 'dark_knight',
    icon: '🌙',
    title: 'Filho da Madrugada',
    desc: 'Alternou com estilo entre os modos Claro e Escuro da interface.',
  },
  {
    id: 'contrast_pro',
    icon: '👁️',
    title: 'Visão Biônica (AAA)',
    desc: 'Ativou o modo de Alto Contraste seguindo as diretrizes WCAG 2.2 AAA.',
  },
  {
    id: 'clip_scout',
    icon: '🎬',
    title: 'Arqueólogo de Clipes',
    desc: 'Utilizou o sistema de busca com debounce para minerar momentos históricos.',
  },
  {
    id: 'clip_collector',
    icon: '⭐',
    title: 'Curador da Live',
    desc: 'Favoritou pelo menos 2 clipes lendários na sua coleção pessoal.',
  },
  {
    id: 'quiz_starter',
    icon: '🧠',
    title: 'Desafiante da Lore',
    desc: 'Completou com bravura uma rodada inteira do Quiz Oficial do Alanverso.',
  },
  {
    id: 'quiz_genius',
    icon: '🎓',
    title: 'Doutor em Alanologia',
    desc: 'Gabaritou o Quiz Oficial com aproveitamento perfeito de 100% dos acertos!',
  },
  {
    id: 'polyglot',
    icon: '🌐',
    title: 'Cidadão do Multiverso',
    desc: 'Alternou o idioma do site entre Português e Inglês no motor i18n.',
  },
  {
    id: 'data_hoarder',
    icon: '📦',
    title: 'Guardião do Multiverso',
    desc: 'Exportou seu perfil e dados salvos de conquistas em arquivo JSON padronizado.',
  },
];

export const ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS_DATA.map((a) => a.id));

/**
 * Calcula o título de patente do usuário com base no total de conquistas desbloqueadas.
 */
export function getRankTitle(unlockedCount) {
  const count = Number(unlockedCount) || 0;
  if (count >= 12) return 'Entidade Cósmica do Alanverso 🌌';
  if (count >= 10) return 'Lenda Suprema do Alanverso 👑';
  if (count >= 7) return 'Guardião da Lore 🛡️';
  if (count >= 4) return 'Mestre dos Memes 🎨';
  if (count >= 1) return 'Fã Curioso ⭐';
  return 'Explorador Iniciante';
}
