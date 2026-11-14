import csv
import io
import re
import json
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.models import Vocabulary, Document
from app.schemas.schemas import (
    VocabularyCreate,
    VocabularyUpdate,
    VocabularyLookupRequest,
    VocabularyResponse
)
from app.services.bengali_phonetics import transliterate_word_to_bengali
from app.services.ai_service import lookup_word_with_context

router = APIRouter(prefix="/api/vocabulary", tags=["vocabulary"])

def format_vocab_response(v: Vocabulary) -> dict:
    syns = []
    ants = []
    if v.synonyms_json:
        try:
            syns = json.loads(v.synonyms_json)
        except Exception:
            pass
    if v.antonyms_json:
        try:
            ants = json.loads(v.antonyms_json)
        except Exception:
            pass
    return {
        "id": v.id,
        "word": v.word,
        "original_word": v.original_word,
        "bengali_pronunciation": v.bengali_pronunciation,
        "bengali_meaning": v.bengali_meaning,
        "english_definition": v.english_definition,
        "ipa_phonetic": v.ipa_phonetic,
        "part_of_speech": v.part_of_speech,
        "example_sentence": v.example_sentence,
        "bengali_example": v.bengali_example,
        "context_sentence": v.context_sentence,
        "document_id": v.document_id,
        "document_title": v.document_title,
        "is_learned": v.is_learned,
        "review_count": v.review_count,
        "leitner_box": v.leitner_box,
        "next_review_at": v.next_review_at,
        "notes": v.notes,
        "created_at": v.created_at,
        "synonyms_json": v.synonyms_json,
        "antonyms_json": v.antonyms_json,
        "synonyms": syns,
        "antonyms": ants
    }

@router.post("/lookup", response_model=VocabularyResponse)
async def lookup_and_auto_save_word(payload: VocabularyLookupRequest, db: Session = Depends(get_db)):
    """
    Looks up a word contextually with full synonyms and antonyms.
    Automatically saves the word to the user's vocabulary notebook without duplicates!
    If the word already exists, updates context or returns existing entry.
    """
    clean_word = re.sub(r"[^a-zA-Z]", "", payload.word).strip().lower()
    if not clean_word:
        raise HTTPException(status_code=400, detail="Invalid word")

    existing = db.query(Vocabulary).filter(Vocabulary.word == clean_word).first()
    
    if existing:
        # Check if existing entry has a placeholder or lacks synonyms/antonyms
        needs_enrichment = (
            "পারিভাষিক অর্থ" in existing.bengali_meaning 
            or not existing.bengali_meaning.strip() 
            or "অর্থ লোড" in existing.bengali_meaning
            or not existing.synonyms_json
        )
        if needs_enrichment:
            details = await lookup_word_with_context(clean_word, payload.context_sentence)
            if details.get("bengali_meaning") and "পারিভাষিক অর্থ" not in details["bengali_meaning"]:
                existing.bengali_meaning = details["bengali_meaning"]
            if details.get("english_definition") and "Definition of" not in details["english_definition"]:
                existing.english_definition = details["english_definition"]
            if details.get("part_of_speech") and existing.part_of_speech in (None, "word"):
                existing.part_of_speech = details["part_of_speech"]
            if details.get("ipa_phonetic"):
                existing.ipa_phonetic = details["ipa_phonetic"]
            if details.get("example_sentence") and not existing.example_sentence:
                existing.example_sentence = details["example_sentence"]
            if details.get("bengali_example"):
                existing.bengali_example = details["bengali_example"]
            if details.get("synonyms"):
                existing.synonyms_json = json.dumps(details["synonyms"])
            if details.get("antonyms"):
                existing.antonyms_json = json.dumps(details["antonyms"])
            db.commit()
            db.refresh(existing)
            return format_vocab_response(existing)

        # Always ensure authentic Bengali pronunciation is kept up to date
        correct_pron = transliterate_word_to_bengali(clean_word, existing.ipa_phonetic)
        if existing.bengali_pronunciation != correct_pron and correct_pron:
            existing.bengali_pronunciation = correct_pron

        # If new context provided and old context was missing, update context
        if payload.context_sentence and not existing.context_sentence:
            existing.context_sentence = payload.context_sentence
            if payload.document_id:
                existing.document_id = payload.document_id
            if payload.document_title:
                existing.document_title = payload.document_title
        db.commit()
        db.refresh(existing)
        return format_vocab_response(existing)

    # Lookup contextual details
    details = await lookup_word_with_context(clean_word, payload.context_sentence)
    
    # Auto-save to notebook
    new_vocab = Vocabulary(
        word=clean_word,
        original_word=payload.word,
        bengali_pronunciation=details.get("bengali_pronunciation", ""),
        bengali_meaning=details.get("bengali_meaning", ""),
        english_definition=details.get("english_definition", ""),
        ipa_phonetic=details.get("ipa_phonetic"),
        part_of_speech=details.get("part_of_speech"),
        example_sentence=details.get("example_sentence"),
        bengali_example=details.get("bengali_example"),
        context_sentence=payload.context_sentence,
        document_id=payload.document_id,
        document_title=payload.document_title,
        synonyms_json=json.dumps(details.get("synonyms", [])),
        antonyms_json=json.dumps(details.get("antonyms", [])),
        is_learned=False,
        leitner_box=1
    )
    db.add(new_vocab)
    db.commit()
    db.refresh(new_vocab)
    return format_vocab_response(new_vocab)


