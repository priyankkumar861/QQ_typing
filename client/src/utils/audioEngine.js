// Real Exam Simulation Audio Engine for SSC & Railway Typing Platform
// Plays authentic recorded typing exam hall audio (100+ candidates typing simultaneously in exam lab)
// and real mechanical keypress click audio.

let hallAudio1 = null;
let hallAudio2 = null;
let isHallPlaying = false;
let currentHallVolume = 0.7;

let audioCtx = null;
let keyAudioBuffers = [];
let isBuffersLoading = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Preload key click audio buffers for 0ms latency tactile feedback
function preloadKeyBuffers() {
  if (isBuffersLoading || keyAudioBuffers.length > 0 || typeof window === 'undefined') return;
  isBuffersLoading = true;
  const ctx = getAudioContext();
  if (!ctx) return;

  const keyFiles = ['/sounds/key_click_1.mp3', '/sounds/key_click_2.mp3', '/sounds/key_click_3.mp3'];
  keyFiles.forEach((file) => {
    fetch(file)
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        keyAudioBuffers.push(decoded);
      })
      .catch(() => {});
  });
}

// Initialize Hall Audio Elements
function initHallAudio() {
  if (typeof window === 'undefined') return;
  if (!hallAudio1) {
    hallAudio1 = new Audio('/sounds/hall_typing_1.mp3');
    hallAudio1.loop = true;
    hallAudio1.preload = 'auto';
  }
  if (!hallAudio2) {
    hallAudio2 = new Audio('/sounds/hall_typing_2.mp3');
    hallAudio2.loop = true;
    hallAudio2.preload = 'auto';
  }
}

/**
 * 1. Play Real Keyboard Click Sound on Keystroke
 */
export function playKeyboardClick(volume = 0.6) {
  try {
    const ctx = getAudioContext();
    preloadKeyBuffers();

    if (ctx && keyAudioBuffers.length > 0) {
      const randomBuf = keyAudioBuffers[Math.floor(Math.random() * keyAudioBuffers.length)];
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = randomBuf;
      // Slight pitch variation (0.94 - 1.06) for organic mechanical switch feel
      source.playbackRate.value = 0.94 + Math.random() * 0.12;

      const safeVol = Math.max(0.1, Math.min(volume, 1));
      gainNode.gain.setValueAtTime(safeVol * 0.9, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      return;
    }

    // Fallback crisp mechanical click synthesis if buffer is still loading
    if (ctx) {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    }
  } catch (e) {}
}

/**
 * 2. Play REAL Authentic Examination Hall Typing Storm
 * 100+ candidates typing simultaneously with real clatter
 */
export function startHallAmbientNoise(volume = 0.7) {
  try {
    initHallAudio();
    currentHallVolume = Math.max(0.05, Math.min(volume, 1));

    if (hallAudio1 && hallAudio2) {
      hallAudio1.volume = currentHallVolume;
      hallAudio2.volume = currentHallVolume * 0.85;

      const p1 = hallAudio1.play();
      if (p1 && p1.catch) {
        p1.catch((err) => console.log('Autoplay audio wait:', err.message));
      }

      // Stagger second audio by 3.5 seconds for continuous overlapping crowd clatter
      setTimeout(() => {
        if (isHallPlaying && hallAudio2) {
          hallAudio2.currentTime = 3.5;
          const p2 = hallAudio2.play();
          if (p2 && p2.catch) p2.catch(() => {});
        }
      }, 500);

      isHallPlaying = true;
    }
  } catch (err) {
    console.warn('Could not play Hall audio:', err);
  }
}

export function stopHallAmbientNoise() {
  isHallPlaying = false;
  try {
    if (hallAudio1) {
      hallAudio1.pause();
      hallAudio1.currentTime = 0;
    }
    if (hallAudio2) {
      hallAudio2.pause();
      hallAudio2.currentTime = 0;
    }
  } catch (e) {}
}

export function setHallNoiseVolume(volume) {
  currentHallVolume = Math.max(0.05, Math.min(volume, 1));
  try {
    if (hallAudio1) {
      hallAudio1.volume = currentHallVolume;
    }
    if (hallAudio2) {
      hallAudio2.volume = currentHallVolume * 0.85;
    }
  } catch (e) {}
}
