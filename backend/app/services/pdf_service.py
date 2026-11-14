import pymupdf as fitz
import json
import re
import os
from typing import Dict, Any, List

def process_pdf_file(file_path: str) -> Dict[str, Any]:
    """
    Extracts text, pages structure, and metadata from a PDF file using PyMuPDF.
    Handles scanned pages with OCR fallback if necessary.
    """
    doc = fitz.open(file_path)
    total_pages = len(doc)
    
    pages_data = []
    full_text_list = []
    
    for page_num in range(total_pages):
        page = doc[page_num]
        text = page.get_text("text").strip()

        # If text is very short/empty, attempt image extraction & OCR
        if len(text) < 15:
            try:
                import pytesseract
                from PIL import Image
                import io
                
                pix = page.get_pixmap(dpi=150)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                ocr_text = pytesseract.image_to_string(img)
                if len(ocr_text.strip()) > len(text):
                    text = ocr_text.strip()
            except Exception:
                pass # OCR optional fallback

        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs and text:
            paragraphs = [text]

        pages_data.append({
            "page_number": page_num + 1,
            "text": text,
            "paragraphs": paragraphs
        })
        if text:
            full_text_list.append(f"--- Page {page_num + 1} ---\n" + text)

    full_content = "\n\n".join(full_text_list)
    total_words = len(re.findall(r"\b\w+\b", full_content))

    title = os.path.basename(file_path).replace(".pdf", "").replace("_", " ").title()
    meta_title = doc.metadata.get("title")
    if meta_title and len(meta_title.strip()) > 2:
        title = meta_title.strip()

    doc.close()

    return {
        "title": title,
        "content": full_content,
        "total_pages": total_pages,
        "total_words": total_words,
        "pages_json": json.dumps(pages_data),
        "source_type": "pdf"
    }
