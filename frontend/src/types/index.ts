export interface DocumentItem {
  id: number;
  title: string;
  source_type: 'pdf' | 'url' | 'image' | 'text';
  source_url?: string;
  file_path?: string;
  content: string;
  html_content?: string;
  pages_json?: string;
  total_words: number;
  current_page: number;
  total_pages: number;
  reading_progress: number;
  last_read_at: string;
  created_at: string;
}

export type AccentType = 'uk' | 'us';

export interface AccentPronunciation {
  ipa: string;
  bengali_pronunciation: string;
  audio_url?: string;
  source: 'dictionary_verified' | 'ai_verified' | 'rule_fallback' | 'unavailable';
}

export interface WordRelationItem {
  word: string;
  bengali_pronunciation: string;
  bengali_meaning: string;
}

export interface VocabularyItem {
  id: number;
  word: string;
  original_word: string;
  // Default (UK) pronunciation
  bengali_pronunciation: string;
  bengali_meaning: string;
  english_definition: string;
  ipa_phonetic?: string;
  audio_url?: string;

  // Dual Accent Pronunciation Data (British English UK default vs American English US alternative)
  active_accent?: AccentType;
  pronunciation_uk?: AccentPronunciation;
  pronunciation_us?: AccentPronunciation;

  part_of_speech?: string;
  example_sentence?: string;
  bengali_example?: string;
  context_sentence?: string;
  document_id?: number;
  document_title?: string;
  synonyms_json?: string;
  antonyms_json?: string;
  synonyms?: WordRelationItem[];
  antonyms?: WordRelationItem[];
  is_learned: boolean;
  review_count: number;
  leitner_box: number;
  next_review_at?: string;
  notes?: string;
  created_at: string;
}

export interface TranslationItem {
  id?: number;
  source_text: string;
  bengali_translation: string;
  bengali_pronunciation: string;
  context?: string;
  created_at?: string;
}

export interface AIAssistantItem {
  result: string;
  bengali_explanation: string;
  grammar_notes?: string[];
  vocabulary_breakdown?: Array<{
    word: string;
    bengali_meaning: string;
    role: string;
  }>;
  related_phrases?: string[];
}

export interface DashboardStats {
  total_vocabularies: number;
  learned_vocabularies: number;
  unlearned_vocabularies: number;
  total_documents: number;
  total_translations: number;
  today_words_count: number;
  streak_days: number;
}
