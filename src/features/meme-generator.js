/**
 * ALANVERSO v5.0.0 - GERADOR DE MEMES EM CANVAS HTML5 COM FILTROS E CARIMBOS
 */

import { showToast } from '../core/a11y.js';
import { safeUrl } from '../core/format.js';
import { MEME_CANVAS_FILTERS, MEME_STICKERS, RANDOM_MEME_QUOTES } from '../data/sounds.js';

function wrapTextMeme(ctx, text, x, y, maxWidth, lineHeight, isBottom = false) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(`${currentLine} ${word}`).width;
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const startY = isBottom ? y - (lines.length - 1) * lineHeight : y;

  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}

export function initMemeGeneratorFeature(onUnlockAchievement, onIncrementStat) {
  const memeCanvas = document.getElementById('meme-canvas');
  const memeCanvasCtx = memeCanvas ? memeCanvas.getContext('2d') : null;
  const memeTopInput = document.getElementById('meme-top-text');
  const memeBottomInput = document.getElementById('meme-bottom-text');
  const memeFontSizeInput = document.getElementById('meme-font-size');
  const memeFontSizeVal = document.getElementById('font-size-val');
  const memeTextColorInput = document.getElementById('meme-text-color');
  const memeStrokeColorInput = document.getElementById('meme-stroke-color');
  const memeUppercaseCheck = document.getElementById('meme-uppercase-check');
  const memeFilterSelect = document.getElementById('meme-filter-select');
  const memeStickerSelect = document.getElementById('meme-sticker-select');
  const memePresetBtns = document.querySelectorAll('.meme-preset-btn');
  const memeUploadInput = document.getElementById('meme-upload-input');
  const btnRandomQuote = document.getElementById('btn-random-quote');
  const btnDownloadMeme = document.getElementById('btn-download-meme');
  const btnCopyMeme = document.getElementById('btn-copy-meme');

  let currentMemeImg = new Image();
  currentMemeImg.crossOrigin = 'anonymous';
  currentMemeImg.src = 'https://pbs.twimg.com/media/C-yYloeXoAIJoFF?format=jpg&name=900x900';

  function drawMeme() {
    if (!memeCanvas || !memeCanvasCtx) return;

    const w = memeCanvas.width;
    const h = memeCanvas.height;

    memeCanvasCtx.save();
    memeCanvasCtx.clearRect(0, 0, w, h);
    memeCanvasCtx.fillStyle = '#0f172a';
    memeCanvasCtx.fillRect(0, 0, w, h);

    // Aplicar filtro visual selecionado no Canvas (v5.0.0)
    const filterKey = memeFilterSelect ? memeFilterSelect.value : 'none';
    if ('filter' in memeCanvasCtx) {
      memeCanvasCtx.filter = MEME_CANVAS_FILTERS[filterKey] || 'none';
    }

    if (currentMemeImg.complete && currentMemeImg.naturalWidth > 0) {
      const imgRatio = currentMemeImg.naturalWidth / currentMemeImg.naturalHeight;
      const canvasRatio = w / h;
      let renderW;
      let renderH;
      let offsetX;
      let offsetY;

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
      memeCanvasCtx.fillStyle = '#1e293b';
      memeCanvasCtx.fillRect(0, 0, w, h);
      memeCanvasCtx.fillStyle = '#ffffff';
      memeCanvasCtx.font = 'bold 24px Poppins, sans-serif';
      memeCanvasCtx.textAlign = 'center';
      memeCanvasCtx.fillText('Carregando imagem do Alanzoka...', w / 2, h / 2);
    }

    if ('filter' in memeCanvasCtx) {
      memeCanvasCtx.filter = 'none';
    }

    // Carimbo / Sticker opcional (v5.0.0)
    const stickerKey = memeStickerSelect ? memeStickerSelect.value : 'none';
    const stickerText = MEME_STICKERS[stickerKey];
    if (stickerText) {
      memeCanvasCtx.save();
      memeCanvasCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      memeCanvasCtx.strokeStyle = '#9333ea';
      memeCanvasCtx.lineWidth = 2;
      memeCanvasCtx.font = '800 16px Poppins, sans-serif';
      const padX = 14;
      const boxW = memeCanvasCtx.measureText(stickerText).width + padX * 2;
      const boxX = 18;
      const boxY = 18;
      memeCanvasCtx.fillRect(boxX, boxY, boxW, 34);
      memeCanvasCtx.strokeRect(boxX, boxY, boxW, 34);
      memeCanvasCtx.fillStyle = '#ffffff';
      memeCanvasCtx.textAlign = 'left';
      memeCanvasCtx.fillText(stickerText, boxX + padX, boxY + 23);
      memeCanvasCtx.restore();
    }

    const fontSize = memeFontSizeInput ? Number.parseInt(memeFontSizeInput.value, 10) : 38;
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

    if (topText) {
      wrapTextMeme(memeCanvasCtx, topText, w / 2, fontSize + 24, w - 40, fontSize * 1.15);
    }

    if (bottomText) {
      wrapTextMeme(
        memeCanvasCtx,
        bottomText,
        w / 2,
        h - fontSize - 24,
        w - 40,
        fontSize * 1.15,
        true,
      );
    }

    memeCanvasCtx.font = '700 13px Poppins, sans-serif';
    memeCanvasCtx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    memeCanvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    memeCanvasCtx.lineWidth = 3;
    memeCanvasCtx.textAlign = 'right';
    memeCanvasCtx.strokeText('ALANVERSO v5.0', w - 16, h - 12);
    memeCanvasCtx.fillText('ALANVERSO v5.0', w - 16, h - 12);
    memeCanvasCtx.restore();
  }

  currentMemeImg.onload = drawMeme;

  [memeTopInput, memeBottomInput, memeTextColorInput, memeStrokeColorInput].forEach((inp) => {
    if (inp) inp.addEventListener('input', drawMeme);
  });

  if (memeUppercaseCheck) memeUppercaseCheck.addEventListener('change', drawMeme);
  if (memeFilterSelect) memeFilterSelect.addEventListener('change', drawMeme);
  if (memeStickerSelect) memeStickerSelect.addEventListener('change', drawMeme);

  if (memeFontSizeInput && memeFontSizeVal) {
    memeFontSizeInput.addEventListener('input', (e) => {
      memeFontSizeVal.textContent = `${e.target.value}px`;
      drawMeme();
    });
  }

  memePresetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      memePresetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const validatedSrc = safeUrl(btn.getAttribute('data-img-src'));
      if (validatedSrc) {
        currentMemeImg = new Image();
        currentMemeImg.crossOrigin = 'anonymous';
        currentMemeImg.onload = drawMeme;
        currentMemeImg.src = validatedSrc;
      }
    });
  });

  if (memeUploadInput) {
    memeUploadInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = safeUrl(String(event.target?.result || ''));
        if (!resultUrl) return;
        currentMemeImg = new Image();
        currentMemeImg.onload = () => {
          memePresetBtns.forEach((b) => b.classList.remove('active'));
          drawMeme();
          showToast('Foto carregada no gerador com sucesso! 📷');
        };
        currentMemeImg.src = resultUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRandomQuote) {
    btnRandomQuote.addEventListener('click', () => {
      const random = RANDOM_MEME_QUOTES[Math.floor(Math.random() * RANDOM_MEME_QUOTES.length)];
      if (memeTopInput) memeTopInput.value = random.top;
      if (memeBottomInput) memeBottomInput.value = random.bottom;
      drawMeme();
      showToast('Nova frase clássica gerada! 🎲');
    });
  }

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
        onIncrementStat?.('memesCreated');
        onUnlockAchievement?.('meme_maker');
      } catch {
        showToast('Clique com o botão direito no meme e escolha "Salvar imagem como..."');
      }
    });
  }

  if (btnCopyMeme && memeCanvas) {
    btnCopyMeme.addEventListener('click', () => {
      try {
        if (memeCanvas.toBlob && navigator.clipboard && window.ClipboardItem) {
          memeCanvas.toBlob(async (blob) => {
            if (!blob) return;
            try {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
              showToast('Meme copiado para a área de transferência! 📋');
              onIncrementStat?.('memesCreated');
              onUnlockAchievement?.('meme_maker');
            } catch {
              btnDownloadMeme?.click();
            }
          }, 'image/png');
        } else {
          btnDownloadMeme?.click();
        }
      } catch {
        btnDownloadMeme?.click();
      }
    });
  }

  drawMeme();

  return { drawMeme };
}
