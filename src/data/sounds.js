/**
 * ALANVERSO v5.0.0 - CATÁLOGO DE SONS, FRASES DE MEMES, STICKERS E FILTROS
 */

/**
 * Mapa de teclas de atalho do Soundboard (sem conflitar com atalhos globais T, C, L).
 */
export const SOUND_HOTKEYS = {
  '1': 'jumpscare',
  '2': 'metralhadora',
  '3': 'pedra',
  '4': 'tijolinho',
  '5': 'cerebro',
  '6': 'cremosa',
  '7': 'puzzle',
  '8': 'vitoria',
  '9': 'rage',
  Q: 'speech-pedra',
  W: 'speech-tijolo',
  E: 'speech-respira',
};

export const RANDOM_MEME_QUOTES = [
  { top: 'QUANDO A MORENA PASSA...', bottom: '...E EU TENTO DISFARÇAR O CHARME' },
  { top: 'OLHA A PEDRAAAAA!', bottom: 'RESPEITA O TIJOLINHO, MOLEQUE!' },
  { top: 'EU NO JOGO DE TERROR:', bottom: '"SÓ VOU DAR UMA OLHADINHA NA PORTA"' },
  { top: 'CALMA, TÔ LIGANDO O CÉREBRO...', bottom: '...DEU ERRO 404 NO PENSAMENTO' },
  { top: 'QUANDO O MONSTRO CORRE ATRÁS DE MIM:', bottom: 'MINHA VELOCIDADE SUBIU PRA 500%' },
  { top: 'FOI TUDO CALCULADO!', bottom: 'PENA QUE SOU PÉSSIMO EM MATEMÁTICA' },
  { top: 'BATEU A VONTADE DE JOGAR INDIE...', bottom: '...02H DA MANHÃ DE FONE NO MÁXIMO' },
];

export const MEME_STICKERS = {
  none: '',
  aovivo: '🔴 AO VIVO',
  pistola: '🔥 100% PISTOLA',
  cremosa: '👀 CREMOSA',
  metralhadora: '😂 METRALHADORA',
};

export const MEME_CANVAS_FILTERS = {
  none: 'none',
  bw: 'grayscale(100%) contrast(1.2)',
  gamer: 'contrast(1.3) saturate(1.45)',
  sepia: 'sepia(85%) contrast(1.05)',
  inverted: 'invert(92%)',
};
