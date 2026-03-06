// Web Audio API sound engine — lazy init after first user interaction
let ctx = null;
let sfxGain = null;
let musicGain = null;
let musicOsc = null;
let musicPlaying = false;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.7;
    sfxGain.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(ctx.destination);
  }
  return ctx;
}

function playTone(freq, type, duration, volMul = 1, dest = null) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(volMul, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(dest || sfxGain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function playSeq(notes, type = 'square') {
  const c = getCtx();
  notes.forEach(([freq, t, dur]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + t);
    gain.gain.setValueAtTime(0.5, c.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + dur);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(c.currentTime + t);
    osc.stop(c.currentTime + t + dur);
  });
}

export const sfx = {
  click() {
    playTone(440, 'square', 0.06, 0.4);
  },
  navHover() {
    playTone(330, 'square', 0.04, 0.2);
  },
  open() {
    playSeq([[330, 0, 0.07], [440, 0.07, 0.07], [550, 0.14, 0.1]]);
  },
  close() {
    playSeq([[550, 0, 0.07], [440, 0.07, 0.07], [330, 0.14, 0.1]]);
  },
  toggle() {
    playSeq([[440, 0, 0.05], [660, 0.06, 0.08]]);
  },
  modeSwitch() {
    playSeq([[220, 0, 0.05], [330, 0.06, 0.05], [440, 0.12, 0.08]]);
  },
  diceRoll() {
    // rapid random tones
    const c = getCtx();
    for (let i = 0; i < 8; i++) {
      const freq = 200 + Math.random() * 400;
      const t = i * 0.04;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, c.currentTime + t);
      gain.gain.setValueAtTime(0.3, c.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.04);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(c.currentTime + t);
      osc.stop(c.currentTime + t + 0.04);
    }
  },
  nat20() {
    playSeq([
      [523, 0,    0.08],
      [659, 0.08, 0.08],
      [784, 0.16, 0.08],
      [1047,0.24, 0.18],
    ], 'square');
  },
  konami() {
    playSeq([
      [262, 0,    0.07],
      [330, 0.08, 0.07],
      [392, 0.16, 0.07],
      [523, 0.24, 0.07],
      [659, 0.32, 0.07],
      [784, 0.40, 0.07],
      [1047,0.48, 0.15],
      [1047,0.65, 0.15],
    ], 'square');
  },
};

// C pentatonic arpeggio melody loop
const MELODY = [
  [262, 0.12], [330, 0.12], [392, 0.12], [523, 0.12],
  [659, 0.12], [523, 0.12], [392, 0.12], [330, 0.12],
  [262, 0.12], [262, 0.12], [330, 0.18], [392, 0.18],
  [523, 0.24], [392, 0.12], [330, 0.12], [262, 0.24],
];
const MELODY_LEN = MELODY.reduce((s, [, d]) => s + d, 0);

let musicLoopTimer = null;

function scheduleLoop() {
  if (!musicPlaying) return;
  const c = getCtx();
  let t = c.currentTime + 0.05;
  MELODY.forEach(([freq, dur]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.85);
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(t);
    osc.stop(t + dur);
    t += dur;
  });
  musicLoopTimer = setTimeout(scheduleLoop, (MELODY_LEN + 0.05) * 1000);
}

export function startMusic() {
  if (musicPlaying) return;
  musicPlaying = true;
  scheduleLoop();
}

export function stopMusic() {
  musicPlaying = false;
  clearTimeout(musicLoopTimer);
}

export function setSfxVolume(v) {
  getCtx();
  sfxGain.gain.value = v;
}

export function setMusicVolume(v) {
  getCtx();
  musicGain.gain.value = v;
  if (v > 0 && !musicPlaying) startMusic();
  if (v === 0) stopMusic();
}
