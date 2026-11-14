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
  ArrowDown,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  X,
  BrainCircuit,
  RotateCcw,
  BookmarkCheck,
  Layers
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

  // Compact Notebook Panel states
  const [panelPosition, setPanelPosition] = useState<'bottom' | 'top'>('bottom');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85);

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
    }
  };

  // Tokenize paragraph into clickable interactive words and sentence translation triggers
  const renderParagraphContent = (paragraphText: string) => {
    const sentenceRegex = /([^.!?]+[.!?]+|\s*[^.!?]+$)/g;
    const sentences = paragraphText.match(sentenceRegex) || [paragraphText];

    return sentences.map((sentence, sIdx) => {
      const tokens = sentence.split(/(\s+|[.,!?;:"'()[\]{}—–]+)/g);

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
            const isActive = (selectedWordVocab && selectedWordVocab.word.toLowerCase() === lower) || activeWord === lower;

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

  // Synonyms and antonyms from selected vocab
  let synonyms: WordRelationItem[] = selectedWordVocab?.synonyms || [];
  let antonyms: WordRelationItem[] = selectedWordVocab?.antonyms || [];
  if (synonyms.length === 0 && selectedWordVocab?.synonyms_json) {
    try { synonyms = JSON.parse(selectedWordVocab.synonyms_json); } catch {}
  }
  if (antonyms.length === 0 && selectedWordVocab?.antonyms_json) {
    try { antonyms = JSON.parse(selectedWordVocab.antonyms_json); } catch {}
  }

  // Render the Compact Notebook Reading Bar
  const renderNotebookReadingBar = () => {
    if (!selectedWordVocab) {
      return (
        <div className="border-t border-slate-200/80 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="bengali-text">
            পড়ার সময় যেকোনো ইংরেজি শব্দ স্পর্শ করলেই এখানে স্বয়ংক্রিয়ভাবে বাংলা উচ্চারণ ও অর্থ দেখতে পাবেন।
          </span>
        </div>
      );
    }

    return (
      <div className={`z-20 w-full transition-all duration-150 border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md shadow-md ${
        panelPosition === 'top' 
          ? 'border-b sticky top-[48px]' 
          : 'border-t sticky bottom-0'
      }`}>
        {/* Compact Main Row (Distraction-free, zero jump reading panel) */}
        <div className="px-3 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Word + Pronunciation + Meaning */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
            {/* Learned Toggle Checkbox */}
            {onToggleLearned && (
              <button
                onClick={() => onToggleLearned(selectedWordVocab.id, selectedWordVocab.is_learned)}
                className="shrink-0 text-slate-400 hover:text-emerald-600 transition-colors p-0.5"
                title={selectedWordVocab.is_learned ? 'Learned' : 'In Progress'}
              >
                {selectedWordVocab.is_learned ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                )}
              </button>
            )}

            {/* Word Name & POS */}
            <div className="shrink-0 flex items-baseline gap-1">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white capitalize">
                {selectedWordVocab.word}
              </span>
              {selectedWordVocab.part_of_speech && (
                <span className="text-[10px] font-semibold text-slate-400 italic hidden xs:inline">
                  ({selectedWordVocab.part_of_speech})
                </span>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden xs:block" />

            {/* Bengali Pronunciation (বাংলা উচ্চারণ) */}
            <div className="shrink-0 flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold hidden md:inline">উচ্চারণ:</span>
              <span className="bengali-text font-bold text-xs sm:text-sm text-indigo-800 dark:text-indigo-200">
                {selectedWordVocab.bengali_pronunciation}
              </span>
            </div>

            {/* Bengali Meaning (বাংলা অর্থ) */}
            <div className="min-w-0 flex-1 truncate">
              <span className="bengali-text font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate block">
                {selectedWordVocab.bengali_meaning}
              </span>
            </div>
          </div>

          {/* Controls: Audio, Expand, Position, Close */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Fast Audio Play Button */}
            <button
              onClick={() => speakEnglishText(selectedWordVocab.word, { rate: audioSpeed })}
              className="flex items-center gap-1 h-8 px-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-xs shadow-2xs transition-transform active:scale-95"
              title="Pronounce word"
            >
              <Volume2 className="h-4 w-4" />
              <span className="text-[10px] hidden sm:inline">{audioSpeed}x</span>
            </button>

            {/* Audio Speed Toggle (1.0x / 0.75x) */}
            <button
              onClick={() => setAudioSpeed(s => s === 0.85 ? 0.65 : s === 0.65 ? 1.0 : 0.85)}
              className="h-8 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-[10px] hidden sm:flex items-center"
              title="Toggle speed (0.65x, 0.85x, 1.0x)"
            >
              {audioSpeed === 0.65 ? '0.65x' : audioSpeed === 1.0 ? '1.0x' : '0.85x'}
            </button>

            {/* Expand Details (Synonyms/Antonyms) */}
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className={`flex items-center gap-0.5 h-8 px-2 rounded-xl text-xs font-semibold transition-colors ${
                isDetailsExpanded 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
              title="View Synonyms & Antonyms"
            >
              <span className="text-[11px] hidden xs:inline">Details</span>
              {isDetailsExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>

            {/* Dock Position Switcher (Top / Bottom) */}
            <button
              onClick={() => setPanelPosition(p => p === 'bottom' ? 'top' : 'bottom')}
              className="h-8 w-8 hidden md:flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={panelPosition === 'bottom' ? 'Dock above text' : 'Dock below text'}
            >
              {panelPosition === 'bottom' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
            </button>

            {/* Close / Dismiss Word Panel */}
            {onClearSelectedWord && (
              <button
                onClick={onClearSelectedWord}
                className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                title="Dismiss panel"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Notebook Details Tray (Distraction-free, inline without covers) */}
        {isDetailsExpanded && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-3 sm:px-6 bg-slate-50/70 dark:bg-slate-850/60 space-y-2.5 max-h-48 overflow-y-auto smooth-scroll-container">
            {/* English Definition */}
            {selectedWordVocab.english_definition && (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-500">Definition: </span>
                {selectedWordVocab.english_definition}
              </p>
            )}

            {/* Synonyms & Antonyms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Synonyms */}
              {synonyms.length > 0 && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2 dark:border-emerald-950/60 dark:bg-emerald-950/30">
                  <div className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    সমার্থক শব্দ (Synonyms)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {synonyms.map((s, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-xs font-semibold text-emerald-900 shadow-2xs dark:bg-slate-800 dark:text-emerald-200">
                        <span>{s.word}</span>
                        <span className="bengali-text text-[10px] font-normal text-emerald-600 dark:text-emerald-400">({s.bengali_pronunciation})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {antonyms.length > 0 && (
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-2 dark:border-rose-950/60 dark:bg-rose-950/30">
                  <div className="font-bold text-[10px] text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">
                    বিপরীতার্থক শব্দ (Antonyms)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {antonyms.map((a, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-xs font-semibold text-rose-900 shadow-2xs dark:bg-slate-800 dark:text-rose-200">
                        <span>{a.word}</span>
                        <span className="bengali-text text-[10px] font-normal text-rose-600 dark:text-rose-400">({a.bengali_pronunciation})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant guidance button */}
            {onAskAi && (
              <button
                onClick={() => onAskAi(selectedWordVocab.word, selectedWordVocab.context_sentence || '')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
              >
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>Ask AI Tutor for in-depth explanation in Bengali</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
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

      {/* If docked at TOP: Render Notebook Reading Bar here */}
      {panelPosition === 'top' && renderNotebookReadingBar()}

      {/* Main Text Content Area with Smooth Momentum Scrolling */}
      <div 
        ref={contentScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto smooth-scroll-container px-4 py-6 sm:px-10 lg:px-14 max-w-4xl mx-auto w-full pb-16"
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

      {/* If docked at BOTTOM: Render Notebook Reading Bar here */}
      {panelPosition === 'bottom' && renderNotebookReadingBar()}

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-20 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
          title="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
