'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Image as ImageIcon, 
  UploadCloud, 
  Clipboard, 
  X, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { DocumentItem } from '../types';
import { 
  createTextDocument, 
  createUrlDocument, 
  uploadPdfDocument, 
  uploadImageDocument 
} from '../lib/api';

interface ImportModalProps {
  onClose: () => void;
  onDocumentLoaded: (doc: DocumentItem) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  onClose,
  onDocumentLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'url' | 'ocr' | 'text'>('pdf');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [urlInput, setUrlInput] = useState<string>('');
  const [textTitle, setTextTitle] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      let doc: DocumentItem | null = null;

      if (activeTab === 'pdf') {
        if (!pdfFile) throw new Error('Please select a PDF file');
        doc = await uploadPdfDocument(pdfFile);
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) throw new Error('Please enter a website article URL');
        doc = await createUrlDocument(urlInput.trim());
      } else if (activeTab === 'ocr') {
        if (!imageFile) throw new Error('Please select an image file (PNG, JPG, WebP)');
        doc = await uploadImageDocument(imageFile);
      } else if (activeTab === 'text') {
        if (!textContent.trim()) throw new Error('Please enter English text');
        doc = await createTextDocument(textTitle.trim() || 'English Reading Article', textContent.trim());
      }

      if (doc) {
        onDocumentLoaded(doc);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="heading-font text-lg font-bold text-slate-900 dark:text-white">
              Import English Content
            </h3>
            <p className="bengali-text text-xs text-slate-500">
              PDF, ওয়েবসাইটের আর্টিকেল, ইমেজ (OCR) বা টেক্সট আপলোড করুন।
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-100 p-1 mt-4 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTab === 'pdf' ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>PDF File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTab === 'url' ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Web URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTab === 'ocr' ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Image OCR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTab === 'text' ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* PDF Upload Tab */}
          {activeTab === 'pdf' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Upload English PDF Document
              </label>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/40">
                <UploadCloud className="mb-2 h-8 w-8 text-indigo-600" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {pdfFile ? pdfFile.name : 'Click to select or drag & drop PDF'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports standard English PDFs with layout preservation & OCR
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="mt-3 text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-indigo-700"
                />
              </div>
            </div>
          )}

          {/* Web Article URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Public Website Article URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://en.wikipedia.org/wiki/... or news article URL"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="bengali-text text-xs text-slate-400">
                বিজ্ঞাপন ও অতিরিক্ত মেনু স্বয়ংক্রিয়ভাবে বাদ দিয়ে পড়ার উপযোগী পরিষ্কার সংস্করণ তৈরি হবে।
              </p>
            </div>
          )}

          {/* Image OCR Tab */}
          {activeTab === 'ocr' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Upload Image with English Text (OCR)
              </label>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/40">
                <ImageIcon className="mb-2 h-8 w-8 text-indigo-600" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {imageFile ? imageFile.name : 'Select image (JPG, PNG, WebP)'}
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="mt-3 text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-indigo-700"
                />
              </div>
            </div>
          )}

          {/* Paste Text Tab */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="e.g. Daily Editorial, IELTS Passage..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  English Text Content
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  placeholder="Paste English paragraphs or stories here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Content...</span>
              </>
            ) : (
              <span>Start Interactive Reading</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
