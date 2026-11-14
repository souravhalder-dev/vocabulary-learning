import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_list_documents():
    response = client.get("/api/documents")
    assert response.status_code == 200
    docs = response.json()
    assert len(docs) >= 1
    assert "title" in docs[0]

def test_vocabulary_lookup_and_auto_save():
    # Test looking up 'student'
    payload = {
        "word": "student",
        "context_sentence": "Every dedicated student encounters moments of doubt.",
        "document_id": 1,
        "document_title": "The Art of Mindful Language Learning"
    }
    response = client.post("/api/vocabulary/lookup", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["word"] == "student"
    assert "স্টুডেন্ট" in data["bengali_pronunciation"]
    assert "শিক্ষার্থী" in data["bengali_meaning"] or "ছাত্র" in data["bengali_meaning"]

def test_vocabulary_lookup_new_word():
    # Test looking up 'resilience'
    payload = {
        "word": "resilience",
        "context_sentence": "Courage and resilience are essential for overcoming life's hurdles."
    }
    response = client.post("/api/vocabulary/lookup", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["word"] == "resilience"
    assert "রেজিলিয়েন্স" in data["bengali_pronunciation"]
    assert "স্থিতিস্থাপকতা" in data["bengali_meaning"] or "ক্ষমতা" in data["bengali_meaning"] or "সহনশীলতা" in data["bengali_meaning"]
    assert "synonyms" in data
    assert "antonyms" in data

def test_sentence_translation_and_pronunciation():
    # Test sentence from user prompt: "I am trying to improve my English reading skills."
    payload = {
        "text": "I am trying to improve my English reading skills."
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "ইংরেজি" in data["bengali_translation"]
    # Check that Bengali pronunciation contains phonetic Bengali script
    assert "আই" in data["bengali_pronunciation"]
    assert "ইংলিশ" in data["bengali_pronunciation"] or "রিডিং" in data["bengali_pronunciation"]

def test_ai_assistant_explanation():
    payload = {
        "text": "meticulous",
        "context": "Meticulous efforts lead to mastery.",
        "mode": "explain_word"
    }
    response = client.post("/api/ai/assistant", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "bengali_explanation" in data
    assert len(data["bengali_explanation"]) > 10

def test_create_text_document():
    payload = {
        "title": "Test AI Article",
        "source_type": "text",
        "content": "Artificial intelligence empowers curious language learners worldwide."
    }
    response = client.post("/api/documents/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test AI Article"
    assert data["total_words"] == 7

def test_export_vocabulary_csv():
    response = client.get("/api/vocabulary/export/csv")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "English Word" in response.text
    assert "Bengali Pronunciation" in response.text

def test_url_ssrf_blocked():
    # Attempting to fetch localhost/internal IP must be blocked by SSRF protection
    payload = {"url": "http://127.0.0.1:8000/api/health"}
    response = client.post("/api/documents/url", json=payload)
    assert response.status_code == 400
    assert "restricted" in response.json()["detail"].lower() or "blocked" in response.json()["detail"].lower()
