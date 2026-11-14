'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Flame, 
  Wifi, 
  WifiOff, 
  PlusCircle, 
  Languages, 
  Moon, 
  Sun,
  BrainCircuit
} from 'lucide-react';

interface NavbarProps {
  onOpenImport: () => void;
  onOpenTranslate: () => void;
  onOpenAiAssistant: () => void;
  streakDays?: number;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenImport,
  onOpenTranslate,
  onOpenAiAssistant,
  streakDays = 1,
  activeSection,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="heading-font text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              ShobdoShadhon
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              AI English-বাংলা
            </span>
          </div>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Smart Reading & Vocabulary for Bengali Speakers
          </p>
        </div>
      </div>

      {/* Action buttons & indicators */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Online / Offline status badge */}
        <div 
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
            isOnline 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
          }`}
          title={isOnline ? 'Online - Cloud AI Connected' : 'Offline Mode - Local IndexedDB Active'}
        >
          {isOnline ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Online</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <WifiOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Offline (PWA)</span>
            </>
          )}
        </div>

        {/* Learning Streak */}
        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span>{streakDays} Day Streak</span>
        </div>

        {/* Sentence Translate Button */}
        <button
          onClick={onOpenTranslate}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
          title="Sentence Translation & Clipboard"
        >
          <Languages className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Translate</span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
        >
          <BrainCircuit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">AI Tutor</span>
        </button>

        {/* Import / Upload Button */}
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Import</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
