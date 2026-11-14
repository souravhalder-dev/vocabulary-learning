import { NextRequest, NextResponse } from 'next/server';
import { transliterateWordToBengali, COMMON_BENGALI_MEANINGS } from '@/lib/phonetics';

async function fetchBengaliMeaning(word: string): Promise<{ meaning: string; pos: string }> {
  if (COMMON_BENGALI_MEANINGS[word]) {
    return { meaning: COMMON_BENGALI_MEANINGS[word], pos: 'word' };
  }
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&dt=bd&q=${encodeURIComponent(word)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
    });
    if (res.ok) {
      const data = await res.json();
      const primary = data?.[0]?.[0]?.[0] || '';
      const list: string[] = [];
      let pos = '';
      if (data?.[1]) {
        for (const grp of data[1]) {
          if (!pos && grp[0]) pos = grp[0];
          if (grp[1]) list.push(...grp[1].slice(0, 3));
        }
      }
      const combined = [primary, ...list.filter((m) => m !== primary)];
      return {
        meaning: combined.slice(0, 4).join(' / ') || primary || word,
        pos: pos || 'word',
      };
    }
  } catch (e) {
    console.warn('Meaning lookup notice:', e);
  }
  return { meaning: word, pos: 'word' };
}

async function enrichRelationList(words: string[]) {
  const cleanList = Array.from(new Set(words.map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(Boolean))).slice(0, 3);
  const results = [];
  for (const w of cleanList) {
    const pron = transliterateWordToBengali(w);
    let meaning = w;
    try {
      const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${w}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (r.ok) {
        const d = await r.json();
        if (d?.[0]?.[0]?.[0]) meaning = d[0][0][0];
      }
    } catch {}
    results.push({
      word: w,
      bengali_pronunciation: pron,
      bengali_meaning: meaning
    });
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawWord = body.word || '';
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
    if (!cleanWord) {
      return NextResponse.json({ detail: 'Invalid word' }, { status: 400 });
    }

    const bengaliPronunciation = transliterateWordToBengali(cleanWord);
    const { meaning: bengaliMeaning, pos } = await fetchBengaliMeaning(cleanWord);

    let englishDefinition = `Contextual usage and definition of '${cleanWord}'.`;
    let ipaPhonetic = '';
    let exampleSentence = body.context_sentence || `The word '${cleanWord}' is frequently used in modern English.`;
    const rawSynonyms: string[] = [];
    const rawAntonyms: string[] = [];

    // Dictionary API lookup for definitions and IPA
    try {
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (dictRes.ok) {
        const entries = await dictRes.json();
        if (Array.isArray(entries) && entries.length > 0) {
          const first = entries[0];
          ipaPhonetic = first.phonetic || '';
          if (first.meanings) {
            for (const m of first.meanings) {
              if (m.synonyms) rawSynonyms.push(...m.synonyms);
              if (m.antonyms) rawAntonyms.push(...m.antonyms);
              for (const d of m.definitions || []) {
                if (d.synonyms) rawSynonyms.push(...d.synonyms);
                if (d.antonyms) rawAntonyms.push(...d.antonyms);
                if (d.definition && !englishDefinition) englishDefinition = d.definition;
                if (d.example && !body.context_sentence) exampleSentence = d.example;
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Dictionary dev lookup notice:', e);
    }

    // Datamuse fallback for synonyms & antonyms
    if (rawSynonyms.length === 0 || rawAntonyms.length === 0) {
      try {
        if (rawSynonyms.length === 0) {
          const synRes = await fetch(`https://api.datamuse.com/words?rel_syn=${cleanWord}&max=4`);
          if (synRes.ok) {
            const list = await synRes.json();
            rawSynonyms.push(...list.map((item: any) => item.word));
          }
        }
        if (rawAntonyms.length === 0) {
          const antRes = await fetch(`https://api.datamuse.com/words?rel_ant=${cleanWord}&max=4`);
          if (antRes.ok) {
            const list = await antRes.json();
            rawAntonyms.push(...list.map((item: any) => item.word));
          }
        }
      } catch {}
    }

    const [synonyms, antonyms] = await Promise.all([
      enrichRelationList(rawSynonyms),
      enrichRelationList(rawAntonyms)
    ]);

    return NextResponse.json({
      id: Date.now(),
      word: cleanWord,
      original_word: rawWord,
      bengali_pronunciation: bengaliPronunciation,
      bengali_meaning: bengaliMeaning,
      english_definition: englishDefinition,
      ipa_phonetic: ipaPhonetic,
      part_of_speech: pos,
      example_sentence: exampleSentence,
      bengali_example: '',
      context_sentence: body.context_sentence || null,
      document_id: body.document_id || null,
      document_title: body.document_title || null,
      is_learned: false,
      review_count: 0,
      leitner_box: 1,
      next_review_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      synonyms,
      antonyms
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Lookup failed' }, { status: 500 });
  }
}
