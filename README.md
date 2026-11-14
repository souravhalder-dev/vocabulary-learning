# ShobdoShadhon AI (শব্দসাধন) - English Reading & Vocabulary Learning Platform for Bengali Speakers

A modern, high-performance, AI-powered English reading and vocabulary learning platform specifically engineered for Bengali-speaking users to achieve English reading mastery, contextual vocabulary acquisition, slow and clear pronunciation understanding, sentence translation, and spaced repetition memorization with full offline PWA support.

---

##  Key Features

1. **Multi-Source English Content Importer**:
   - **PDF Reader**: PyMuPDF-based text and structure extraction, layout preservation, multi-page navigation, reading progress tracking.
   - **Website Article Reader**: SSRF-protected, clean readability extractor removing ads, navbars, and headers.
   - **Image OCR**: Upload JPG, PNG, WebP images to extract English text for interactive reading.
   - **Direct Text Input**: Paste any English paragraphs, articles, or test reading passages.

2. **Interactive Reading Experience**:
   - Read original English text directly in-app.
   - Click/tap **any English word** to instantly see:
     - **English Word & Part of Speech**
     - **Bengali Pronunciation (বাংলা উচ্চারণ)** (e.g. *Student* ➔ স্টুডেন্ট, *Significant* ➔ সিগনিফিক্যান্ট, *Resilience* ➔ রেজিলিয়েন্স)
     - **Bengali Meaning (বাংলা অর্থ)**
     - **English Definition & Example Sentences**
     - **Clear Audio Pronunciation Button** with controls: **1.0x Normal**, **0.75x Slow**, **0.5x Very Slow**, and **Replay**.
   - Contextual meaning recognition rather than generic one-size-fits-all definitions.

3. **Automatic Vocabulary Notebook**:
   - Automatically saves clicked words instantly without page refreshes.
   - Deduplication: avoids duplicate entries and updates contextual usage.
   - Searchable, filterable by learned status or source document.
   - Editable Bengali meanings and pronunciations.
   - Export vocabulary as CSV or JSON.
   - Offline access powered by IndexedDB (Dexie.js).

4. **Sentence Translation & Intelligent Clipboard Detection**:
   - Automatically detects copied English sentences in-app or via Clipboard API.
   - Displays:
     1. Original English sentence.
     2. Natural Bengali translation (বাংলা অনুবাদ).
     3. Bengali phonetic pronunciation of the English sentence (বাংলা লিপিতে ইংরেজি উচ্চারণ, e.g. "আই অ্যাম ট্রাইং টু ইমপ্রুভ মাই ইংলিশ রিডিং স্কিলস।").
     4. Normal and slow audio playback (1.0x, 0.75x, 0.5x).

5. **Spaced Repetition Flashcards**:
   - Leitner 5-box spaced repetition system.
   - Audio pronunciation on front, flip card to reveal Bengali meaning and pronunciation.
   - Rating actions: Again (Hard), Good (+1), Easy (+2).
   - Confetti celebration upon completion!

6. **AI-Powered Learning Assistant**:
   - Contextual language tutor for:
     - Difficult vocabulary in context.
     - Sentence breakdowns into simpler clauses.
     - Grammar rules and tense structures explained in friendly Bengali.
     - Idioms and figurative phrases.

7. **Offline-First PWA Architecture**:
   - Progressive Web App (PWA) manifest and Service Worker caching.
   - IndexedDB local storage using Dexie.js for offline reading, saved vocabulary, translation history, and reading progress.


