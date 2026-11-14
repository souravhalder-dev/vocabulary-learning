'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Volume2,
  Check,
  Languages,
  BookOpen,
  ArrowUp,
  Percent
} from 'lucide-react';
import { DocumentItem, VocabularyItem } from '../types';
import { lookupAndAutoSaveWord, updateReadingProgress } from '../lib/api';
import { speakEnglishText } from '../lib/speech';

interface InteractiveReaderProps {
  document: DocumentItem;
  onWordSelected: (vocab: VocabularyItem) => void;
  onSentenceSelected?: (sentence: string) => void;
  savedWordsSet?: Set<string>;
  learnedWordsSet?: Set<string>;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  document,
  onWordSelected,
  onSentenceSelected,
  savedWordsSet = new Set(),
  learnedWordsSet = new Set(),
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [currentPage, setCurrentPage] = useState<number>(document.current_page || 1);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [copiedSentence, setCopiedSentence] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Parse multi-page PDF json if available, else paragraphs
  const pagesData = useMemo(() => {
    if (document.pages_json) {
      try {
        const parsed = JSON.parse(document.pages_json);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    const rawContent = document.content || '';
    const paragraphs = rawContent ? rawContent.split('\n\n').filter((p) => p.trim()) : [];
    return [{ page_number: 1, paragraphs }];
  }, [document]);

  const totalPages = pagesData.length;
  const currentParagraphs: string[] = pagesData[currentPage - 1]?.paragraphs || [document.content || ''];

  // Handle smooth scroll progress calculation
  const handleScroll = () => {
    if (!contentScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentScrollRef.current;
    if (scrollHeight <= clientHeight) {
      setScrollProgress(100);
      return;
    }
    const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    setScrollProgress(progress);
    setShowScrollTop(scrollTop > 400);

    // Save reading progress throttled
    if (progress > (document.reading_progress || 0)) {
      updateReadingProgress(document.id, currentPage, progress).catch(console.error);
    }
  };

  const scrollToTop = () => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle word click
  const handleWordClick = async (rawWord: string, surroundingSentence: string) => {
    const clean = rawWord.replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
    if (!clean) return;

    setActiveWord(clean);

    // Instant audio pronunciation
    speakEnglishText(clean, { rate: 0.85 });

    try {
      const vocab = await lookupAndAutoSaveWord(
        clean,
        surroundingSentence,
        document.id,
        document.title
      );
      onWordSelected(vocab);
    } catch (err) {
      console.error('Word lookup failed:', err);
    }
  };

  // Helper to split a paragraph into sentences and tokenized interactive words
  const renderParagraphContent = (paragraphText: string) => {
    const sentenceRegex = /([^.!?]+[.!?]+|\s*[^.!?]+$)/g;
    const sentences = paragraphText.match(sentenceRegex) || [paragraphText];

    return sentences.map((sentence, sIdx) => {
      const tokens = sentence.split(/(\s+|[.,!?;:\"'()\[\]{}—–]+)/g);

      return (
        <span 
          key={sIdx} 
          className="group/sentence relative rounded px-1 transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
        >
          {tokens.map((token, tIdx) => {
            const isWord = /^[a-zA-Z]+$/.test(token.trim());
            if (!isWord) {
              return <span key={tIdx} className="text-slate-600 dark:text-slate-400">{token}</span>;
            }

            const lower = token.toLowerCase();
            const isSaved = savedWordsSet.has(lower);
            const isLearned = learnedWordsSet.has(lower);
            const isActive = activeWord === lower;

            return (
              <span
                key={tIdx}
                onClick={() => handleWordClick(token, sentence.trim())}
                className={`reader-word ${isActive ? 'active-word' : ''} ${
                  isLearned 
                    ? 'learned-word text-emerald-800 dark:text-emerald-300 font-semibold' 
                    : isSaved 
                    ? 'saved-word text-indigo-700 dark:text-indigo-300 font-medium' 
                    : 'text-slate-800 dark:text-slate-100'
                }`}
                title="Tap for Bengali pronunciation, meaning, synonyms & antonyms"
              >
                {token}
              </span>
            );
          })}

          {/* Inline Sentence Translation Button */}
          {onSentenceSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSentenceSelected(sentence.trim());
                setCopiedSentence(sentence.trim());
                setTimeout(() => setCopiedSentence(null), 2000);
              }}
              className="inline-flex items-center ml-1 opacity-0 group-hover/sentence:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/60 dark:text-indigo-400 dark:hover:bg-indigo-950/80 align-middle"
              title="Translate this sentence to Bengali"
            >
              {copiedSentence === sentence.trim() ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Languages className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </span>
      );
    });
  };

  const fontSizeClasses = {
    sm: 'text-sm sm:text-base leading-relaxed sm:leading-loose',
    base: 'text-base sm:text-lg leading-loose sm:leading-loose',
    lg: 'text-lg sm:text-xl leading-loose sm:leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose sm:leading-loose',
  };

  return (
    <div className="relative flex h-full flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Sticky Reader Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-white/90 px-3.5 sm:px-6 py-2.5 dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md gap-2">
        {/* Title & Document Badge */}
        <div className="flex items-center gap-2 overflow-hidden max-w-[65%] sm:max-w-none">
          <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0">
            {document.source_type}
          </span>
          <h1 className="truncate text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
            {document.title}
          </h1>
        </div>

        {/* Controls: Font size, Pages, and Live reading percentage */}
        <div className="flex items-center gap-2">
          {/* Live reading percentage pill */}
          <div className="hidden sm:flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span>{scrollProgress}% read</span>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800 text-xs">
            {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 font-bold rounded-lg transition-all ${
                  fontSize === size
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
                title={`Font size ${size}`}
              >
                {size === 'sm' ? 'A-' : size === 'base' ? 'A' : size === 'lg' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>

          {/* Page navigation if multi-page */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  scrollToTop();
                }}
                disabled={currentPage <= 1}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>{currentPage}/{totalPages}</span>
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  scrollToTop();
                }}
                disabled={currentPage >= totalPages}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Reading Progress Bar */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Text Content Area with Smooth Momentum Scrolling */}
      <div 
        ref={contentScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto smooth-scroll-container px-4 py-6 sm:px-10 lg:px-14 max-w-4xl mx-auto w-full"
      >
        {/* Interactive Helper Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-violet-50/70 p-3.5 text-xs text-indigo-900 dark:bg-gradient-to-r dark:from-indigo-950/40 dark:to-violet-950/30 dark:text-indigo-200 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-indigo-100/80 dark:border-indigo-900/40 gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="bengali-text font-medium">
              শব্দে স্পর্শ করুন ➔ সাথে সাথে বাংলা উচ্চারণ, অর্থ, Synonyms ও Antonyms দেখুন।
            </span>
          </div>
          <span className="self-start sm:self-center shrink-0 text-[11px] font-bold bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-slate-700 shadow-2xs">
            Auto-Save Active
          </span>
        </div>

        {/* Paragraphs Display with Optimal Line Spacing */}
        <div className={`space-y-6 sm:space-y-8 font-normal ${fontSizeClasses[fontSize]}`}>
          {currentParagraphs.map((para, idx) => (
            <p key={idx} className="tracking-wide text-slate-800 dark:text-slate-100">
              {renderParagraphContent(para)}
            </p>
          ))}
        </div>

        {/* Article End Card */}
        <div className="mt-12 mb-8 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800 space-y-1">
          <p className="bengali-text font-semibold text-slate-600 dark:text-slate-300">
            পাঠ সম্পূর্ণ হয়েছে! মোট শব্দ: {document.total_words} টি।
          </p>
          <p className="text-slate-400">
            সংরক্ষিত শব্দগুলো ঝালাই করতে Spaced Flashcards বা Vocabulary Notebook দেখুন।
          </p>
        </div>
      </div>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-14 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
          title="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Reader Footer Info Bar */}
      <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/60 px-4 sm:px-6 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <span>{document.total_words} words</span>
          <span>•</span>
          <span>{scrollProgress}% completed</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Interactive Learning Active</span>
        </div>
      </div>
    </div>
  );
};
