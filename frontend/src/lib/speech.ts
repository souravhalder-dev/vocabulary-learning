/**
 * High-performance audio player & speech synthesis utility.
 * Supports authentic native-speaker MP3 dictionary recordings and native browser Web Speech API.
 * Supports distinct British English (UK, en-GB) and American English (US, en-US) accents.
 */

export interface SpeechOptions {
  rate?: number; // 1.0 (normal), 0.75 (slow), 0.5 (very slow)
  pitch?: number;
  lang?: string;
  accent?: 'uk' | 'us';
  audioUrl?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined') {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export function playNativeAudioOrSpeak(text: string, options: SpeechOptions = {}) {
  stopSpeaking();

  const accent = options.accent || 'uk';
  const targetLang = options.lang || (accent === 'uk' ? 'en-GB' : 'en-US');
  const speed = options.rate ?? 0.85;

  // 1. If authentic recorded native-speaker audio URL is provided from dictionary, play it!
  if (options.audioUrl && typeof window !== 'undefined') {
    try {
      const audio = new Audio(options.audioUrl);
      audio.playbackRate = speed;
      audio.onplay = () => options.onStart?.();
      audio.onended = () => {
        currentAudio = null;
        options.onEnd?.();
      };
      audio.onerror = () => {
        currentAudio = null;
        // Fall back to Web Speech Synthesis if network audio fails
        speakEnglishText(text, { ...options, audioUrl: undefined, lang: targetLang });
      };
      currentAudio = audio;
      audio.play().catch(() => {
        speakEnglishText(text, { ...options, audioUrl: undefined, lang: targetLang });
      });
      return;
    } catch {
      // Fall through to Web Speech
    }
  }

  // 2. Browser Web Speech API with accent-targeted voice
  speakEnglishText(text, { ...options, lang: targetLang });
}

export function speakEnglishText(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    return;
  }

  stopSpeaking();

  const accent = options.accent || 'uk';
  const targetLang = options.lang || (accent === 'uk' ? 'en-GB' : 'en-US');

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  utterance.rate = options.rate ?? 0.85;
  utterance.pitch = options.pitch ?? 1.0;

  // Attempt to select accent-matching English voice
  const voices = window.speechSynthesis.getVoices();
  const accentPrefix = accent === 'uk' ? 'en-GB' : 'en-US';

  const exactVoice = voices.find(
    (v) => (v.lang === accentPrefix || v.lang.startsWith(accentPrefix)) &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online') || v.name.includes('George') || v.name.includes('Hazel') || v.name.includes('Samantha') || v.name.includes('David'))
  ) || voices.find((v) => v.lang.startsWith(accentPrefix))
    || voices.find((v) => v.lang.startsWith('en'));

  if (exactVoice) {
    utterance.voice = exactVoice;
  }

  if (options.onStart) utterance.onstart = options.onStart;
  utterance.onend = () => {
    currentUtterance = null;
    options.onEnd?.();
  };
  utterance.onerror = (err) => {
    currentUtterance = null;
    options.onError?.(err);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}
