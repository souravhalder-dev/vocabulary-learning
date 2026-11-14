'use client';

import React from 'react';
import { 
  FileText, 
  Globe, 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  BookOpen, 
  ArrowRight,
  Clock,
  Plus
} from 'lucide-react';
import { DocumentItem } from '../types';

interface LibraryViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (id: number) => Promise<void>;
  onOpenImport: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  documents,
  onSelectDocument,
  onDeleteDocument,
  onOpenImport,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <UploadCloud className="h-5 w-5 text-rose-600" />;
      case 'url': return <Globe className="h-5 w-5 text-blue-600" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-amber-600" />;
      default: return <FileText className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-font text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Reading Library ({documents.length})
          </h2>
          <p className="bengali-text text-sm text-slate-500 dark:text-slate-400">
            আপনার সকল সংরক্ষিত PDF, আর্টিক্যাল ও টেক্সট। অফলাইনেও পড়তে পারবেন।
          </p>
        </div>
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Import New Content</span>
        </button>
      </div>

      {/* Grid of Documents */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-base">Your Library is Empty</h3>
          <p className="bengali-text text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            একটি PDF আপলোড করুন বা আর্টিকেলের লিঙ্ক দিয়ে ইন্টারেক্টিভ রিডিং শুরু করুন।
          </p>
          <button
            onClick={onOpenImport}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
          >
            Import Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      {getIcon(doc.source_type)}
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {doc.source_type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-opacity"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="line-clamp-2 font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-500 mt-1">
                    {(doc.content || '').slice(0, 150)}...
                  </p>
                </div>
              </div>

              {/* Footer info & Read button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{doc.total_words} words</span>
                </div>

                <button
                  onClick={() => onSelectDocument(doc)}
                  className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Read Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
