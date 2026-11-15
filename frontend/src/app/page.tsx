'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DashboardView } from '../components/DashboardView';
import { LibraryView } from '../components/LibraryView';
import { InteractiveReader } from '../components/InteractiveReader';
import { WordDetailPanel } from '../components/WordDetailPanel';
import { VocabularyNotebookView } from '../components/VocabularyNotebookView';
import { SentenceTranslationPanel } from '../components/SentenceTranslationPanel';
import { FlashcardReviewModal } from '../components/FlashcardReviewModal';
import { ImportModal } from '../components/ImportModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { TranslationHistoryView } from '../components/TranslationHistoryView';
import { SettingsView } from '../components/SettingsView';

import { DocumentItem, VocabularyItem, TranslationItem, DashboardStats } from '../types';
import { 
  getDocuments, 
  getDocumentById,
  getVocabularies, 
  updateVocabulary, 
  deleteVocabulary, 
  deleteDocument,
  getDashboardStats,
  getTranslationHistory
} from '../lib/api';
import { useClipboardWatcher } from '../hooks/useClipboardWatcher';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_vocabularies: 0,
    learned_vocabularies: 0,
    unlearned_vocabularies: 0,
    total_documents: 0,
    total_translations: 0,
    today_words_count: 0,
    streak_days: 1,
  });

  // Active Reader and Word details
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [selectedWordVocab, setSelectedWordVocab] = useState<VocabularyItem | null>(null);

  // Modals and Drawers
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showTranslatePanel, setShowTranslatePanel] = useState<boolean>(false);
  const [translateInitialText, setTranslateInitialText] = useState<string>('');
  const [showFlashcards, setShowFlashcards] = useState<boolean>(false);
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);
  const [aiAssistantTarget, setAiAssistantTarget] = useState<{ text: string; context?: string }>({ text: '' });

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [docs, vocabs, statData, transHistory] = await Promise.all([
        getDocuments(),
        getVocabularies(),
        getDashboardStats(),
        getTranslationHistory(),
      ]);
      setDocuments(docs);
      setVocabularies(vocabs);
      setStats(statData);
      setTranslations(transHistory);

      if (docs.length > 0 && !selectedDoc) {
        setSelectedDoc(docs[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, [selectedDoc]);

  useEffect(() => {
    loadData();
    // Register service worker if available
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, [loadData]);

  // Clipboard copy watcher: automatically detect copied sentences
  useClipboardWatcher((copiedText) => {
    if (copiedText && copiedText.trim().length > 10) {
      setTranslateInitialText(copiedText.trim());
      setShowTranslatePanel(true);
    }
  });

  // Fast lookups for saved and learned word highlight in reader
  const savedWordsSet = useMemo(() => new Set(vocabularies.map((v) => v.word.toLowerCase())), [vocabularies]);
  const learnedWordsSet = useMemo(
    () => new Set(vocabularies.filter((v) => v.is_learned).map((v) => v.word.toLowerCase())),
    [vocabularies]
  );

  // Handle word selection from Interactive Reader
  const handleWordSelected = (vocab: VocabularyItem) => {
    setSelectedWordVocab(vocab);
    // Instant update vocabulary list without duplicate
    setVocabularies((prev) => {
      const existingIdx = prev.findIndex((v) => v.word.toLowerCase() === vocab.word.toLowerCase());
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = vocab;
        return copy;
      }
      return [vocab, ...prev];
    });
    // Update stats
    setStats((prev) => ({
      ...prev,
      total_vocabularies: prev.total_vocabularies + 1,
      today_words_count: prev.today_words_count + 1,
    }));
  };

  // Toggle single word learned from detail panel
  const handleToggleWordLearned = (id: number, current: boolean) => {
    handleUpdateVocabulary(id, { is_learned: !current });
  };

  // Update vocabulary
  const handleUpdateVocabulary = async (id: number, payload: Partial<VocabularyItem>) => {
    try {
      const updated = await updateVocabulary(id, payload);
      setVocabularies((prev) => prev.map((v) => (v.id === id ? updated : v)));
      if (selectedWordVocab && selectedWordVocab.id === id) {
        setSelectedWordVocab(updated);
      }
      // Refresh stats
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to update vocabulary:', err);
    }
  };

  // Delete vocabulary
  const handleDeleteVocabulary = async (id: number) => {
    try {
      await deleteVocabulary(id);
      setVocabularies((prev) => prev.filter((v) => v.id !== id));
      if (selectedWordVocab && selectedWordVocab.id === id) {
        setSelectedWordVocab(null);
      }
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to delete vocabulary:', err);
    }
  };

  // Delete document
  const handleDeleteDocument = async (id: number) => {
    if (confirm('Delete this document from your library?')) {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDoc && selectedDoc.id === id) {
        setSelectedDoc(documents.find((d) => d.id !== id) || null);
      }
    }
  };

  const handleDocumentLoaded = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
    setSelectedDoc(doc);
    setActiveTab('reader');
  };

  const handleSelectDocument = async (doc: DocumentItem) => {
    if (!doc.content) {
      try {
        const full = await getDocumentById(doc.id);
        setSelectedDoc(full);
      } catch {
        setSelectedDoc(doc);
      }
    } else {
      setSelectedDoc(doc);
    }
    setActiveTab('reader');
  };

  const handleAskAi = (word: string, context?: string) => {
    setAiAssistantTarget({ text: word, context });
    setShowAiAssistant(true);
  };

  return (
    <div className={`min-h-screen ${activeTab === 'reader' ? 'h-screen md:h-[100dvh] max-h-[100dvh] overflow-hidden' : 'pb-20 md:pb-0'} flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
      {/* Top Navigation */}
      <Navbar
        onOpenImport={() => setShowImportModal(true)}
        onOpenTranslate={() => {
          setTranslateInitialText('');
          setShowTranslatePanel(true);
        }}
        onOpenAiAssistant={() => {
          setAiAssistantTarget({ text: 'resilience', context: 'Language learning is a journey that demands patience and resilience.' });
          setShowAiAssistant(true);
        }}
        streakDays={stats.streak_days}
        activeSection={activeTab}
      />

      {/* Main Workspace */}
      <div className={`flex flex-1 min-h-0 ${activeTab === 'reader' ? 'h-full overflow-hidden pb-16 md:pb-0' : 'overflow-hidden'}`}>
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          vocabCount={vocabularies.length}
          onOpenImport={() => setShowImportModal(true)}
        />

        {/* Center Workspace Content */}
        <main
          className={`flex-1 min-h-0 ${
            activeTab === 'reader'
              ? 'h-full overflow-hidden p-2 sm:p-4 lg:p-6 flex flex-col'
              : 'overflow-y-auto p-3 sm:p-6 lg:p-8'
          } max-w-7xl mx-auto w-full`}
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              recentDocs={documents}
              recentVocabs={vocabularies}
              onSelectDocument={handleSelectDocument}
              onOpenImport={() => setShowImportModal(true)}
              onOpenTranslate={() => {
                setTranslateInitialText('');
                setShowTranslatePanel(true);
              }}
              onOpenAiAssistant={() => {
                setAiAssistantTarget({ text: 'fluency', context: '' });
                setShowAiAssistant(true);
              }}
              onNavigateToNotebook={() => setActiveTab('notebook')}
              onNavigateToReader={() => setActiveTab('reader')}
              onStartFlashcards={() => setShowFlashcards(true)}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              documents={documents}
              onSelectDocument={handleSelectDocument}
              onDeleteDocument={handleDeleteDocument}
              onOpenImport={() => setShowImportModal(true)}
            />
          )}

          {activeTab === 'reader' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full min-h-0 flex-1">
              {/* Left/Center Main Reading Area */}
              <div className="lg:col-span-8 h-full min-h-0 flex flex-col">
                {selectedDoc ? (
                  <InteractiveReader
                    document={selectedDoc}
                    onWordSelected={handleWordSelected}
                    onSentenceSelected={(sentence) => {
                      setTranslateInitialText(sentence);
                      setShowTranslatePanel(true);
                    }}
                    savedWordsSet={savedWordsSet}
                    learnedWordsSet={learnedWordsSet}
                    selectedWordVocab={selectedWordVocab}
                    onClearSelectedWord={() => setSelectedWordVocab(null)}
                    onToggleLearned={handleToggleWordLearned}
                    onAskAi={handleAskAi}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                    <p className="font-bold text-slate-700 dark:text-slate-300">No document selected</p>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                    >
                      Import Content
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side Vocabulary Popup / Details Panel */}
              <div className="hidden lg:flex lg:col-span-4 h-full min-h-0 flex-col rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
                <WordDetailPanel
                  vocabulary={selectedWordVocab}
                  onToggleLearned={handleToggleWordLearned}
                  onAskAi={handleAskAi}
                />
              </div>
            </div>
          )}

          {activeTab === 'notebook' && (
            <VocabularyNotebookView
              vocabularies={vocabularies}
              onUpdateVocabulary={handleUpdateVocabulary}
              onDeleteVocabulary={handleDeleteVocabulary}
              onStartFlashcards={() => setShowFlashcards(true)}
            />
          )}

          {activeTab === 'flashcards' && (
            <div className="py-6">
              <VocabularyNotebookView
                vocabularies={vocabularies}
                onUpdateVocabulary={handleUpdateVocabulary}
                onDeleteVocabulary={handleDeleteVocabulary}
                onStartFlashcards={() => setShowFlashcards(true)}
              />
            </div>
          )}

          {activeTab === 'translator' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <SentenceTranslationPanel
                initialText={translateInitialText}
              />
              <TranslationHistoryView
                translations={translations}
                onOpenTranslate={() => {
                  setTranslateInitialText('');
                  setShowTranslatePanel(true);
                }}
              />
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="max-w-2xl mx-auto py-4">
              <AiAssistantDrawer
                initialText={aiAssistantTarget.text || 'resilience'}
                contextSentence={aiAssistantTarget.context || 'Language learning is a transformative journey that demands patience and resilience.'}
                onClose={() => setActiveTab('dashboard')}
              />
            </div>
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Slide-out Sentence Translation Modal */}
      {showTranslatePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl smooth-scroll-container">
            <SentenceTranslationPanel
              initialText={translateInitialText}
              onClose={() => setShowTranslatePanel(false)}
            />
          </div>
        </div>
      )}

      {/* Import Content Modal (PDF / URL / OCR / Text) */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onDocumentLoaded={handleDocumentLoaded}
        />
      )}

      {/* Spaced Flashcards Practice Modal */}
      {showFlashcards && (
        <FlashcardReviewModal
          vocabularies={vocabularies}
          onClose={() => setShowFlashcards(false)}
          onUpdateVocabulary={handleUpdateVocabulary}
        />
      )}

      {/* AI Assistant Drawer */}
      {showAiAssistant && (
        <AiAssistantDrawer
          initialText={aiAssistantTarget.text}
          contextSentence={aiAssistantTarget.context}
          onClose={() => setShowAiAssistant(false)}
        />
      )}
    </div>
  );
}
