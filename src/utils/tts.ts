/**
 * Centralized Arabic Text-To-Speech (TTS) Manager
 * Powered by Web Speech API (window.speechSynthesis)
 * Specially tuned for Arabic children learning experiences.
 */

import { AudioSettings } from '../types';
import { naturalizeArabicNumbers } from './arabicNumbers';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  enabled?: boolean;
  onEnd?: () => void;
  priority?: boolean;
  forceSpokenNumbers?: boolean;
}

class TTSManager {
  private static instance: TTSManager;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isVoicesLoaded = false;
  private lastSpokenText: string = '';
  private sequenceTimeouts: number[] = [];
  private isUnlocked = false;
  private onSpeakingChangeCallbacks: Set<(isSpeaking: boolean) => void> = new Set();
  private settings: AudioSettings = {
    enabled: true,
    rate: 0.9, // Child-friendly slightly relaxed pace
    volume: 1.0,
    soundEffects: true,
  };

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }

      // Browser user activation handler to unlock TTS audio playback immediately
      const unlockHandler = () => {
        if (this.isUnlocked) return;
        this.isUnlocked = true;
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch {
          // ignore
        }
        window.removeEventListener('click', unlockHandler);
        window.removeEventListener('touchstart', unlockHandler);
      };
      window.addEventListener('click', unlockHandler, { once: true });
      window.addEventListener('touchstart', unlockHandler, { once: true });
    }
  }

  public static getInstance(): TTSManager {
    if (!TTSManager.instance) {
      TTSManager.instance = new TTSManager();
    }
    return TTSManager.instance;
  }

  /**
   * Set global audio settings
   */
  public updateSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  /**
   * Discover and prioritize best Arabic voice
   */
  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const available = window.speechSynthesis.getVoices();
    if (!available || available.length === 0) return;

    this.voices = available;
    this.isVoicesLoaded = true;

    // Preference:
    // 1. Egyptian Arabic (ar-EG)
    // 2. Saudi Arabic (ar-SA)
    // 3. Any Arabic voice (starts with 'ar' or contains 'Arabic' or 'العربية')
    // 4. Default voice
    const egyptianVoice = available.find(
      (v) => v.lang.toLowerCase() === 'ar-eg' || v.lang.toLowerCase() === 'ar_eg'
    );
    const saudiVoice = available.find(
      (v) => v.lang.toLowerCase() === 'ar-sa' || v.lang.toLowerCase() === 'ar_sa'
    );
    const anyArabicVoice = available.find(
      (v) =>
        v.lang.toLowerCase().startsWith('ar') ||
        v.name.toLowerCase().includes('arabic') ||
        v.name.includes('عربي') ||
        v.name.includes('طارق') ||
        v.name.includes('ماجد') ||
        v.name.includes('ليلى') ||
        v.name.includes('مريم')
    );

    this.selectedVoice = egyptianVoice || saudiVoice || anyArabicVoice || null;
  }

  /**
   * Remove emojis, UI symbols, markdown, and extra whitespace
   */
  public cleanText(text: string): string {
    if (!text) return '';

    return text
      // Extended emoji & pictograph unicode ranges
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ''
      )
      // Unicode Emoji block coverage
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ''
      )
      // Specific decorative symbols often used in educational apps
      .replace(/[⭐⭐️🌟✨🎉💡🚀👋🏻👩🏻🏫🏆🏅🔥❤️💛🎮📚🧠🔤🔢📖🍎🐱🐶🚗✏️⚽🌸🌼🌿🍪🍬🎈🔔]/g, '')
      // Bullet points, arrows, quotes, and markdown
      .replace(/[•«»"''""*#_~`[\]{}()]/g, ' ')
      // Clean duplicate whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Stop any current speech and clear sequence queue
   */
  public cancel(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.sequenceTimeouts.forEach((id) => clearTimeout(id));
    this.sequenceTimeouts = [];
    this.currentUtterance = null;
    this.notifySpeakingChange(false);
  }

  /**
   * Register a listener for speaking state changes
   */
  public onSpeakingChange(cb: (isSpeaking: boolean) => void): () => void {
    this.onSpeakingChangeCallbacks.add(cb);
    return () => this.onSpeakingChangeCallbacks.delete(cb);
  }

  private notifySpeakingChange(isSpeaking: boolean): void {
    this.onSpeakingChangeCallbacks.forEach((cb) => {
      try {
        cb(isSpeaking);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Check if speech is currently playing
   */
  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }

  /**
   * Get the last spoken text (for replay button)
   */
  public getLastSpokenText(): string {
    return this.lastSpokenText;
  }

  /**
   * Replay the last spoken text
   */
  public replayLast(options?: TTSOptions): void {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, options);
    }
  }

  /**
   * Speak a piece of Arabic text
   */
  public speak(text: string, options?: TTSOptions): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    const enabled = options?.enabled ?? this.settings.enabled;
    if (!enabled) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    // Cancel any previous speech immediately
    this.cancel();

    // 1. Clean emojis and symbols
    let speechString = this.cleanText(text);

    // 2. Convert digits and numerals to natural Arabic words
    if (options?.forceSpokenNumbers !== false) {
      speechString = naturalizeArabicNumbers(speechString);
    }

    if (!speechString.trim()) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    this.lastSpokenText = speechString;

    // Refresh voices if not initialized yet
    if (!this.selectedVoice && !this.isVoicesLoaded) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(speechString);
    this.currentUtterance = utterance;

    // Voice setup
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
      utterance.lang = this.selectedVoice.lang;
    } else {
      utterance.lang = 'ar-EG';
    }

    // Child-friendly speech rate (relaxed and calm pace)
    utterance.rate = options?.rate ?? this.settings.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1.12; // Friendly, warm pitch
    utterance.volume = options?.volume ?? this.settings.volume ?? 1.0;

    this.notifySpeakingChange(true);

    utterance.onstart = () => {
      this.notifySpeakingChange(true);
    };

    utterance.onend = () => {
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
        this.notifySpeakingChange(false);
      }
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS utterance error:', e);
      }
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
        this.notifySpeakingChange(false);
      }
      if (options?.onEnd) options.onEnd();
    };

    try {
      // Resume if paused (browser safety)
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('speechSynthesis speak error:', err);
      this.notifySpeakingChange(false);
      if (options?.onEnd) options.onEnd();
    }
  }

  /**
   * Speak a sequence of phrases with natural pauses between them
   */
  public speakSequence(
    phrases: string[],
    options?: TTSOptions,
    onComplete?: () => void
  ): void {
    this.cancel();

    const validPhrases = phrases
      .map((p) => this.cleanText(p))
      .filter((p) => p.length > 0);

    if (validPhrases.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex >= validPhrases.length) {
        if (onComplete) onComplete();
        return;
      }

      const phrase = validPhrases[currentIndex];
      currentIndex++;

      this.speak(phrase, {
        ...options,
        onEnd: () => {
          // Pause 300ms before next item in sequence
          const t = window.setTimeout(speakNext, 300);
          this.sequenceTimeouts.push(t);
        },
      });
    };

    speakNext();
  }
}

export const tts = TTSManager.getInstance();
