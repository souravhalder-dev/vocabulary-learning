import os
import shutil
import uuid
import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import Document
from app.schemas.schemas import DocumentResponse, DocumentListItem, DocumentCreate, DocumentUrlRequest, DocumentProgressUpdate
from app.services.scraper_service import extract_article_content
from app.services.pdf_service import process_pdf_file
from app.config import settings

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("", response_model=List[DocumentListItem])
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.last_read_at.desc()).all()


@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post("/text", response_model=DocumentResponse)
def create_text_document(doc_in: DocumentCreate, db: Session = Depends(get_db)):
    total_words = len(re.findall(r"\b\w+\b", doc_in.content))
    doc = Document(
        title=doc_in.title or "Pasted Text Document",
        source_type="text",
        content=doc_in.content,
        html_content=doc_in.html_content,
        pages_json=doc_in.pages_json,
        total_words=total_words,
        total_pages=1,
        current_page=1,
        reading_progress=0
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.post("/url", response_model=DocumentResponse)
async def create_document_from_url(payload: DocumentUrlRequest, db: Session = Depends(get_db)):
    try:
        data = await extract_article_content(payload.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch article: {str(e)}")

    doc = Document(
        title=data["title"],
        source_type="url",
        source_url=data["source_url"],
        content=data["content"],
        html_content=data["html_content"],
        total_words=data["total_words"],
        total_pages=1,
        current_page=1,
        reading_progress=0
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.post("/upload-pdf", response_model=DocumentResponse)
async def upload_pdf(file: UploadFile = File(...), title: Optional[str] = Form(None), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        data = process_pdf_file(file_path)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")

    doc = Document(
        title=title or data["title"] or file.filename,
        source_type="pdf",
        file_path=file_path,
        content=data["content"],
        pages_json=data["pages_json"],
        total_pages=data["total_pages"],
        total_words=data["total_words"],
        current_page=1,
        reading_progress=0
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.post("/upload-image", response_model=DocumentResponse)
async def upload_image_ocr(file: UploadFile = File(...), title: Optional[str] = Form(None), db: Session = Depends(get_db)):
    valid_extensions = (".jpg", ".jpeg", ".png", ".webp")
    if not any(file.filename.lower().endswith(ext) for ext in valid_extensions):
        raise HTTPException(status_code=400, detail="Allowed image formats: JPG, JPEG, PNG, WebP")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = ""
    try:
        import pytesseract
        from PIL import Image
        img = Image.open(file_path)
        extracted_text = pytesseract.image_to_string(img)
    except Exception as e:
        print(f"Server OCR notice: {e}")
        extracted_text = "Text could not be extracted via server OCR. You can also use client-side OCR."

    total_words = len(re.findall(r"\b\w+\b", extracted_text))
    doc_title = title or f"OCR Image - {file.filename}"

    doc = Document(
        title=doc_title,
        source_type="image",
        file_path=file_path,
        content=extracted_text,
        total_pages=1,
        total_words=total_words,
        current_page=1,
        reading_progress=0
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.patch("/{doc_id}/progress", response_model=DocumentResponse)
def update_reading_progress(doc_id: int, payload: DocumentProgressUpdate, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc.current_page = payload.current_page
    doc.reading_progress = payload.reading_progress
    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc.file_path and os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
