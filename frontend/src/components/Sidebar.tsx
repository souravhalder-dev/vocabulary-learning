'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Library, 
  BookOpenText, 
  BookmarkCheck, 
  Languages, 
  BrainCircuit, 
  Layers, 
  Settings,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  vocabCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  vocabCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'reader', label: 'Reading Room', icon: BookOpenText },
    { id: 'notebook', label: 'Vocabulary Notebook', icon: BookmarkCheck, badge: vocabCount },
    { id: 'flashcards', label: 'Spaced Flashcards', icon: Layers },
    { id: 'translator', label: 'Sentence Translator', icon: Languages },
    { id: 'assistant', label: 'AI Language Tutor', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          <div className="px-3 py-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Motivational Tip Card */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/50 p-3.5 dark:border-indigo-950/60 dark:from-indigo-950/30 dark:to-slate-900">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Daily Bengali Tip</span>
          </div>
          <p className="bengali-text text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            প্রতিটি শব্দের উচ্চারণ ও অর্থ একসাথে শুনলে স্মৃতিকোষে তা দীর্ঘস্থায়ী হয়।
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'library', label: 'Library', icon: Library },
          { id: 'reader', label: 'Reader', icon: BookOpenText },
          { id: 'notebook', label: 'Notebook', icon: BookmarkCheck },
          { id: 'translator', label: 'Translate', icon: Languages },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 text-xs font-medium ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
