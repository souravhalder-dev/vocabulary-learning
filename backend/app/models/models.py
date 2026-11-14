import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    source_type = Column(String(50), nullable=False) # 'pdf', 'url', 'image', 'text'
    source_url = Column(Text, nullable=True)
    file_path = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    html_content = Column(Text, nullable=True)
    pages_json = Column(Text, nullable=True) # JSON string of pages/paragraphs
    total_words = Column(Integer, default=0)
    current_page = Column(Integer, default=1)
    total_pages = Column(Integer, default=1)
    reading_progress = Column(Integer, default=0) # 0-100%
    last_read_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vocabularies = relationship("Vocabulary", back_populates="document", cascade="all, delete-orphan")


class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), nullable=False, index=True)
    original_word = Column(String(100), nullable=False)
    bengali_pronunciation = Column(String(200), nullable=False)
    bengali_meaning = Column(Text, nullable=False)
    english_definition = Column(Text, nullable=False)
    ipa_phonetic = Column(String(100), nullable=True)
    part_of_speech = Column(String(50), nullable=True)
    example_sentence = Column(Text, nullable=True)
    bengali_example = Column(Text, nullable=True)
    context_sentence = Column(Text, nullable=True)
    
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    document_title = Column(String(255), nullable=True)
    
    synonyms_json = Column(Text, nullable=True) # JSON list of {word, bengali_pronunciation, bengali_meaning}
    antonyms_json = Column(Text, nullable=True) # JSON list of {word, bengali_pronunciation, bengali_meaning}

    is_learned = Column(Boolean, default=False, index=True)
    review_count = Column(Integer, default=0)
    leitner_box = Column(Integer, default=1)
    next_review_at = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    document = relationship("Document", back_populates="vocabularies")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    source_text = Column(Text, nullable=False)
    bengali_translation = Column(Text, nullable=False)
    bengali_pronunciation = Column(Text, nullable=False)
    context = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class LearningStreak(Base):
    __tablename__ = "learning_streaks"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(10), nullable=False, unique=True) # YYYY-MM-DD
    words_clicked = Column(Integer, default=0)
    words_reviewed = Column(Integer, default=0)
    sentences_translated = Column(Integer, default=0)
    reading_time_minutes = Column(Integer, default=0)
