'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Award,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  RotateCcw,
  Send,
  Bot,
  Filter,
  Check,
  X,
  Layers,
  Clock,
  Compass,
  FileText,
  MessageSquare,
  Edit3,
  Save,
  Zap,
  Target,
  ArrowDown
} from 'lucide-react';
import {
  ALL_GRAMMAR_CHAPTERS,
  getChapterById,
  searchGrammarContent
} from '../../lib/grammar-data';
import {
  GrammarChapter,
  GrammarRule,
  BcsQuestionAnalysis,
  GrammarQuizQuestion,
  UserGrammarProgress,
  ColorCodedToken,
  VisualStep
} from '../../types/grammar';

const STORAGE_KEY = 'shobdoshadhon_ai_grammar_progress_v2';

export const EnglishLanguageView: React.FC = () => {
  // Navigation & View State
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chapter-1');
  const [activeTab, setActiveTab] = useState<'textbook' | 'bcs_analysis' | 'practice' | 'bookmarks_notes' | 'revision' | 'tutor'>('textbook');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bcsFilterExam, setBcsFilterExam] = useState<string>('All');
  const [practiceType, setPracticeType] = useState<'mcq' | 'fill_in_blank' | 'error_correction'>('mcq');
  const [quizDifficulty, setQuizDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // User Learning Progress State (completed rules, chapters, bookmarks, notes)
  const [progress, setProgress] = useState<UserGrammarProgress>({
    completedRules: [],
    completedChapters: [],
    bookmarkedRules: [],
    savedQuestions: [],
    personalNotes: {},
    quizScores: {}
  });

  // Note Editing State
  const [activeNoteRuleId, setActiveNoteRuleId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>('');

  // Quiz Interaction State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Fill in the blanks state
  const [fibAnswers, setFibAnswers] = useState<Record<string, string>>({});
  const [fibChecked, setFibChecked] = useState<Record<string, boolean>>({});

  // AI Tutor State
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [tutorMessages, setTutorMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'নমস্কার! আমি আপনার AI Grammar Tutor (ব্যক্তিগত ইংরেজি ব্যাকরণ গৃহশিক্ষক)।\n\nআপনি ইংরেজি ব্যাকরণের যেকোনো নিয়ম, বিগত বছরের বিসিএস প্রশ্ন, কিংবা বিভ্রান্তিকর ব্যতিক্রম সম্পর্কে বাংলায় প্রশ্ন করতে পারেন। আমি সহজ বাংলায় উদাহরণসহ বুঝিয়ে দেব।'
    }
  ]);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({
          ...parsed,
          personalNotes: parsed.personalNotes || {}
        });
      }
    } catch (err) {
      console.warn('Failed to load grammar progress:', err);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: UserGrammarProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (err) {
      console.warn('Failed to save grammar progress:', err);
    }
  };

  const currentChapter = useMemo(() => {
    return getChapterById(selectedChapterId) || ALL_GRAMMAR_CHAPTERS[0];
  }, [selectedChapterId]);

  // Overall statistics
  const totalRulesCount = useMemo(() => {
    return ALL_GRAMMAR_CHAPTERS.reduce((acc, c) => acc + c.rules.length, 0);
  }, []);

  const completionPercentage = useMemo(() => {
    if (totalRulesCount === 0) return 0;
    return Math.min(100, Math.round((progress.completedRules.length / totalRulesCount) * 100));
  }, [progress.completedRules.length, totalRulesCount]);

  // Toggle Rule Completion
  const toggleRuleCompleted = (ruleId: string) => {
    const isCompleted = progress.completedRules.includes(ruleId);
    const newCompleted = isCompleted
      ? progress.completedRules.filter((id) => id !== ruleId)
      : [...progress.completedRules, ruleId];

    const chapterRuleIds = currentChapter.rules.map((r) => r.id);
    const isChapterDone = chapterRuleIds.every((id) => newCompleted.includes(id));
    const newCompletedChapters = isChapterDone
      ? Array.from(new Set([...progress.completedChapters, currentChapter.id]))
      : progress.completedChapters.filter((id) => id !== currentChapter.id);

    saveProgress({
      ...progress,
      completedRules: newCompleted,
      completedChapters: newCompletedChapters
    });
  };

  // Toggle Rule Bookmark
  const toggleRuleBookmark = (ruleId: string) => {
    const isBookmarked = progress.bookmarkedRules.includes(ruleId);
    const newBookmarks = isBookmarked
      ? progress.bookmarkedRules.filter((id) => id !== ruleId)
      : [...progress.bookmarkedRules, ruleId];
    saveProgress({ ...progress, bookmarkedRules: newBookmarks });
  };

  // Save Personal Note for a rule
  const handleSaveNote = (ruleId: string) => {
    const updatedNotes = {
      ...progress.personalNotes,
      [ruleId]: currentNoteText.trim()
    };
    if (!currentNoteText.trim()) {
      delete updatedNotes[ruleId];
    }
    saveProgress({ ...progress, personalNotes: updatedNotes });
    setActiveNoteRuleId(null);
  };

  // Search Results
  const searchResults = useMemo(() => {
    return searchGrammarContent(searchQuery);
  }, [searchQuery]);

  // Filtered BCS Questions
  const filteredBcsQuestions = useMemo(() => {
    const questions = currentChapter.bcsQuestions;
    if (bcsFilterExam === 'All') return questions;
    return questions.filter((q) => q.bcsExam.includes(bcsFilterExam));
  }, [currentChapter, bcsFilterExam]);

  // Filtered Quiz Questions
  const filteredQuizQuestions = useMemo(() => {
    let questions = currentChapter.practiceQuestions;
    if (quizDifficulty !== 'all') {
      questions = questions.filter((q) => q.difficulty === quizDifficulty);
    }
    return questions;
  }, [currentChapter, quizDifficulty]);

  // Handle Quiz Option Selection
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showQuizResults) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Calculate Quiz Score
  const calculateQuizScore = () => {
    let correct = 0;
    filteredQuizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return { correct, total: filteredQuizQuestions.length };
  };

  // AI Tutor Ask Function
  const handleAskTutor = async (questionText?: string, contextRule?: GrammarRule) => {
    const q = questionText || tutorQuery;
    if (!q.trim() || isTutorLoading) return;

    setTutorMessages((prev) => [...prev, { sender: 'user', text: q }]);
    if (!questionText) setTutorQuery('');
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/grammar/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          chapterId: currentChapter.id,
          ruleId: contextRule ? contextRule.id : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTutorMessages((prev) => [...prev, { sender: 'ai', text: data.answer }]);
      } else {
        setTutorMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'দুঃখিত, এই মুহূর্তে সার্ভারে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।' }
        ]);
      }
    } catch {
      setTutorMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'নেটওয়ার্ক জনিত কারণে উত্তর পাওয়া যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।' }
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Ask AI about specific rule from textbook
  const handleDirectRuleAsk = (rule: GrammarRule) => {
    setActiveTab('tutor');
    const prompt = `Rule ${rule.ruleNumber}: "${rule.title} (${rule.bengaliTitle})" নিয়ে আমাকে সহজ বাংলায় কিছু বাস্তব উদাহরণ, কমন ভুল এবং বিসিএস পরীক্ষার টেকনিক বুঝিয়ে বলুন।`;
    handleAskTutor(prompt, rule);
  };

  // Color-coded token styling
  const getTokenRoleStyle = (role: ColorCodedToken['role']) => {
    switch (role) {
      case 'subject':
        return 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800';
      case 'verb':
        return 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800';
      case 'object':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800';
      case 'modifier':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800';
      case 'connector':
        return 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800';
      case 'preposition':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-200 dark:border-cyan-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Chapter Navigation (Previous / Next)
  const currentChapterIndex = ALL_GRAMMAR_CHAPTERS.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentChapterIndex > 0 ? ALL_GRAMMAR_CHAPTERS[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < ALL_GRAMMAR_CHAPTERS.length - 1 ? ALL_GRAMMAR_CHAPTERS[currentChapterIndex + 1] : null;

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* ── Top Header Bar ──────────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Section Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 text-white shadow-md shadow-indigo-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>AI Grammar</span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Smart Textbook
                  </span>
                </h1>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  BCS Special
                </span>
              </div>
              <p className="bengali-text text-xs text-slate-500 dark:text-slate-400">
                অধ্যায়ভিত্তিক ভিজ্যুয়াল গ্রামার পাঠ্যবই, বিগত ১০ বছরের বিসিএস প্রশ্ন ও সার্বক্ষণিক এআই শিক্ষক
              </p>
            </div>
          </div>

          {/* Quick Stats & Search Box */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Progress Pill */}
            <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 border border-indigo-100 dark:border-indigo-900/60">
              <Flame className="h-4 w-4 text-orange-500" />
              <div className="text-left">
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">সিলেবাস অগ্রগতি</div>
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {completionPercentage}% ({progress.completedRules.length}/{totalRulesCount} টি নিয়ম সম্পন্ন)
                </div>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="যেকোনো নিয়ম বা টপিক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/80 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:bg-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5 border-t border-slate-100 dark:border-slate-800/60 pt-2 text-xs">
          {[
            { id: 'textbook', label: '📖 পাঠ্যবই ও ভিজ্যুয়াল লেসন', badge: currentChapter.rules.length },
            { id: 'bcs_analysis', label: '🎯 ১০ বছরের বিসিএস প্রশ্ন', badge: currentChapter.bcsQuestions.length },
            { id: 'practice', label: '📝 অনুশীলন ও পরীক্ষা', badge: currentChapter.practiceQuestions.length },
            { id: 'bookmarks_notes', label: '🔖 বুকমার্ক ও পার্সোনাল নোটস', badge: progress.bookmarkedRules.length + Object.keys(progress.personalNotes).length },
            { id: 'revision', label: '⚡ দ্রুত রিভিশন কার্ড' },
            { id: 'tutor', label: '🤖 AI Grammar Tutor' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Workspace Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Chapter Syllabus Navigation */}
        <aside className="w-72 sm:w-80 shrink-0 border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              কোর্স লেকচার সূচি (Lectures 01-16)
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              {ALL_GRAMMAR_CHAPTERS.length} টি অধ্যায়
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 smooth-scroll-container">
            {ALL_GRAMMAR_CHAPTERS.map((ch) => {
              const isSelected = selectedChapterId === ch.id;
              const isDone = progress.completedChapters.includes(ch.id);

              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 dark:bg-indigo-950/70 dark:border-indigo-800 dark:text-indigo-200 shadow-2xs'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      {ch.lectureNo || `Ch-${ch.chapterNumber}`}
                    </span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                      ch.bcsFrequency === 'Very High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}>
                      BCS {ch.bcsFrequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold truncate">
                      {ch.title}
                    </span>
                    {isDone && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                    )}
                  </div>
                  <span className="bengali-text text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {ch.bengaliTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center / Right Content Panel */}
        <main className="flex-1 min-h-0 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 smooth-scroll-container">
          <div className="max-w-4xl mx-auto w-full space-y-6">

            {/* Global Search Results Overlay (If User Typed in Search) */}
            {searchQuery.trim() && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-lg border border-indigo-200 dark:border-indigo-900 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="h-4 w-4 text-indigo-600" />
                    <span>খোঁজার ফলাফল: "{searchQuery}"</span>
                  </h3>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    বন্ধ করুন
                  </button>
                </div>

                {searchResults.rules.length === 0 && searchResults.bcsQuestions.length === 0 ? (
                  <p className="bengali-text text-xs text-slate-500">কোনো প্রাসঙ্গিক নিয়ম বা প্রশ্ন পাওয়া যায়নি।</p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.rules.map(({ chapter, rule }) => (
                      <div
                        key={rule.id}
                        onClick={() => {
                          setSelectedChapterId(chapter.id);
                          setActiveTab('textbook');
                          setSearchQuery('');
                        }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer border border-slate-200 dark:border-slate-800 transition-colors"
                      >
                        <div className="text-[10px] font-bold text-indigo-600 uppercase mb-0.5">
                          {chapter.title} • Rule {rule.ruleNumber}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {rule.title} ({rule.bengaliTitle})
                        </div>
                        <div className="bengali-text text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {rule.explanationBn}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 1: Textbook Mode (Visual Learning & Detailed Lessons) ───── */}
            {activeTab === 'textbook' && (
              <div className="space-y-6">
                {/* Chapter Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
                  <div className="relative z-10 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-400/30">
                        {currentChapter.lectureNo || `Chapter ${currentChapter.chapterNumber}`}
                      </span>
                      <span className="rounded-full bg-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-400/30">
                        বিসিএস গুরুত্ব: {currentChapter.bcsFrequency}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      {currentChapter.title}
                    </h2>
                    <p className="bengali-text text-sm sm:text-base text-indigo-100 font-medium">
                      {currentChapter.bengaliTitle}
                    </p>

                    <p className="bengali-text text-xs text-indigo-200/90 leading-relaxed pt-1">
                      {currentChapter.bcsFrequencyNotes}
                    </p>
                  </div>
                </div>

                {/* Subchapter Navigation Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {currentChapter.subchapters.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{idx + 1}.</span>
                      <span className="bengali-text">{sub.bengaliTitle}</span>
                    </div>
                  ))}
                </div>

                {/* Rules Cards Loop */}
                <div className="space-y-6">
                  {currentChapter.rules.map((rule) => {
                    const isRuleDone = progress.completedRules.includes(rule.id);
                    const isRuleBookmarked = progress.bookmarkedRules.includes(rule.id);
                    const savedNote = progress.personalNotes[rule.id] || '';
                    const isEditingNote = activeNoteRuleId === rule.id;

                    return (
                      <div
                        key={rule.id}
                        id={rule.id}
                        className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
                      >
                        {/* Rule Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold font-mono">
                                RULE {rule.ruleNumber}
                              </span>
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                {rule.title}
                              </h3>
                            </div>
                            <h4 className="bengali-text text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                              {rule.bengaliTitle}
                            </h4>
                          </div>

                          {/* Action Buttons: Note, Ask AI, Bookmark & Done */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Personal Note Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (isEditingNote) {
                                  setActiveNoteRuleId(null);
                                } else {
                                  setActiveNoteRuleId(rule.id);
                                  setCurrentNoteText(savedNote);
                                }
                              }}
                              className={`p-2 rounded-xl transition-colors ${
                                savedNote
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={savedNote ? 'ব্যক্তিগত নোট দেখুন/সম্পাদনা করুন' : 'ব্যক্তিগত নোট যোগ করুন'}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            {/* Direct Ask AI Button */}
                            <button
                              type="button"
                              onClick={() => handleDirectRuleAsk(rule)}
                              className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                              title="এই নিয়ম সম্পর্কে AI গৃহশিক্ষককে সরাসরি প্রশ্ন করুন"
                            >
                              <Bot className="h-4 w-4" />
                            </button>

                            {/* Bookmark Button */}
                            <button
                              type="button"
                              onClick={() => toggleRuleBookmark(rule.id)}
                              className={`p-2 rounded-xl transition-colors ${
                                isRuleBookmarked
                                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={isRuleBookmarked ? 'বুকমার্ক সরানো' : 'গুরুত্বপূর্ণ হিসেবে সংরক্ষণ'}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>

                            {/* Completion Checkmark */}
                            <button
                              type="button"
                              onClick={() => toggleRuleCompleted(rule.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isRuleDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{isRuleDone ? 'পড়া শেষ' : 'পড়া হয়েছে'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Personal Note Box (If Open or Exists) */}
                        {(isEditingNote || savedNote) && (
                          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                              <span className="flex items-center gap-1.5">
                                <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                                <span>আপনার ব্যক্তিগত পড়ার নোট (Personal Learning Note):</span>
                              </span>
                              {isEditingNote && (
                                <button
                                  type="button"
                                  onClick={() => handleSaveNote(rule.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-xs hover:bg-indigo-500"
                                >
                                  <Save className="h-3 w-3" />
                                  <span>সংরক্ষণ করুন</span>
                                </button>
                              )}
                            </div>

                            {isEditingNote ? (
                              <textarea
                                value={currentNoteText}
                                onChange={(e) => setCurrentNoteText(e.target.value)}
                                placeholder="এই নিয়মের জন্য আপনার ব্যক্তিগত শর্টকাট বা গুরুত্বপূর্ণ তথ্য এখানে লিখে রাখুন..."
                                className="w-full h-20 rounded-xl border border-indigo-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-hidden dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-200"
                              />
                            ) : (
                              <p className="bengali-text text-xs text-slate-700 dark:text-slate-300 italic">
                                "{savedNote}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Bengali In-Depth Explanation */}
                        <div className="space-y-2">
                          <p className="bengali-text text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                            {rule.explanationBn}
                          </p>
                          {rule.whyAndWhen && (
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 bengali-text">
                              <span className="font-bold text-slate-800 dark:text-slate-200">কেন ও কখন ব্যবহার করবেন: </span>
                              {rule.whyAndWhen}
                            </div>
                          )}
                        </div>

                        {/* Grammatical Formula Box */}
                        {rule.formula && (
                          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/40 border border-indigo-200/80 dark:border-indigo-900/60">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
                              গাণিতিক গঠন / ব্যাকরণিক ফর্মুলা (Grammar Formula)
                            </div>
                            <code className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200 font-mono select-all">
                              {rule.formula}
                            </code>
                          </div>
                        )}

                        {/* ── VISUAL LEARNING: Flowcharts & Decision Trees ───────── */}
                        {rule.visualDiagram && (
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                              <Compass className="h-4 w-4" />
                              <span>{rule.visualDiagram.title}</span>
                            </div>

                            <div className="space-y-2">
                              {rule.visualDiagram.steps.map((st, stIdx) => (
                                <div key={stIdx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <div className="flex items-center gap-2 sm:w-1/3 shrink-0">
                                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                      {st.step}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                      {st.condition}
                                    </span>
                                  </div>
                                  <div className="hidden sm:block text-slate-400">➔</div>
                                  <div className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-indigo-950 dark:text-indigo-300 bengali-text shadow-2xs">
                                    {st.resultBn}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── VISUAL LEARNING: Color-Coded Sentence Breakdown ──── */}
                        {rule.colorCodedSentence && rule.colorCodedSentence.length > 0 && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              <span>কালার-কোডেড বাক্য বিশ্লেষণ (Color-Coded Structure Breakdown)</span>
                            </div>

                            {/* Token Badges Row */}
                            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                              {rule.colorCodedSentence.map((tok, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${getTokenRoleStyle(tok.role)}`}
                                  title={`${tok.role.toUpperCase()}: ${tok.note}`}
                                >
                                  {tok.token}
                                </span>
                              ))}
                            </div>

                            {/* Token Notes Legend */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                              {rule.colorCodedSentence.map((tok, tIdx) => (
                                <div key={tIdx} className="flex items-baseline gap-1.5 bengali-text text-[11px]">
                                  <span className="font-bold text-indigo-700 dark:text-indigo-400 shrink-0">
                                    "{tok.token}":
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">{tok.note}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Examples Section */}
                        {rule.examples.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              বাস্তব বাক্যে প্রয়োগ ও বাংলা অর্থ (Examples)
                            </h5>
                            <div className="space-y-2">
                              {rule.examples.map((ex, exIdx) => (
                                <div
                                  key={exIdx}
                                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                                >
                                  <div className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                                    "{ex.english}"
                                  </div>
                                  <div className="bengali-text text-slate-600 dark:text-slate-300">
                                    অনুবাদ: {ex.bengali}
                                  </div>
                                  {ex.note && (
                                    <div className="bengali-text text-[11px] text-indigo-600 dark:text-indigo-400 pt-0.5">
                                      🔍 বিশ্লেষণ: {ex.note}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Correct vs Incorrect Sentences Table */}
                        {rule.correctVsIncorrect.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              সঠিক বনাম ভুল বাক্যের তুলনা (Correct vs Incorrect)
                            </h5>
                            <div className="space-y-2">
                              {rule.correctVsIncorrect.map((item, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900"
                                >
                                  <div className="flex items-start gap-2 text-rose-700 dark:text-rose-400">
                                    <X className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                                    <div>
                                      <span className="font-bold">ভুল: </span>
                                      <span className="line-through">{item.incorrect}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 text-emerald-700 dark:text-emerald-400">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                                    <div>
                                      <span className="font-bold">সঠিক: </span>
                                      <span>{item.correct}</span>
                                      <div className="bengali-text text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        কারণ: {item.reasonBn}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Callout Box: Exam Tricks & Shortcuts */}
                        {rule.examTricks.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                              <Lightbulb className="h-4 w-4" />
                              <span>বিসিএস শর্টকাট টেকনিক ও পরীক্ষার ট্রিক (Exam Tricks)</span>
                            </div>
                            {rule.examTricks.map((t, tIdx) => (
                              <p key={tIdx} className="bengali-text text-emerald-900 dark:text-emerald-200 leading-relaxed">
                                • {t}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Callout Box: Common Mistakes */}
                        {rule.commonMistakes.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                              <AlertTriangle className="h-4 w-4" />
                              <span>ছাত্রছাত্রীদের সাধারণ ভুল ও পরীক্ষকের ফাঁদ (Common Mistakes)</span>
                            </div>
                            {rule.commonMistakes.map((m, mIdx) => (
                              <p key={mIdx} className="bengali-text text-rose-900 dark:text-rose-200 leading-relaxed">
                                • {m}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Chapter Bottom Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                  {prevChapter ? (
                    <button
                      onClick={() => setSelectedChapterId(prevChapter.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>পূর্ববর্তী: {prevChapter.title}</span>
                    </button>
                  ) : <div />}

                  {nextChapter ? (
                    <button
                      onClick={() => setSelectedChapterId(nextChapter.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      <span>পরবর্তী: {nextChapter.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : <div />}
                </div>
              </div>
            )}

            {/* ── TAB 2: 10-Year BCS Question Analysis ────────────────────────── */}
            {activeTab === 'bcs_analysis' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-600" />
                      <span>বিগত ১০ বছরের বিসিএস প্রিলিমিনারি প্রশ্ন ব্যবচ্ছেদ</span>
                    </h3>
                    <p className="bengali-text text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ৩৫তম থেকে ৪৬তম বিসিএসে আসা প্রশ্নসমূহের কারণভিত্তিক অপশন বিশ্লেষণ ও ফাঁদ সনাক্তকরণ
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    {['All', '৪৬তম', '৪৫তম', '৪৪তম', '৪৩তম', '৪১তম', '৪০তম', '৩৮তম', '৩৭তম', '৩৫তম'].map((exam) => (
                      <button
                        key={exam}
                        onClick={() => setBcsFilterExam(exam)}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                          bcsFilterExam === exam
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredBcsQuestions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি। অন্য কোনো ফিল্টার নির্বাচন করুন।
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredBcsQuestions.map((bcs, qIdx) => (
                      <div
                        key={bcs.id}
                        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                      >
                        {/* Question Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold">
                            {bcs.bcsExam} ({bcs.year})
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            প্রশ্ন নং {qIdx + 1}
                          </span>
                        </div>

                        {/* Question Text */}
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {bcs.question}
                        </h4>

                        {/* 4 Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          {bcs.options.map((opt) => {
                            const isCorrect = opt.key === bcs.correctOption;
                            return (
                              <div
                                key={opt.key}
                                className={`p-3 rounded-xl border flex items-center justify-between ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 text-[11px] font-bold shrink-0">
                                    {opt.key}
                                  </span>
                                  <span>{opt.text}</span>
                                </div>
                                {isCorrect && <Check className="h-4 w-4 text-emerald-600" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* In-depth Answer Key & Option Breakdown */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs">
                            <div className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                              ✅ সঠিক উত্তরের পূর্ণাঙ্গ ব্যাখ্যা:
                            </div>
                            <p className="bengali-text text-slate-700 dark:text-slate-300 leading-relaxed">
                              {bcs.detailedExplanationBn}
                            </p>
                          </div>

                          {/* Individual Option Breakdown */}
                          {bcs.optionBreakdown.length > 0 && (
                            <div className="space-y-1.5 text-xs">
                              <span className="font-bold text-slate-600 dark:text-slate-400">প্রতিটি অপশনের চুলচেরা বিশ্লেষণ:</span>
                              {bcs.optionBreakdown.map((ob, obIdx) => (
                                <div key={obIdx} className="flex items-start gap-2 bengali-text text-[11.5px]">
                                  <span className={`font-bold shrink-0 ${ob.isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {ob.option}:
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">{ob.reasonBn}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Trap Pattern Notice */}
                          {bcs.trapPattern && (
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="bengali-text">
                                <span className="font-bold">পরীক্ষকের ফাঁদ (Exam Trap): </span>
                                {bcs.trapPattern}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: Interactive Practice & Exam Modes ────────────────────── */}
            {activeTab === 'practice' && (
              <div className="space-y-6">
                {/* Practice Sub-tab Switcher: MCQ / Fill in blanks / Error detection */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {currentChapter.title} - অনুশীলন ও মূল্যায়ন
                      </h3>
                      <p className="bengali-text text-xs text-slate-500">
                        বিভিন্ন ফরম্যাটের প্রশ্নের মাধ্যমে ব্যাকরণিক দক্ষতা যাচাই করুন
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setPracticeType('mcq')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        practiceType === 'mcq' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      MCQs ({filteredQuizQuestions.length})
                    </button>
                    <button
                      onClick={() => setPracticeType('fill_in_blank')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        practiceType === 'fill_in_blank' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Fill-in-the-Blanks
                    </button>
                    <button
                      onClick={() => setPracticeType('error_correction')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        practiceType === 'error_correction' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Error Spotting
                    </button>
                  </div>
                </div>

                {/* Sub-mode 1: Multiple Choice Questions */}
                {practiceType === 'mcq' && (
                  <div className="space-y-5">
                    {/* Score Summary Box (If Evaluated) */}
                    {showQuizResults && (
                      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-violet-900 text-white shadow-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">আপনার প্রাপ্ত ফলাফল</div>
                          <div className="text-2xl font-black mt-1">
                            {calculateQuizScore().correct} / {calculateQuizScore().total}
                          </div>
                          <p className="bengali-text text-xs text-indigo-200 mt-1">
                            {calculateQuizScore().correct === calculateQuizScore().total
                              ? 'চমৎকার! আপনার প্রস্তুতি অত্যন্ত মানসম্মত।'
                              : 'ভুল হওয়া প্রশ্নগুলোর ব্যাখ্যা মনোযোগ দিয়ে পড়ুন।'}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setShowQuizResults(false);
                            setUserAnswers({});
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-indigo-50 transition-all"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>পুনরায় পরীক্ষা দিন</span>
                        </button>
                      </div>
                    )}

                    {filteredQuizQuestions.map((q, idx) => {
                      const selectedOpt = userAnswers[q.id];

                      return (
                        <div
                          key={q.id}
                          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-400">
                              প্রশ্ন {idx + 1}
                            </span>
                            {q.bcsYearTag && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10.5px] font-bold">
                                {q.bcsYearTag}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {q.question}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((optText, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = q.correctIndex === optIdx;

                              let optStyle = 'bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/40 dark:hover:bg-indigo-950/40 border-slate-200 dark:border-slate-800';

                              if (showQuizResults) {
                                if (isCorrect) {
                                  optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-200 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  optStyle = 'bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-200';
                                }
                              } else if (isSelected) {
                                optStyle = 'bg-indigo-100 border-indigo-400 text-indigo-900 dark:bg-indigo-950 dark:border-indigo-600 dark:text-indigo-200 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${optStyle}`}
                                >
                                  <span>{optText}</span>
                                  {showQuizResults && isCorrect && (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  )}
                                  {showQuizResults && isSelected && !isCorrect && (
                                    <X className="h-4 w-4 text-rose-600" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showQuizResults && (
                            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs">
                              <div className="font-bold text-indigo-900 dark:text-indigo-200 mb-0.5">
                                ব্যাখ্যা (Explanation):
                              </div>
                              <p className="bengali-text text-slate-700 dark:text-slate-300">
                                {q.explanationBn}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!showQuizResults && filteredQuizQuestions.length > 0 && (
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={() => setShowQuizResults(true)}
                          className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                        >
                          উত্তরপত্র জমা দিন (Submit Test)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-mode 2: Fill-in-the-Blanks */}
                {practiceType === 'fill_in_blank' && (
                  <div className="space-y-4">
                    {currentChapter.rules.flatMap((r) => r.fillInTheBlanks || []).length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                        এই অধ্যায়ের জন্য ফিল-ইন-দ্য-ব্ল্যাংকস দ্রুত সংযোজন করা হচ্ছে। অনুগ্রহ করে এমসিকিউ মোড অনুশীলন করুন।
                      </div>
                    ) : (
                      currentChapter.rules.flatMap((r) => r.fillInTheBlanks || []).map((fib) => {
                        const userVal = fibAnswers[fib.id] || '';
                        const isChecked = fibChecked[fib.id];
                        const isRight = userVal.trim().toLowerCase() === fib.answer.toLowerCase();

                        return (
                          <div
                            key={fib.id}
                            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                          >
                            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-serif">
                              {fib.sentence}
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="সঠিক শব্দটি লিখুন..."
                                value={userVal}
                                onChange={(e) => {
                                  setFibAnswers((prev) => ({ ...prev, [fib.id]: e.target.value }));
                                  setFibChecked((prev) => ({ ...prev, [fib.id]: false }));
                                }}
                                className="w-56 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                              />
                              <button
                                onClick={() => setFibChecked((prev) => ({ ...prev, [fib.id]: true }))}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs"
                              >
                                যাচাই করুন
                              </button>
                            </div>

                            {isChecked && (
                              <div className={`p-3 rounded-xl border text-xs ${
                                isRight
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                                  : 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                              }`}>
                                <div className="font-bold">
                                  {isRight ? '🎉 সঠিক উত্তর!' : `❌ ভুল উত্তর। সঠিক উত্তর হলো: "${fib.answer}"`}
                                </div>
                                <div className="bengali-text text-[11px] mt-1">{fib.explanationBn}</div>
                              </div>
                            )}

                            <div className="bengali-text text-[11px] text-slate-400">
                              💡 ইঙ্গিত: {fib.hintBn}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Sub-mode 3: Error Spotting & Correction */}
                {practiceType === 'error_correction' && (
                  <div className="space-y-4">
                    {currentChapter.rules.flatMap((r) => r.errorCorrections || []).length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                        এই অধ্যায়ের জন্য এরর স্পটিং প্রশ্ন প্রস্তুত হচ্ছে।
                      </div>
                    ) : (
                      currentChapter.rules.flatMap((r) => r.errorCorrections || []).map((ec) => (
                        <div
                          key={ec.id}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                        >
                          <div className="text-xs font-bold text-rose-600 uppercase">ভুল বাক্য (Spot the Error):</div>
                          <div className="text-sm font-semibold text-rose-700 dark:text-rose-400 font-serif">
                            "{ec.incorrect}"
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-xs">
                            <div className="font-bold text-emerald-800 dark:text-emerald-300">
                              ✅ সঠিক রূপ: "{ec.correct}"
                            </div>
                            <div className="bengali-text text-slate-600 dark:text-slate-400 text-[11px]">
                              সংশোধনের কারণ: {ec.reasonBn}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: Bookmarks & Personal Notes ───────────────────────────── */}
            {activeTab === 'bookmarks_notes' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookmarkCheck className="h-5 w-5 text-amber-500" />
                    <span>আপনার বুকমার্ক ও ব্যক্তিগত পড়ার নোটসমূহ</span>
                  </h3>
                  <p className="bengali-text text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    গুরুত্বপূর্ণ চিহ্নিত করা নিয়ম এবং আপনার নিজস্ব নোটগুলোর সংকলন
                  </p>
                </div>

                {progress.bookmarkedRules.length === 0 && Object.keys(progress.personalNotes).length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    এখনও কোনো নিয়ম বুকমার্ক বা নোট লেখা হয়নি। পাঠ্যবই পড়ার সময় বুকমার্ক ও এডিট আইকনে ক্লিক করে নিজের মতো নোট লিখুন।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ALL_GRAMMAR_CHAPTERS.flatMap((c) =>
                      c.rules
                        .filter((r) => progress.bookmarkedRules.includes(r.id) || progress.personalNotes[r.id])
                        .map((rule) => {
                          const note = progress.personalNotes[rule.id];
                          const isBookmarked = progress.bookmarkedRules.includes(rule.id);

                          return (
                            <div
                              key={rule.id}
                              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div
                                  onClick={() => {
                                    setSelectedChapterId(c.id);
                                    setActiveTab('textbook');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <div className="text-[10px] font-bold text-indigo-600 uppercase">
                                    {c.title} • Rule {rule.ruleNumber}
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {rule.title} ({rule.bengaliTitle})
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {isBookmarked && (
                                    <button
                                      onClick={() => toggleRuleBookmark(rule.id)}
                                      className="p-1.5 text-amber-500 hover:text-slate-400 rounded-lg"
                                      title="বুকমার্ক মুছুন"
                                    >
                                      <BookmarkCheck className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <code className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                                {rule.formula}
                              </code>

                              {note && (
                                <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-xs bengali-text text-indigo-950 dark:text-indigo-200 italic">
                                  📝 আপনার নোট: "{note}"
                                </div>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: Quick Revision & Formula Cards ───────────────────────── */}
            {activeTab === 'revision' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span>{currentChapter.title} - দ্রুত রিভিশন পয়েন্ট ও সূত্র</span>
                  </h3>
                  <p className="bengali-text text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    পরীক্ষার আগের রাতে বা শেষ মুহূর্তের দ্রুত রিভিশনের জন্য মূল পয়েন্টসমূহ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentChapter.summaryRevisionNotes.map((note, nIdx) => (
                    <div
                      key={nIdx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-xs flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {nIdx + 1}
                      </span>
                      <p className="bengali-text text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* All Chapter Formulas Rapid Review Card */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Target className="h-4 w-4" />
                    <span>এই অধ্যায়ের সমস্ত ব্যাকরণিক সূত্রের দ্রুত একঝলক</span>
                  </div>

                  <div className="space-y-2">
                    {currentChapter.rules.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                        <div className="text-[11px] font-bold text-amber-400">
                          Rule {r.ruleNumber}: {r.bengaliTitle}
                        </div>
                        <code className="text-xs text-indigo-200 font-mono block">
                          {r.formula}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 6: AI Grammar Tutor ─────────────────────────────────────── */}
            {activeTab === 'tutor' && (
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[650px] overflow-hidden">
                {/* Tutor Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>AI Grammar Tutor (ব্যক্তিগত গৃহশিক্ষক)</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="bengali-text text-[10.5px] text-slate-500">
                        সংশ্লিষ্ট অধ্যায়: {currentChapter.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutor Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 smooth-scroll-container">
                  {tutorMessages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 bengali-text'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTutorLoading && (
                    <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 p-2">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <span className="bengali-text">AI গৃহশিক্ষক ব্যাকরণ বিশ্লেষণ করছেন...</span>
                    </div>
                  )}
                </div>

                {/* Prompt Suggestions */}
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  {[
                    'Lest এর পর should কেন বসে?',
                    'Gerund ও Participle চেনার সহজ উপায়',
                    'Made of বনাম Made from এর পার্থক্য',
                    'আমার এই বাক্যটি শুদ্ধ কি না পরীক্ষা করুন'
                  ].map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleAskTutor(p)}
                      className="shrink-0 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors bengali-text"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskTutor();
                  }}
                  className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="ইংরেজি ব্যাকরণ নিয়ে যেকোনো প্রশ্ন বাংলায় লিখুন বা কোনো বাক্য পরীক্ষা করতে দিন..."
                    value={tutorQuery}
                    onChange={(e) => setTutorQuery(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!tutorQuery.trim() || isTutorLoading}
                    className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
