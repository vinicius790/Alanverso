/**
 * ALANVERSO v5.0.0 - BANCO OFICIAL DE PERGUNTAS E REGRAS DO QUIZ
 */

export const QUIZ_QUESTIONS = [
  {
    category: 'Variantes Dimensionais',
    question:
      'Qual é a variante do multiverso do Alanzoka famosa pelo sombrero mexicano, bigode marcante e bordões hispânicos?',
    options: [
      'Alan Normal',
      'Alan Mexicano (Don Ferreira)',
      'Alan da Quebrada',
      'Alan Intelectual',
    ],
    correctIndex: 1,
    explanation:
      'Don Ferreira é a variante mexicana lendária, sempre pronta para bailar e tocar maracas nas transmissões.',
  },
  {
    category: 'História & Reações',
    question:
      'Quando o Alanzoka toma um susto repentino em um jogo de terror Indie, qual é sua reação clássica instantânea?',
    options: [
      'Fechar os olhos em silêncio absoluto e respirar fundo',
      'Grito estridente de susto seguido da clássica metralhadora de risadas',
      'Desligar o computador da tomada e sair correndo da casa',
      'Permanecer imóvel com expressão de poker face',
    ],
    correctIndex: 1,
    explanation:
      'A risada no ritmo de metralhadora após o susto estridente é a marca registrada histórica do canal.',
  },
  {
    category: 'Companhia & Lore',
    question:
      'Como é conhecida a companheira de vida e aventuras do Alan, frequentemente homenageada nos clipes da comunidade?',
    options: ['Maethe', 'Cremosa do Além', 'Dona Florinda', 'Dona Clotilde'],
    correctIndex: 0,
    explanation:
      'Maethe e Alanzoka formam o casal mais querido das streams brasileiras, protagonizando momentos épicos.',
  },
  {
    category: 'Memes & Galanteio',
    question:
      'O que o Alan faz quando a "Cremosa" é avistada ou mencionada em suas transmissões ao vivo?',
    options: [
      'Pede ajuda para os moderadores mutarem o chat',
      'Ativa o modo Sedutor da Quebrada com postura elegante e olhar penetrante',
      'Finge desmaio ao vivo',
      'Coloca uma música triste e chora no microfone',
    ],
    correctIndex: 1,
    explanation:
      'O lendário meme do Alan Sedutor com camisa social e olhar conquistador é ativado instantaneamente!',
  },
  {
    category: 'Origens do Canal',
    question:
      'Qual jogo de terror clássico nos anos 2010 marcou época no canal com os sustos mais icônicos do início da carreira?',
    options: [
      'Slender: The Eight Pages e Amnesia: The Dark Descent',
      'Farming Simulator 2011',
      'Tetris Ultimate Edition',
      'Flight Simulator 2012',
    ],
    correctIndex: 0,
    explanation:
      'Slender e Amnesia foram os divisores de águas que consagraram o humor e as reações autênticas do Alan.',
  },
  {
    category: 'Tecnologia do Multiverso',
    question:
      'Como os efeitos sonoros do Soundboard interativo do Alanverso são gerados na web?',
    options: [
      'Apenas arquivos de fita cassete analógica',
      'Síntese de áudio em tempo real com Web Audio API e osciladores dinâmicos',
      'Código Morse transmitido via rádio amador',
      'Gravações em disco de vinil de 78 RPM',
    ],
    correctIndex: 1,
    explanation:
      'O Alanverso utiliza a moderna Web Audio API do navegador para sintetizar ondas e frequências customizadas.',
  },
  {
    category: 'Bordões Clássicos',
    question:
      'Durante momentos de pura tensão ou jogadas improváveis no FPS ou horror, qual grito de alerta se tornou bordão eterno?',
    options: [
      'Olha o meteoro caindo!',
      'Olha a pedraaa! / É o tijolinho, moleque!',
      'Atenção tripulação!',
      'Cadê o controle remoto?',
    ],
    correctIndex: 1,
    explanation:
      '"Olha a pedraaa!" e "É o tijolinho, moleque!" fazem parte do vocabulário oficial de todos os inscritos.',
  },
  {
    category: 'Variantes Dimensionais',
    question:
      'Quando o personagem ou jogador enfrenta um enigma lógico aparentemente simples mas demora minutos para resolver, quem entra em cena?',
    options: [
      'Alan Velocista',
      'Alan Intelectual com o Cérebro Desligando',
      'Alan Astrólogo',
      'Alan Cozinheiro',
    ],
    correctIndex: 1,
    explanation:
      'Puzzles de madeira e chaves em Resident Evil sempre despertam a famosa "tela azul cerebral" divertida em live.',
  },
  {
    category: 'Acessibilidade & Web',
    question:
      'Qual nível de conformidade WCAG o portal Alanverso implementa no modo de Alto Contraste e navegação por teclado?',
    options: [
      'Nível Básico Experimental',
      'WCAG 2.2 AAA (contraste >= 7:1, Live Region e Skip Links)',
      'Somente compatível com mouse',
      'Sem suporte a leitores de tela',
    ],
    correctIndex: 1,
    explanation:
      'O Alanverso aplica contraste AAA (>= 7:1), anúncios em Live Region, focus trap e atalhos completos de teclado.',
  },
  {
    category: 'Comunidade Twitch',
    question:
      'Qual é o nome completo do criador de conteúdo brasileiro mundialmente conhecido como Alanzoka?',
    options: [
      'Alan Silva Costa',
      'Alan Ferreira',
      'Alan Pereira Gomes',
      'Alexandre Ferreira',
    ],
    correctIndex: 1,
    explanation:
      'Alan Ferreira é o nome por trás de um dos maiores e mais premiados canais de games do Brasil na Twitch e YouTube.',
  },
];

/**
 * Avalia o desempenho final de uma partida do Quiz.
 */
export function evaluateQuizResult(score, total) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const percent = Math.round((score / safeTotal) * 100);

  if (percent === 100) {
    return {
      percent,
      icon: '👑',
      title: 'Doutor em Alanologia!',
      desc: 'Perfeição absoluta! Você conhece todas as dimensões e lendas do Alanverso.',
      isGenius: true,
    };
  }
  if (percent >= 70) {
    return {
      percent,
      icon: '🎓',
      title: 'Especialista em Alanverso!',
      desc: 'Excelente resultado! Você acompanha as lives e memes há muito tempo.',
      isGenius: false,
    };
  }
  if (percent >= 40) {
    return {
      percent,
      icon: '⭐',
      title: 'Iniciado no Multiverso!',
      desc: 'Bom começo! Explore mais a galeria de clipes para se tornar um mestre.',
      isGenius: false,
    };
  }
  return {
    percent,
    icon: '🐣',
    title: 'Recém-chegado ao Chat!',
    desc: 'Você ainda está descobrindo os memes. Vale a pena reviver os clipes épicos!',
    isGenius: false,
  };
}
