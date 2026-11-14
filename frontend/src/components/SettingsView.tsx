'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Database, 
  Key, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Check, 
  Trash2,
  HardDrive
} from 'lucide-react';
import { offlineDB } from '../lib/db';

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [savedKey, setSavedKey] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [clearedMsg, setClearedMsg] = useState<string | null>(null);

  const handleSaveApiKey = () => {
    localStorage.setItem('engbengali_gemini_key', apiKey);
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2000);
  };

  const handleClearOfflineDB = async () => {
    if (confirm('Are you sure you want to clear offline cache? (Saved vocabulary will be re-synced from database)')) {
      await offlineDB.delete();
      await offlineDB.open();
      setClearedMsg('Offline cache cleared successfully.');
      setTimeout(() => setClearedMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="heading-font text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Platform Settings (সেটিংস)
        </h2>
        <p className="bengali-text text-sm text-slate-500 dark:text-slate-400">
          উচ্চারণ গতি, অফলাইন স্টোরেজ এবং এআই সেটিংস নিয়ন্ত্রণ করুন।
        </p>
      </div>

      {/* Speech Pronunciation Settings */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Audio Pronunciation Speed
          </h3>
        </div>
        <p className="bengali-text text-xs text-slate-500">
          ইংরেজি শিক্ষার্থী হিসেবে স্বাভাবিকের চেয়ে কিছুটা ধীর উচ্চারণ স্পষ্টভাবে বুঝতে সহায়ক।
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Normal (1.0x)', rate: 1.0 },
            { label: 'Learner Slow (0.85x)', rate: 0.85 },
            { label: 'Very Slow (0.65x)', rate: 0.65 },
          ].map((item) => (
            <button
              key={item.rate}
              onClick={() => setSpeechRate(item.rate)}
              className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                speechRate === item.rate
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Offline Storage Settings */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            IndexedDB Offline Storage (PWA)
          </h3>
        </div>
        <p className="bengali-text text-xs text-slate-500">
          আপনার সংরক্ষিত শব্দভাণ্ডার ও পাঠ্যসমূহ ব্রাউজারের IndexedDB ডাটাবেসে সম্পূর্ণ অফলাইনে সংরক্ষিত থাকে।
        </p>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Offline Cache Active</span>
            <span className="text-slate-500">IndexedDB: VocabularyLearningDB</span>
          </div>
          <button
            onClick={handleClearOfflineDB}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>
        {clearedMsg && (
          <p className="text-xs font-semibold text-emerald-600">{clearedMsg}</p>
        )}
      </div>

      {/* AI Assistant Key (Optional) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-amber-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Google Gemini API Key (Optional)
          </h3>
        </div>
        <p className="bengali-text text-xs text-slate-500">
          প্ল্যাটফর্মটি নিজস্ব উচ্চমানের বাংলা ডিকশনারি ও ফোনেটিক ইঞ্জিনের মাধ্যমে ডিফল্টভাবেই কাজ করে। গভীর এআই বিশ্লেষণের জন্য ঐচ্ছিকভাবে নিজস্ব API Key যুক্ত করতে পারেন।
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            onClick={handleSaveApiKey}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
          >
            {savedKey ? <Check className="h-4 w-4" /> : null}
            <span>{savedKey ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