@router.get("", response_model=List[VocabularyResponse])
def list_vocabularies(
    q: Optional[str] = Query(None, description="Search query"),
    learned: Optional[bool] = Query(None, description="Filter by learned status"),
    doc_id: Optional[int] = Query(None, description="Filter by document id"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Vocabulary)

    if q:
        search = f"%{q.strip().lower()}%"
        query = query.filter(
            (Vocabulary.word.ilike(search)) |
            (Vocabulary.bengali_meaning.ilike(search)) |
            (Vocabulary.bengali_pronunciation.ilike(search))
        )
    if learned is not None:
        query = query.filter(Vocabulary.is_learned == learned)
    if doc_id is not None:
        query = query.filter(Vocabulary.document_id == doc_id)

    items = query.order_by(Vocabulary.created_at.desc()).offset(offset).limit(limit).all()
    return [format_vocab_response(item) for item in items]


@router.post("", response_model=VocabularyResponse)
def create_vocabulary(item: VocabularyCreate, db: Session = Depends(get_db)):
    clean_word = re.sub(r"[^a-zA-Z]", "", item.word).strip().lower()
    existing = db.query(Vocabulary).filter(Vocabulary.word == clean_word).first()
    if existing:
        return existing

    vocab = Vocabulary(
        word=clean_word,
        original_word=item.original_word or item.word,
        bengali_pronunciation=item.bengali_pronunciation or "",
        bengali_meaning=item.bengali_meaning or "",
        english_definition=item.english_definition or "",
        ipa_phonetic=item.ipa_phonetic,
        part_of_speech=item.part_of_speech,
        example_sentence=item.example_sentence,
        bengali_example=item.bengali_example,
        context_sentence=item.context_sentence,
        document_id=item.document_id,
        document_title=item.document_title,
        notes=item.notes
    )
    db.add(vocab)
    db.commit()
    db.refresh(vocab)
    return vocab


@router.patch("/{vocab_id}", response_model=VocabularyResponse)
def update_vocabulary(vocab_id: int, payload: VocabularyUpdate, db: Session = Depends(get_db)):
    vocab = db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary entry not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(vocab, key, value)

    db.commit()
    db.refresh(vocab)
    return vocab


@router.delete("/{vocab_id}")
def delete_vocabulary(vocab_id: int, db: Session = Depends(get_db)):
    vocab = db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary entry not found")

    db.delete(vocab)
    db.commit()
    return {"message": "Vocabulary entry deleted successfully"}


@router.get("/export/csv")
def export_vocabulary_csv(db: Session = Depends(get_db)):
    items = db.query(Vocabulary).order_by(Vocabulary.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_NONNUMERIC)
    writer.writerow([
        "English Word",
        "Bengali Pronunciation",
        "Bengali Meaning",
        "English Definition",
        "Part of Speech",
        "Example Sentence",
        "Bengali Example",
        "Reading Context",
        "Source Document",
        "Learned Status",
        "Date Saved"
    ])

    for v in items:
        writer.writerow([
            v.word,
            v.bengali_pronunciation,
            v.bengali_meaning,
            v.english_definition,
            v.part_of_speech or "",
            v.example_sentence or "",
            v.bengali_example or "",
            v.context_sentence or "",
            v.document_title or "",
            "Learned" if v.is_learned else "Learning",
            v.created_at.strftime("%Y-%m-%d %H:%M:%S") if v.created_at else ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=vocabulary_notebook.csv"}
    )
