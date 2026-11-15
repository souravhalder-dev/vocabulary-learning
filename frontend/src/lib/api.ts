import { DocumentItem, VocabularyItem, TranslationItem, AIAssistantItem, DashboardStats } from '../types';
import { offlineDB } from './db';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchWithFallback<T>(url: string, options?: RequestInit): Promise<T> {
  const primaryUrl = API_BASE_URL ? `${API_BASE_URL}${url}` : url;
  try {
    const res = await fetch(primaryUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      if (API_BASE_URL) {
        // Fallback to internal Next.js API route
        try {
          const fallbackRes = await fetch(url, options);
          if (fallbackRes.ok) return await fallbackRes.json();
        } catch {}
      }
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Network request failed');
    }
    return await res.json();
  } catch (error) {
    if (API_BASE_URL) {
      try {
        const fallbackRes = await fetch(url, options);
        if (fallbackRes.ok) return await fallbackRes.json();
      } catch {}
    }
    console.warn(`API call failed for ${url}:`, error);
    throw error;
  }
}

// Documents API
export async function getDocuments(): Promise<DocumentItem[]> {
  try {
    const docs = await fetchWithFallback<DocumentItem[]>('/api/documents');
    // Cache offline
    await offlineDB.documents.bulkPut(docs).catch(console.error);
    return docs;
  } catch {
    // Offline fallback
    return await offlineDB.documents.toArray();
  }
}

export async function getDocumentById(id: number): Promise<DocumentItem> {
  try {
    const doc = await fetchWithFallback<DocumentItem>(`/api/documents/${id}`);
    await offlineDB.documents.put(doc).catch(console.error);
    return doc;
  } catch {
    const offlineDoc = await offlineDB.documents.get(id);
    if (offlineDoc) return offlineDoc;
    throw new Error('Document not found in offline storage');
  }
}

export async function createTextDocument(title: string, content: string): Promise<DocumentItem> {
  return await fetchWithFallback<DocumentItem>('/api/documents/text', {
    method: 'POST',
    body: JSON.stringify({ title, content, source_type: 'text' }),
  });
}

export async function createUrlDocument(url: string): Promise<DocumentItem> {
  return await fetchWithFallback<DocumentItem>('/api/documents/url', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export async function uploadPdfDocument(file: File, title?: string): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);

  const targetUrl = API_BASE_URL ? `${API_BASE_URL}/api/documents/upload-pdf` : '/api/documents/upload-pdf';
  const res = await fetch(targetUrl, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'PDF upload failed');
  }
  return await res.json();
}

export async function uploadImageDocument(file: File, title?: string): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);

  const targetUrl = API_BASE_URL ? `${API_BASE_URL}/api/documents/upload-image` : '/api/documents/upload-image';
  const res = await fetch(targetUrl, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'OCR upload failed' }));
    throw new Error(err.detail || 'Image upload failed');
  }
  return await res.json();
}

