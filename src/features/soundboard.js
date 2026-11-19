/**
 * ALANVERSO v5.0.0 - SOUNDBOARD WEB AUDIO API, EFEITOS DSP E VISUALIZADOR FFT
 */

import { announceA11y, showToast } from '../core/a11y.js';

export function initSoundboardFeature(onUnlockAchievement, onIncrementStat) {
  let audioCtx = null;
  let fxInputNode = null;
  let bassFilterNode = null;
  let delayNode = null;
  let feedbackGainNode = null;
  let echoWetGainNode = null;
  let masterGain = null;
  let analyser = null;

  let activeNodes = [];
  let currentPitch = 1.0;
  let visualizerMode = 'waves'; // 'waves' | 'bars'
  let isSoundPlaying = false;
  let soundsPlayedCount = 0;
  let echoEnabled = false;
  let bassEnabled = false;
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

  // Controles de Efeitos v5.0.0
  const btnFxEcho = document.getElementById('btn-fx-echo');
  const btnFxBass = document.getElementById('btn-fx-bass');
  const btnFxTurbo = document.getElementById('btn-fx-turbo');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(
        volSlider ? Number.parseFloat(volSlider.value) : 0.8,
        audioCtx.currentTime,
      );

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      // Cadeia de Efeitos DSP v5.0.0: fxInputNode -> bassFilterNode -> masterGain & Delay
      fxInputNode = audioCtx.createGain();
      bassFilterNode = audioCtx.createBiquadFilter();
      bassFilterNode.type = 'lowshelf';
      bassFilterNode.frequency.setValueAtTime(180, audioCtx.currentTime);
      bassFilterNode.gain.setValueAtTime(bassEnabled ? 12 : 0, audioCtx.currentTime);

      delayNode = audioCtx.createDelay(1.0);
      delayNode.delayTime.setValueAtTime(0.24, audioCtx.currentTime);
      feedbackGainNode = audioCtx.createGain();
      feedbackGainNode.gain.setValueAtTime(0.38, audioCtx.currentTime);
      echoWetGainNode = audioCtx.createGain();
      echoWetGainNode.gain.setValueAtTime(echoEnabled ? 0.55 : 0, audioCtx.currentTime);

      fxInputNode.connect(bassFilterNode);
      bassFilterNode.connect(masterGain);

      // Loop de Echo / Delay
      bassFilterNode.connect(delayNode);
      delayNode.connect(feedbackGainNode);
      feedbackGainNode.connect(delayNode);
      delayNode.connect(echoWetGainNode);
      echoWetGainNode.connect(masterGain);

      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      startVisualizerLoop();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function updateSoundboardStatus(msg, playing) {
    if (statusText) statusText.textContent = msg;
    if (statusDot) {
      statusDot.classList.toggle('active', Boolean(playing));
    }
  }

  function stopAllSounds() {
    activeNodes.forEach((node) => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch {
        // Nós já encerrados
      }
    });
    activeNodes = [];

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    soundButtons.forEach((btn) => btn.classList.remove('playing'));
    isSoundPlaying = false;
    updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
  }

  function playSynthesizedSound(soundType, buttonEl) {
    const ctx = initAudioContext();
    if (!ctx) return;

    const targetOutput = fxInputNode || masterGain;
    if (buttonEl) buttonEl.classList.add('playing');
    isSoundPlaying = true;
    updateSoundboardStatus(`Tocando: ${soundType.toUpperCase()}`, true);

    const now = ctx.currentTime;
    const baseP = currentPitch;

    switch (soundType) {
      case 'jumpscare': {
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
        gain.connect(targetOutput);

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
          gain.connect(targetOutput);
          osc.start(startTime);
          osc.stop(startTime + duration);
          activeNodes.push(osc);
        }
        setTimeout(() => buttonEl?.classList.remove('playing'), bursts * duration * 1000);
        break;
      }

      case 'pedra': {
        const siren = ctx.createOscillator();
        const sirenGain = ctx.createGain();
        siren.type = 'sawtooth';
        siren.frequency.setValueAtTime(700 * baseP, now);
        siren.frequency.linearRampToValueAtTime(950 * baseP, now + 0.15);
        siren.frequency.linearRampToValueAtTime(650 * baseP, now + 0.3);
        sirenGain.gain.setValueAtTime(0.8, now);
        sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        siren.connect(sirenGain);
        sirenGain.connect(targetOutput);
        siren.start(now);
        siren.stop(now + 0.35);

        const boom = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(180 * baseP, now + 0.3);
        boom.frequency.exponentialRampToValueAtTime(38, now + 1.2);
        boomGain.gain.setValueAtTime(0.001, now);
        boomGain.gain.setValueAtTime(0.95, now + 0.3);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        boom.connect(boomGain);
        boomGain.connect(targetOutput);
        boom.start(now + 0.3);
        boom.stop(now + 1.2);

        activeNodes.push(siren, boom);
        setTimeout(() => buttonEl?.classList.remove('playing'), 1200);
        break;
      }

      case 'tijolinho': {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq * baseP, startTime);
          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
          osc.connect(gain);
          gain.connect(targetOutput);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
          activeNodes.push(osc);
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), notes.length * 80 + 100);
        break;
      }

      case 'cerebro': {
        const steps = 10;
        for (let i = 0; i < steps; i++) {
          const startTime = now + i * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime((600 + ((i * 180) % 900)) * baseP, startTime);
          gain.gain.setValueAtTime(0.3, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
          osc.connect(gain);
          gain.connect(targetOutput);
          osc.start(startTime);
          osc.stop(startTime + 0.05);
          activeNodes.push(osc);
        }
        setTimeout(() => buttonEl?.classList.remove('playing'), 650);
        break;
      }

      case 'cremosa': {
        const chord = [261.63, 329.63, 392.0, 493.88];
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * baseP, now);
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(5, now);
          lfoGain.gain.setValueAtTime(6 * baseP, now);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + 1.4);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
          osc.connect(gain);
          gain.connect(targetOutput);
          osc.start(now);
          osc.stop(now + 1.4);
          activeNodes.push(osc, lfo);
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), 1400);
        break;
      }

      case 'puzzle': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220 * baseP, now);
        osc.frequency.exponentialRampToValueAtTime(880 * baseP, now + 1.6);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        osc.connect(gain);
        gain.connect(targetOutput);
        osc.start(now);
        osc.stop(now + 1.6);
        activeNodes.push(osc);
        setTimeout(() => buttonEl?.classList.remove('playing'), 1600);
        break;
      }

      case 'vitoria': {
        const melody = [
          { f: 523.25, d: 0.12 },
          { f: 523.25, d: 0.12 },
          { f: 523.25, d: 0.12 },
          { f: 523.25, d: 0.28 },
          { f: 415.3, d: 0.24 },
          { f: 466.16, d: 0.24 },
          { f: 523.25, d: 0.4 },
        ];
        let offset = 0;
        melody.forEach((item) => {
          const startTime = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(item.f * baseP, startTime);
          gain.gain.setValueAtTime(0.35, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);
          osc.connect(gain);
          gain.connect(targetOutput);
          osc.start(startTime);
          osc.stop(startTime + item.d);
          activeNodes.push(osc);
          offset += item.d + 0.04;
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), offset * 1000);
        break;
      }

      case 'rage': {
        const drops = [440, 415, 392, 330];
        let dropOffset = 0;
        drops.forEach((f) => {
          const startTime = now + dropOffset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f * baseP, startTime);
          osc.frequency.exponentialRampToValueAtTime(f * 0.92 * baseP, startTime + 0.3);
          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);
          osc.connect(gain);
          gain.connect(targetOutput);
          osc.start(startTime);
          osc.stop(startTime + 0.32);
          activeNodes.push(osc);
          dropOffset += 0.35;
        });
        setTimeout(() => buttonEl?.classList.remove('playing'), dropOffset * 1000);
        break;
      }

      case 'speech-pedra':
        triggerSpeechPhrase('Olha a pedraaa!', 1.2 * baseP, buttonEl, () =>
          playSynthesizedSound('pedra'),
        );
        break;

      case 'speech-tijolo':
        triggerSpeechPhrase('É o tijolinho, moleque!', 1.3 * baseP, buttonEl, () =>
          playSynthesizedSound('tijolinho'),
        );
        break;

      case 'speech-respira':
        triggerSpeechPhrase('Calma, respira, Alanzoka!', 0.9 * baseP, buttonEl, () =>
          playSynthesizedSound('cremosa'),
        );
        break;

      default:
        buttonEl?.classList.remove('playing');
        break;
    }
  }

  function triggerSpeechPhrase(text, pitch, buttonEl, bgSoundFn) {
    if (bgSoundFn) bgSoundFn();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.pitch = Math.min(2.0, Math.max(0.5, pitch));
      utterance.rate = 1.1;

      const finish = () => {
        buttonEl?.classList.remove('playing');
        updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        buttonEl?.classList.remove('playing');
        updateSoundboardStatus('Pronto para tocar (clique em um som)', false);
      }, 1000);
    }
  }

  if (volSlider && volVal) {
    volSlider.addEventListener('input', (e) => {
      const val = Number.parseFloat(e.target.value);
      volVal.textContent = `${Math.round(val * 100)}%`;
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
      }
    });
  }

  if (pitchSlider && pitchVal) {
    pitchSlider.addEventListener('input', (e) => {
      currentPitch = Number.parseFloat(e.target.value);
      let desc = 'Normal';
      if (currentPitch < 0.8) desc = 'Monstro / Grave';
      else if (currentPitch > 1.3) desc = 'Esquilo / Agudo';
      pitchVal.textContent = `${currentPitch.toFixed(1)}x (${desc})`;
    });
  }

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

  if (btnFxEcho) {
    btnFxEcho.addEventListener('click', () => {
      echoEnabled = !echoEnabled;
      btnFxEcho.setAttribute('aria-pressed', String(echoEnabled));
      if (echoWetGainNode && audioCtx) {
        echoWetGainNode.gain.setValueAtTime(echoEnabled ? 0.55 : 0, audioCtx.currentTime);
      }
      if (echoEnabled) onUnlockAchievement?.('audio_alchemist');
      const msg = echoEnabled ? 'Efeito Eco/Delay ativado! 🎛️' : 'Efeito Eco/Delay desativado.';
      showToast(msg);
      announceA11y(msg);
    });
  }

  if (btnFxBass) {
    btnFxBass.addEventListener('click', () => {
      bassEnabled = !bassEnabled;
      btnFxBass.setAttribute('aria-pressed', String(bassEnabled));
      if (bassFilterNode && audioCtx) {
        bassFilterNode.gain.setValueAtTime(bassEnabled ? 12 : 0, audioCtx.currentTime);
      }
      if (bassEnabled) onUnlockAchievement?.('audio_alchemist');
      const msg = bassEnabled ? 'Bass Boost (Graves Reforçados) ativado! 🔊' : 'Bass Boost desativado.';
      showToast(msg);
      announceA11y(msg);
    });
  }

  if (btnFxTurbo) {
    btnFxTurbo.addEventListener('click', () => {
      onUnlockAchievement?.('audio_alchemist');
      showToast('Combo Modo Metralhadora Turbo disparado! 🔥');
      ['jumpscare', 'metralhadora', 'pedra', 'vitoria'].forEach((sfx, idx) => {
        setTimeout(() => {
          soundsPlayedCount += 1;
          onIncrementStat?.('soundsPlayed');
          playSynthesizedSound(sfx);
        }, idx * 280);
      });
      onUnlockAchievement?.('sound_master');
    });
  }

  if (stopAllBtn) {
    stopAllBtn.addEventListener('click', () => {
      stopAllSounds();
      showToast('Todos os sons foram interrompidos! ⏹');
    });
  }

  soundButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const soundType = btn.getAttribute('data-sound');
      if (!soundType) return;
      soundsPlayedCount += 1;
      onIncrementStat?.('soundsPlayed');
      if (soundsPlayedCount >= 3) {
        onUnlockAchievement?.('sound_master');
      }
      playSynthesizedSound(soundType, btn);
    });
  });

  function startVisualizerLoop() {
    if (!soundCanvas || !soundCanvasCtx || animFrameId) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    function render() {
      animFrameId = requestAnimationFrame(render);
      const width = soundCanvas.width;
      const height = soundCanvas.height;

      soundCanvasCtx.clearRect(0, 0, width, height);
      soundCanvasCtx.fillStyle = '#0f172a';
      soundCanvasCtx.fillRect(0, 0, width, height);

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

          const sliceWidth = width / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;
            if (i === 0) soundCanvasCtx.moveTo(x, y);
            else soundCanvasCtx.lineTo(x, y);
            x += sliceWidth;
          }
          soundCanvasCtx.lineTo(width, height / 2);
          soundCanvasCtx.stroke();
          soundCanvasCtx.shadowBlur = 0;
        } else {
          analyser.getByteFrequencyData(dataArray);
          const barWidth = (width / (bufferLength / 2)) * 1.8;
          let x = 0;
          for (let i = 0; i < bufferLength / 2; i++) {
            const barHeight = (dataArray[i] / 255) * height * 0.9;
            const gradient = soundCanvasCtx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(1, '#9333ea');
            soundCanvasCtx.fillStyle = gradient;
            soundCanvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
            x += barWidth;
          }
        }
      } else {
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

  startVisualizerLoop();

  return { stopAllSounds, playSynthesizedSound };
}
