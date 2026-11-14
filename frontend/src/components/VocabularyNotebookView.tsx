'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Download, 
  Layers, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { VocabularyItem } from '../types';
import { speakEnglishText } from '../lib/speech';
import confetti from 'canvas-confetti';

interface VocabularyNotebookViewProps {
  vocabularies: VocabularyItem[];
  onUpdateVocabulary: (id: number, payload: Partial<VocabularyItem>) => Promise<void>;
  onDeleteVocabulary: (id: number) => Promise<void>;
  onStartFlashcards: () => void;
}

export const VocabularyNotebookView: React.FC<VocabularyNotebookViewProps> = ({
  vocabularies,
  onUpdateVocabulary,
  onDeleteVocabulary,
  onStartFlashcards,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLearned, setFilterLearned] = useState<'all' | 'learning' | 'learned'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMeaning, setEditMeaning] = useState<string>('');
  const [editPronunciation, setEditPronunciation] = useState<string>('');

  // Filter and search
  const filteredVocabularies = useMemo(() => {
    return vocabularies.filter((v) => {
      // Status filter
      if (filterLearned === 'learned' && !v.is_learned) return false;
      if (filterLearned === 'learning' && v.is_learned) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = v.word.toLowerCase().includes(q);
        const matchesMeaning = v.bengali_meaning.toLowerCase().includes(q);
        const matchesPron = v.bengali_pronunciation.toLowerCase().includes(q);
        return matchesWord || matchesMeaning || matchesPron;
      }
      return true;
    });
  }, [vocabularies, searchQuery, filterLearned]);

  const handleToggleLearned = async (id: number, current: boolean) => {
    if (!current) {
      // Trigger confetti celebration on learning a word!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    await onUpdateVocabulary(id, { is_learned: !current });
  };

  const startEditing = (vocab: VocabularyItem) => {
    setEditingId(vocab.id);
    setEditMeaning(vocab.bengali_meaning);
    setEditPronunciation(vocab.bengali_pronunciation);
  };

  const saveEditing = async (id: number) => {
    await onUpdateVocabulary(id, {
      bengali_meaning: editMeaning,
      bengali_pronunciation: editPronunciation,
    });
    setEditingId(null);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['English Word', 'Bengali Pronunciation', 'Bengali Meaning', 'English Definition', 'Example Sentence', 'Status', 'Date'],
      ...vocabularies.map((v) => [
        `"${v.word}"`,
        `"${v.bengali_pronunciation}"`,
        `"${v.bengali_meaning}"`,
        `"${v.english_definition.replace(/"/g, '""')}"`,
        `"${(v.example_sentence || '').replace(/"/g, '""')}"`,
        `"${v.is_learned ? 'Learned' : 'Learning'}"`,
        `"${v.created_at}"`,
      ]),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shobdoshadhon_vocabulary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const learnedCount = vocabularies.filter(v => v.is_learned).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-200">
              Personal Lexicon
            </span>
            <span className="text-xs text-indigo-300">Auto-saved from Reading</span>
          </div>
          <h2 className="heading-font text-2xl font-bold tracking-tight">
            Vocabulary Notebook (শব্দভাণ্ডার)
          </h2>
          <p className="bengali-text text-sm text-indigo-200 mt-1">
            মোট সংরক্ষিত শব্দ: {vocabularies.length} টি • আয়ত্ত করা শব্দ: {learnedCount} টি
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Flashcards Practice Button */}
          <button
            onClick={onStartFlashcards}
            disabled={vocabularies.length === 0}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:opacity-50 transition-colors"
          >
            <Layers className="h-4 w-4 text-indigo-600" />
            <span>Spaced Flashcards ({vocabularies.length})</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={vocabularies.length === 0}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/50 bg-indigo-800/40 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700/50 disabled:opacity-50 transition-colors"
            title="Download CSV notebook"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word, বাংলা উচ্চারণ, or বাংলা অর্থ..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900">
          {(['all', 'learning', 'learned'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterLearned(tab)}
              className={`rounded-lg px-3 py-1.5 capitalize transition-all ${
                filterLearned === tab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              {tab === 'all' ? `All (${vocabularies.length})` : tab === 'learning' ? `Learning (${vocabularies.length - learnedCount})` : `Learned (${learnedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Table (matching prompt specification table) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">English Word</th>
                <th className="py-3.5 px-4">Bengali Pronunciation (বাংলা উচ্চারণ)</th>
                <th className="py-3.5 px-4">Bengali Meaning (বাংলা অর্থ)</th>
                <th className="py-3.5 px-4 text-center">Audio</th>
                <th className="py-3.5 px-4">Document / Source</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVocabularies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <BookOpen className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="font-medium text-sm">No vocabulary words found</p>
                    <p className="bengali-text text-xs mt-1">
                      পড়ার সময় ইংরেজি শব্দে ক্লিক করলেই স্বয়ংক্রিয়ভাবে এখানে যুক্ত হবে।
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVocabularies.map((vocab) => {
                  const isEditing = editingId === vocab.id;

                  return (
                    <tr
                      key={vocab.id}
                      className="group transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      {/* Learned Checkbox */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleLearned(vocab.id, vocab.is_learned)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                          title={vocab.is_learned ? 'Mark as learning' : 'Mark as learned'}
                        >
                          {vocab.is_learned ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* English Word */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white capitalize">
                          <span>{vocab.word}</span>
                          {vocab.part_of_speech && (
                            <span className="text-[11px] font-normal italic text-slate-400">
                              ({vocab.part_of_speech})
                            </span>
                          )}
                        </div>
                        {vocab.example_sentence && (
                          <p className="line-clamp-1 text-xs text-slate-500 italic mt-0.5 max-w-xs">
                            "{vocab.example_sentence}"
                          </p>
                        )}
                      </td>

                      {/* Bengali Pronunciation */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPronunciation}
                            onChange={(e) => setEditPronunciation(e.target.value)}
                            className="bengali-text rounded border border-indigo-400 px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                          />
                        ) : (
                          <span className="bengali-text font-bold text-indigo-700 dark:text-indigo-400 text-base">
                            {vocab.bengali_pronunciation}
                          </span>
                        )}
                      </td>

                      {/* Bengali Meaning */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editMeaning}
                            onChange={(e) => setEditMeaning(e.target.value)}
                            className="bengali-text rounded border border-indigo-400 px-2 py-1 text-sm dark:bg-slate-800 dark:text-white w-full"
                          />
                        ) : (
                          <span className="bengali-text font-semibold text-slate-800 dark:text-slate-200">
                            {vocab.bengali_meaning}
                          </span>
                        )}
                      </td>

                      {/* Audio Button */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => speakEnglishText(vocab.word, { rate: 0.85 })}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 transition-colors"
                          title="Slow & clear audio pronunciation"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </td>

                      {/* Document Source */}
                      <td className="py-3.5 px-4">
                        <span className="truncate block max-w-[140px] text-xs text-slate-500 dark:text-slate-400" title={vocab.document_title || 'General'}>
                          {vocab.document_title || 'General'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEditing(vocab.id)}
                                className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                title="Save"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(vocab)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                                title="Edit meaning"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onDeleteVocabulary(vocab.id)}
                                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                title="Delete word"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