export async function updateReadingProgress(docId: number, currentPage: number, readingProgress: number): Promise<void> {
  try {
    await fetchWithFallback(`/api/documents/${docId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ current_page: currentPage, reading_progress: readingProgress }),
    });
  } catch {
    // Queue offline
    await offlineDB.syncQueue.add({
      action: 'update_progress',
      payload: { docId, currentPage, readingProgress },
      timestamp: Date.now(),
    });
  }
}

export async function deleteDocument(id: number): Promise<void> {
  await fetchWithFallback(`/api/documents/${id}`, { method: 'DELETE' });
  await offlineDB.documents.delete(id).catch(console.error);
}

// Vocabulary API
export async function lookupAndAutoSaveWord(word: string, contextSentence?: string, docId?: number, docTitle?: string): Promise<VocabularyItem> {
  try {
    const vocab = await fetchWithFallback<VocabularyItem>('/api/vocabulary/lookup', {
      method: 'POST',
      body: JSON.stringify({
        word,
        context_sentence: contextSentence,
        document_id: docId,
        document_title: docTitle,
      }),
    });
    await offlineDB.vocabularies.put(vocab).catch(console.error);
    return vocab;
  } catch (err) {
    // Check if in offline DB
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const existing = await offlineDB.vocabularies.where('word').equals(clean).first();
    if (existing) return existing;

    // Create simple offline item
    const fallbackVocab: VocabularyItem = {
      id: Date.now(),
      word: clean,
      original_word: word,
      bengali_pronunciation: clean,
      bengali_meaning: `(Offline) ${word}`,
      english_definition: 'Stored offline',
      example_sentence: contextSentence,
      context_sentence: contextSentence,
      document_id: docId,
      document_title: docTitle,
      is_learned: false,
      review_count: 0,
      leitner_box: 1,
      created_at: new Date().toISOString(),
    };
    await offlineDB.vocabularies.put(fallbackVocab);
    return fallbackVocab;
  }
}

export async function getVocabularies(q?: string, learned?: boolean, docId?: number): Promise<VocabularyItem[]> {
  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (learned !== undefined) params.set('learned', String(learned));
    if (docId !== undefined) params.set('doc_id', String(docId));

    const items = await fetchWithFallback<VocabularyItem[]>(`/api/vocabulary?${params.toString()}`);
    await offlineDB.vocabularies.bulkPut(items).catch(console.error);
    return items;
  } catch {
    // Offline filter
    let collection = offlineDB.vocabularies.toCollection();
    if (learned !== undefined) {
      collection = offlineDB.vocabularies.where('is_learned').equals(learned ? 1 : 0);
    }
    let all = await collection.toArray();
    if (q) {
      const lower = q.toLowerCase();
      all = all.filter(v => v.word.includes(lower) || v.bengali_meaning.includes(lower) || v.bengali_pronunciation.includes(lower));
    }
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export async function updateVocabulary(id: number, payload: Partial<VocabularyItem>): Promise<VocabularyItem> {
  try {
    const updated = await fetchWithFallback<VocabularyItem>(`/api/vocabulary/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await offlineDB.vocabularies.put(updated).catch(console.error);
    return updated;
  } catch {
    const existing = await offlineDB.vocabularies.get(id);
    if (existing) {
      const merged = { ...existing, ...payload };
      await offlineDB.vocabularies.put(merged);
      await offlineDB.syncQueue.add({
        action: 'update_vocab',
        payload: { id, payload },
        timestamp: Date.now(),
      });
      return merged;
    }
    throw new Error('Vocabulary item not found');
  }
}

export async function deleteVocabulary(id: number): Promise<void> {
  try {
    await fetchWithFallback(`/api/vocabulary/${id}`, { method: 'DELETE' });
  } finally {
    await offlineDB.vocabularies.delete(id).catch(console.error);
  }
}

// Translation API
export async function translateText(text: string, context?: string): Promise<TranslationItem> {
  const result = await fetchWithFallback<TranslationItem>('/api/translate', {
    method: 'POST',
    body: JSON.stringify({ text, context }),
  });
  await offlineDB.translations.put(result).catch(console.error);
  return result;
}

export async function getTranslationHistory(): Promise<TranslationItem[]> {
  try {
    const items = await fetchWithFallback<TranslationItem[]>('/api/translate/history');
    await offlineDB.translations.bulkPut(items).catch(console.error);
    return items;
  } catch {
    return await offlineDB.translations.toArray();
  }
}

// AI Assistant API
export async function getAiAssistantGuidance(text: string, context?: string, mode: string = 'explain_word'): Promise<AIAssistantItem> {
  return await fetchWithFallback<AIAssistantItem>('/api/ai/assistant', {
    method: 'POST',
    body: JSON.stringify({ text, context, mode }),
  });
}

// Dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await fetchWithFallback<DashboardStats>('/api/stats/dashboard');
  } catch {
    const totalVocab = await offlineDB.vocabularies.count();
    const learnedVocab = await offlineDB.vocabularies.where('is_learned').equals(1).count();
    const totalDocs = await offlineDB.documents.count();
    const totalTrans = await offlineDB.translations.count();
    return {
      total_vocabularies: totalVocab,
      learned_vocabularies: learnedVocab,
      unlearned_vocabularies: totalVocab - learnedVocab,
      total_documents: totalDocs,
      total_translations: totalTrans,
      today_words_count: 0,
      streak_days: 1,
    };
  }
}
