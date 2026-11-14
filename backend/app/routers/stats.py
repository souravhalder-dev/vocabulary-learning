import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.models import Vocabulary, Document, Translation, LearningStreak
from app.schemas.schemas import DashboardStatsResponse

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_vocab = db.query(Vocabulary).count()
    learned_vocab = db.query(Vocabulary).filter(Vocabulary.is_learned == True).count()
    unlearned_vocab = total_vocab - learned_vocab
    total_docs = db.query(Document).count()
    total_translations = db.query(Translation).count()

    today_str = datetime.date.today().strftime("%Y-%m-%d")
    today_start = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
    
    today_words = db.query(Vocabulary).filter(Vocabulary.created_at >= today_start).count()

    # Calculate streak
    streak_count = db.query(LearningStreak).count()
    if streak_count == 0 and total_vocab > 0:
        streak_count = 1

    return {
        "total_vocabularies": total_vocab,
        "learned_vocabularies": learned_vocab,
        "unlearned_vocabularies": unlearned_vocab,
        "total_documents": total_docs,
        "total_translations": total_translations,
        "today_words_count": today_words,
        "streak_days": max(1, streak_count)
    }
