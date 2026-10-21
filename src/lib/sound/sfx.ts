"use client";
/**
 * Ritual sound effects, synthesised with the Web Audio API (no audio files to load or license).
 * Sounds only play after a user gesture, and the preference is remembered per browser.
 */

const STORAGE_KEY = "ie-sound";
const listeners = new Set<(on: boolean) => void>();

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let breathNodes: { stop: () => void } | null = null;

export function soundEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Storage unavailable (private mode): the choice lasts for this page only.
  }
  if (!on) stopBreath();
  listeners.forEach((l) => l(on));
}

export function onSoundChange(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined" || !soundEnabled()) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out: master! };
}

function noise(c: AudioContext) {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  return src;
}

function tone(c: AudioContext, out: AudioNode, freq: number, start: number, dur: number, peak: number, type: OscillatorType = "sine") {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g).connect(out);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

/** Soft pluck for small confirmations. */
export function playTap() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  tone(a.ctx, a.out, 660, t, 0.18, 0.12, "triangle");
  tone(a.ctx, a.out, 990, t + 0.03, 0.22, 0.05);
}

/** A riffle of card edges: short band-passed noise bursts. */
export function playShuffle(durationMs = 2000) {
  const a = audio();
  if (!a) return;
  const t0 = a.ctx.currentTime;
  const riffles = Math.round(durationMs / 90);
  for (let i = 0; i < riffles; i++) {
    const t = t0 + i * 0.09 + Math.random() * 0.03;
    const src = noise(a.ctx);
    const bp = a.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2200 + Math.random() * 1800;
    bp.Q.value = 1.4;
    const g = a.ctx.createGain();
    // Louder in the middle of each riffle pass, like cards slapping together.
    const pass = Math.sin(((i % 8) / 8) * Math.PI);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05 + 0.18 * pass, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(bp).connect(g).connect(a.out);
    src.start(t, Math.random() * 0.5, 0.08);
  }
}

/** Choosing a card: a woody knock. */
export function playPick() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  const osc = a.ctx.createOscillator();
  const g = a.ctx.createGain();
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(g).connect(a.out);
  osc.start(t);
  osc.stop(t + 0.2);
}

/** Turning a card over: an upward air swoosh. */
export function playFlip() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  const src = noise(a.ctx);
  const bp = a.ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.9;
  bp.frequency.setValueAtTime(500, t);
  bp.frequency.exponentialRampToValueAtTime(4200, t + 0.45);
  const g = a.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.28, t + 0.18);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  src.connect(bp).connect(g).connect(a.out);
  src.start(t, 0, 0.6);
}

/** The reveal: a shimmering arpeggio that rings out. */
export function playReveal() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + 0.05;
  // A major-ninth shimmer; slight detune gives a bell-like chorus.
  [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => {
    tone(a.ctx, a.out, f, t + i * 0.07, 2.6, 0.09);
    tone(a.ctx, a.out, f * 1.003, t + i * 0.07 + 0.01, 2.2, 0.04);
  });
  tone(a.ctx, a.out, 130.81, t, 2.8, 0.12);
}

/** Pad that swells and softens with the breathing orb (same 9 s cycle). */
export function startBreath() {
  const a = audio();
  if (!a || breathNodes) return;
  const { ctx: c, out } = a;
  const g = c.createGain();
  g.gain.value = 0.0001;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 700;
  const oscs = [196, 293.66, 392.5].map((f) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.connect(lp);
    o.start();
    return o;
  });
  lp.connect(g).connect(out);
  let t = c.currentTime;
  // Schedule ten breaths ahead (inhale 4 s, hold, exhale ~4.5 s).
  for (let i = 0; i < 10; i++) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 4);
    g.gain.setValueAtTime(0.07, t + 4.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 9);
    t += 9;
  }
  breathNodes = {
    stop: () => {
      const now = c.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(0.0001, now, 0.3);
      oscs.forEach((o) => o.stop(now + 1.5));
    },
  };
}

export function stopBreath() {
  breathNodes?.stop();
  breathNodes = null;
}

/** Light haptic feedback where supported (mostly Android). */
export function buzz(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator && soundEnabled()) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Some browsers throw when vibration isn't allowed; ignore.
    }
  }
}
