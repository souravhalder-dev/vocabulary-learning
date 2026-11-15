'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  X, 
  BrainCircuit,
  Check,
  ArrowRight,
  Split,
  Layers,
  HelpCircle,
  Radio
} from 'lucide-react';
import { VocabularyItem, WordRelationItem, AccentType } from '../types';
import { playNativeAudioOrSpeak, stopSpeaking } from '../lib/speech';

interface WordDetailPanelProps {
  vocabulary: VocabularyItem | null;
  onClose?: () => void;
  onToggleLearned?: (id: number, current: boolean) => void;
  onAskAi?: (word: string, context?: string) => void;
  onSelectRelatedWord?: (word: string) => void;
  isAutoSaved?: boolean;
}

export const WordDetailPanel: React.FC<WordDetailPanelProps> = ({
  vocabulary,
  onClose,
  onToggleLearned,
  onAskAi,
  onSelectRelatedWord,
  isAutoSaved = true,
}) => {
  const [selectedSpeed, setSelectedSpeed] = useState<number>(0.85);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeAudioWord, setActiveAudioWord] = useState<string | null>(null);
  const [activeAccent, setActiveAccent] = useState<AccentType>('uk');

  if (!vocabulary) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500">
        <BookOpen className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600 animate-pulse" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tap Any English Word to Explore</p>
        <p className="bengali-text text-xs mt-1 text-slate-400 max-w-xs">
          যেকোনো শব্দ স্পর্শ করলেই ব্রিটিশ (UK) ও আমেরিকান (US) উচ্চারণ, বাংলা অর্থ, সমার্থক ও বিপরীতার্থক শব্দ দেখতে পাবেন।
        </p>
      </div>
    );
  }

  // Active accent pronunciation resolution (defaults to UK British English)
  const currentPron = activeAccent === 'uk'
    ? (vocabulary.pronunciation_uk || {
        ipa: vocabulary.ipa_phonetic || '',
        bengali_pronunciation: vocabulary.bengali_pronunciation,
        audio_url: vocabulary.audio_url,
        source: 'dictionary_verified' as const
      })
    : (vocabulary.pronunciation_us || {
        ipa: vocabulary.ipa_phonetic || '',
        bengali_pronunciation: vocabulary.bengali_pronunciation,
        audio_url: vocabulary.audio_url,
        source: 'dictionary_verified' as const
      });

  const handlePlayAudio = (wordToSpeak: string, rate: number = 0.85) => {
    setSelectedSpeed(rate);
    setIsPlaying(true);
    setActiveAudioWord(wordToSpeak);
    playNativeAudioOrSpeak(wordToSpeak, {
      rate: rate,
      accent: activeAccent,
      audioUrl: currentPron.audio_url,
      onEnd: () => {
        setIsPlaying(false);
        setActiveAudioWord(null);
      },
      onError: () => {
        setIsPlaying(false);
        setActiveAudioWord(null);
      },
    });
  };

  // Parse synonyms & antonyms if available
  let synonyms: WordRelationItem[] = vocabulary.synonyms || [];
  let antonyms: WordRelationItem[] = vocabulary.antonyms || [];

  if (synonyms.length === 0 && vocabulary.synonyms_json) {
    try {
      synonyms = JSON.parse(vocabulary.synonyms_json);
    } catch {
      // ignore
    }
  }

  if (antonyms.length === 0 && vocabulary.antonyms_json) {
    try {
      antonyms = JSON.parse(vocabulary.antonyms_json);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-white p-4 sm:p-5 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 smooth-scroll-container">
      {/* Mobile drag handle for sheet */}
      <div className="lg:hidden mx-auto -mt-2 mb-2 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />

      <div className="space-y-4">
        {/* Header with Close and Auto-saved badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-2xs">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>Saved to Notebook</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Word Title & Part of Speech Badge */}
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="heading-font text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize">
              {vocabulary.word}
            </h2>
            {vocabulary.part_of_speech && (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {vocabulary.part_of_speech}
              </span>
            )}
          </div>
          {currentPron.ipa && (
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
              <span>{currentPron.ipa}</span>
              <span className="text-[10px] uppercase font-sans font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activeAccent.toUpperCase()} IPA
              </span>
            </p>
          )}
        </div>

        {/* Accent Selector (UK British English default vs US American English alternative) */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1.5 flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            <span>উচ্চারণ (Accent)</span>
          </span>
          <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 p-0.5 shadow-2xs border border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveAccent('uk')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeAccent === 'uk'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="British English (UK) - Default Accent"
            >
              <span>🇬🇧 UK</span>
              <span className="text-[9px] opacity-80 font-normal hidden sm:inline">(British)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAccent('us')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeAccent === 'us'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="American English (US) - Alternative Accent"
            >
              <span>🇺🇸 US</span>
              <span className="text-[9px] opacity-80 font-normal hidden sm:inline">(American)</span>
            </button>
          </div>
        </div>

        {/* Primary Bengali Pronunciation Card (বাংলা উচ্চারণ) */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50 p-4 shadow-2xs dark:border-indigo-950/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span>বাংলা উচ্চারণ ({activeAccent.toUpperCase()})</span>
            </span>
            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
              currentPron.source === 'dictionary_verified'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                : currentPron.source === 'ai_verified'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {currentPron.source === 'dictionary_verified' ? 'Dictionary' : currentPron.source === 'ai_verified' ? 'AI Verified' : 'Phonetic'}
            </span>
          </div>
          <p className="bengali-text text-2xl sm:text-3xl font-bold tracking-wide text-indigo-900 dark:text-indigo-200">
            {currentPron.bengali_pronunciation || 'উচ্চারণ লোড হচ্ছে...'}
          </p>
        </div>

        {/* Bengali Meaning Card (বাংলা অর্থ) */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-850/50">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            বাংলা অর্থ (Meaning)
          </div>
          <p className="bengali-text text-lg sm:text-xl font-bold leading-relaxed text-slate-900 dark:text-white">
            {vocabulary.bengali_meaning}
          </p>
        </div>

        {/* Audio Pronunciation Controls with Native Audio & Speed Options */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-850/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{activeAccent.toUpperCase()} Audio ({currentPron.audio_url ? 'Native Speaker' : 'Natural Voice'})</span>
            </span>
            <button
              onClick={() => handlePlayAudio(vocabulary.word, selectedSpeed)}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              <RotateCcw className="h-3 w-3" /> Replay
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'Normal (1.0x)', rate: 1.0 },
              { label: 'Slow (0.75x)', rate: 0.75 },
              { label: 'Very Slow (0.5x)', rate: 0.5 },
            ].map((speed) => (
              <button
                key={speed.rate}
                onClick={() => handlePlayAudio(vocabulary.word, speed.rate)}
                className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  selectedSpeed === speed.rate && isPlaying && activeAudioWord === vocabulary.word
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{speed.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SYNONYMS SECTION (সমার্থক শব্দ) with Bengali Meaning & Pronunciation */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 p-4 shadow-2xs dark:border-emerald-950/60 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 text-[11px]">
                ≈
              </span>
              <span>সমার্থক শব্দ (Synonyms)</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              বাংলা উচ্চারণ ও অর্থসহ
            </span>
          </div>

          {synonyms.length > 0 ? (
            <div className="space-y-2">
              {synonyms.map((syn, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between rounded-xl border border-emerald-100 bg-white/90 p-2.5 shadow-2xs dark:border-emerald-900/40 dark:bg-slate-800/80 transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                        {syn.word}
                      </span>
                      <span className="bengali-text text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {syn.bengali_pronunciation}
                      </span>
                    </div>
                    <p className="bengali-text text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                      বাংলা: {syn.bengali_meaning}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(syn.word, 0.85)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 transition-colors shrink-0"
                    title={`Pronounce ${syn.word}`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-emerald-200/80 p-3 text-center text-xs text-slate-500 dark:border-emerald-900/60">
              <p className="bengali-text">এই শব্দের কোনো সমার্থক শব্দ পাওয়া যায়নি।</p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ANTONYMS SECTION (বিপরীত শব্দ) with Bengali Meaning & Pronunciation */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/70 via-white to-rose-50/30 p-4 shadow-2xs dark:border-rose-950/60 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 text-[11px]">
                ≠
              </span>
              <span>বিপরীত শব্দ (Antonyms)</span>
            </div>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
              বাংলা উচ্চারণ ও অর্থসহ
            </span>
          </div>

          {antonyms.length > 0 ? (
            <div className="space-y-2">
              {antonyms.map((ant, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between rounded-xl border border-rose-100 bg-white/90 p-2.5 shadow-2xs dark:border-rose-900/40 dark:bg-slate-800/80 transition-all hover:border-rose-300 dark:hover:border-rose-700"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                        {ant.word}
                      </span>
                      <span className="bengali-text text-xs font-bold text-rose-700 dark:text-rose-400">
                        {ant.bengali_pronunciation}
                      </span>
                    </div>
                    <p className="bengali-text text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                      বাংলা: {ant.bengali_meaning}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(ant.word, 0.85)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-colors shrink-0"
                    title={`Pronounce ${ant.word}`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-rose-200/80 p-3 text-center text-xs text-slate-500 dark:border-rose-900/60">
              <p className="bengali-text">এই শব্দের কোনো সরাসরি বিপরীত শব্দ পাওয়া যায়নি।</p>
            </div>
          )}
        </div>

        {/* English Definition */}
        {vocabulary.english_definition && (
          <div className="space-y-1 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contextual Definition
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {vocabulary.english_definition}
            </p>
          </div>
        )}

        {/* Example Sentence with Bengali Translation */}
        {vocabulary.example_sentence && (
          <div className="rounded-xl bg-slate-50 p-3.5 text-xs dark:bg-slate-800/60 space-y-2">
            <span className="font-bold text-slate-600 dark:text-slate-400">
              Example in Context:
            </span>
            <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
              "{vocabulary.example_sentence}"
            </p>
            {vocabulary.bengali_example && (
              <p className="bengali-text text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 font-medium">
                বাংলা অনুবাদ: {vocabulary.bengali_example}
              </p>
            )}
          </div>
        )}

        {/* Reading Context */}
        {vocabulary.context_sentence && (
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-slate-400 dark:text-slate-500">
              Original Reading Context:
            </span>
            <p className="rounded-xl border border-slate-200/80 p-2.5 text-slate-600 dark:border-slate-800 dark:text-slate-400 text-[11px] leading-relaxed">
              "...{vocabulary.context_sentence}..."
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6 space-y-2 pb-2">
        {onToggleLearned && (
          <button
            onClick={() => onToggleLearned(vocabulary.id, vocabulary.is_learned)}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow-xs ${
              vocabulary.is_learned
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>{vocabulary.is_learned ? 'Word Mastered (আয়ত্ত করা হয়েছে)' : 'Mark as Learned (আয়ত্ত করুন)'}</span>
          </button>
        )}

        {onAskAi && (
          <button
            onClick={() => onAskAi(vocabulary.word, vocabulary.context_sentence)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 py-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>AI Tutor: বাংলায় বিস্তারিত ব্যাখ্যা</span>
          </button>
        )}
      </div>
    </div>
  );
};
