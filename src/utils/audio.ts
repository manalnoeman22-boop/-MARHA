import { AudioSettings } from '../types';
import { tts } from './tts';
import type { TTSOptions } from './tts';

export { tts };
export type { TTSOptions };

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Clean text from emojis, special symbols, and punctuation marks that shouldn't be read out loud.
 */
export function cleanSpeechText(text: string): string {
  return tts.cleanText(text);
}

/**
 * Speak Arabic text clearly using central TTSManager
 */
export function speakText(text: string, settings?: Partial<AudioSettings>, onEnd?: () => void): void {
  if (settings) {
    tts.updateSettings(settings);
  }
  tts.speak(text, {
    enabled: settings?.enabled,
    rate: settings?.rate,
    volume: settings?.volume,
    onEnd,
  });
}

/**
 * Speak a sequence of Arabic texts with natural pauses
 */
export function speakSequence(phrases: string[], settings?: Partial<AudioSettings>, onComplete?: () => void): void {
  if (settings) {
    tts.updateSettings(settings);
  }
  tts.speakSequence(phrases, {
    enabled: settings?.enabled,
    rate: settings?.rate,
    volume: settings?.volume,
  }, onComplete);
}

/**
 * Cancel any ongoing speech
 */
export function stopSpeech(): void {
  tts.cancel();
}

/**
 * Play cheerful synthesized sound effects using Web Audio API
 */
export function playSuccessChime(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
    
    gain.gain.setValueAtTime(0, now + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.4);
  });
}

export function playErrorChime(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Soft gentle descending chord (encouraging, not harsh!)
  const notes = [440, 392]; // A4 -> G4

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    gain.gain.setValueAtTime(0, now + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.3);
  });
}

export function playStarChime(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1760, now + 0.25);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

export function playPopSound(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

export function playCelebrationFanfare(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const melody = [
    { freq: 523.25, time: 0, dur: 0.15 },
    { freq: 659.25, time: 0.12, dur: 0.15 },
    { freq: 783.99, time: 0.24, dur: 0.2 },
    { freq: 1046.50, time: 0.42, dur: 0.45 },
  ];

  melody.forEach((item) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.freq, now + item.time);

    gain.gain.setValueAtTime(0, now + item.time);
    gain.gain.linearRampToValueAtTime(0.2, now + item.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + item.time);
    osc.stop(now + item.time + item.dur + 0.05);
  });
}
