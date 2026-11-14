from typing import Optional, List, Any
from pydantic import BaseModel, HttpUrl, ConfigDict
from datetime import datetime

# Document schemas
class DocumentBase(BaseModel):
    title: str
    source_type: str # 'pdf', 'url', 'image', 'text'
    source_url: Optional[str] = None

class DocumentCreate(BaseModel):
    title: str
    source_type: str
    content: str
    source_url: Optional[str] = None
    html_content: Optional[str] = None
    pages_json: Optional[str] = None

class DocumentUrlRequest(BaseModel):
    url: str

class DocumentProgressUpdate(BaseModel):
    current_page: int
    reading_progress: int

class DocumentResponse(DocumentBase):
    id: int
    content: str
    html_content: Optional[str] = None
    pages_json: Optional[str] = None
    total_words: int
    current_page: int
    total_pages: int
    reading_progress: int
    last_read_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DocumentListItem(DocumentBase):
    id: int
    content: Optional[str] = ""
    html_content: Optional[str] = None
    pages_json: Optional[str] = None
    total_words: int
    current_page: int
    total_pages: int
    reading_progress: int
    last_read_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Vocabulary schemas
class VocabularyCreate(BaseModel):
    word: str
    original_word: Optional[str] = None
    bengali_pronunciation: Optional[str] = None
    bengali_meaning: Optional[str] = None
    english_definition: Optional[str] = None
    ipa_phonetic: Optional[str] = None
    part_of_speech: Optional[str] = None
    example_sentence: Optional[str] = None
    bengali_example: Optional[str] = None
    context_sentence: Optional[str] = None
    document_id: Optional[int] = None
    document_title: Optional[str] = None
    synonyms_json: Optional[str] = None
    antonyms_json: Optional[str] = None
    notes: Optional[str] = None

class VocabularyUpdate(BaseModel):
    bengali_pronunciation: Optional[str] = None
    bengali_meaning: Optional[str] = None
    english_definition: Optional[str] = None
    example_sentence: Optional[str] = None
    is_learned: Optional[bool] = None
    notes: Optional[str] = None
    leitner_box: Optional[int] = None

class VocabularyLookupRequest(BaseModel):
    word: str
    context_sentence: Optional[str] = None
    document_id: Optional[int] = None
    document_title: Optional[str] = None

class VocabularyResponse(BaseModel):
    id: int
    word: str
    original_word: str
    bengali_pronunciation: str
    bengali_meaning: str
    english_definition: str
    ipa_phonetic: Optional[str] = None
    part_of_speech: Optional[str] = None
    example_sentence: Optional[str] = None
    bengali_example: Optional[str] = None
    context_sentence: Optional[str] = None
    document_id: Optional[int] = None
    document_title: Optional[str] = None
    synonyms_json: Optional[str] = None
    antonyms_json: Optional[str] = None
    synonyms: Optional[List[dict]] = None
    antonyms: Optional[List[dict]] = None
    is_learned: bool
    review_count: int
    leitner_box: int
    next_review_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Translation schemas
class TranslationRequest(BaseModel):
    text: str
    context: Optional[str] = None

class TranslationResponse(BaseModel):
    id: Optional[int] = None
    source_text: str
    bengali_translation: str
    bengali_pronunciation: str
    context: Optional[str] = None
    created_at: Optional[datetime] = None


# AI Assistant schemas
class AIAssistantRequest(BaseModel):
    text: str
    context: Optional[str] = None
    mode: str # 'explain_word', 'explain_sentence', 'grammar', 'idiom', 'breakdown'

class AIAssistantResponse(BaseModel):
    result: str
    bengali_explanation: str
    grammar_notes: Optional[List[str]] = None
    vocabulary_breakdown: Optional[List[dict]] = None
    related_phrases: Optional[List[str]] = None


# Stats & Streaks
class DashboardStatsResponse(BaseModel):
    total_vocabularies: int
    learned_vocabularies: int
    unlearned_vocabularies: int
    total_documents: int
    total_translations: int
    today_words_count: int
    streak_days: int
