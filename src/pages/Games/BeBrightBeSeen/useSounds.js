import { useRef, useCallback, useEffect } from "react";

// ── Web Audio helpers ──

let _ctx = null;
function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function footstep() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const t = now;

  // Quick filtered noise for a soft "thud"
  const dur = 0.06;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(80, t);
  osc.frequency.exponentialRampToValueAtTime(30, t + dur);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, t);
  filter.frequency.exponentialRampToValueAtTime(60, t + dur);

  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + dur);
}

function applauseBurst() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Layer multiple noise bursts to simulate claps
  for (let i = 0; i < 12; i++) {
    const t = now + i * 0.08 + Math.random() * 0.04;
    const dur = 0.15 + Math.random() * 0.1;
    const vol = (0.06 + Math.random() * 0.08) * (1 - i / 14);

    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let s = 0; s < bufferSize; s++) {
      const env = 1 - s / bufferSize;
      data[s] = (Math.random() * 2 - 1) * env * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1000 + Math.random() * 2000, t);
    bandpass.Q.setValueAtTime(0.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur);
  }
}

function introJingle() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Cheerful ascending notes: C4 E4 G4 C5
  const notes = [
    { freq: 523, at: 0, dur: 0.18 },
    { freq: 659, at: 0.16, dur: 0.18 },
    { freq: 784, at: 0.32, dur: 0.18 },
    { freq: 1047, at: 0.48, dur: 0.45 },
  ];

  notes.forEach(({ freq, at, dur }) => {
    const t = now + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.03);
    gain.gain.setValueAtTime(0.1, t + dur * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  });
}

function correctChime() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  [523, 659, 784].forEach((freq, i) => {
    const t = now + i * 0.1;
    const dur = 0.25;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  });
}

function wrongBuzz() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(100, now + 0.2);
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

// ── Hook ──

export function useSounds() {
  const footstepTimerRef = useRef(0);
  const walkingRef = useRef(false);
  const animRef = useRef(null);

  const playFootstep = useCallback(() => {
    footstep();
  }, []);

  const startFootsteps = useCallback(() => {
    walkingRef.current = true;
    footstepTimerRef.current = 0;

    const tick = (ts) => {
      if (!walkingRef.current) return;

      if (ts - footstepTimerRef.current >= 320) {
        footstepTimerRef.current = ts;
        footstep();
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const stopFootsteps = useCallback(() => {
    walkingRef.current = false;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  const playApplause = useCallback(() => {
    applauseBurst();
  }, []);

  const playIntro = useCallback(() => {
    introJingle();
  }, []);

  const playCorrect = useCallback(() => {
    correctChime();
  }, []);

  const playWrong = useCallback(() => {
    wrongBuzz();
  }, []);

  useEffect(() => {
    return () => {
      walkingRef.current = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return {
    startFootsteps,
    stopFootsteps,
    playApplause,
    playIntro,
    playCorrect,
    playWrong,
  };
}
