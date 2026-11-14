import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.models import Document, Vocabulary, Translation
from app.routers import documents, vocabulary, translate, ai, stats

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AI-Powered English Reading & Vocabulary Learning Platform for Bengali Speakers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploaded files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(documents.router)
app.include_router(vocabulary.router)
app.include_router(translate.router)
app.include_router(ai.router)
app.include_router(stats.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME, "version": "1.0.0"}

# Seed initial sample data if database is empty
def seed_initial_data():
    db = SessionLocal()
    try:
        if db.query(Document).count() == 0:
            sample_article = (
                "Language learning is a transformative journey that demands patience, curiosity, and resilience. "
                "Every dedicated student encounters moments of doubt, but consistent daily reading practice unlocks profound fluency. "
                "When you read authentic English articles, your mind naturally absorbs sophisticated vocabulary and sentence structures. "
                "Technology has created remarkable opportunities for learners across the world. "
                "By embracing every intellectual challenge with optimism and perseverance, you build enduring confidence. "
                "Remember, significant progress is achieved not through sudden miracles, but through steady, meticulous efforts every single day."
            )
            doc = Document(
                title="The Art of Mindful Language Learning",
                source_type="text",
                content=sample_article,
                total_words=len(sample_article.split()),
                total_pages=1,
                current_page=1,
                reading_progress=0
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)

            sample_words = [
                {
                    "word": "student",
                    "original_word": "student",
                    "bengali_pronunciation": "স্টুডেন্ট",
                    "bengali_meaning": "শিক্ষার্থী / ছাত্র",
                    "english_definition": "A person who is studying at a school, college, or university.",
                    "part_of_speech": "noun",
                    "example_sentence": "Every dedicated student encounters moments of doubt.",
                    "bengali_example": "প্রতিটি একনিষ্ঠ শিক্ষার্থী সন্দেহের মুহূর্তের মুখোমুখি হয়।",
                    "context_sentence": "Every dedicated student encounters moments of doubt, but consistent daily reading practice unlocks profound fluency.",
                    "document_id": doc.id,
                    "document_title": doc.title,
                    "is_learned": False,
                    "leitner_box": 1
                },
                {
                    "word": "resilience",
                    "original_word": "resilience",
                    "bengali_pronunciation": "রেজিলিয়েন্স",
                    "bengali_meaning": "প্রতিকূলতা কাটিয়ে ওঠার ক্ষমতা",
                    "english_definition": "The capacity to recover quickly from difficulties; toughness.",
                    "part_of_speech": "noun",
                    "example_sentence": "Language learning demands patience, curiosity, and resilience.",
                    "bengali_example": "ভাষা শেখার জন্য ধৈর্য, কৌতূহল এবং সহনশীলতা প্রয়োজন।",
                    "context_sentence": "Language learning is a transformative journey that demands patience, curiosity, and resilience.",
                    "document_id": doc.id,
                    "document_title": doc.title,
                    "is_learned": True,
                    "leitner_box": 2
                },
                {
                    "word": "significant",
                    "original_word": "significant",
                    "bengali_pronunciation": "সিগনিফিক্যান্ট",
                    "bengali_meaning": "গুরুত্বপূর্ণ / তাৎপর্যপূর্ণ",
                    "english_definition": "Sufficiently great or important to be worthy of attention; noteworthy.",
                    "part_of_speech": "adjective",
                    "example_sentence": "Significant progress is achieved through steady efforts.",
                    "bengali_example": "ধারাবাহিক প্রচেষ্টার মাধ্যমে তাৎপর্যপূর্ণ অগ্রগতি অর্জিত হয়।",
                    "context_sentence": "Significant progress is achieved not through sudden miracles, but through steady, meticulous efforts every single day.",
                    "document_id": doc.id,
                    "document_title": doc.title,
                    "is_learned": False,
                    "leitner_box": 1
                }
            ]

            for sw in sample_words:
                vocab = Vocabulary(**sw)
                db.add(vocab)

            # Sample translation
            trans = Translation(
                source_text="I am trying to improve my English reading skills.",
                bengali_translation="আমি আমার ইংরেজি পড়ার দক্ষতা উন্নত করার চেষ্টা করছি।",
                bengali_pronunciation="আই অ্যাম ট্রাইং টু ইমপ্রুভ মাই ইংলিশ রিডিং স্কিলস।",
                context="Sample sentence translation"
            )
            db.add(trans)
            db.commit()
    except Exception as e:
        print(f"Seed error: {e}")
    finally:
        db.close()

seed_initial_data()
