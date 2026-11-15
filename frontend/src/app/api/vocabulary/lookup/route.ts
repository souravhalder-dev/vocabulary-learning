import { NextRequest, NextResponse } from 'next/server';
import { fetchAccuratePronunciationOnline } from '@/lib/phonetics';

async function fetchBengaliMeaning(word: string) {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&dt=bd&dt=rm&q=${encodeURIComponent(word)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      }
    );
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
        googleIpa: data?.[0]?.[1]?.[3] || '',
      };
    }
  } catch (e) {
    console.warn('Meaning lookup notice:', e);
  }
  return { meaning: word, pos: 'word', googleIpa: '' };
}

async function enrichRelationList(words: string[]) {
  const cleanList = Array.from(new Set(words.map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(Boolean))).slice(0, 3);
  return await Promise.all(
    cleanList.map(async (w) => {
      let meaning = w;
      try {
        const trRes = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(w)}`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        if (trRes.ok) {
          const d = await trRes.json();
          if (d?.[0]?.[0]?.[0]) meaning = d[0][0][0];
        }
      } catch {}

      // Fast synchronous rule + verified dict for relations so request never exceeds Vercel limits
      const { transliterateWordToBengali } = await import('@/lib/phonetics');
      const pron = transliterateWordToBengali(w);
      return {
        word: w,
        bengali_pronunciation: pron,
        bengali_meaning: meaning,
      };
    })
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawWord = body.word || '';
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
    if (!cleanWord) {
      return NextResponse.json({ detail: 'Invalid word' }, { status: 400 });
    }

    let englishDefinition = `Contextual usage and definition of '${cleanWord}'.`;
    let ipaPhonetic = '';
    let exampleSentence = body.context_sentence || `The word '${cleanWord}' is frequently used in modern English.`;
    const rawSynonyms: string[] = [];
    const rawAntonyms: string[] = [];

    // Parallel fetch: Bengali Meaning, Dictionary API, Datamuse, and AI Pronunciation
    const [meaningData, dictData, datamuseData, accuratePronunciation] = await Promise.allSettled([
      fetchBengaliMeaning(cleanWord),
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(cleanWord)}&qe=sp&md=dfrps&ipa=1&max=1`)
        .then(r => r.ok ? r.json() : null).catch(() => null),
      fetchAccuratePronunciationOnline(cleanWord)
    ]);

    const bengaliMeaning = meaningData.status === 'fulfilled' ? meaningData.value.meaning : cleanWord;
    const pos = meaningData.status === 'fulfilled' ? meaningData.value.pos : 'word';
    const googleIpa = meaningData.status === 'fulfilled' ? meaningData.value.googleIpa : '';

    if (dictData.status === 'fulfilled' && Array.isArray(dictData.value) && dictData.value.length > 0) {
      const first = dictData.value[0];
      ipaPhonetic = first.phonetic || '';
      if (!ipaPhonetic && Array.isArray(first.phonetics)) {
        for (const p of first.phonetics) {
          if (p.text) {
            ipaPhonetic = p.text;
            if ((p.audio || '').toLowerCase().includes('uk')) break;
          }
        }
      }
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

    if (datamuseData.status === 'fulfilled' && Array.isArray(datamuseData.value) && datamuseData.value.length > 0) {
      const dm = datamuseData.value[0];
      if (!ipaPhonetic && dm.tags) {
        for (const t of dm.tags) {
          if (t.startsWith('ipa_pron:')) {
            ipaPhonetic = t.replace('ipa_pron:', '');
            break;
          }
        }
      }
      if (dm.defs && dm.defs.length > 0 && englishDefinition.startsWith('Contextual usage')) {
        englishDefinition = dm.defs[0].replace(/^[a-z]+\t/, '').trim();
      }
    }

    if (!ipaPhonetic && googleIpa) {
      ipaPhonetic = googleIpa;
    }

    let bengaliPronunciation =
      accuratePronunciation.status === 'fulfilled' && accuratePronunciation.value
        ? accuratePronunciation.value
        : '';

    if (!bengaliPronunciation) {
      const { transliterateWordToBengali, ipaToBengaliPronunciation } = await import('@/lib/phonetics');
      if (ipaPhonetic) {
        bengaliPronunciation = ipaToBengaliPronunciation(ipaPhonetic) || '';
      }
      if (!bengaliPronunciation) {
        bengaliPronunciation = transliterateWordToBengali(cleanWord);
      }
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
