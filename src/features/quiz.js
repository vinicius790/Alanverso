/**
 * ALANVERSO v5.0.0 - QUIZ OFICIAL COM COMBO DE ACERTOS E DICA 50/50 (DOM SEGURO / ANTI-XSS)
 */

import { announceA11y, showToast } from '../core/a11y.js';
import { clearElement, h } from '../core/dom.js';
import { STORAGE_KEYS, readText, writeText } from '../core/storage.js';
import { QUIZ_QUESTIONS, evaluateQuizResult } from '../data/quiz.js';

export function initQuizFeature(onUnlockAchievement, onRenderStats) {
  let currentQuizIndex = 0;
  let quizScore = 0;
  let currentStreak = 0;
  let maxMatchStreak = 0;
  let hintsRemaining = 2;
  let hasAnsweredCurrent = false;
  let hintUsedOnCurrent = false;

  const quizCard = document.getElementById('quiz-card');
  const quizResultCard = document.getElementById('quiz-result-card');
  const quizCategoryBadge = document.getElementById('quiz-category-badge');
  const quizCounter = document.getElementById('quiz-counter');
  const quizCurrentScore = document.getElementById('quiz-current-score');
  const quizStreakPill = document.getElementById('quiz-streak-pill');
  const quizCurrentStreak = document.getElementById('quiz-current-streak');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsGrid = document.getElementById('quiz-options-grid');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizHintBtn = document.getElementById('quiz-hint-btn');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');
  const quizShareBtn = document.getElementById('quiz-share-btn');

  function updateStreakUI() {
    if (quizCurrentStreak) quizCurrentStreak.textContent = `${currentStreak}x`;
    if (quizStreakPill) {
      quizStreakPill.classList.toggle('hot', currentStreak >= 3);
    }
  }

  function updateHintButton() {
    if (!quizHintBtn) return;
    quizHintBtn.textContent = `💡 Dica 50/50 (${hintsRemaining})`;
    quizHintBtn.disabled = hintsRemaining <= 0 || hasAnsweredCurrent || hintUsedOnCurrent;
  }

  function renderQuizQuestion() {
    if (!quizCard || currentQuizIndex >= QUIZ_QUESTIONS.length) {
      showQuizResults();
      return;
    }

    const q = QUIZ_QUESTIONS[currentQuizIndex];
    hasAnsweredCurrent = false;
    hintUsedOnCurrent = false;

    quizCard.style.display = 'block';
    if (quizResultCard) quizResultCard.style.display = 'none';

    if (quizCategoryBadge) quizCategoryBadge.textContent = `🧠 ${q.category}`;
    if (quizCounter) {
      quizCounter.textContent = `Pergunta ${currentQuizIndex + 1} de ${QUIZ_QUESTIONS.length}`;
    }
    if (quizCurrentScore) quizCurrentScore.textContent = String(quizScore);
    if (quizQuestionText) quizQuestionText.textContent = q.question;

    updateStreakUI();

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
      clearElement(quizOptionsGrid);
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = h(
          'button',
          {
            type: 'button',
            class: 'quiz-option-btn',
            'data-index': String(idx),
            'aria-label': `Opção ${letters[idx]}: ${optText}`,
            onClick: () => handleQuizAnswer(idx),
          },
          h('span', { class: 'quiz-option-letter', 'aria-hidden': 'true' }, letters[idx]),
          h('span', { class: 'quiz-option-label' }, optText),
        );
        quizOptionsGrid.appendChild(btn);
      });
    }

    updateHintButton();
    announceA11y(`Pergunta ${currentQuizIndex + 1}: ${q.question}`);
  }

  function applyFiftyFiftyHint() {
    if (hintsRemaining <= 0 || hasAnsweredCurrent || hintUsedOnCurrent || !quizOptionsGrid) return;
    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const buttons = Array.from(quizOptionsGrid.querySelectorAll('.quiz-option-btn'));
    const wrongButtons = buttons.filter((_, idx) => idx !== q.correctIndex);

    // Embaralha alternativas erradas e elimina 2
    for (let i = wrongButtons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongButtons[i], wrongButtons[j]] = [wrongButtons[j], wrongButtons[i]];
    }

    wrongButtons.slice(0, 2).forEach((btn) => {
      btn.disabled = true;
      btn.classList.add('eliminated');
    });

    hintsRemaining -= 1;
    hintUsedOnCurrent = true;
    updateHintButton();
    announceA11y('Dica 50/50 aplicada: duas opções incorretas foram eliminadas.');
  }

  function handleQuizAnswer(selectedIndex) {
    if (hasAnsweredCurrent) return;
    hasAnsweredCurrent = true;

    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    const optionBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll('.quiz-option-btn') : [];

    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) btn.classList.add('correct');
      else if (idx === selectedIndex) btn.classList.add('wrong');
    });

    if (isCorrect) {
      quizScore += 1;
      currentStreak += 1;
      if (currentStreak > maxMatchStreak) maxMatchStreak = currentStreak;
      if (quizCurrentScore) quizCurrentScore.textContent = String(quizScore);

      if (quizFeedbackBox) {
        quizFeedbackBox.className = 'quiz-feedback-box correct';
        quizFeedbackBox.textContent = `✔️ Resposta Correta! ${q.explanation}`;
        quizFeedbackBox.style.display = 'block';
      }
      announceA11y(`Resposta correta! ${q.explanation}`);
    } else {
      currentStreak = 0;
      if (quizFeedbackBox) {
        quizFeedbackBox.className = 'quiz-feedback-box wrong';
        quizFeedbackBox.textContent = `❌ Incorreto! A resposta certa era: "${q.options[q.correctIndex]}". ${q.explanation}`;
        quizFeedbackBox.style.display = 'block';
      }
      announceA11y(
        `Resposta incorreta! A resposta certa era: ${q.options[q.correctIndex]}. ${q.explanation}`,
      );
    }

    updateStreakUI();
    updateHintButton();

    if (quizNextBtn) {
      quizNextBtn.style.display = 'inline-flex';
      quizNextBtn.focus();
    }
  }

  function showQuizResults() {
    if (quizCard) quizCard.style.display = 'none';
    if (!quizResultCard) return;

    quizResultCard.style.display = 'block';

    const total = QUIZ_QUESTIONS.length;
    const summary = evaluateQuizResult(quizScore, total);

    const scoreEl = document.getElementById('quiz-final-score');
    const percentEl = document.getElementById('quiz-final-percent');
    const recordEl = document.getElementById('quiz-final-record');
    const titleEl = document.getElementById('quiz-result-title');
    const descEl = document.getElementById('quiz-result-desc');
    const iconEl = document.getElementById('quiz-result-icon');

    if (scoreEl) scoreEl.textContent = `${quizScore}/${total}`;
    if (percentEl) percentEl.textContent = `${summary.percent}%`;

    let savedHigh = Number.parseInt(readText(STORAGE_KEYS.QUIZ_HIGHSCORE, '0'), 10) || 0;
    if (quizScore > savedHigh) {
      savedHigh = quizScore;
      writeText(STORAGE_KEYS.QUIZ_HIGHSCORE, String(savedHigh));
    }

    const savedStreak = Number.parseInt(readText(STORAGE_KEYS.QUIZ_BEST_STREAK, '0'), 10) || 0;
    if (maxMatchStreak > savedStreak) {
      writeText(STORAGE_KEYS.QUIZ_BEST_STREAK, String(maxMatchStreak));
    }

    if (recordEl) recordEl.textContent = String(savedHigh);
    if (iconEl) iconEl.textContent = summary.icon;
    if (titleEl) titleEl.textContent = summary.title;
    if (descEl) descEl.textContent = summary.desc;

    if (summary.isGenius) {
      onUnlockAchievement?.('quiz_genius');
    }
    onUnlockAchievement?.('quiz_starter');
    onRenderStats?.();
    announceA11y(`Quiz concluído! Você acertou ${quizScore} de ${total} perguntas (${summary.percent}%).`);
  }

  if (quizHintBtn) quizHintBtn.addEventListener('click', applyFiftyFiftyHint);

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      currentQuizIndex += 1;
      renderQuizQuestion();
    });
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      currentQuizIndex = 0;
      quizScore = 0;
      currentStreak = 0;
      maxMatchStreak = 0;
      hintsRemaining = 2;
      renderQuizQuestion();
      showToast('Quiz reiniciado! Boa sorte! 🎯');
    });
  }

  if (quizShareBtn) {
    quizShareBtn.addEventListener('click', () => {
      const text = `Acertei ${quizScore} de ${QUIZ_QUESTIONS.length} perguntas (combo máximo ${maxMatchStreak}x) no Quiz Oficial do Alanverso v5.0! 🏆`;
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(text)
          .then(() => showToast('Resultado copiado para a área de transferência! 📋'))
          .catch(() => showToast(text));
      } else {
        showToast(text);
      }
    });
  }

  renderQuizQuestion();

  return { renderQuizQuestion, handleQuizAnswer, showQuizResults };
}
