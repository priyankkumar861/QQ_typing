// Exam Simulation Audio Engine for SSC & Railway Typing Platform
// Generates authentic mechanical keyboard clicks and realistic TCS iON Exam Hall typing crowd ambient noise

let audioCtx = null;
let hallGainNode = null;
let hallInterval = null;
let isHallPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
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

/**
 * 1. Play Authentic Mechanical Keyboard Click
 * Dual-layer synthesis: Sharp mechanical switch snap + bottom-out clack
 */
export function playKeyboardClick(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(volume, 1)) * 0.4, now);
    masterGain.connect(ctx.destination);

    // Layer A: Crisp mechanical click transient (High frequency snap)
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'triangle';
    // Randomize pitch slightly for natural feel (380Hz - 480Hz)
    const baseFreq = 420 + (Math.random() * 80 - 40);
    snapOsc.frequency.setValueAtTime(baseFreq * 2.2, now);
    snapOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.035);

    snapGain.gain.setValueAtTime(0.8, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    snapOsc.connect(snapGain);
    snapGain.connect(masterGain);

    snapOsc.start(now);
    snapOsc.stop(now + 0.04);

    // Layer B: Bottom-out thud (Body resonance of keycap hitting plate)
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(180 + (Math.random() * 30), now);
    thudOsc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

    thudGain.gain.setValueAtTime(0.9, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    thudOsc.connect(thudGain);
    thudGain.connect(masterGain);

    thudOsc.start(now);
    thudOsc.stop(now + 0.055);

    // Layer C: Subtle plastic friction noise burst (White noise puff)
    const bufferSize = ctx.sampleRate * 0.015; // 15ms buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 1.2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.015);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
  } catch (err) {
    // Audio contexts can be blocked until first user interaction
  }
}

/**
 * 2. Exam Hall Ambient Typing Clatter Simulation
 * Recreates the authentic atmosphere of TCS iON / SSC Examination Lab
 * where 100+ candidates type together with room reverberation and chaotic clatter
 */
export function startHallAmbientNoise(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isHallPlaying) {
      if (hallGainNode) {
        hallGainNode.gain.setTargetAtTime(Math.max(0.01, Math.min(volume, 1)) * 0.35, ctx.currentTime, 0.1);
      }
      return;
    }

    isHallPlaying = true;

    // Master Hall Gain
    hallGainNode = ctx.createGain();
    hallGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    hallGainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, Math.min(volume, 1)) * 0.35, ctx.currentTime + 0.5);
    hallGainNode.connect(ctx.destination);

    // Sub-layer 1: Room AC / Ambient Low Hum
    const humOsc = ctx.createOscillator();
    const humGain = ctx.createGain();
    humOsc.type = 'sine';
    humOsc.frequency.setValueAtTime(80, ctx.currentTime);
    humGain.gain.setValueAtTime(0.04, ctx.currentTime);
    humOsc.connect(humGain);
    humGain.connect(hallGainNode);
    humOsc.start();

    // Sub-layer 2: Periodic multi-typist clatter burst
    // Simulates 15-25 distant candidates typing in ripples
    const playDistantKeystroke = () => {
      if (!isHallPlaying || !hallGainNode) return;
      try {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
        // Distant keystroke frequencies with room muffling (250Hz - 900Hz)
        osc.frequency.setValueAtTime(300 + Math.random() * 550, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.03);

        const clickVol = 0.05 + Math.random() * 0.12;
        g.gain.setValueAtTime(clickVol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.025 + Math.random() * 0.015);

        if (panner) {
          // Pan randomly across stereo field (-0.9 left to +0.9 right)
          panner.pan.setValueAtTime((Math.random() * 1.8) - 0.9, t);
          osc.connect(g);
          g.connect(panner);
          panner.connect(hallGainNode);
        } else {
          osc.connect(g);
          g.connect(hallGainNode);
        }

        osc.start(t);
        osc.stop(t + 0.045);
      } catch (e) {}
    };

    // Schedule chaotic typing bursts mimicking a 100-person hall
    const triggerHallBursts = () => {
      if (!isHallPlaying) return;
      // Burst between 3 to 7 keystrokes in quick succession
      const count = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        setTimeout(playDistantKeystroke, Math.random() * 80);
      }
      // Next burst interval (dense exam hall rhythm)
      const nextDelay = 35 + Math.random() * 65;
      hallInterval = setTimeout(triggerHallBursts, nextDelay);
    };

    triggerHallBursts();
  } catch (err) {
    console.warn('Could not start Hall Ambient sound:', err);
  }
}

export function stopHallAmbientNoise() {
  isHallPlaying = false;
  if (hallInterval) {
    clearTimeout(hallInterval);
    hallInterval = null;
  }
  if (hallGainNode && audioCtx) {
    try {
      hallGainNode.gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.15);
      setTimeout(() => {
        if (!isHallPlaying && hallGainNode) {
          try {
            hallGainNode.disconnect();
          } catch (e) {}
          hallGainNode = null;
        }
      }, 200);
    } catch (e) {
      hallGainNode = null;
    }
  }
}

export function setHallNoiseVolume(volume) {
  if (hallGainNode && audioCtx && isHallPlaying) {
    try {
      hallGainNode.gain.setTargetAtTime(Math.max(0.01, Math.min(volume, 1)) * 0.35, audioCtx.currentTime, 0.1);
    } catch (e) {}
  }
}
