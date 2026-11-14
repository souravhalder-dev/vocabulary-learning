import Dexie, { Table } from 'dexie';
import { DocumentItem, VocabularyItem, TranslationItem } from '../types';

export interface OfflineAction {
  id?: number;
  action: 'create_vocab' | 'update_vocab' | 'delete_vocab' | 'update_progress';
  payload: any;
  timestamp: number;
}

export class VocabularyLearningDB extends Dexie {
  documents!: Table<DocumentItem, number>;
  vocabularies!: Table<VocabularyItem, number>;
  translations!: Table<TranslationItem, number>;
  syncQueue!: Table<OfflineAction, number>;

  constructor() {
    super('VocabularyLearningDB');
    this.version(1).stores({
      documents: 'id, title, source_type, last_read_at, reading_progress',
      vocabularies: 'id, word, is_learned, leitner_box, document_id, created_at',
      translations: '++id, source_text, created_at',
      syncQueue: '++id, action, timestamp'
    });
  }
}

export const offlineDB = new VocabularyLearningDB();
