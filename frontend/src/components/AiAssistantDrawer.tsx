'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  BookOpen, 
  Layers, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { AIAssistantItem } from '../types';
import { getAiAssistantGuidance } from '../lib/api';

interface AiAssistantDrawerProps {
  initialText?: string;
  contextSentence?: string;
  onClose: () => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  initialText = '',
  contextSentence = '',
  onClose,
}) => {
  const [queryText, setQueryText] = useState<string>(initialText);
  const [context, setContext] = useState<string>(contextSentence);
  const [mode, setMode] = useState<string>('explain_word');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIAssistantItem | null>(null);

  const handleAskAssistant = async (selectedMode?: string) => {
    const text = queryText.trim();
    if (!text) return;

    setLoading(true);
    try {
      const data = await getAiAssistantGuidance(text, context, selectedMode || mode);
      setResult(data);
    } catch (err) {
      console.error('AI Assistant query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const modeOptions = [
    { id: 'explain_word', label: 'Word in Context', desc: 'প্রাসঙ্গিক অর্থ ও প্রয়োগ' },
    { id: 'explain_sentence', label: 'Sentence Breakdown', desc: 'বাক্যের সহজ বাংলা বিশ্লেষণ' },
    { id: 'grammar', label: 'Grammar & Structure', desc: 'টেন্স ও ব্যাকরণ নিয়ম' },
    { id: 'idiom', label: 'Idioms & Phrases', desc: 'বাগধারা ও ভাবার্থ' },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-label="Close backdrop"
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="heading-font text-base font-bold text-slate-900 dark:text-white">
              AI English Tutor (বাংলায় ব্যাখ্যা)
            </h3>
            <p className="text-xs text-slate-500">Contextual English Learning Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {modeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setMode(opt.id);
                if (queryText.trim()) handleAskAssistant(opt.id);
              }}
              className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                mode === opt.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400'
              }`}
            >
              <span className="font-semibold">{opt.label}</span>
              <span className="bengali-text text-[11px] text-slate-400 mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Target English Word or Sentence
          </label>
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="e.g. resilience, idiom, or full sentence"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Context box */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">
            Surrounding Context (Optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
            placeholder="Paste the paragraph or sentence here for precise context..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          onClick={() => handleAskAssistant()}
          disabled={loading || !queryText.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>Explain in Bengali</span>
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            {/* Bengali explanation */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-4 dark:border-indigo-950/60 dark:from-indigo-950/30 dark:to-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                <Lightbulb className="h-4 w-4" />
                <span>সহজ ভাষায় বাংলা ব্যাখ্যা (Bengali Explanation)</span>
              </div>
              <p className="bengali-text text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {result.bengali_explanation}
              </p>
            </div>

            {/* Grammar notes if any */}
            {result.grammar_notes && result.grammar_notes.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40 space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  ব্যাকরণ ও গঠনের বিশেষ বিষয়:
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                  {result.grammar_notes.map((note, i) => (
                    <li key={i} className="bengali-text">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related phrases */}
            {result.related_phrases && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-500">Related Practice:</span>
                <div className="flex flex-wrap gap-1">
                  {result.related_phrases.map((phrase, i) => (
                    <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
