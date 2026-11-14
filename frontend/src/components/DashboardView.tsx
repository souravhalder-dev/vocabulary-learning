'use client';

import React from 'react';
import { 
  Flame, 
  BookOpen, 
  BookmarkCheck, 
  Languages, 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Globe, 
  Image as ImageIcon,
  Volume2,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Layers,
  BookOpenText
} from 'lucide-react';
import { DocumentItem, VocabularyItem, DashboardStats } from '../types';
import { speakEnglishText } from '../lib/speech';

interface DashboardViewProps {
  stats: DashboardStats;
  recentDocs: DocumentItem[];
  recentVocabs: VocabularyItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenImport: () => void;
  onOpenTranslate: () => void;
  onOpenAiAssistant: () => void;
  onNavigateToNotebook: () => void;
  onNavigateToReader?: () => void;
  onStartFlashcards?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentDocs,
  recentVocabs,
  onSelectDocument,
  onOpenImport,
  onOpenTranslate,
  onOpenAiAssistant,
  onNavigateToNotebook,
  onNavigateToReader,
  onStartFlashcards,
}) => {
  const latestDoc = recentDocs[0];
  const percentLearned = stats.total_vocabularies > 0 
    ? Math.round((stats.learned_vocabularies / stats.total_vocabularies) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Streak Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
            <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
            <span>{stats.streak_days} Day Streak • প্রতিদিনের পাঠাভ্যাস</span>
          </div>
          <h1 className="heading-font text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to ShobdoShadhon AI
          </h1>
          <p className="bengali-text text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            বাস্তব ইংরেজি কনটেন্ট পড়ুন, যেকোনো শব্দে ট্যাপ করলেই তাৎক্ষণিক বাংলা উচ্চারণ ও অর্থ জানুন এবং নোটবুকে স্বয়ংক্রিয়ভাবে সংরক্ষণ করুন।
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={onOpenImport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Import Content</span>
            </button>
            <button
              onClick={onOpenTranslate}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition-colors"
            >
              <Languages className="h-4 w-4 text-indigo-300" />
              <span>Translate</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Mobile-First Quick Tool Launchpad (1-tap access on any smartphone, tablet, or PC) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={() => (onNavigateToReader ? onNavigateToReader() : latestDoc && onSelectDocument(latestDoc))}
          className="flex flex-col justify-between rounded-2xl border border-indigo-100 bg-white p-3.5 sm:p-4 text-left shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-indigo-950/60 dark:bg-slate-900 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 mb-2 group-hover:scale-105 transition-transform">
            <BookOpenText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">Reading Room</div>
            <p className="bengali-text text-[11px] text-slate-500 line-clamp-1 mt-0.5">শব্দে ট্যাপ করে পড়ুন</p>
          </div>
        </button>

        <button
          onClick={onOpenTranslate}
          className="flex flex-col justify-between rounded-2xl border border-violet-100 bg-white p-3.5 sm:p-4 text-left shadow-2xs transition-all hover:border-violet-300 hover:shadow-md dark:border-violet-950/60 dark:bg-slate-900 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/70 dark:text-violet-400 mb-2 group-hover:scale-105 transition-transform">
            <Languages className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">Translator</div>
            <p className="bengali-text text-[11px] text-slate-500 line-clamp-1 mt-0.5">অনুবাদ ও উচ্চারণ</p>
          </div>
        </button>

        <button
          onClick={() => (onStartFlashcards ? onStartFlashcards() : onNavigateToNotebook())}
          className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-3.5 sm:p-4 text-left shadow-2xs transition-all hover:border-emerald-300 hover:shadow-md dark:border-emerald-950/60 dark:bg-slate-900 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">Flashcards</div>
            <p className="bengali-text text-[11px] text-slate-500 line-clamp-1 mt-0.5">স্মৃতিকোষ অনুশীলন</p>
          </div>
        </button>

        <button
          onClick={onOpenAiAssistant}
          className="flex flex-col justify-between rounded-2xl border border-amber-100 bg-white p-3.5 sm:p-4 text-left shadow-2xs transition-all hover:border-amber-300 hover:shadow-md dark:border-amber-950/60 dark:bg-slate-900 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400 mb-2 group-hover:scale-105 transition-transform">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">AI Tutor</div>
            <p className="bengali-text text-[11px] text-slate-500 line-clamp-1 mt-0.5">সহজ বাংলা ব্যাখ্যা</p>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Saved Vocab */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Vocabulary</span>
            <BookmarkCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats.total_vocabularies}
          </div>
          <p className="bengali-text text-[11px] text-slate-400 mt-0.5">স্বয়ংক্রিয়ভাবে সংরক্ষিত</p>
        </div>

        {/* Learned Words */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Mastered</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.learned_vocabularies}
          </div>
          <p className="bengali-text text-[11px] text-slate-400 mt-0.5">{percentLearned}% আয়ত্ত করা হয়েছে</p>
        </div>

        {/* Documents */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Library Content</span>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats.total_documents}
          </div>
          <p className="bengali-text text-[11px] text-slate-400 mt-0.5">PDF, URL ও OCR পাঠ্য</p>
        </div>

        {/* Translations */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Translations</span>
            <Languages className="h-4 w-4 text-violet-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats.total_translations}
          </div>
          <p className="bengali-text text-[11px] text-slate-400 mt-0.5">বাক্য ও উচ্চারণ চর্চা</p>
        </div>
      </div>

      {/* Continue Reading Card */}
      {latestDoc && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white p-5 dark:border-indigo-950/60 dark:from-indigo-950/30 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Continue Reading (পূর্বের পাঠ جاری রাখুন)</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {latestDoc.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 max-w-lg">
              {(latestDoc.content || '').slice(0, 120)}...
            </p>
          </div>

          <button
            onClick={() => onSelectDocument(latestDoc)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors shrink-0"
          >
            <span>Resume Reader</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Recent Saved Words Section */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Recent Vocabulary Words
            </h3>
            <p className="bengali-text text-xs text-slate-400">
              সাম্প্রতিক সংরক্ষিত শব্দসমূহ ও বাংলা উচ্চারণ
            </p>
          </div>
          <button
            onClick={onNavigateToNotebook}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View Full Notebook</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {recentVocabs.slice(0, 6).map((vocab) => (
            <div
              key={vocab.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white capitalize block text-sm">
                  {vocab.word}
                </span>
                <span className="bengali-text text-xs text-indigo-700 dark:text-indigo-400 font-semibold block">
                  {vocab.bengali_pronunciation}
                </span>
                <span className="bengali-text text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {vocab.bengali_meaning}
                </span>
              </div>
              <button
                onClick={() => speakEnglishText(vocab.word, { rate: 0.85 })}
                className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                title="Pronounce"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
