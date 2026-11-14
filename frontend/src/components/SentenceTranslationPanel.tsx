'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  Languages, 
  Clipboard, 
  ClipboardPaste, 
  X, 
  Sparkles, 
  Send,
  Loader2,
  Check
} from 'lucide-react';
import { TranslationItem } from '../types';
import { translateText } from '../lib/api';
import { speakEnglishText } from '../lib/speech';

interface SentenceTranslationPanelProps {
  initialText?: string;
  onClose?: () => void;
}

export const SentenceTranslationPanel: React.FC<SentenceTranslationPanelProps> = ({
  initialText = '',
  onClose,
}) => {
  const [inputText, setInputText] = useState<string>(initialText);
  const [translation, setTranslation] = useState<TranslationItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);

  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate || inputText).trim();
    if (!text) return;

    setLoading(true);
    try {
      const res = await translateText(text);
      setTranslation(res);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputText(text.trim());
          handleTranslate(text.trim());
        }
      }
    } catch (err) {
      console.warn('Clipboard read permission denied:', err);
    }
  };

  const handlePlayAudio = (rate: number) => {
    if (!translation && !inputText) return;
    const textToSpeak = translation ? translation.source_text : inputText;
    setPlaybackSpeed(rate);
    speakEnglishText(textToSpeak, { rate });
  };

  const handleCopyBengali = () => {
    if (!translation) return;
    navigator.clipboard.writeText(translation.bengali_translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Languages className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Intelligent Sentence Translation & Pronunciation
            </h3>
            <p className="bengali-text text-xs text-slate-500">
              ইংরেজি বাক্য পেস্ট বা কপি করুন — বাংলা অনুবাদ ও বাংলা লিপিতে উচ্চারণ দেখুন।
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Input Textarea & Paste Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>English Sentence</span>
          <button
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            <span>Paste from Clipboard</span>
          </button>
        </div>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or copy an English sentence (e.g., 'I am trying to improve my English reading skills.')..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
          />
          <button
            onClick={() => handleTranslate()}
            disabled={loading || !inputText.trim()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Translate</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {translation && (
        <div className="space-y-4 pt-2">
          {/* Bengali Translation (বাংলা অনুবাদ) */}
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-slate-50/50 p-4 dark:border-indigo-950/70 dark:from-indigo-950/30 dark:to-slate-900">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
              <span>বাংলা অনুবাদ (Bengali Translation)</span>
              <button
                onClick={handleCopyBengali}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Clipboard className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="bengali-text text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {translation.bengali_translation}
            </p>
          </div>

          {/* Bengali Pronunciation of the English sentence (বাংলা লিপিতে ইংরেজি উচ্চারণ) */}
          <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-950/60 dark:bg-violet-950/20">
            <div className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1">
              বাংলা উচ্চারণ (Sentence Pronunciation in Bengali Script)
            </div>
            <p className="bengali-text text-base font-semibold text-violet-950 dark:text-violet-200 leading-relaxed">
              {translation.bengali_pronunciation}
            </p>
          </div>

          {/* Audio Controls */}
          <div className="flex flex-wrap items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40 gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Clear Audio Playback:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAudio(1.0)}
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
              >
                <Volume2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Normal 1.0x</span>
              </button>
              <button
                onClick={() => handlePlayAudio(0.75)}
                className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300"
              >
                <Volume2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Slow 0.75x</span>
              </button>
              <button
                onClick={() => handlePlayAudio(0.5)}
                className="flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100 dark:bg-violet-950/70 dark:text-violet-300"
              >
                <Volume2 className="h-3.5 w-3.5 text-violet-600" />
                <span>0.5x</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
