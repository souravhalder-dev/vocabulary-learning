from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Translation
from app.schemas.schemas import TranslationRequest, TranslationResponse
from app.services.ai_service import translate_text

router = APIRouter(prefix="/api/translate", tags=["translate"])

@router.post("", response_model=TranslationResponse)
async def translate_sentence(payload: TranslationRequest, db: Session = Depends(get_db)):
    clean_text = payload.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Empty text provided")

    result = await translate_text(clean_text, payload.context)

    # Save to history
    record = Translation(
        source_text=result["source_text"],
        bengali_translation=result["bengali_translation"],
        bengali_pronunciation=result["bengali_pronunciation"],
        context=payload.context
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/history", response_model=List[TranslationResponse])
def get_translation_history(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Translation).order_by(Translation.created_at.desc()).limit(limit).all()


@router.delete("/history/{trans_id}")
def delete_translation(trans_id: int, db: Session = Depends(get_db)):
    item = db.query(Translation).filter(Translation.id == trans_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Translation not found")
    db.delete(item)
    db.commit()
    return {"message": "Translation deleted successfully"}
