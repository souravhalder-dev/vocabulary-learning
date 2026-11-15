import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Library, 
  BookOpenText, 
  BookmarkCheck, 
  Languages, 
  BrainCircuit, 
  Layers, 
  Settings,
  Sparkles,
  Menu,
  X,
  UploadCloud,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  vocabCount?: number;
  onOpenImport?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  vocabCount = 0,
  onOpenImport,
}) => {
  const [showMobileMore, setShowMobileMore] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'english-language', label: 'English Language', icon: GraduationCap, badge: 'BCS' },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'reader', label: 'Reading Room', icon: BookOpenText },
    { id: 'notebook', label: 'Vocabulary Notebook', icon: BookmarkCheck, badge: vocabCount },
    { id: 'flashcards', label: 'Spaced Flashcards', icon: Layers },
    { id: 'translator', label: 'Sentence Translator', icon: Languages },
    { id: 'assistant', label: 'AI Language Tutor', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMobileNavClick = (tabId: string) => {
    setShowMobileMore(false);
    onSelectTab(tabId);
  };

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
                  {item.badge !== undefined && (typeof item.badge === 'string' ? item.badge.length > 0 : item.badge > 0) && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      typeof item.badge === 'string'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300'
                    }`}>
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

      {/* Mobile Bottom Navigation Bar with Safe Area Support */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 shadow-lg">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'english-language', label: 'Grammar', icon: GraduationCap },
          { id: 'reader', label: 'Reader', icon: BookOpenText },
          { id: 'notebook', label: 'Notebook', icon: BookmarkCheck, badge: vocabCount },
          { id: 'translator', label: 'Translate', icon: Languages },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMobileNavClick(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          );
        })}

        {/* More Tools Button */}
        <button
          onClick={() => setShowMobileMore(!showMobileMore)}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
            showMobileMore || ['library', 'flashcards', 'assistant', 'settings'].includes(activeTab)
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Menu className="h-5 w-5 stroke-2" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile More Sheet */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowMobileMore(false)} 
            aria-label="Close"
          />
          <div className="relative z-10 rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-slide-up pb-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                All Learning Tools & Features
              </span>
              <button
                onClick={() => setShowMobileMore(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleMobileNavClick('flashcards')}
                className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 text-left dark:border-indigo-950/60 dark:bg-indigo-950/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Flashcards</div>
                  <div className="bengali-text text-[11px] text-slate-500">স্মৃতিকোষ অনুশীলন</div>
                </div>
              </button>

              <button
                onClick={() => handleMobileNavClick('assistant')}
                className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-3 text-left dark:border-violet-950/60 dark:bg-violet-950/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">AI Tutor</div>
                  <div className="bengali-text text-[11px] text-slate-500">সহজ বাংলা ব্যাখ্যা</div>
                </div>
              </button>

              <button
                onClick={() => handleMobileNavClick('library')}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-left dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white dark:bg-slate-700">
                  <Library className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Library</div>
                  <div className="bengali-text text-[11px] text-slate-500">সংরক্ষিত আর্টিকেল</div>
                </div>
              </button>

              <button
                onClick={() => handleMobileNavClick('settings')}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-left dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Settings</div>
                  <div className="bengali-text text-[11px] text-slate-500">অডিও ও সেটিংস</div>
                </div>
              </button>
            </div>

            {onOpenImport && (
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onOpenImport();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 p-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Import Content (PDF / URL / OCR / Text)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
