'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  X, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { VocabularyItem } from '../types';
import { speakEnglishText } from '../lib/speech';
import confetti from 'canvas-confetti';

interface FlashcardReviewModalProps {
  vocabularies: VocabularyItem[];
  onClose: () => void;
  onUpdateVocabulary: (id: number, payload: Partial<VocabularyItem>) => Promise<void>;
}

export const FlashcardReviewModal: React.FC<FlashcardReviewModalProps> = ({
  vocabularies,
  onClose,
  onUpdateVocabulary,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const activeCard = vocabularies[currentIndex];

  const handleNextCard = async (rating: 'hard' | 'good' | 'easy') => {
    if (!activeCard) return;

    let newBox = activeCard.leitner_box || 1;
    let isLearned = activeCard.is_learned;

    if (rating === 'easy') {
      newBox = Math.min(5, newBox + 2);
      isLearned = true;
    } else if (rating === 'good') {
      newBox = Math.min(5, newBox + 1);
    } else {
      newBox = 1;
    }

    await onUpdateVocabulary(activeCard.id, {
      leitner_box: newBox,
      is_learned: isLearned,
      review_count: (activeCard.review_count || 0) + 1,
    });

    if (currentIndex + 1 < vocabularies.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePlayAudio = (rate: number = 0.85) => {
    if (!activeCard) return;
    speakEnglishText(activeCard.word, { rate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Spaced Repetition Review (স্মৃতিকোষ অনুশীলন)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {completed ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              অভিনন্দন! আজকের ফ্ল্যাশকার্ড সম্পন্ন হয়েছে!
            </h3>
            <p className="bengali-text text-sm text-slate-500">
              আপনি সফলভাবে {vocabularies.length} টি শব্দ অনুশীলন করেছেন।
            </p>
            <button
              onClick={onClose}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-md transition-colors"
            >
              Back to Notebook
            </button>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Progress counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Card {currentIndex + 1} of {vocabularies.length}</span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Box {activeCard?.leitner_box || 1} / 5
              </span>
            </div>

            {/* Flashcard container with flip */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[260px] cursor-pointer rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-b from-slate-50 to-indigo-50/30 p-8 text-center flex flex-col items-center justify-center transition-all hover:border-indigo-400 dark:border-indigo-900/60 dark:from-slate-800/40 dark:to-indigo-950/20 select-none"
            >
              {!isFlipped ? (
                /* Card Front: English word & Audio */
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    English Word
                  </span>
                  <h2 className="heading-font text-4xl font-extrabold capitalize text-slate-900 dark:text-white">
                    {activeCard?.word}
                  </h2>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(0.85);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-indigo-600 shadow-xs hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-400"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Listen Pronunciation</span>
                    </button>
                  </div>
                  <p className="bengali-text text-xs text-slate-400 pt-4">
                    অর্থ ও বাংলা উচ্চারণ দেখতে ক্লিক করুন
                  </p>
                </div>
              ) : (
                /* Card Back: Bengali Pronunciation & Meaning */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      বাংলা উচ্চারণ
                    </span>
                    <p className="bengali-text text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                      {activeCard?.bengali_pronunciation}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400">
                      বাংলা অর্থ
                    </span>
                    <p className="bengali-text text-2xl font-extrabold text-slate-900 dark:text-white">
                      {activeCard?.bengali_meaning}
                    </p>
                  </div>

                  {activeCard?.example_sentence && (
                    <p className="text-xs italic text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                      "{activeCard.example_sentence}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isFlipped ? (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleNextCard('hard')}
                  className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
                >
                  Again (Hard)
                </button>
                <button
                  onClick={() => handleNextCard('good')}
                  className="rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400"
                >
                  Good (+1)
                </button>
                <button
                  onClick={() => handleNextCard('easy')}
                  className="rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-xs"
                >
                  Easy (Learned)
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 shadow-md transition-colors"
              >
                Reveal Answer (উত্তর দেখুন)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
