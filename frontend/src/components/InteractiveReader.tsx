'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp,
  ChevronDown,
  Sparkles, 
  Volume2,
  Check,
  Languages,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  X
} from 'lucide-react';
import { DocumentItem, VocabularyItem, WordRelationItem } from '../types';
import { lookupAndAutoSaveWord, updateReadingProgress } from '../lib/api';
import { speakEnglishText } from '../lib/speech';

interface InteractiveReaderProps {
  document: DocumentItem;
  onWordSelected: (vocab: VocabularyItem) => void;
  onSentenceSelected?: (sentence: string) => void;
  savedWordsSet?: Set<string>;
  learnedWordsSet?: Set<string>;
  selectedWordVocab?: VocabularyItem | null;
  onClearSelectedWord?: () => void;
  onToggleLearned?: (id: number, current: boolean) => void;
  onAskAi?: (word: string, context?: string) => void;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  document,
  onWordSelected,
  onSentenceSelected,
  savedWordsSet = new Set(),
  learnedWordsSet = new Set(),
  selectedWordVocab,
  onClearSelectedWord,
  onToggleLearned,
  onAskAi,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [currentPage, setCurrentPage] = useState<number>(document.current_page || 1);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [copiedSentence, setCopiedSentence] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const autoScrollSpeedRef = useRef<number>(0.9); // smooth px per frame
  const autoScrollAnimRef = useRef<number | null>(null);

  // Mobile contextual inline popup positioning
  const [popupAlign, setPopupAlign] = useState<'center' | 'left' | 'right'>('center');
  const [popupVertical, setPopupVertical] = useState<'above' | 'below'>('above');
  const [loadingWord, setLoadingWord] = useState<string | null>(null);
  const audioSpeed = 0.85;

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
    stopAutoScroll();
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    stopAutoScroll();
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({
        top: contentScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollByAmount = (amount: number) => {
    stopAutoScroll();
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollAnimRef.current) {
      cancelAnimationFrame(autoScrollAnimRef.current);
      autoScrollAnimRef.current = null;
    }
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      setIsAutoScrolling(true);
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling) return;

    let lastTime = performance.now();
    const step = (time: number) => {
      const delta = (time - lastTime) / 16.6;
      lastTime = time;

      if (contentScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentScrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 3) {
          stopAutoScroll();
          return;
        }
        contentScrollRef.current.scrollTop += autoScrollSpeedRef.current * delta;
      }
      autoScrollAnimRef.current = requestAnimationFrame(step);
    };

