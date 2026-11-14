'use client';

import React from 'react';
import { 
  Languages, 
  Volume2, 
  Trash2, 
  Clock, 
  Copy, 
  Check,
  Plus
} from 'lucide-react';
import { TranslationItem } from '../types';
import { speakEnglishText } from '../lib/speech';

interface TranslationHistoryViewProps {
  translations: TranslationItem[];
  onOpenTranslate: () => void;
  onDeleteTranslation?: (id: number) => void;
}

export const TranslationHistoryView: React.FC<TranslationHistoryViewProps> = ({
  translations,
  onOpenTranslate,
  onDeleteTranslation,
}) => {
  const [copiedId, setCopiedId] = React.useState<number | null>(null);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-font text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Translation & Pronunciation History ({translations.length})
          </h2>
          <p className="bengali-text text-sm text-slate-500 dark:text-slate-400">
            অনুশীলনকৃত সকল ইংরেজি বাক্য, বাংলা অনুবাদ ও বাংলা লিপিতে উচ্চারণ।
          </p>
        </div>
        <button
          onClick={onOpenTranslate}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Translation</span>
        </button>
      </div>

      {translations.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Languages className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No translations yet</p>
          <p className="bengali-text text-xs text-slate-400 mt-1">
            পড়ার সময় যেকোনো বাক্য কপি করুন বা অনুবাদক ব্যবহার করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {translations.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-2xl border border-slate-200/90 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    English Sentence
                  </span>
                  <p className="font-medium text-slate-900 dark:text-white text-base">
                    "{item.source_text}"
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => speakEnglishText(item.source_text, { rate: 0.85 })}
                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                    title="Listen slow pronunciation"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.bengali_translation, item.id || idx)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Copy Bengali translation"
                  >
                    {copiedId === (item.id || idx) ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Bengali translation & pronunciation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="rounded-xl bg-indigo-50/60 p-3 dark:bg-indigo-950/30">
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 block mb-0.5">
                    বাংলা অনুবাদ (Bengali Meaning):
                  </span>
                  <p className="bengali-text text-sm font-bold text-indigo-950 dark:text-indigo-200">
                    {item.bengali_translation}
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50/60 p-3 dark:bg-violet-950/30">
                  <span className="text-[11px] font-bold text-violet-700 dark:text-violet-400 block mb-0.5">
                    বাংলা লিপিতে উচ্চারণ (Bengali Script Pronunciation):
                  </span>
                  <p className="bengali-text text-sm font-semibold text-violet-950 dark:text-violet-200">
                    {item.bengali_pronunciation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