    autoScrollAnimRef.current = requestAnimationFrame(step);
    return () => {
      if (autoScrollAnimRef.current) {
        cancelAnimationFrame(autoScrollAnimRef.current);
      }
    };
  }, [isAutoScrolling]);

  // Click on scrub progress bar to jump anywhere in the article
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    stopAutoScroll();
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (contentScrollRef.current) {
      const target = (contentScrollRef.current.scrollHeight - contentScrollRef.current.clientHeight) * ratio;
      contentScrollRef.current.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  // Keyboard navigation for hands-free reading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        scrollByAmount(e.shiftKey ? -320 : 320);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        scrollByAmount(180);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        scrollByAmount(-180);
      } else if (e.code === 'PageDown') {
        e.preventDefault();
        scrollByAmount(420);
      } else if (e.code === 'PageUp') {
        e.preventDefault();
        scrollByAmount(-420);
      } else if (e.code === 'Home') {
        e.preventDefault();
        scrollToTop();
      } else if (e.code === 'End') {
        e.preventDefault();
        scrollToBottom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle word click with collision detection for mobile inline popup
  const handleWordClick = async (rawWord: string, surroundingSentence: string, e?: React.MouseEvent) => {
    const clean = rawWord.replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
    if (!clean) return;

    setActiveWord(clean);
    setLoadingWord(clean);

    if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;

      // Safe collision check for mobile screen edges
      if (rect.left < 110) {
        setPopupAlign('left');
      } else if (screenWidth - rect.right < 110) {
        setPopupAlign('right');
      } else {
        setPopupAlign('center');
      }

      // Check vertical position - if too close to top bar, flip below the word
      if (rect.top < 140) {
        setPopupVertical('below');
      } else {
        setPopupVertical('above');
      }
    }

    // Instant audio pronunciation
    speakEnglishText(clean, { rate: audioSpeed });

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
    } finally {
      setLoadingWord(null);
    }
  };

  // Synonyms from selected vocab
  let synonyms: WordRelationItem[] = selectedWordVocab?.synonyms || [];
  if (synonyms.length === 0 && selectedWordVocab?.synonyms_json) {
    try { synonyms = JSON.parse(selectedWordVocab.synonyms_json); } catch {}
  }

  // Tokenize paragraph into clickable interactive words and sentence translation triggers
  const renderParagraphContent = (paragraphText: string) => {
    const sentenceRegex = /([^.!?]+[.!?]+|\s*[^.!?]+$)/g;
    const sentences = paragraphText.match(sentenceRegex) || [paragraphText];

    return sentences.map((sentence, sIdx) => {
      const tokens = sentence.split(/(\s+|[.,!?;:"'()[\]{}—–]+)/g);

      return (
        <span 
          key={sIdx} 
          className="group/sentence relative rounded px-0.5 transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
        >
          {tokens.map((token, tIdx) => {
            const isWord = /^[a-zA-Z]+$/.test(token.trim());
            if (!isWord) {
              return <span key={tIdx} className="text-slate-600 dark:text-slate-400">{token}</span>;
            }

            const lower = token.toLowerCase();
            const isSaved = savedWordsSet.has(lower);
            const isLearned = learnedWordsSet.has(lower);
            const isActive = (selectedWordVocab && selectedWordVocab.word.toLowerCase() === lower) || activeWord === lower;
            const isCurrentActive = activeWord === lower;

            return (
              <span
                key={tIdx}
                className="relative inline-block align-baseline"
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick(token, sentence.trim(), e);
                  }}
                  className={`reader-word cursor-pointer ${isActive ? 'active-word font-semibold text-indigo-600 dark:text-indigo-400' : ''} ${
                    isLearned 
                      ? 'learned-word text-emerald-800 dark:text-emerald-300 font-semibold' 
                      : isSaved 
                      ? 'saved-word text-indigo-700 dark:text-indigo-300 font-medium' 
                      : 'text-slate-800 dark:text-slate-100'
                  }`}
                  title="Tap for Bengali pronunciation & meaning"
                >
                  {token}
                </span>

                {/* Mobile-only inline contextual note / speech-bubble directly above or below the tapped word */}
                {isCurrentActive && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`lg:hidden absolute z-50 ${
                      popupVertical === 'below' 
                        ? 'top-[calc(100%+8px)]' 
                        : 'bottom-[calc(100%+8px)]'
                    } ${
                      popupAlign === 'left' 
                        ? 'left-0' 
                        : popupAlign === 'right' 
                        ? 'right-0' 
                        : 'left-1/2 -translate-x-1/2'
                    } w-60 sm:w-64 max-w-[85vw] rounded-2xl bg-slate-900/95 dark:bg-slate-900/98 text-white p-2.5 shadow-2xl backdrop-blur-md border border-slate-700/60 select-none animate-in fade-in zoom-in-95 duration-150`}
                  >
                    {/* Speech bubble caret pointing directly at the word */}
                    <div
                      className={`absolute ${
                        popupVertical === 'below' 
                          ? '-top-1.5 border-t border-l' 
                          : '-bottom-1.5 border-b border-r'
                      } ${
                        popupAlign === 'left' 
                          ? 'left-4' 
                          : popupAlign === 'right' 
                          ? 'right-4' 
                          : 'left-1/2 -translate-x-1/2'
                      } w-3 h-3 bg-slate-900 dark:bg-slate-900 rotate-45 border-slate-700/60`}
                    />

                    {loadingWord === lower && (!selectedWordVocab || selectedWordVocab.word.toLowerCase() !== lower) ? (
                      <div className="flex items-center gap-2 py-1 px-1">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent shrink-0" />
                        <span className="text-xs text-slate-300 bengali-text">বাংলা অর্থ ও উচ্চারণ খোঁজা হচ্ছে...</span>
                      </div>
                    ) : selectedWordVocab && selectedWordVocab.word.toLowerCase() === lower ? (
                      <div className="space-y-1">
                        {/* Bengali Pronunciation Header */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakEnglishText(selectedWordVocab.word, { rate: audioSpeed });
                              }}
                              className="shrink-0 p-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-transform active:scale-90"
                              title="Listen"
                            >
                              <Volume2 className="h-3 w-3" />
                            </button>

                            <div className="min-w-0 flex items-center gap-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium shrink-0">উচ্চারণ:</span>
                              <span className="bengali-text font-bold text-amber-300 text-xs sm:text-sm tracking-wide truncate">
                                {selectedWordVocab.bengali_pronunciation}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveWord(null);
                              onClearSelectedWord?.();
                            }}
                            className="shrink-0 text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800"
                            title="Close"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Bengali Meaning: in a smaller font directly below Bengali pronunciation */}
                        <div className="pt-1 border-t border-slate-800/80 leading-snug">
                          {selectedWordVocab.part_of_speech && (
                            <span className="text-[10px] text-indigo-300/90 font-medium italic mr-1 shrink-0">
                              ({selectedWordVocab.part_of_speech})
                            </span>
                          )}
                          <span className="bengali-text text-[11px] sm:text-xs text-slate-200 font-normal line-clamp-2">
                            {selectedWordVocab.bengali_meaning}
                          </span>
                        </div>

                        {/* Synonyms Preview (if available) */}
                        {synonyms.length > 0 && (
                          <div className="pt-0.5 text-[9.5px] sm:text-[10px] text-emerald-300/80 flex items-center gap-1 truncate">
                            <span className="font-semibold text-emerald-400 shrink-0">Syn:</span>
                            <span className="truncate text-slate-300">{synonyms.slice(0, 3).map(s => s.word).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="capitalize font-semibold">{token}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveWord(null);
                            onClearSelectedWord?.();
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </span>
            );
          })}

          {/* Inline Sentence Translation Button (Visible on mobile touch screens) */}
          {onSentenceSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSentenceSelected(sentence.trim());
                setCopiedSentence(sentence.trim());
                setTimeout(() => setCopiedSentence(null), 2000);
              }}
              className="inline-flex items-center ml-1 opacity-70 sm:opacity-0 sm:group-hover/sentence:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/60 dark:text-indigo-400 dark:hover:bg-indigo-950/80 align-middle"
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
    <div className="relative flex h-full min-h-0 flex-col bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Sticky Reader Toolbar */}
      <div className="shrink-0 z-20 flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-white/95 px-3.5 sm:px-6 py-2.5 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md gap-2">
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

      {/* Interactive Scrubbable Reading Progress Bar */}
      <div 
        onClick={handleProgressBarClick}
        className="shrink-0 h-1.5 w-full bg-slate-100 dark:bg-slate-800 hover:h-2.5 cursor-pointer transition-all group/scrub relative"
        title="ক্লিক করে লেখার যেকোনো অংশে স্ক্রোল করুন (Click to scrub)"
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-100 relative"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow border border-indigo-600 opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main Text Content Area with Smooth Momentum Scrolling */}
      <div 
        ref={contentScrollRef}
        onScroll={handleScroll}
        onWheel={() => { if (isAutoScrolling) stopAutoScroll(); }}
        onTouchMove={() => { if (isAutoScrolling) stopAutoScroll(); }}
        onClick={() => {
          if (activeWord) {
            setActiveWord(null);
            onClearSelectedWord?.();
          }
        }}
        className="flex-1 min-h-0 overflow-y-auto reader-scroll-area smooth-scroll-container px-4 py-6 sm:px-10 lg:px-14 w-full pb-28"
      >
        <div className="max-w-4xl mx-auto w-full">
        {/* Interactive Helper Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-violet-50/70 p-3.5 text-xs text-indigo-900 dark:bg-gradient-to-r dark:from-indigo-950/40 dark:to-violet-950/30 dark:text-indigo-200 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-indigo-100/80 dark:border-indigo-900/40 gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="bengali-text font-medium">
              শব্দে স্পর্শ করুন ➔ সাথে সাথে বাংলা উচ্চারণ ও অর্থ সরাসরি শব্দের উপরে দেখতে পাবেন।
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
      </div>

      {/* Floating Smooth Scroll Quick Control Bar */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 flex items-center gap-1 p-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md select-none transition-all duration-200">
        {/* Realtime Progress Tag */}
        <span className="px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
          {scrollProgress}%
        </span>

        {/* Scroll Up Button */}
        <button
          type="button"
          onClick={() => scrollByAmount(-320)}
          className="p-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/60 transition-colors"
          title="উপরে স্ক্রোল করুন (Scroll Up - Alt+Up / Shift+Space)"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        {/* Scroll Down Button */}
        <button
          type="button"
          onClick={() => scrollByAmount(320)}
          className="p-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/60 transition-colors"
          title="নিচে স্ক্রোল করুন (Scroll Down - Alt+Down / Space)"
        >
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Auto-Scroll Toggle */}
        <button
          type="button"
          onClick={toggleAutoScroll}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            isAutoScrolling
              ? 'bg-indigo-600 text-white shadow-xs animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
          }`}
          title={isAutoScrolling ? 'অটো-স্ক্রোল থামান (Pause)' : 'অটো-স্ক্রোল শুরু করুন (Smooth Auto-Scroll)'}
        >
          {isAutoScrolling ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isAutoScrolling ? 'Pause' : 'Auto'}</span>
        </button>

        {/* Back to Top Quick Action */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-1.5 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/60 transition-colors border-l border-slate-200 dark:border-slate-800 pl-2 ml-0.5"
            title="এক ক্লিকে একদম শুরুতে যান (Back to top)"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
